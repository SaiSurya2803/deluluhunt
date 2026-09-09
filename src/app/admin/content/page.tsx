"use client";

import { useState, useEffect } from 'react';
import { DB } from '@/services/db';
import { Round } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, Lock, Unlock, PlayCircle, CheckCircle } from 'lucide-react';

export default function ContentManagementPage() {
  const [rounds, setRounds] = useState<Round[]>([]);

  useEffect(() => {
    setRounds(DB.getRounds() || []);
  }, []);

  const saveRounds = () => {
    DB.setRounds(rounds);
    alert('Rounds saved successfully!');
  };

  const updateRound = (id: string, field: keyof Round, value: any) => {
    setRounds(rounds.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-danger tracking-tight">ROUNDS MANAGEMENT</h1>
          <p className="text-slate-500 mt-1">Configure titles, descriptions, points, and unlock status.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setRounds([...rounds, { id: `r${Date.now()}`, roundNumber: rounds.length + 1, title: 'New Round', description: '', objective: '', rules: [], maxScore: 100, status: 'LOCKED' }])} className="bg-white text-slate-700 hover:bg-slate-50">
            Add Round
          </Button>
          <Button onClick={saveRounds} className="bg-success text-white hover:bg-success/90">
            <Save className="w-4 h-4 mr-2" /> Save All Rounds
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {rounds.length === 0 && <p className="text-slate-500 col-span-full text-center p-8">No rounds defined. Click Add Round.</p>}
        {rounds.map((round) => (
          <Card key={round.id} className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg text-slate-800">Round {round.roundNumber}</CardTitle>
              <div className="flex items-center gap-2">
                <select 
                  value={round.status}
                  onChange={(e) => updateRound(round.id, 'status', e.target.value)}
                  className="bg-white border border-slate-300 text-sm rounded px-2 py-1 text-slate-700"
                >
                  <option value="LOCKED">LOCKED</option>
                  <option value="UNLOCKED">UNLOCKED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
                <Button variant="ghost" size="sm" onClick={() => { if(confirm('Delete round?')) setRounds(rounds.filter(r => r.id !== round.id)) }} className="text-danger hover:bg-danger/10 p-2 h-auto">
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Title</label>
                <Input 
                  value={round.title} 
                  onChange={(e) => updateRound(round.id, 'title', e.target.value)} 
                  className="bg-white border-slate-300 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea 
                  value={round.description} 
                  onChange={(e) => updateRound(round.id, 'description', e.target.value)} 
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-md p-2 text-sm min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Objective</label>
                <Input 
                  value={round.objective} 
                  onChange={(e) => updateRound(round.id, 'objective', e.target.value)} 
                  className="bg-white border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Time Limit (mins)</label>
                  <Input 
                    type="number"
                    value={round.timeLimit || 0} 
                    onChange={(e) => updateRound(round.id, 'timeLimit', parseInt(e.target.value) || 0)} 
                    className="bg-white border-slate-300 text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Max Score</label>
                  <Input 
                    type="number"
                    value={round.maxScore || 0} 
                    onChange={(e) => updateRound(round.id, 'maxScore', parseInt(e.target.value) || 0)} 
                    className="bg-white border-slate-300 text-slate-900"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
