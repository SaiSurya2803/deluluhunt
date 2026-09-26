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
  const [tournamentEndTime, setTournamentEndTime] = useState<string>('');

  useEffect(() => {
    setRounds(DB.getRounds() || []);
    const gs = DB.getGlobalSettings();
    // Convert to format suitable for datetime-local input (YYYY-MM-DDThh:mm)
    if (gs.tournamentEndTime) {
      setTournamentEndTime(new Date(gs.tournamentEndTime).toISOString().slice(0, 16));
    }
  }, []);

  const saveRounds = () => {
    DB.setRounds(rounds);
    
    // Save global settings
    const currentGlobal = DB.getGlobalSettings();
    DB.setGlobalSettings({
      ...currentGlobal,
      tournamentEndTime: new Date(tournamentEndTime).toISOString()
    });
    
    alert('Content and timers saved successfully!');
  };

  const updateRound = (id: string, field: keyof Round, value: any) => {
    setRounds(rounds.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-white/20/10">
        <div>
          <h1 className="text-3xl font-bold text-danger tracking-tight">ROUNDS MANAGEMENT</h1>
          <p className="text-slate-400 mt-1">Configure titles, descriptions, points, and unlock status.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setRounds([...rounds, { id: `r${Date.now()}`, roundNumber: rounds.length + 1, title: 'New Round', description: '', objective: '', rules: [], maxScore: 100, status: 'LOCKED' }])} className="glass-panel  text-slate-300 hover:glass-panel backdrop-blur-lg">
            Add Round
          </Button>
          <Button onClick={saveRounds} className="bg-success text-white hover:bg-success/90">
            <Save className="w-4 h-4 mr-2" /> Save All Rounds
          </Button>
        </div>
      </div>

      <Card className="border-white/20/10 shadow-sm glass-panel overflow-hidden mb-6">
        <CardHeader className="glass-panel backdrop-blur-lg border-b border-white/20/10 pb-4">
          <CardTitle className="text-lg text-slate-200 flex items-center">
             Global Tournament Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-2 max-w-sm">
            <label className="text-sm font-semibold text-slate-300">Race Ends At (Date & Time)</label>
            <Input 
              type="datetime-local"
              value={tournamentEndTime} 
              onChange={(e) => setTournamentEndTime(e.target.value)} 
              className="glass-panel border-white/20 text-white"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {rounds.length === 0 && <p className="text-slate-400 col-span-full text-center p-8">No rounds defined. Click Add Round.</p>}
        {rounds.map((round) => (
          <Card key={round.id} className="border-white/20/10 shadow-sm glass-panel  overflow-hidden">
            <CardHeader className="glass-panel backdrop-blur-lg border-b border-white/20/10 flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg text-slate-200">Round {round.roundNumber}</CardTitle>
              <div className="flex items-center gap-2">
                <select 
                  value={round.status}
                  onChange={(e) => updateRound(round.id, 'status', e.target.value)}
                  className="glass-panel  border border-white/20 text-sm rounded px-2 py-1 text-slate-300"
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
                <label className="text-sm font-semibold text-slate-300">Title</label>
                <Input 
                  value={round.title} 
                  onChange={(e) => updateRound(round.id, 'title', e.target.value)} 
                  className="glass-panel  border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Description</label>
                <textarea 
                  value={round.description} 
                  onChange={(e) => updateRound(round.id, 'description', e.target.value)} 
                  className="w-full glass-panel  border border-white/20 text-white rounded-md p-2 text-sm min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Objective</label>
                <Input 
                  value={round.objective} 
                  onChange={(e) => updateRound(round.id, 'objective', e.target.value)} 
                  className="glass-panel  border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Time Limit (mins)</label>
                  <Input 
                    type="number"
                    value={round.timeLimit || 0} 
                    onChange={(e) => updateRound(round.id, 'timeLimit', parseInt(e.target.value) || 0)} 
                    className="glass-panel  border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Max Score</label>
                  <Input 
                    type="number"
                    value={round.maxScore || 0} 
                    onChange={(e) => updateRound(round.id, 'maxScore', parseInt(e.target.value) || 0)} 
                    className="glass-panel  border-white/20 text-white"
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
