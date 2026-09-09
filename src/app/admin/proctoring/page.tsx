"use client";

import { useEffect, useState } from 'react';
import { DB } from '@/services/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, UserX, CheckCircle, Video, Monitor, SplitSquareHorizontal } from 'lucide-react';
import { Team, ProctoringEvent } from '@/types';
import { cn } from '@/lib/utils';

// Live Monitor Component
function LiveMonitorNode({ team }: { team: Team }) {
  const [camFrame, setCamFrame] = useState<string | null>(null);
  const [screenFrame, setScreenFrame] = useState<string | null>(null);

  useEffect(() => {
    const channel = new BroadcastChannel(`proctoring_${team.id}`);
    channel.onmessage = (e) => {
      if (e.data.type === 'STREAM_UPDATE') {
        if (e.data.camFrame) setCamFrame(e.data.camFrame);
        if (e.data.screenFrame) setScreenFrame(e.data.screenFrame);
      }
    };
    return () => channel.close();
  }, [team.id]);

  return (
    <Card className="overflow-hidden border-slate-700 shadow-sm bg-slate-900 hover:shadow-md transition-shadow">
      <div className="flex bg-slate-900 relative">
        <div className="w-1/3 aspect-video bg-black relative border-r border-slate-800 flex items-center justify-center">
          {camFrame ? <img src={camFrame} alt="cam" className="w-full h-full object-cover transform scale-x-[-1]" /> : <Video className="w-6 h-6 text-slate-300" />}
          <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1 rounded">CAM</div>
        </div>
        <div className="w-2/3 aspect-video bg-black relative flex items-center justify-center">
          {screenFrame ? <img src={screenFrame} alt="screen" className="w-full h-full object-cover" /> : <Monitor className="w-8 h-8 text-slate-300" />}
          <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 rounded">SCR</div>
        </div>
        <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
          <span className="w-2 h-2 rounded-full bg-danger animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
          <span className="text-[10px] uppercase font-bold text-white tracking-widest bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">LIVE</span>
        </div>
      </div>
      <CardContent className="p-3 bg-slate-900">
        <p className="font-bold text-sm text-white truncate">{team.name}</p>
        <div className="flex items-center justify-between mt-2">
          <SplitSquareHorizontal className="w-4 h-4 text-success" />
          <span className="text-xs font-medium text-success">Streams Active</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProctoringPage() {
  const [events, setEvents] = useState<ProctoringEvent[]>([]);
  const [teams, setTeams] = useState<Record<string, Team>>({});

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const ev = DB.getItem<ProctoringEvent>(DB.KEYS.PROCTORING_EVENTS);
    setEvents(ev);
    
    const tms = DB.getTeams();
    const map = tms.reduce((acc, t) => ({ ...acc, [t.id]: t }), {} as Record<string, Team>);
    setTeams(map);
  };

  const markReviewed = (id: string) => {
    const updated = events.map(e => e.id === id ? { ...e, status: 'REVIEWED' as const } : e);
    DB.setItem(DB.KEYS.PROCTORING_EVENTS, updated);
    setEvents(updated);
  };

  const getSeverityBadge = (sev: string) => {
    if (sev === 'HIGH') return <Badge variant="destructive">HIGH</Badge>;
    if (sev === 'MEDIUM') return <Badge variant="warning">MEDIUM</Badge>;
    return <Badge variant="secondary">LOW</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-danger text-glow">LIVE PROCTORING</h1>
        <p className="text-foreground/60 mt-1">Monitor active quiz participants and review flagged events.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white tracking-tight">Event Log</h2>
          {events.length === 0 ? (
            <Card className="border-slate-700 shadow-sm bg-slate-900">
              <CardContent className="p-12 text-center text-slate-400">
                No proctoring events recorded.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {events.map(event => {
                const team = teams[event.teamId];
                const member = team?.members.find(m => m.id === event.memberId);
                
                return (
                  <Card key={event.id} className={cn("transition-colors border-slate-700 shadow-sm", event.status === 'UNREVIEWED' ? 'bg-danger/5 border-l-4 border-l-danger' : 'bg-slate-900 opacity-70')}>
                    <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${event.status === 'UNREVIEWED' ? 'bg-danger/10 text-danger' : 'bg-slate-800 text-slate-400'}`}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white">{team?.name || 'Unknown Team'}</span>
                            <span className="text-xs text-slate-400 px-2 border border-slate-700 rounded-md bg-slate-800">{member?.name || 'Unknown'}</span>
                            {getSeverityBadge(event.severity)}
                          </div>
                          <p className="text-slate-300 font-medium">{event.event}</p>
                          <p className="text-xs text-slate-400 mt-1">{new Date(event.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {event.status === 'UNREVIEWED' ? (
                        <Button variant="outline" size="sm" onClick={() => markReviewed(event.id)} className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white">
                          <CheckCircle className="w-4 h-4 mr-2 text-success" /> Mark Reviewed
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-success border-success bg-success/5">REVIEWED</Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white tracking-tight">Active Monitors</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {Object.values(teams).filter(t => t.quizStatus === 'ACTIVE').map(team => (
              <LiveMonitorNode key={team.id} team={team} />
            ))}
            {Object.values(teams).filter(t => t.quizStatus === 'ACTIVE').length === 0 && (
              <div className="col-span-full text-center p-8 text-slate-400 border border-slate-700 bg-slate-800 border-dashed rounded-xl">
                No active participants streaming
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
