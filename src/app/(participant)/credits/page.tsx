"use client";

import { useEffect, useState } from 'react';
import { DB } from '@/services/db';
import { CreditTransaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/useAuthStore';
import { Coins, ArrowDownRight, ArrowUpRight, History } from 'lucide-react';

export default function CreditsPage() {
  const { team } = useAuthStore();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);

  useEffect(() => {
    if (team) {
      const allTx = DB.getCreditTx();
      setTransactions(allTx.filter(tx => tx.teamId === team.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }
  }, [team]);

  if (!team) return null;

  const startingCredits = 50; // In a real app this might be configurable
  const creditsUsed = startingCredits - team.credits;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white text-glow">CREDIT CENTER</h1>
        <p className="text-foreground/60 mt-1">Manage your team's credits and view transaction history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-warning/10 border-warning/30 shadow-[0_0_30px_rgba(255,170,0,0.15)] relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-20"><Coins className="w-32 h-32 text-warning" /></div>
          <CardHeader>
            <CardTitle className="text-warning text-sm uppercase tracking-wider">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-black text-warning text-glow">{team.credits}</div>
            <p className="text-warning/70 mt-2 text-sm">Available to spend</p>
          </CardContent>
        </Card>

        <Card className="border-glass-border">
          <CardHeader>
            <CardTitle className="text-foreground/70 text-sm uppercase tracking-wider">Starting Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{startingCredits}</div>
            <p className="text-foreground/50 mt-2 text-sm">Initial allocation</p>
          </CardContent>
        </Card>

        <Card className="border-danger/20 bg-danger/5">
          <CardHeader>
            <CardTitle className="text-danger/80 text-sm uppercase tracking-wider">Total Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-danger">{creditsUsed}</div>
            <p className="text-danger/60 mt-2 text-sm">Spent on hints & clues</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-glass-border">
          <CardTitle className="flex items-center"><History className="w-5 h-5 mr-2" /> Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-foreground/50">
              No transactions yet.
            </div>
          ) : (
            <div className="divide-y divide-glass-border">
              {transactions.map(tx => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-900/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                      {tx.amount > 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-white">{tx.reason}</p>
                      <p className="text-xs text-foreground/50">{new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount}
                    </p>
                    <p className="text-xs text-foreground/50">Balance: {tx.balanceAfter}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
