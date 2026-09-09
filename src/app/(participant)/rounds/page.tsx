"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DB } from '@/services/db';
import { Round } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Lock, Unlock, CheckCircle, PlayCircle } from 'lucide-react';

export default function RoundsPage() {
  const [rounds, setRounds] = useState<Round[]>([]);

  useEffect(() => {
    setRounds(DB.getRounds());
  }, []);

  const getStatusConfig = (status: Round['status']) => {
    switch (status) {
      case 'LOCKED': return { icon: Lock, color: 'text-foreground/40', badge: 'default' as const, bg: 'bg-white/60 opacity-70' };
      case 'UNLOCKED': return { icon: Unlock, color: 'text-primary', badge: 'outline' as const, bg: 'bg-primary/5 border-primary/30' };
      case 'IN_PROGRESS': return { icon: PlayCircle, color: 'text-warning', badge: 'warning' as const, bg: 'bg-warning/5 border-warning/30' };
      case 'COMPLETED': return { icon: CheckCircle, color: 'text-success', badge: 'success' as const, bg: 'bg-success/5 border-success/30' };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 text-glow">CHALLENGE ROUNDS</h1>
        <p className="text-foreground/60 mt-1">Complete rounds sequentially or as unlocked by the admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rounds.map(round => {
          const config = getStatusConfig(round.status);
          const Icon = config.icon;

          return (
            <Card key={round.id} className={`transition-all duration-300 ${config.bg} ${round.status !== 'LOCKED' && 'hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:-translate-y-1'}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant={config.badge} className="uppercase tracking-widest text-[10px]">Round {round.roundNumber}</Badge>
                  <Icon className={`w-6 h-6 ${config.color}`} />
                </div>
                <CardTitle className="mt-4 text-xl">{round.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70 line-clamp-2 min-h-[40px]">{round.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="glass-panel px-2 py-1 rounded">Score: {round.maxScore}</span>
                  {round.timeLimit && <span className="glass-panel px-2 py-1 rounded">Time: {round.timeLimit}m</span>}
                </div>
              </CardContent>
              <CardFooter>
                {round.status === 'LOCKED' ? (
                  <Button variant="ghost" disabled className="w-full bg-white/60 text-foreground/40 border border-glass-border">
                    <Lock className="w-4 h-4 mr-2" /> LOCKED
                  </Button>
                ) : (
                  <Link href={`/rounds/${round.id}`} className="w-full">
                    <Button variant={round.status === 'COMPLETED' ? 'outline' : 'default'} className="w-full group">
                      {round.status === 'COMPLETED' ? 'REVIEW SUBMISSION' : 'ENTER ROUND'}
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
