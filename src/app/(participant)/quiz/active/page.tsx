"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DB } from '@/services/db';
import { QuizQuestion } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/useAuthStore';
import { Clock, ShieldAlert, CheckCircle, Circle, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ActiveQuizPage() {
  const router = useRouter();
  const { team, updateTeam, currentMember } = useAuthStore();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});
  const [timeTaken, setTimeTaken] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [trustScore, setTrustScore] = useState(100);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const streamsRef = useRef<{cam: MediaStream | null, screen: MediaStream | null}>({ cam: null, screen: null });
  const hasRequested = useRef(false);

  useEffect(() => {
    // Basic proctoring simulation: Listen to visibility change
    const handleVisibilityChange = () => {
      if (document.hidden && team && currentMember) {
        setTrustScore(prev => Math.max(0, prev - 15));
        const events = DB.getItem<any>(DB.KEYS.PROCTORING_EVENTS);
        DB.setItem(DB.KEYS.PROCTORING_EVENTS, [
          {
            id: `pe-${Date.now()}`,
            teamId: team.id,
            memberId: currentMember.id,
            event: 'Tab Switched / Focus Lost',
            severity: 'HIGH',
            timestamp: new Date().toISOString(),
            status: 'UNREVIEWED'
          },
          ...events
        ]);
        alert("PROCTORING WARNING: Please return to the quiz window. This event has been recorded and your trust score dropped.");
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Request Streams
    async function setupStreams() {
      if (hasRequested.current) return;
      hasRequested.current = true;
      
      try {
        const cam = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setVideoStream(cam);
        streamsRef.current.cam = cam;
        
        const screen = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        setScreenStream(screen);
        streamsRef.current.screen = screen;

        // --- BROADCAST TO ADMIN PANEL ---
        if (team) {
          const channel = new BroadcastChannel(`proctoring_${team.id}`);
          const canvas = document.createElement('canvas');
          canvas.width = 320;
          canvas.height = 240;
          const ctx = canvas.getContext('2d');
          
          const screenCanvas = document.createElement('canvas');
          screenCanvas.width = 640;
          screenCanvas.height = 360;
          const screenCtx = screenCanvas.getContext('2d');

          let camVideo = document.createElement('video');
          camVideo.srcObject = cam;
          camVideo.play();
          
          let screenVideo = document.createElement('video');
          screenVideo.srcObject = screen;
          screenVideo.play();

          const interval = setInterval(() => {
            let camFrame = null;
            let screenFrame = null;
            
            if (ctx && camVideo.videoWidth > 0) {
              ctx.drawImage(camVideo, 0, 0, canvas.width, canvas.height);
              camFrame = canvas.toDataURL('image/jpeg', 0.5);
            }
            if (screenCtx && screenVideo.videoWidth > 0) {
              screenCtx.drawImage(screenVideo, 0, 0, screenCanvas.width, screenCanvas.height);
              screenFrame = screenCanvas.toDataURL('image/jpeg', 0.5);
            }
            
            channel.postMessage({
              type: 'STREAM_UPDATE',
              camFrame,
              screenFrame,
              trustScore
            });
          }, 1000); // 1 FPS for demo stability
          
          // attach to window to clean up later
          (window as any).proctorInterval = interval;
          (window as any).proctorChannel = channel;
        }

      } catch (err) {
        console.error("Proctoring stream error", err);
        setTrustScore(prev => Math.max(0, prev - 30));
        alert("PROCTORING ERROR: Camera and Screen sharing are mandatory. Your trust score has been penalized.");
      }
    }
    setupStreams();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      
      // Properly close all tracks using the ref to avoid stale closures
      if (streamsRef.current.cam) {
        streamsRef.current.cam.getTracks().forEach(t => t.stop());
      }
      if (streamsRef.current.screen) {
        streamsRef.current.screen.getTracks().forEach(t => t.stop());
      }
      
      clearInterval((window as any).proctorInterval);
      (window as any).proctorChannel?.close();
    };
  }, [team, currentMember]);

  useEffect(() => {
    // AI periodic "scan" simulation
    const aiInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        // Random minor AI deduction for "looking away"
        setTrustScore(prev => Math.max(0, prev - 2));
      }
    }, 10000);
    return () => clearInterval(aiInterval);
  }, []);

  useEffect(() => {
    const qs = DB.getItem<QuizQuestion>(DB.KEYS.QUIZ_QUESTIONS) || [];
    setQuestions(qs);
    
    // Initialize per-question timers
    const initialTimers: Record<string, number> = {};
    qs.forEach(q => {
      initialTimers[q.id] = q.timer || 60;
    });
    setTimeRemaining(initialTimers);
    
    // Load saved answers
    if (team) {
      const saved = localStorage.getItem(`quiz_answers_${team.id}`);
      if (saved) setAnswers(JSON.parse(saved));
      
      // Mark team quiz active
      const teams = DB.getTeams();
      const updatedTeam = { ...team, quizStatus: 'ACTIVE' as const };
      DB.setTeams(teams.map(t => t.id === team.id ? updatedTeam : t));
      updateTeam(updatedTeam);
    }
  }, []);

  useEffect(() => {
    if (questions.length === 0) return;
    
    const currentQ = questions[currentIndex];
    const timeLeftForCurrent = timeRemaining[currentQ.id];

    if (timeLeftForCurrent !== undefined && timeLeftForCurrent <= 0) {
      if (currentIndex === questions.length - 1) {
        handleSubmit(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => ({
        ...prev,
        [currentQ.id]: Math.max(0, (prev[currentQ.id] || 0) - 1)
      }));
      setTimeTaken(prev => ({
        ...prev,
        [currentQ.id]: (prev[currentQ.id] || 0) + 1
      }));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentIndex, timeRemaining, questions]);

  const handleSelectOption = (qId: string, optionIndex: number) => {
    const newAnswers = { ...answers, [qId]: optionIndex };
    setAnswers(newAnswers);
    
    // Auto save
    if (team) {
      localStorage.setItem(`quiz_answers_${team.id}`, JSON.stringify(newAnswers));
      setSaveIndicator(true);
      setTimeout(() => setSaveIndicator(false), 2000);
    }
  };

  const toggleMarkForReview = (qId: string) => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(qId)) newMarked.delete(qId);
    else newMarked.add(qId);
    setMarkedForReview(newMarked);
  };

  const handleSubmit = (auto = false) => {
    if (!team) return;
    
    if (!auto) {
      const answeredCount = Object.keys(answers).length;
      if (!confirm(`You have answered ${answeredCount}/${questions.length} questions. Submit quiz?`)) {
        return;
      }
    }
    
    setIsSubmitting(true);
    
    // Calculate score
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctOptionIndex) score += (q.points || 10);
    });
    
    // Save detailed quiz submission
    const quizSubs = DB.getQuizSubmissions() || [];
    DB.setQuizSubmissions([
      ...quizSubs,
      {
        id: `qsub-${Date.now()}`,
        teamId: team.id,
        answers: answers,
        timeTaken: timeTaken,
        submittedAt: new Date().toISOString(),
        totalScore: score
      }
    ]);

    // Update team - IMPORTANT: we add quizTrustScore and quizScore
    const teams = DB.getTeams();
    const updatedTeam = { ...team, quizStatus: 'COMPLETED' as const, quizScore: score, quizTrustScore: trustScore };
    DB.setTeams(teams.map(t => t.id === team.id ? updatedTeam : t));
    updateTeam(updatedTeam);
    
    // Stop streams properly using refs
    if (streamsRef.current.cam) {
      streamsRef.current.cam.getTracks().forEach(t => t.stop());
    }
    if (streamsRef.current.screen) {
      streamsRef.current.screen.getTracks().forEach(t => t.stop());
    }
    
    // Log
    const logs = DB.getActivityLogs();
    DB.setActivityLogs([
      {
        id: `log-${Date.now()}`,
        teamId: team.id,
        memberId: currentMember?.id,
        action: auto ? `Quiz Auto-Submitted (Score: ${score}, Trust: ${trustScore}%)` : `Quiz Submitted manually (Score: ${score}, Trust: ${trustScore}%)`,
        timestamp: new Date().toISOString()
      },
      ...logs
    ]);
    
    router.push('/quiz/intro');
  };

  if (questions.length === 0) return <div className="p-8 text-center text-slate-900">Loading questions...</div>;

  const currentQ = questions[currentIndex];
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col h-screen -m-4 md:-m-8 relative">
      {/* Live Proctoring PIP */}
      <div className="absolute bottom-4 left-4 z-50 flex gap-2 pointer-events-none">
        <div className="w-32 h-24 bg-black rounded-lg border-2 border-slate-700 overflow-hidden relative shadow-lg">
          <video autoPlay playsInline muted className="w-full h-full object-cover" ref={el => { if (el && videoStream) el.srcObject = videoStream; }}></video>
          <div className="absolute top-1 left-1 bg-danger text-white text-[8px] px-1 rounded animate-pulse">REC</div>
          <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 rounded">CAM</div>
        </div>
        <div className="w-32 h-24 bg-black rounded-lg border-2 border-slate-700 overflow-hidden relative shadow-lg">
          <video autoPlay playsInline muted className="w-full h-full object-cover" ref={el => { if (el && screenStream) el.srcObject = screenStream; }}></video>
          <div className="absolute top-1 left-1 bg-danger text-white text-[8px] px-1 rounded animate-pulse">REC</div>
          <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 rounded">SCR</div>
        </div>
        <div className="flex flex-col justify-end">
          <div className={cn("text-xs font-bold px-2 py-1 rounded shadow", trustScore > 70 ? "bg-success text-white" : trustScore > 40 ? "bg-warning text-white" : "bg-danger text-white")}>
            AI Trust: {trustScore}%
          </div>
        </div>
      </div>
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-white/90 border-b border-glass-border">
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center">
            <img src="/logo.png" alt="INNOVATEX" className="h-8 w-auto object-contain mr-3" />
            <span className="font-bold text-xl text-primary text-glow">QUIZ</span>
          </div>
          <Badge variant="outline" className="border-primary text-primary">Q: {currentIndex + 1} / {questions.length}</Badge>
        </div>
        
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 font-mono text-xl font-bold ${(timeRemaining[currentQ?.id] || 0) < 15 ? 'text-danger animate-pulse' : 'text-warning'}`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeRemaining[currentQ?.id] || 0)}
          </div>
          <Button variant="destructive" size="sm" onClick={() => handleSubmit()} disabled={isSubmitting}>
            {isSubmitting ? 'SUBMITTING...' : 'SUBMIT QUIZ'}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto w-full flex-1">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Question {currentIndex + 1}</h2>
              {saveIndicator && <span className="text-success text-xs flex items-center"><Save className="w-3 h-3 mr-1" /> Answer Saved</span>}
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <p className="text-lg text-slate-900 leading-relaxed">{currentQ.text}</p>
              </CardContent>
            </Card>
            
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[currentQ.id] === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => handleSelectOption(currentQ.id, idx)}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3",
                      isSelected 
                        ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]" 
                        : "border-glass-border bg-white/60 hover:bg-white/60 hover:border-foreground/30"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isSelected ? <CheckCircle className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-foreground/40" />}
                    </div>
                    <span className={isSelected ? "text-slate-900 font-medium" : "text-foreground/80"}>{option}</span>
                  </div>
                );
              })}
            </div>
            
          </div>
          
          {/* Navigation Controls */}
          <div className="max-w-3xl mx-auto w-full flex justify-between items-center mt-8 pt-6 border-t border-glass-border">
            <Button 
              variant="outline" 
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>
            
            <Button 
              variant={markedForReview.has(currentQ.id) ? "secondary" : "ghost"} 
              className={markedForReview.has(currentQ.id) ? "" : "border border-glass-border"}
              onClick={() => toggleMarkForReview(currentQ.id)}
            >
              <ShieldAlert className="w-4 h-4 mr-2" />
              {markedForReview.has(currentQ.id) ? "Marked for Review" : "Mark for Review"}
            </Button>
            
            <Button 
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
        
        {/* Right Sidebar - Question Palette */}
        <div className="w-64 border-l border-glass-border bg-white/60 p-4 hidden lg:flex flex-col">
          <div className="text-sm font-semibold uppercase text-foreground/60 mb-4">Question Palette</div>
          
          <div className="grid grid-cols-5 gap-2 mb-8">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isMarked = markedForReview.has(q.id);
              const isCurrent = idx === currentIndex;
              
              let bgClass = "bg-glass-bg border-glass-border text-foreground/70";
              if (isCurrent) bgClass = "bg-primary/20 border-primary text-slate-900";
              else if (isMarked) bgClass = "bg-secondary text-slate-900 border-secondary";
              else if (isAnswered) bgClass = "bg-success/20 text-success border-success/50";
              
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn("w-10 h-10 rounded-md border flex items-center justify-center text-sm font-medium transition-all", bgClass)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          
          <div className="space-y-3 text-xs text-foreground/70 mt-auto">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-success/20 border border-success/50"></div> Answered</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-secondary border border-secondary"></div> Marked for Review</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-glass-bg border border-glass-border"></div> Not Visited / Unanswered</div>
          </div>
        </div>
      </div>
    </div>
  );
}
