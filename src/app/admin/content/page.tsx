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
  const [eventDate, setEventDate] = useState<string>('');
  const [venue, setVenue] = useState<string>('');
  const [registrationUrl, setRegistrationUrl] = useState<string>('');
  const [rulesText, setRulesText] = useState<string>('');

  useEffect(() => {
    setRounds(DB.getRounds() || []);
    const gs = DB.getGlobalSettings();
    if (gs.tournamentEndTime) {
      setTournamentEndTime(new Date(gs.tournamentEndTime).toISOString().slice(0, 16));
    }
    setEventDate(gs.eventDate || '');
    setVenue(gs.venue || '');
    setRegistrationUrl(gs.registrationUrl || '');
    setRulesText(gs.rulesText || '');
  }, []);

  const saveRounds = () => {
    DB.setRounds(rounds);
    
    // Save global settings
    DB.setGlobalSettings({
      tournamentEndTime: new Date(tournamentEndTime).toISOString(),
      eventDate,
      venue,
      registrationUrl,
      rulesText
    });
    
    alert('Content and settings saved successfully!');
  };

  const updateRound = (id: string, field: keyof Round, value: any) => {
    setRounds(rounds.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-foreground/20/10">
        <div>
          <h1 className="text-3xl font-bold text-danger tracking-tight">PLATFORM MANAGEMENT</h1>
          <p className="text-slate-400 mt-1">Configure global settings and round configurations.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setRounds([...rounds, { id: `r${Date.now()}`, roundNumber: rounds.length + 1, title: 'New Round', description: '', objective: '', rules: [], maxScore: 100, status: 'LOCKED' }])} className="glass-panel text-slate-300 hover:glass-panel backdrop-blur-lg">
            Add Round
          </Button>
          <Button onClick={saveRounds} className="bg-success text-foreground hover:bg-success/90">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </div>

      <Card className="border-foreground/20/10 shadow-sm glass-panel overflow-hidden mb-6">
        <CardHeader className="glass-panel backdrop-blur-lg border-b border-foreground/20/10 pb-4">
          <CardTitle className="text-lg text-slate-200 flex items-center">
             Global Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Race Ends At (Date & Time)</label>
            <Input 
              type="datetime-local"
              value={tournamentEndTime} 
              onChange={(e) => setTournamentEndTime(e.target.value)}
              className="bg-void/50 border-foreground/20/10 text-foreground"
            />
            <p className="text-xs text-slate-500">Global countdown timer for leaderboard.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Event Date (Home Page)</label>
            <Input 
              type="text"
              value={eventDate} 
              onChange={(e) => setEventDate(e.target.value)}
              className="bg-void/50 border-foreground/20/10 text-foreground"
              placeholder="e.g. OCT 28 2026"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Venue (Home Page)</label>
            <Input 
              type="text"
              value={venue} 
              onChange={(e) => setVenue(e.target.value)}
              className="bg-void/50 border-foreground/20/10 text-foreground"
              placeholder="e.g. INNOVATEX HQ"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Registration URL (Home Page)</label>
            <Input 
              type="text"
              value={registrationUrl} 
              onChange={(e) => setRegistrationUrl(e.target.value)}
              className="bg-void/50 border-foreground/20/10 text-foreground"
              placeholder="e.g. /register or https://forms.gle/..."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-300">Rules & Help Text (/rules)</label>
            <textarea 
              value={rulesText}
              onChange={(e) => setRulesText(e.target.value)}
              className="w-full h-32 bg-void/50 border border-foreground/20/10 rounded-md p-3 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-danger"
              placeholder="Enter the official hackathon rules here..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {rounds.length === 0 && <p className="text-slate-400 col-span-full text-center p-8">No rounds defined. Click Add Round.</p>}
        {rounds.map((round) => (
          <Card key={round.id} className="border-foreground/20/10 shadow-sm glass-panel  overflow-hidden">
            <CardHeader className="glass-panel backdrop-blur-lg border-b border-foreground/20/10 flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg text-slate-200">Round {round.roundNumber}</CardTitle>
              <div className="flex items-center gap-2">
                <select 
                  value={round.status}
                  onChange={(e) => updateRound(round.id, 'status', e.target.value)}
                  className="glass-panel  border border-foreground/20 text-sm rounded px-2 py-1 text-slate-300"
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
                  className="glass-panel  border-foreground/20 text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Description</label>
                <textarea 
                  value={round.description} 
                  onChange={(e) => updateRound(round.id, 'description', e.target.value)} 
                  className="w-full glass-panel  border border-foreground/20 text-foreground rounded-md p-2 text-sm min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Objective</label>
                <Input 
                  value={round.objective} 
                  onChange={(e) => updateRound(round.id, 'objective', e.target.value)} 
                  className="glass-panel  border-foreground/20 text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Time Limit (mins)</label>
                  <Input 
                    type="number"
                    value={round.timeLimit || 0} 
                    onChange={(e) => updateRound(round.id, 'timeLimit', parseInt(e.target.value) || 0)} 
                    className="glass-panel  border-foreground/20 text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Max Score</label>
                  <Input 
                    type="number"
                    value={round.maxScore || 0} 
                    onChange={(e) => updateRound(round.id, 'maxScore', parseInt(e.target.value) || 0)} 
                    className="glass-panel  border-foreground/20 text-foreground"
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
