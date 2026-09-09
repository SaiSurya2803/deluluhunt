"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, Zap, Globe, Cpu, Database, Network, Code } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Light Theme Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Animated Tech Grid */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]" />
        
        {/* 3D Floating Elements */}
        <motion.div 
          className="absolute top-[20%] left-[10%] opacity-20 hidden md:block text-primary"
          animate={{ y: [0, -30, 0], rotateX: [0, 15, 0], rotateY: [0, 45, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Database size={120} strokeWidth={1} />
        </motion.div>

        <motion.div 
          className="absolute bottom-[15%] right-[10%] opacity-20 hidden md:block text-secondary"
          animate={{ y: [0, 40, 0], rotateZ: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Network size={150} strokeWidth={1} />
        </motion.div>

        <motion.div 
          className="absolute top-[30%] right-[20%] opacity-10 hidden lg:block text-accent"
          animate={{ x: [0, 30, 0], y: [0, -20, 0], rotate: [0, 90, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <Code size={100} strokeWidth={1} />
        </motion.div>

        {/* Technical Data Stream Simulation */}
        <div className="absolute left-0 top-0 w-full h-full pointer-events-none opacity-[0.03]">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-primary w-[2px] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                height: `${Math.random() * 100 + 50}px`,
              }}
              animate={{
                y: ['0vh', '120vh'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      <div className="z-10 w-full max-w-6xl mx-auto px-4 perspective-1000">
        <motion.div 
          initial={{ opacity: 0, y: 50, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-8 glass-panel p-12 rounded-3xl border-white/50 shadow-2xl bg-white/60 backdrop-blur-xl relative"
        >
          {/* Top glowing accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-70"></div>

          <div className="space-y-4 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-primary tracking-widest text-sm md:text-base font-mono uppercase font-bold flex items-center justify-center gap-2">
                <Cpu size={18} /> Initialize Assessment
              </h2>
            </motion.div>
            
            <div className="flex justify-center my-4">
              <img src="/logo.png" alt="INNOVATEX DELULU HUNT" className="h-24 md:h-32 w-auto object-contain drop-shadow-md" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-slate-700 mt-2">
              THE ULTIMATE 6-ROUND CHALLENGE
            </h3>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mt-6 font-medium">
              Think. Solve. Strategize. Conquer.
            </p>
            <p className="text-slate-500 max-w-2xl mx-auto mt-2 text-sm md:text-base">
              Assemble your team of up to 4 members. Compete across multiple technical, logical, and problem-solving challenges in a high-stakes proctored environment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-white text-lg px-8 py-6 uppercase tracking-wider font-bold shadow-xl shadow-primary/30 transition-transform hover:-translate-y-1">
                Initialize Sequence
              </Button>
            </Link>
            <Link href="/rules" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full bg-white text-slate-800 text-lg px-8 py-6 uppercase tracking-wider hover:bg-slate-50 transition-transform hover:-translate-y-1 border-slate-300">
                View Documentation
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-slate-200/60">
            <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center space-y-3 p-6 bg-white/50 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:bg-white">
              <div className="p-3 bg-primary/10 rounded-full text-primary"><Cpu className="w-6 h-6" /></div>
              <span className="text-sm font-bold text-slate-700">6 Tech Rounds</span>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center space-y-3 p-6 bg-white/50 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:bg-white">
              <div className="p-3 bg-secondary/10 rounded-full text-secondary"><ShieldAlert className="w-6 h-6" /></div>
              <span className="text-sm font-bold text-slate-700">Proctored Env</span>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center space-y-3 p-6 bg-white/50 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:bg-white">
              <div className="p-3 bg-warning/10 rounded-full text-warning"><Zap className="w-6 h-6" /></div>
              <span className="text-sm font-bold text-slate-700">Live Analytics</span>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center space-y-3 p-6 bg-white/50 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:bg-white">
              <div className="p-3 bg-success/10 rounded-full text-success"><Globe className="w-6 h-6" /></div>
              <span className="text-sm font-bold text-slate-700">Global Ranking</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
