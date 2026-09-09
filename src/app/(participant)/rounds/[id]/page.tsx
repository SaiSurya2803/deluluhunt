"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DB } from '@/services/db';
import { Round } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Target, Clock, Trophy, FileText, Key, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function RoundOverviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { team, currentMember } = useAuthStore();
  const [round, setRound] = useState<Round | null>(null);

  useEffect(() => {
    const rounds = DB.getRounds();
    const currentRound = rounds.find(r => r.id === id);
    if (currentRound) {
      if (currentRound.status === 'LOCKED') {
        router.push('/rounds'); // Security fallback
      } else {
        setRound(currentRound);
      }
    }
  }, [id, router]);

  const handleStartRound = () => {
    if (!round || !team || !currentMember) return;
    
    // If not started, mark in progress
    if (round.status === 'UNLOCKED') {
      const rounds = DB.getRounds();
      const updatedRounds = rounds.map(r => r.id === round.id ? { ...r, status: 'IN_PROGRESS' as const } : r);
      DB.setRounds(updatedRounds);
      
      const logs = DB.getActivityLogs();
      DB.setActivityLogs([
        {
          id: `log-${Date.now()}`,
          teamId: team.id,
          memberId: currentMember.id,
          action: `Started Round ${round.roundNumber}`,
          timestamp: new Date().toISOString()
        },
        ...logs
      ]);
    }
    
    router.push(`/rounds/${round.id}/workspace`);
  };

  if (!round) return <div className="text-center p-12 text-primary">Loading round details...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link href="/rounds" className="inline-flex items-center text-sm text-primary hover:underline">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Rounds
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-glass-border pb-6">
        <div>
          <Badge variant="outline" className="mb-2 text-primary border-primary">ROUND {round.roundNumber}</Badge>
          <h1 className="text-4xl font-bold text-slate-900 text-glow">{round.title}</h1>
          <p className="text-foreground/60 mt-2 text-lg">{round.description}</p>
        </div>
        <Badge variant={round.status === 'COMPLETED' ? 'success' : 'warning'} className="text-sm px-3 py-1">
          {round.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><Target className="w-5 h-5 mr-2 text-primary" /> Objective</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">{round.objective}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><AlertTriangle className="w-5 h-5 mr-2 text-warning" /> Rules & Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                {round.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-glass-border pb-3">
                <span className="text-foreground/60 text-sm flex items-center"><Trophy className="w-4 h-4 mr-2" /> Max Score</span>
                <span className="font-bold text-xl text-primary">{round.maxScore}</span>
              </div>
              <div className="flex justify-between items-center border-b border-glass-border pb-3">
                <span className="text-foreground/60 text-sm flex items-center"><Clock className="w-4 h-4 mr-2" /> Time Limit</span>
                <span className="font-bold text-slate-900">{round.timeLimit ? `${round.timeLimit} mins` : 'None'}</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button onClick={handleStartRound} size="lg" className="w-full text-lg shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              {round.status === 'IN_PROGRESS' ? 'CONTINUE ROUND' : round.status === 'COMPLETED' ? 'REVIEW ROUND' : 'START ROUND'}
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Link href="/assets">
                <Button variant="glass" className="w-full text-xs h-12">
                  <FileText className="w-4 h-4 mr-2" /> ASSETS
                </Button>
              </Link>
              <Link href="/clues">
                <Button variant="glass" className="w-full text-xs h-12">
                  <Key className="w-4 h-4 mr-2" /> CLUES
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
