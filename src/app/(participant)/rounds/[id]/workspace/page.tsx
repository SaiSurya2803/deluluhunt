"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DB } from '@/services/db';
import { Round } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save, Send, Terminal, Clock, Play } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function ChallengeWorkspacePage() {
  const { id } = useParams();
  const router = useRouter();
  const { team, currentMember, updateTeam } = useAuthStore();
  const [round, setRound] = useState<Round | null>(null);
  const [answer, setAnswer] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const rounds = DB.getRounds();
    const currentRound = rounds.find(r => r.id === id);
    if (currentRound && currentRound.status !== 'LOCKED') {
      setRound(currentRound);
      if (currentRound.timeLimit) {
        setTimeLeft(currentRound.timeLimit * 60);
      }
      
      // Load saved answer from local storage for simulation
      const saved = localStorage.getItem(`draft_${team?.id}_${id}`);
      if (saved) setAnswer(saved);
    } else {
      router.push('/rounds');
    }
  }, [id, router, team]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && round?.status !== 'COMPLETED') {
      const timer = setInterval(() => setTimeLeft(prev => prev! - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, round]);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem(`draft_${team?.id}_${id}`, answer);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleSubmit = () => {
    if (!confirm('Are you sure you want to submit? This action is final.')) return;
    
    if (!round || !team || !currentMember) return;
    
    // Mark round as completed
    const rounds = DB.getRounds();
    const updatedRounds = rounds.map(r => r.id === round.id ? { ...r, status: 'COMPLETED' as const } : r);
    DB.setRounds(updatedRounds);
    
    // Save submission to DB
    const submissions = DB.getSubmissions() || [];
    DB.setSubmissions([
      ...submissions,
      {
        id: `sub-${Date.now()}`,
        teamId: team.id,
        roundId: round.id,
        answer: answer,
        submittedAt: new Date().toISOString(),
        status: 'PENDING_REVIEW'
      }
    ]);
    
    // Update team progress (Score will be added by admin later)
    const teams = DB.getTeams();
    const updatedTeam = {
      ...team,
      roundsCompleted: team.roundsCompleted + 1,
    };
    
    const updatedTeams = teams.map(t => t.id === team.id ? updatedTeam : t);
    DB.setTeams(updatedTeams);
    updateTeam(updatedTeam);
    
    // Log Activity
    const logs = DB.getActivityLogs();
    DB.setActivityLogs([
      {
        id: `log-${Date.now()}`,
        teamId: team.id,
        memberId: currentMember.id,
        action: `Submitted Round ${round.roundNumber}`,
        timestamp: new Date().toISOString()
      },
      ...logs
    ]);

    router.push(`/rounds`);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Compiling and running...');
    
    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code: answer })
      });
      const data = await res.json();
      setOutput(data.output || 'No output.');
    } catch (err: any) {
      setOutput('Failed to execute: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  if (!round) return <div className="text-center p-12 text-primary">Loading workspace...</div>;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-lg border border-glass-border">
        <div className="flex items-center gap-4">
          <Link href={`/rounds/${round.id}`} className="text-foreground/60 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="font-bold text-lg text-primary">{round.title}</h2>
            <p className="text-xs text-foreground/50">Workspace</p>
          </div>
        </div>
        
        {timeLeft !== null && round.status !== 'COMPLETED' && (
          <div className="flex items-center gap-2 text-warning font-mono bg-warning/10 px-3 py-1 rounded border border-warning/20">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
        {/* Challenge Description Panel */}
        <Card className="lg:col-span-1 flex flex-col h-full">
          <CardHeader className="border-b border-glass-border pb-4">
            <CardTitle className="text-sm uppercase tracking-wider text-primary">Challenge Brief</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="prose prose-invert prose-sm">
              <p className="text-foreground/80 leading-relaxed">{round.description}</p>
              <h4 className="text-white mt-4">Objective</h4>
              <p className="text-foreground/80">{round.objective}</p>
              <h4 className="text-white mt-4">Requirements</h4>
              <ul className="text-foreground/80">
                {round.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Editor Panel */}
        <Card className="lg:col-span-2 flex flex-col h-full border-primary/20">
          <CardHeader className="border-b border-glass-border pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm uppercase tracking-wider text-primary flex items-center">
              <Terminal className="w-4 h-4 mr-2" /> Solution Editor
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-xs text-foreground/50 hidden sm:block">
                {isSaving ? <span className="text-success">Saving...</span> : 'Auto-saves'}
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-background border border-glass-border text-sm rounded px-2 py-1 text-foreground"
              >
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c">C (GCC)</option>
                <option value="javascript">JavaScript</option>
              </select>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRunCode} 
                disabled={isRunning || round.status === 'COMPLETED'}
                className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
              >
                <Play className="w-4 h-4 mr-1" /> {isRunning ? 'Running...' : 'Run Code'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col">
            <div className="flex-1 flex flex-col sm:flex-row h-full">
              <textarea
                className="flex-1 w-full sm:w-1/2 bg-transparent resize-none p-4 font-mono text-sm focus:outline-none text-foreground/90 placeholder:text-foreground/30 custom-scrollbar border-b sm:border-b-0 sm:border-r border-glass-border min-h-[250px]"
                placeholder="// Write your solution here..."
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  if (answer.length % 50 === 0) handleSave();
                }}
                disabled={round.status === 'COMPLETED'}
              />
              <div className="w-full sm:w-1/2 flex flex-col bg-slate-950/50">
                <div className="text-xs font-semibold px-4 py-2 border-b border-glass-border/30 text-slate-400 bg-slate-900/50 flex justify-between">
                  <span>EXECUTION OUTPUT</span>
                </div>
                <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap custom-scrollbar min-h-[150px]">
                  {output || <span className="text-slate-300 italic">Click "Run Code" to compile and execute your solution.</span>}
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/60 border-t border-glass-border p-4 flex justify-between items-center">
              <Button variant="ghost" onClick={handleSave} disabled={round.status === 'COMPLETED'} className="text-foreground/70">
                <Save className="w-4 h-4 mr-2" /> Save Draft
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={round.status === 'COMPLETED' || !answer.trim()}
                className="shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              >
                {round.status === 'COMPLETED' ? 'ALREADY SUBMITTED' : <><Send className="w-4 h-4 mr-2" /> SUBMIT FINAL ANSWER</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
