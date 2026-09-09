"use client";

import { useEffect, useState } from 'react';
import { DB } from '@/services/db';
import { LeaderboardEntry, Team } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Trophy, Medal, Award, Edit2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState<number>(0);
  const [editQuizScore, setEditQuizScore] = useState<number>(0);

  const loadLeaderboard = () => {
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
      
    ranked.forEach((r, idx) => r.rank = idx + 1);
    setEntries(ranked);
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const handleEditClick = (teamId: string, currentScore: number, currentQuizScore: number) => {
    setEditingId(teamId);
    setEditScore(currentScore);
    setEditQuizScore(currentQuizScore);
  };

  const handleSaveScore = (teamId: string) => {
    const teams = DB.getTeams();
    const targetTeam = teams.find(t => t.id === teamId);
    
    if (targetTeam) {
      // The total score = team.score + team.quizScore.
      // If we are overriding the "score" we should just set team.score to (editScore - editQuizScore).
      const newBaseScore = editScore - editQuizScore;
      
      const updatedTeams = teams.map(t => 
        t.id === teamId ? { ...t, score: newBaseScore, quizScore: editQuizScore } : t
      );
      
      DB.setTeams(updatedTeams);
      setEditingId(null);
      loadLeaderboard();
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-warning" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-slate-300" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-foreground/50 font-mono w-6 text-center inline-block">{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-danger tracking-tight">ADMIN LEADERBOARD</h1>
          <p className="text-slate-500 mt-1">Live rankings with score override capabilities.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Team</th>
                  <th className="px-6 py-4">Total Score</th>
                  <th className="px-6 py-4">Rounds</th>
                  <th className="px-6 py-4">Quiz Score</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => {
                  const isEditing = editingId === entry.teamId;
                  return (
                    <tr 
                      key={entry.teamId} 
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">{getRankIcon(entry.rank)}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {entry.teamName}
                      </td>
                      <td className="px-6 py-4 font-mono text-primary text-lg">
                        {isEditing ? (
                          <Input 
                            type="number" 
                            value={editScore} 
                            onChange={(e) => setEditScore(parseInt(e.target.value) || 0)}
                            className="w-24 h-8 text-center bg-white border-primary"
                            autoFocus
                          />
                        ) : (
                          entry.score
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{entry.roundsCompleted} / 6</td>
                      <td className="px-6 py-4 text-success">
                        {isEditing ? (
                          <Input 
                            type="number" 
                            value={editQuizScore} 
                            onChange={(e) => setEditQuizScore(parseInt(e.target.value) || 0)}
                            className="w-24 h-8 text-center bg-white border-success"
                          />
                        ) : (
                          entry.quizScore
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-8 w-8 p-0 text-slate-500">
                              <X className="w-4 h-4" />
                            </Button>
                            <Button size="sm" onClick={() => handleSaveScore(entry.teamId)} className="h-8 w-8 p-0 bg-success hover:bg-success/90 text-white">
                              <Check className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => handleEditClick(entry.teamId, entry.score, entry.quizScore)} className="h-8 px-2 text-primary hover:bg-primary/10">
                            <Edit2 className="w-4 h-4 mr-1" /> Edit
                          </Button>
                        )}
                      </td>
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
