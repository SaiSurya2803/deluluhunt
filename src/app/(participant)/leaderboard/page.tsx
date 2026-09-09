"use client";

import { useEffect, useState } from 'react';
import { DB } from '@/services/db';
import { LeaderboardEntry } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuthStore } from '@/store/useAuthStore';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LeaderboardPage() {
  const { team } = useAuthStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Generate leaderboard from teams
    const teams = DB.getTeams();
    const ranked = teams
      .map(t => ({
        rank: 0,
        teamId: t.id,
        teamName: t.name,
        score: t.score + (t.quizScore || 0),
        roundsCompleted: t.roundsCompleted,
        quizScore: t.quizScore || 0,
        creditsUsed: 50 - t.credits,
        completionTime: 0,
      }))
      .sort((a, b) => b.score - a.score || b.roundsCompleted - a.roundsCompleted);
      
    // Assign ranks
    ranked.forEach((r, idx) => r.rank = idx + 1);
    setEntries(ranked);
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-warning" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-slate-300" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-foreground/50 font-mono w-6 text-center inline-block">{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-slate-900 text-glow">GLOBAL LEADERBOARD</h1>
        <p className="text-foreground/60 mt-2">Live rankings based on score and completion time.</p>
      </div>

      <Card className="border-primary/20">
        <CardContent className="p-0 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-foreground/50 uppercase bg-white/60 border-b border-glass-border">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Team</th>
                  <th className="px-6 py-4">Total Score</th>
                  <th className="px-6 py-4">Rounds</th>
                  <th className="px-6 py-4">Quiz Score</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => {
                  const isCurrentTeam = entry.teamId === team?.id;
                  return (
                    <tr 
                      key={entry.teamId} 
                      className={cn(
                        "border-b border-glass-border/50 last:border-0 hover:bg-white/5 transition-colors",
                        isCurrentTeam && "bg-primary/10 border-primary/30"
                      )}
                    >
                      <td className="px-6 py-4">{getRankIcon(entry.rank)}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                        {entry.teamName}
                        {isCurrentTeam && <span className="px-2 py-0.5 rounded text-[10px] bg-primary text-black ml-2 uppercase tracking-wider">You</span>}
                      </td>
                      <td className="px-6 py-4 font-mono text-primary text-lg">{entry.score}</td>
                      <td className="px-6 py-4">{entry.roundsCompleted} / 6</td>
                      <td className="px-6 py-4 text-success">{entry.quizScore}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
