"use client";

import { useEffect, useState } from 'react';
import { DB } from '@/services/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, AlertTriangle, ShieldCheck, Swords, ShieldAlert, BarChart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalTeams: 0,
    activeTeams: 0,
    quizSubmissions: 0,
    proctoringAlerts: 0,
    totalCreditsUsed: 0
  });

  useEffect(() => {
    const teams = DB.getTeams();
    const proctoringEvents = DB.getItem<any>(DB.KEYS.PROCTORING_EVENTS) || [];
    
    setStats({
      totalTeams: teams.length,
      activeTeams: teams.filter(t => t.isActive).length,
      quizSubmissions: teams.filter(t => t.quizStatus === 'COMPLETED').length,
      proctoringAlerts: proctoringEvents.filter((e: any) => e.status === 'UNREVIEWED').length,
      totalCreditsUsed: teams.reduce((acc, t) => acc + (50 - t.credits), 0)
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-700">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-slate-400 mt-1">Real-time platform statistics and alerts.</p>
        </div>
        <Link href="/admin/proctoring">
          <Button variant="destructive" className="shadow-sm">
            <ShieldAlert className="w-4 h-4 mr-2" /> Live Proctoring
          </Button>
        </Link>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-700 shadow-sm bg-slate-900">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Teams</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalTeams}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg"><Users className="w-5 h-5 text-primary" /></div>
            </div>
            <p className="text-xs text-success mt-4 font-medium flex items-center">
              <span className="w-2 h-2 rounded-full bg-success mr-2"></span> {stats.activeTeams} Active
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-700 shadow-sm bg-slate-900">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">Quiz Subs</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.quizSubmissions}</p>
              </div>
              <div className="p-2 bg-success/10 rounded-lg"><ShieldCheck className="w-5 h-5 text-success" /></div>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-success h-full" style={{ width: `${Math.max(10, (stats.quizSubmissions / Math.max(1, stats.totalTeams)) * 100)}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 shadow-sm bg-slate-900">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">Credits Used</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalCreditsUsed}</p>
              </div>
              <div className="p-2 bg-warning/10 rounded-lg"><Swords className="w-5 h-5 text-warning" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 shadow-sm bg-slate-900 relative overflow-hidden group">
          <div className={cn("absolute inset-0 opacity-10 pointer-events-none transition-opacity", stats.proctoringAlerts > 0 ? "bg-danger" : "bg-slate-700")}></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">Proctor Alerts</p>
                <p className={cn("text-3xl font-bold mt-1", stats.proctoringAlerts > 0 ? "text-danger" : "text-white")}>
                  {stats.proctoringAlerts}
                </p>
              </div>
              <div className={cn("p-2 rounded-lg", stats.proctoringAlerts > 0 ? "bg-danger/20 text-danger animate-pulse" : "bg-slate-800 text-slate-400")}>
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            {stats.proctoringAlerts > 0 && (
              <Link href="/admin/proctoring" className="text-xs text-danger hover:underline mt-4 block font-medium">
                Review immediately &rarr;
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="border-slate-700 shadow-sm bg-slate-900">
          <CardHeader className="border-b border-slate-800 bg-slate-800/50">
            <CardTitle className="text-slate-300 text-base flex items-center">
              <ShieldAlert className="w-4 h-4 mr-2" /> Recent Suspicious Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-8 text-center text-slate-400 text-sm">
              View the <Link href="/admin/proctoring" className="text-primary hover:underline font-medium">Proctoring</Link> tab for live streams.
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 shadow-sm bg-slate-900">
          <CardHeader className="border-b border-slate-800 bg-slate-800/50">
            <CardTitle className="text-slate-300 text-base flex items-center">
              <BarChart className="w-4 h-4 mr-2" /> System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
             <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Database Connection</span>
                  <span className="px-2 py-1 bg-success/10 text-success rounded-md font-medium text-xs">STABLE (Local Mock)</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Proctoring AI Engine</span>
                  <span className="px-2 py-1 bg-success/10 text-success rounded-md font-medium text-xs">ONLINE</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">WebRTC Stream Server</span>
                  <span className="px-2 py-1 bg-success/10 text-success rounded-md font-medium text-xs">ACTIVE</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
