"use client";

import { useState, useEffect } from 'react';
import { DB } from '@/services/db';
import { Clue, Round } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, Plus, Trash2, Key } from 'lucide-react';

export default function AdminCluesPage() {
  const [clues, setClues] = useState<Clue[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);

  useEffect(() => {
    setClues(DB.getClues() || []);
    setRounds(DB.getRounds() || []);
  }, []);

  const saveClues = () => {
    DB.setClues(clues);
    alert('Clues saved successfully!');
  };

  const addClue = () => {
    setClues([
      ...clues,
      {
        id: `c-${Date.now()}`,
        roundId: rounds[0]?.id || 'r1',
        content: 'New hint information...',
        cost: 10,
        isUnlocked: false,
        isFree: false
      }
    ]);
  };

  const updateClue = (id: string, field: keyof Clue, value: any) => {
    setClues(clues.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeClue = (id: string) => {
    if (confirm('Delete this clue?')) {
      setClues(clues.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-danger tracking-tight">CLUES MANAGEMENT</h1>
          <p className="text-slate-500 mt-1">Add hints, configure costs, and assign them to specific rounds.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addClue} className="bg-white text-slate-700 hover:bg-slate-50">
            <Plus className="w-4 h-4 mr-2" /> Add Clue
          </Button>
          <Button onClick={saveClues} className="bg-success text-white hover:bg-success/90">
            <Save className="w-4 h-4 mr-2" /> Save All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {clues.map((clue, index) => (
          <Card key={clue.id} className="border-slate-200 shadow-sm bg-white overflow-visible">
            <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center">
                <Key className="w-4 h-4 mr-2 text-warning" /> Clue {index + 1}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => removeClue(clue.id)} className="text-danger hover:bg-danger/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Assigned Round</label>
                <select 
                  value={clue.roundId}
                  onChange={(e) => updateClue(clue.id, 'roundId', e.target.value)}
                  className="w-full bg-white border border-slate-300 text-sm rounded-md px-3 py-2 text-slate-900"
                >
                  {rounds.map(r => (
                    <option key={r.id} value={r.id}>Round {r.roundNumber}: {r.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Clue Content</label>
                <textarea 
                  value={clue.content} 
                  onChange={(e) => updateClue(clue.id, 'content', e.target.value)} 
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-md p-3 text-sm min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Cost (Credits)</label>
                  <Input 
                    type="number"
                    value={clue.cost} 
                    onChange={(e) => updateClue(clue.id, 'cost', parseInt(e.target.value) || 0)} 
                    className="bg-white border-slate-300 text-slate-900"
                    disabled={clue.isFree}
                  />
                </div>
                <div className="flex flex-col gap-3 justify-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={clue.isFree}
                      onChange={(e) => updateClue(clue.id, 'isFree', e.target.checked)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm text-slate-700">Is Free</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={clue.isUnlocked}
                      onChange={(e) => updateClue(clue.id, 'isUnlocked', e.target.checked)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm text-slate-700">Unlocked Globally</span>
                  </label>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
