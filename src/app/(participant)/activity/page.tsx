"use client";

import { useEffect, useState } from 'react';
import { DB } from '@/services/db';
import { ActivityLog } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuthStore } from '@/store/useAuthStore';
import { Activity, Clock } from 'lucide-react';

export default function ActivityPage() {
  const { team } = useAuthStore();
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (team) {
      const allLogs = DB.getActivityLogs();
      const teamLogs = allLogs
        .filter(l => l.teamId === team.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLogs(teamLogs);
    }
  }, [team]);

  if (!team) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 text-glow">TEAM ACTIVITY</h1>
        <p className="text-foreground/60 mt-1">A chronological log of all your team's actions.</p>
      </div>

      <Card className="border-glass-border">
        <CardHeader className="border-b border-glass-border">
          <CardTitle className="flex items-center"><Activity className="w-5 h-5 mr-2" /> Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-foreground/50">
              No activity recorded yet.
            </div>
          ) : (
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-glass-border before:to-transparent">
              {logs.map((log) => {
                const date = new Date(log.timestamp);
                const member = team.members.find(m => m.id === log.memberId);
                
                return (
                  <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary/30 bg-white text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                      <Clock className="w-4 h-4" />
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-glass-border bg-white/60 hover:bg-white/60 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-900 font-medium">{log.action}</p>
                      {member && <p className="text-xs text-foreground/50 mt-2 flex items-center">Performed by: <span className="text-foreground/80 ml-1">{member.name}</span></p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
