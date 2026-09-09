"use client";

import { useState, useEffect } from 'react';
import { DB } from '@/services/db';
import { QuizSubmission, Team, QuizQuestion } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default function AdminQuizSubmissionsPage() {
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [questions, setQuestions] = useState<Record<string, QuizQuestion>>({});

  useEffect(() => {
    setSubmissions(DB.getQuizSubmissions() || []);
    
    const teamMap: Record<string, Team> = {};
    DB.getTeams().forEach(t => teamMap[t.id] = t);
    setTeams(teamMap);

    const questionMap: Record<string, QuizQuestion> = {};
    const qs = DB.getItem<QuizQuestion>(DB.KEYS.QUIZ_QUESTIONS) || [];
    qs.forEach(q => questionMap[q.id] = q);
    setQuestions(questionMap);
  }, []);

  const formatTime = (seconds: number) => {
    if (!seconds) return '0s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-danger tracking-tight">QUIZ SUBMISSIONS</h1>
          <p className="text-slate-500 mt-1">Detailed breakdown of answers and time taken per team.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {submissions.length === 0 && (
          <div className="text-center p-12 bg-white border border-slate-200 rounded-xl text-slate-500">
            No quiz submissions yet.
          </div>
        )}
        
        {submissions.map((sub) => {
          const team = teams[sub.teamId];
          if (!team) return null;

          // Calculate total time taken
          const totalTime = Object.values(sub.timeTaken || {}).reduce((acc, curr) => acc + curr, 0);

          return (
            <Card key={sub.id} className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-slate-800">{team.name}</CardTitle>
                    <p className="text-sm text-slate-500">Submitted at: {new Date(sub.submittedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Time Taken</p>
                      <Badge variant="outline" className="font-mono bg-white">{formatTime(totalTime)}</Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Score</p>
                      <Badge variant="success" className="font-mono text-base px-3 py-1">{sub.totalScore} pts</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-3 font-medium">Question</th>
                        <th className="px-6 py-3 font-medium">Team's Answer</th>
                        <th className="px-6 py-3 font-medium">Correct Answer</th>
                        <th className="px-6 py-3 font-medium">Time Taken</th>
                        <th className="px-6 py-3 font-medium text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Object.keys(sub.answers).map(qId => {
                        const question = questions[qId];
                        const selectedIdx = sub.answers[qId];
                        const timeForQ = sub.timeTaken?.[qId] || 0;
                        
                        if (!question) return null;

                        const isCorrect = selectedIdx === question.correctOptionIndex;
                        const teamAnswerText = question.options[selectedIdx];
                        const correctAnswerText = question.options[question.correctOptionIndex];

                        return (
                          <tr key={qId} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 max-w-xs truncate font-medium text-slate-700" title={question.text}>
                              {question.text}
                            </td>
                            <td className={`px-6 py-4 max-w-xs truncate ${isCorrect ? 'text-success font-medium' : 'text-danger'}`} title={teamAnswerText}>
                              {teamAnswerText !== undefined ? teamAnswerText : 'No Answer'}
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate text-slate-600" title={correctAnswerText}>
                              {correctAnswerText}
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-500">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {formatTime(timeForQ)}</span>
                            </td>
                            <td className="px-6 py-4 flex justify-center">
                              {isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-success" />
                              ) : (
                                <XCircle className="w-5 h-5 text-danger" />
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
          );
        })}
      </div>
    </div>
  );
}
