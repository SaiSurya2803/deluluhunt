"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { DB } from '@/services/db';
import { Round, ActivityLog } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Swords, Coins, Key, BrainCircuit, Activity, Folder, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { team } = useAuthStore();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (team) {
      setRounds(DB.getRounds());
      const logs = DB.getActivityLogs().filter(l => l.teamId === team.id).slice(0, 5);
      setRecentLogs(logs);
    }
  }, [team]);

  if (!team) return null;

  const progressPercent = Math.round((team.roundsCompleted / 6) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-sans font-semibold tracking-tight text-foreground mb-1">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">{team.name}</span>
          </h1>
          <p className="text-secondary text-sm font-medium tracking-wide uppercase">Ready for your next challenge?</p>
        </div>
        <div className="flex gap-3">
          <Link href="/rounds">
            <button className="h-10 px-6 rounded-full bg-gradient-to-r from-primary to-[#FDE047] text-black font-semibold text-sm hover:scale-105 transition-transform shadow-[0_0_15px_rgba(250,204,21,0.2)]">
              Continue Round
            </button>
          </Link>
          <Link href="/leaderboard">
            <button className="h-10 px-6 rounded-full glass-panel text-foreground text-sm font-semibold hover:bg-foreground/5 transition-colors">
              View Leaderboard
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Top 4 Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-purple-glow p-6 flex flex-col items-start justify-between min-h-[140px] group">
          <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Swords className="w-5 h-5 text-[#D8B4FE]" />
          </div>
          <div>
            <div className="text-3xl font-dot text-foreground tracking-widest">{team.roundsCompleted} <span className="text-foreground/30 text-lg">/ 6</span></div>
            <div className="text-[10px] text-foreground/50 uppercase tracking-widest font-semibold mt-1">Rounds Completed</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-blue-glow p-6 flex flex-col items-start justify-between min-h-[140px] group">
          <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Activity className="w-5 h-5 text-[#4F46E5]" />
          </div>
          <div>
            <div className="text-3xl font-dot text-foreground tracking-widest">{team.score + (team.quizScore || 0)}</div>
            <div className="text-[10px] text-foreground/50 uppercase tracking-widest font-semibold mt-1">Total Score</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-yellow-glow p-6 flex flex-col items-start justify-between min-h-[140px] group">
          <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Coins className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-3xl font-dot text-foreground tracking-widest">{team.credits}</div>
            <div className="text-[10px] text-foreground/50 uppercase tracking-widest font-semibold mt-1">Credits Remaining</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-green-glow p-6 flex flex-col items-start justify-between min-h-[140px] group">
          <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-5 h-5 text-success" />
          </div>
          <div>
            <div className="mt-1"><Badge variant={team.quizStatus === 'COMPLETED' ? 'success' : 'warning'} className="bg-foreground/10 hover:bg-foreground/20 border-0">{team.quizStatus}</Badge></div>
            <div className="text-[10px] text-foreground/50 uppercase tracking-widest font-semibold mt-2">Quiz Status</div>
          </div>
        </motion.div>
      </div>

      {/* Round Progress Full Width */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="glass-panel p-8 relative overflow-hidden">
        {/* Subtle background glow for progress */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-3xl pointer-events-none"></div>
        
        <div className="flex justify-between items-end mb-4 relative z-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">Round Progress</div>
          <div className="text-2xl font-dot font-bold">{progressPercent}%</div>
        </div>
        
        <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-foreground/5 shadow-inner relative z-10">
          <div 
            className="bg-gradient-to-r from-orange-400 to-primary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(250,204,21,0.5)]"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </motion.div>

      {/* Bottom 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Recent Activity (takes 3 cols) */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="md:col-span-3 card-white-glow p-8 flex flex-col h-full">
          <div className="text-lg font-semibold text-foreground mb-6">Recent Activity</div>
          <div className="flex-1">
            {recentLogs.length > 0 ? (
              <div className="space-y-6">
                {recentLogs.map((log, idx) => (
                  <div key={log.id} className="flex gap-4 items-start relative group">
                    {/* Minimal Timeline Line */}
                    {idx !== recentLogs.length - 1 && (
                      <div className="absolute left-[5px] top-6 bottom-[-24px] w-[1px] bg-foreground/10 group-hover:bg-foreground/20 transition-colors"></div>
                    )}
                    <div className="w-3 h-3 mt-1.5 rounded-full border border-foreground/30 bg-foreground/5 shadow-[0_0_8px_rgba(255,255,255,0.1)] shrink-0 z-10"></div>
                    <div>
                      <p className="text-foreground text-sm font-medium">{log.action}</p>
                      <p className="text-foreground/40 text-xs font-mono mt-1">{new Date(log.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground/30 text-sm font-medium flex h-full items-center justify-center">No recent telemetry data.</p>
            )}
          </div>
          <div className="mt-8 pt-4 border-t border-foreground/5">
            <Link href="/activity" className="text-xs text-foreground/50 hover:text-foreground uppercase tracking-widest font-semibold flex items-center gap-2 transition-colors w-max">
              View All Activity <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Quick Actions (takes 2 cols) */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="md:col-span-2 glass-panel p-8">
          <div className="text-lg font-semibold text-foreground mb-6">Quick Actions</div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/assets" className="bg-muted border border-foreground/5 p-6 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-foreground/5 hover:border-foreground/10 transition-all group shadow-inner">
              <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Folder className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-foreground/70 group-hover:text-foreground transition-colors">View Assets</span>
            </Link>
            
            <Link href="/clues" className="bg-muted border border-foreground/5 p-6 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-foreground/5 hover:border-foreground/10 transition-all group shadow-inner">
              <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-[#A855F7]/20 transition-colors">
                <Key className="w-5 h-5 text-[#A855F7]" />
              </div>
              <span className="text-xs font-semibold text-foreground/70 group-hover:text-foreground transition-colors">View Clues</span>
            </Link>
            
            <Link href="/credits" className="bg-muted border border-foreground/5 p-6 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-foreground/5 hover:border-foreground/10 transition-all group shadow-inner">
              <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                <Coins className="w-5 h-5 text-success" />
              </div>
              <span className="text-xs font-semibold text-foreground/70 group-hover:text-foreground transition-colors">Get Credits</span>
            </Link>
            
            <Link href="/quiz/intro" className="bg-muted border border-foreground/5 p-6 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-foreground/5 hover:border-foreground/10 transition-all group shadow-inner">
              <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-[#4F46E5]/20 transition-colors">
                <BrainCircuit className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <span className="text-xs font-semibold text-foreground/70 group-hover:text-foreground transition-colors">Quiz Round</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
