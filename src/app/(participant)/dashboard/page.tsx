"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { DB } from '@/services/db';
import { Round, ActivityLog } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Swords, Coins, Key, BrainCircuit, Activity, Folder } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { team } = useAuthStore();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (team) {
      setRounds(DB.getRounds());
      const logs = DB.getActivityLogs().filter(l => l.teamId === team.id).slice(0, 5);
      setRecentLogs(logs);
    }
  }, [team]);

  if (!team) return null;

  const progressPercent = Math.round((team.roundsCompleted / 6) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {team.name}</h1>
          <p className="text-foreground/60 mt-1">Ready for your next challenge?</p>
        </div>
        <div className="flex gap-2">
          <Link href="/rounds"><Button variant="default">Continue Round</Button></Link>
          <Link href="/leaderboard"><Button variant="outline">View Leaderboard</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
            <Swords className="w-8 h-8 text-primary" />
            <div className="text-3xl font-bold">{team.roundsCompleted} / 6</div>
            <div className="text-xs text-foreground/50 uppercase tracking-wide">Rounds Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
            <Activity className="w-8 h-8 text-secondary" />
            <div className="text-3xl font-bold">{team.score + (team.quizScore || 0)}</div>
            <div className="text-xs text-foreground/50 uppercase tracking-wide">Total Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
            <Coins className="w-8 h-8 text-warning" />
            <div className="text-3xl font-bold">{team.credits}</div>
            <div className="text-xs text-foreground/50 uppercase tracking-wide">Credits Remaining</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
            <BrainCircuit className="w-8 h-8 text-success" />
            <div className="text-lg font-bold mt-2"><Badge variant={team.quizStatus === 'COMPLETED' ? 'success' : 'warning'}>{team.quizStatus}</Badge></div>
            <div className="text-xs text-foreground/50 uppercase tracking-wide mt-2">Quiz Status</div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
        <CardContent className="p-6">
          <div className="flex justify-between items-end mb-2">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">Round Progress</div>
            <div className="text-xl font-bold">{progressPercent}%</div>
          </div>
          <div className="w-full bg-white/80 h-4 rounded-full overflow-hidden border border-glass-border">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,240,255,0.8)]"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs.length > 0 ? (
              <div className="space-y-4">
                {recentLogs.map(log => (
                  <div key={log.id} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0"></div>
                    <div>
                      <p className="text-slate-900">{log.action}</p>
                      <p className="text-foreground/50 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground/50 text-sm italic">No recent activity.</p>
            )}
            <Link href="/activity">
              <Button variant="ghost" size="sm" className="w-full mt-4">View All Activity</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link href="/assets" className="glass-panel p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-glass-bg transition-colors text-center">
              <Folder className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">View Assets</span>
            </Link>
            <Link href="/clues" className="glass-panel p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-glass-bg transition-colors text-center">
              <Key className="w-6 h-6 text-warning" />
              <span className="text-sm font-medium">View Clues</span>
            </Link>
            <Link href="/credits" className="glass-panel p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-glass-bg transition-colors text-center">
              <Coins className="w-6 h-6 text-success" />
              <span className="text-sm font-medium">Get Credits</span>
            </Link>
            <Link href="/quiz/intro" className="glass-panel p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-glass-bg transition-colors text-center">
              <BrainCircuit className="w-6 h-6 text-secondary" />
              <span className="text-sm font-medium">Quiz Round</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
