"use client";

import { useEffect, useState } from 'react';
import { DB } from '@/services/db';
import { LeaderboardEntry } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const { team } = useAuthStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const teams = DB.getTeams();
    const ranked = teams
      .map(t => ({
        rank: 0,
        teamId: t.id,
        teamName: t.name,
        score: t.score + (t.quizScore || 0),
        roundsCompleted: t.roundsCompleted,
        quizScore: t.quizScore || 0,
        creditsUsed: 50 - t.credits,
        completionTime: 0,
      }))
      .sort((a, b) => b.score - a.score || b.roundsCompleted - a.roundsCompleted);
      
    ranked.forEach((r, idx) => r.rank = idx + 1);
    setEntries(ranked);

    // Global Timer Setup
    const gs = DB.getGlobalSettings();
    const endTime = gs.tournamentEndTime ? new Date(gs.tournamentEndTime).getTime() : Date.now();
    
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries; // Show all in the table for now, or maybe just all of them

  const getHexagonStyle = (color: string) => ({
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    background: color,
  });

  return (
    <div className="space-y-12 pb-16 pt-4 font-sans max-w-5xl mx-auto">
      
      {/* Top Banner Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Banner */}
        <div className="bg-card rounded-2xl p-6 flex items-center justify-between border border-foreground/5 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.3)]">
              <Trophy className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <div className="text-sm text-foreground/50 font-medium">Global Prize Pool</div>
              <div className="text-2xl font-bold text-primary tracking-tight">100,000 XP</div>
            </div>
          </div>
          <div className="text-xs text-foreground/30 uppercase tracking-widest text-right relative z-10 max-w-[120px]">
            Total rewards up for grabs
          </div>
        </div>

        {/* Right Banner */}
        <div className="bg-card rounded-2xl p-6 flex items-center justify-between border border-[#34C759]/20 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#34C759]/10 blur-[50px] rounded-full pointer-events-none"></div>
          <div className="text-sm text-foreground font-bold tracking-widest uppercase relative z-10">
            Race Ends In:
          </div>
          <div className="flex gap-2 relative z-10">
            {[
              { label: 'Days', val: String(timeLeft.days).padStart(2, '0') },
              { label: 'Hours', val: String(timeLeft.hours).padStart(2, '0') },
              { label: 'Minutes', val: String(timeLeft.minutes).padStart(2, '0') },
              { label: 'Seconds', val: String(timeLeft.seconds).padStart(2, '0') },
            ].map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="bg-muted border border-[#34C759]/30 text-[#34C759] font-mono text-xl py-1.5 px-2 rounded-md shadow-inner">
                  {t.val}
                </div>
                <div className="text-[9px] text-foreground/40 uppercase font-semibold">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Podium Section */}
      {top3.length > 0 && (
        <div className="flex justify-center items-end h-[350px] gap-2 md:gap-6 mt-16 mb-24 relative">
          
          {/* Rank 2 (Left) */}
          {top3[1] && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col items-center relative z-10 w-28 md:w-40">
              <div className="mb-4 flex flex-col items-center text-center">
                <div className="w-16 h-16 p-[2px] bg-gradient-to-b from-[#34C759] to-transparent mb-3 shadow-[0_0_20px_rgba(52,199,89,0.2)]" style={getHexagonStyle('')}>
                  <div className="w-full h-full bg-card flex items-center justify-center text-xl font-bold text-foreground uppercase" style={getHexagonStyle('')}>
                    {top3[1].teamName.substring(0,2)}
                  </div>
                </div>
                <div className="text-foreground font-semibold text-sm truncate w-full">{top3[1].teamName}</div>
                <div className="text-[#34C759] font-mono font-bold mt-1 text-lg">{top3[1].score}</div>
              </div>
              <div className="absolute top-28 w-8 h-8 bg-gray-200 shadow-md text-gray-800 font-bold flex items-center justify-center z-20" style={getHexagonStyle('')}>
                2
              </div>
              <div className="w-full h-40 bg-gradient-to-b from-[#1E3B2E] to-[#0A120E] border-t border-[#34C759]/40 rounded-t-[50%] shadow-[inset_0_10px_20px_rgba(52,199,89,0.1)] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 rounded-t-[50%]"></div>
              </div>
            </motion.div>
          )}

          {/* Rank 1 (Center) */}
          {top3[0] && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col items-center relative z-20 w-32 md:w-48 mb-8">
              <div className="mb-4 flex flex-col items-center text-center">
                <div className="w-20 h-20 p-[2px] bg-gradient-to-b from-primary to-orange-500 mb-3 shadow-[0_0_30px_rgba(250,204,21,0.4)]" style={getHexagonStyle('')}>
                  <div className="w-full h-full bg-card flex items-center justify-center text-2xl font-bold text-foreground uppercase" style={getHexagonStyle('')}>
                    {top3[0].teamName.substring(0,2)}
                  </div>
                </div>
                <div className="text-foreground font-bold text-base truncate w-full">{top3[0].teamName}</div>
                <div className="text-primary font-mono font-bold mt-1 text-xl">{top3[0].score}</div>
              </div>
              <div className="absolute top-[120px] w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-[0_0_15px_rgba(250,204,21,0.5)] text-black font-black flex items-center justify-center z-20" style={getHexagonStyle('')}>
                1
              </div>
              <div className="w-full h-48 bg-gradient-to-b from-[#4A3D11] to-[#120F04] border-t border-primary/50 rounded-t-[50%] shadow-[inset_0_10px_20px_rgba(250,204,21,0.15)] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 rounded-t-[50%]"></div>
              </div>
            </motion.div>
          )}

          {/* Rank 3 (Right) */}
          {top3[2] && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center relative z-10 w-28 md:w-40">
              <div className="mb-4 flex flex-col items-center text-center">
                <div className="w-16 h-16 p-[2px] bg-gradient-to-b from-[#34C759] to-transparent mb-3 shadow-[0_0_20px_rgba(52,199,89,0.2)]" style={getHexagonStyle('')}>
                  <div className="w-full h-full bg-card flex items-center justify-center text-xl font-bold text-foreground uppercase" style={getHexagonStyle('')}>
                    {top3[2].teamName.substring(0,2)}
                  </div>
                </div>
                <div className="text-foreground font-semibold text-sm truncate w-full">{top3[2].teamName}</div>
                <div className="text-[#34C759] font-mono font-bold mt-1 text-lg">{top3[2].score}</div>
              </div>
              <div className="absolute top-28 w-8 h-8 bg-secondary shadow-md text-foreground font-bold flex items-center justify-center z-20" style={getHexagonStyle('')}>
                3
              </div>
              <div className="w-full h-32 bg-gradient-to-b from-[#1E3B2E] to-[#0A120E] border-t border-[#34C759]/40 rounded-t-[50%] shadow-[inset_0_10px_20px_rgba(52,199,89,0.1)] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 rounded-t-[50%]"></div>
              </div>
            </motion.div>
          )}

        </div>
      )}

      {/* Table Title */}
      <div className="text-center mb-6">
        <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Climb the Leaderboard and Claim Your Rewards</h2>
        <p className="text-foreground/40 text-xs font-medium max-w-lg mx-auto leading-relaxed">
          Each day, the top teams with the highest scores earn bonus credits. Track your position on the live leaderboard now.
        </p>
      </div>

      {/* The Table List */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-3">
        {/* Header Row */}
        <div className="flex items-center px-6 py-2 text-xs text-foreground/30 uppercase tracking-widest font-semibold mb-2">
          <div className="w-12 text-center">#</div>
          <div className="flex-1">Player</div>
          <div className="w-32 text-right">Rounds</div>
          <div className="w-32 text-right">Score</div>
        </div>

        {/* Rows */}
        {entries.map((entry) => {
          const isCurrentTeam = entry.teamId === team?.id;
          return (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              key={entry.teamId} 
              className={cn(
                "flex items-center px-6 py-4 rounded-2xl bg-muted border border-foreground/5 transition-transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] group",
                isCurrentTeam ? "bg-card border-primary/30" : ""
              )}
            >
              <div className="w-12 flex justify-center">
                <div className="w-6 h-6 rounded-md bg-foreground/5 flex items-center justify-center text-xs font-bold text-foreground/50 group-hover:bg-foreground/10 transition-colors">
                  {entry.rank}
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-foreground text-[10px] font-bold uppercase shadow-inner">
                  {entry.teamName.substring(0,2)}
                </div>
                <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                  {entry.teamName}
                  {isCurrentTeam && <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">You</span>}
                </span>
              </div>
              <div className="w-32 text-right text-sm text-foreground/50 font-mono">
                {entry.roundsCompleted} / 6
              </div>
              <div className="w-32 text-right text-sm font-bold text-[#34C759] font-mono">
                {entry.score}
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
