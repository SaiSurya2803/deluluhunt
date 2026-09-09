"use client";

import { useState, useEffect } from 'react';
import { DB } from '@/services/db';
import { RoundSubmission, Team, Round } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle, Clock } from 'lucide-react';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<RoundSubmission[]>([]);
  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [rounds, setRounds] = useState<Record<string, Round>>({});

  useEffect(() => {
    setSubmissions(DB.getSubmissions() || []);
    
    const teamMap: Record<string, Team> = {};
    DB.getTeams().forEach(t => teamMap[t.id] = t);
    setTeams(teamMap);

    const roundMap: Record<string, Round> = {};
    DB.getRounds().forEach(r => roundMap[r.id] = r);
    setRounds(roundMap);
  }, []);

  const handleGrade = (subId: string, teamId: string, score: number) => {
    // 1. Update Submission status
    const updatedSubs = submissions.map(s => 
      s.id === subId ? { ...s, status: 'GRADED' as const, score } : s
    );
    DB.setSubmissions(updatedSubs);
    setSubmissions(updatedSubs);

    // 2. Add score to the Team
    const allTeams = DB.getTeams();
    const updatedTeams = allTeams.map(t => 
      t.id === teamId ? { ...t, score: t.score + score } : t
    );
    DB.setTeams(updatedTeams);
    
    // Update local team map for UI refresh
    setTeams(prev => ({
      ...prev,
      [teamId]: { ...prev[teamId], score: prev[teamId].score + score }
    }));
    
    alert(`Successfully graded! Added ${score} points to team.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-danger tracking-tight">GRADING & SUBMISSIONS</h1>
          <p className="text-slate-500 mt-1">Review team workspace answers and assign scores manually.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {submissions.length === 0 && (
          <div className="col-span-full text-center p-12 bg-white border border-slate-200 rounded-xl text-slate-500">
            No submissions pending review.
          </div>
        )}
        
        {submissions.map((sub) => {
          const team = teams[sub.teamId];
          const round = rounds[sub.roundId];
          if (!team || !round) return null;

          return (
            <Card key={sub.id} className="border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-slate-800">{team.name}</CardTitle>
                    <p className="text-sm text-slate-500">Round {round.roundNumber}: {round.title}</p>
                  </div>
                  {sub.status === 'GRADED' ? (
                    <span className="flex items-center text-xs font-bold text-success bg-success/10 px-2 py-1 rounded">
                      <CheckCircle className="w-3 h-3 mr-1" /> GRADED ({sub.score} pts)
                    </span>
                  ) : (
                    <span className="flex items-center text-xs font-bold text-warning bg-warning/10 px-2 py-1 rounded">
                      <Clock className="w-3 h-3 mr-1" /> PENDING
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col space-y-4">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Submitted Answer</label>
                  <div className="mt-1 w-full bg-slate-900 text-slate-300 rounded-md p-4 text-sm font-mono whitespace-pre-wrap overflow-y-auto max-h-[200px] custom-scrollbar">
                    {sub.answer || <span className="italic text-slate-500">No answer provided.</span>}
                  </div>
                </div>

                {sub.status === 'PENDING_REVIEW' && (
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">Max Score: {round.maxScore}</p>
                    </div>
                    <form 
                      className="flex items-center gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const score = parseInt(formData.get('score') as string) || 0;
                        handleGrade(sub.id, team.id, score);
                      }}
                    >
                      <Input 
                        type="number" 
                        name="score"
                        max={round.maxScore}
                        min={0}
                        placeholder="Points" 
                        className="w-24 text-center bg-white border-slate-300"
                        required
                      />
                      <Button type="submit" className="bg-success hover:bg-success/90">
                        Assign Score
                      </Button>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
