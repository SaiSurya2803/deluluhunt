"use client";

import { useEffect, useState } from 'react';
import { DB } from '@/services/db';
import { Clue, Round } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/useAuthStore';
import { Key, Lock, Unlock, AlertCircle } from 'lucide-react';

export default function CluesPage() {
  const { team, updateTeam, currentMember } = useAuthStore();
  const [clues, setClues] = useState<Clue[]>([]);
  const [rounds, setRounds] = useState<Record<string, Round>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [team]);

  const loadData = () => {
    if (!team) return;
    
    // Only show clues for unlocked or completed rounds
    const allRounds = DB.getRounds();
    const accessibleRounds = allRounds.filter(r => r.status !== 'LOCKED');
    
    const roundsMap = accessibleRounds.reduce((acc, r) => ({ ...acc, [r.id]: r }), {} as Record<string, Round>);
    setRounds(roundsMap);

    const allClues = DB.getClues();
    // A clue is related to a team. In our mock, we can just use the global clues, 
    // but typically clues unlocking is per team.
    // For demo purposes, we will load team's unlocked clues from a custom key, 
    // or just assume `isUnlocked` in the DB is global (not ideal).
    // Let's use local storage to track *team's* unlocked clues.
    const teamUnlockedCluesKey = `unlocked_clues_${team.id}`;
    const unlockedIds: string[] = JSON.parse(localStorage.getItem(teamUnlockedCluesKey) || '[]');
    
    const relevantClues = allClues.filter(c => roundsMap[c.roundId]).map(c => ({
      ...c,
      isUnlocked: c.isFree || unlockedIds.includes(c.id)
    }));
    
    setClues(relevantClues);
  };

  const handleUnlock = (clue: Clue) => {
    if (!team || !currentMember) return;
    setError('');

    if (team.credits < clue.cost) {
      setError(`Insufficient credits. You need ${clue.cost} credits, but only have ${team.credits}.`);
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (confirm(`Unlock this clue for ${clue.cost} credits?`)) {
      const newCredits = team.credits - clue.cost;
      
      // Update team credits
      const teams = DB.getTeams();
      const updatedTeam = { ...team, credits: newCredits };
      DB.setTeams(teams.map(t => t.id === team.id ? updatedTeam : t));
      updateTeam(updatedTeam);

      // Save unlocked state
      const teamUnlockedCluesKey = `unlocked_clues_${team.id}`;
      const unlockedIds: string[] = JSON.parse(localStorage.getItem(teamUnlockedCluesKey) || '[]');
      localStorage.setItem(teamUnlockedCluesKey, JSON.stringify([...unlockedIds, clue.id]));

      // Log credit tx
      const txs = DB.getCreditTx();
      DB.setCreditTx([
        {
          id: `tx-${Date.now()}`,
          teamId: team.id,
          amount: -clue.cost,
          balanceAfter: newCredits,
          reason: `Unlocked extra clue for Round ${rounds[clue.roundId]?.roundNumber}`,
          timestamp: new Date().toISOString(),
          roundId: clue.roundId,
        },
        ...txs
      ]);

      // Log activity
      const logs = DB.getActivityLogs();
      DB.setActivityLogs([
        {
          id: `log-${Date.now()}`,
          teamId: team.id,
          memberId: currentMember.id,
          action: `Purchased Clue for Round ${rounds[clue.roundId]?.roundNumber} (-${clue.cost} credits)`,
          timestamp: new Date().toISOString()
        },
        ...logs
      ]);

      loadData(); // refresh
    }
  };

  // Group by round
  const groupedClues = clues.reduce((acc, clue) => {
    if (!acc[clue.roundId]) acc[clue.roundId] = [];
    acc[clue.roundId].push(clue);
    return acc;
  }, {} as Record<string, Clue[]>);

  if (!team) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-glass-border pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">CLUES & HINTS</h1>
          <p className="text-foreground/60 mt-1">Unlock hints to help solve complex challenges.</p>
        </div>
        <div className="bg-glass-bg border border-glass-border px-4 py-2 rounded-lg flex items-center gap-3">
          <span className="text-sm text-foreground/60 uppercase tracking-wider">Balance:</span>
          <span className="font-bold text-xl text-warning">{team.credits}</span>
          <span className="text-warning text-xs uppercase tracking-widest">CRD</span>
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {Object.keys(groupedClues).length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-xl">
          <Key className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
          <p className="text-foreground/60">No clues available yet. Unlock more rounds to view clues.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedClues).map(roundId => {
            const round = rounds[roundId];
            if (!round) return null;

            return (
              <div key={roundId} className="space-y-4">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Badge variant="outline" className="border-primary text-primary">R{round.roundNumber}</Badge>
                  {round.title}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedClues[roundId].map((clue, idx) => (
                    <Card key={clue.id} className={clue.isUnlocked ? 'border-success/30 bg-success/5' : 'border-glass-border'}>
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold text-white">Clue {idx + 1}</CardTitle>
                        {clue.isUnlocked ? (
                          <Unlock className="w-4 h-4 text-success" />
                        ) : (
                          <Lock className="w-4 h-4 text-foreground/40" />
                        )}
                      </CardHeader>
                      <CardContent className="min-h-[80px]">
                        {clue.isUnlocked ? (
                          <p className="text-foreground/90">{clue.content}</p>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-foreground/40">
                            <Lock className="w-6 h-6 mb-2 opacity-50" />
                            <span className="text-xs uppercase tracking-wider">Hidden Clue</span>
                          </div>
                        )}
                      </CardContent>
                      {!clue.isUnlocked && (
                        <CardFooter className="pt-0">
                          <Button 
                            className="w-full bg-warning text-black hover:bg-warning/80 shadow-[0_0_10px_rgba(255,170,0,0.3)]"
                            onClick={() => handleUnlock(clue)}
                          >
                            UNLOCK FOR {clue.cost} CREDITS
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
