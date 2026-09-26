"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Database, Folder, Globe, Power } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [sync, setSync] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div ref={containerRef} className="relative min-h-[200vh] flex flex-col items-center bg-transparent text-[#09090b] overflow-hidden selection:bg-[#FF3B30]/20 font-sans">
      
      {/* Top Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 px-6 py-5 flex justify-between items-center backdrop-blur-xl bg-white/40 border-b border-black/5 shadow-sm"
      >
        <div className="font-mono text-xl tracking-tighter text-black font-bold uppercase flex items-center gap-2">
          <div className="w-3 h-3 bg-[#FF3B30] rounded-full animate-pulse shadow-md shadow-red-500/20"></div>
          INNOVATEX
        </div>
        <div className="hidden md:flex gap-10 font-mono text-xs tracking-widest text-black/50 uppercase font-medium">
          <span className="hover:text-black transition-colors cursor-pointer">Specs</span>
          <span className="hover:text-black transition-colors cursor-pointer">Design</span>
          <span className="hover:text-black transition-colors cursor-pointer">Platform</span>
        </div>
        <Link href="/login">
          <button className="text-xs font-mono uppercase tracking-widest border border-black/10 bg-white/50 px-6 py-2 rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
            Access Portal
          </button>
        </Link>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center pt-20 perspective-1000">
        
        {/* Floating Glass Orbs/Panels */}
        <motion.div style={{ y: y1 }} className="absolute left-[10%] top-[20%] w-64 h-64 bg-white/60 backdrop-blur-3xl rounded-[3rem] border border-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.05)] z-0 hidden md:block" />
        <motion.div style={{ y: y2 }} className="absolute right-[15%] bottom-[20%] w-96 h-48 bg-gradient-to-tr from-pink-100/50 to-purple-100/50 backdrop-blur-3xl rounded-[4rem] border border-white/90 shadow-[0_20px_40px_rgba(0,0,0,0.05)] z-0 hidden md:block transform -rotate-12" />

        <div className="z-10 w-full max-w-6xl mx-auto px-4 flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-black/5 bg-white/80 backdrop-blur-md mb-8 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF3B30]"></span>
            <span className="text-xs font-mono tracking-widest text-black/70 uppercase font-medium">Delulu Hunt OS (Light)</span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-7xl md:text-[9rem] font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black to-black/40"
            >
              PURE
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-7xl md:text-[9rem] font-bold tracking-tighter leading-none"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B30] to-[#FF9500]">INSTINCT.</span>
            </motion.h1>
          </div>
          
          <motion.p 
            style={{ opacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-2xl text-black/50 max-w-2xl mt-8 font-light tracking-wide"
          >
            A flagship competitive programming experience. Luminous logic. Visceral design. Master the 6-round technical challenge.
          </motion.p>

          {/* Container echoing the phone shape */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="relative w-full max-w-[420px] mx-auto p-6 md:p-10 flex flex-col gap-6 z-10 mt-16"
          >
            
            <div className="flex gap-4 h-64">
              {/* Assist Limit Card */}
              <div className="flex-1 glass-panel p-6 flex flex-col justify-between relative overflow-hidden bg-white/70">
                <div className="text-black/80 font-semibold text-lg">Assist Limit</div>
                
                <div className="flex flex-col items-center justify-center flex-1">
                  <div className="font-dot text-5xl text-black tracking-widest drop-shadow-sm">74%</div>
                  <div className="flex justify-between w-full text-[10px] text-black/40 mt-1 font-mono font-medium">
                    <span>73%</span>
                    <span>75%</span>
                  </div>
                </div>

                <div className="w-full relative mt-4">
                  <div className="h-[4px] w-full bg-black/5 rounded-full overflow-hidden flex shadow-inner">
                    <div className="h-full bg-[#FF3B30] w-[74%] rounded-full shadow-sm"></div>
                    <div className="h-full w-[26%] border-b-[2px] border-dotted border-black/10"></div>
                  </div>
                  {/* Little triangle slider handle */}
                  <div className="absolute top-1/2 left-[74%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#FF3B30]"></div>
                  
                  <div className="flex justify-between w-full text-[10px] text-black/40 mt-3 uppercase tracking-wider font-semibold">
                    <span>Min</span>
                    <span>Max</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                {/* Strain Card (Purple) */}
                <div className="flex-1 rounded-[2.5rem] card-purple-glow p-5 flex flex-col justify-between backdrop-blur-2xl border border-white/80">
                  <div className="text-black/80 font-semibold text-lg">Strain</div>
                  <div className="self-end relative w-16 h-16 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-sm">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="4" strokeDasharray="2 4" />
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="175" strokeDashoffset="119" strokeLinecap="round" />
                    </svg>
                    <span className="font-dot text-lg text-black font-bold">32%</span>
                  </div>
                </div>

                {/* Sync Card (Blue) */}
                <div 
                  className="flex-1 rounded-[2.5rem] card-blue-glow p-5 flex items-center justify-between backdrop-blur-2xl border border-white/80 cursor-pointer"
                  onClick={() => setSync(!sync)}
                >
                  <div className="text-black/80 font-semibold text-lg">Sync</div>
                  <div className="w-14 h-8 bg-black/5 rounded-full p-1 shadow-inner relative flex items-center transition-all duration-300 border border-black/5">
                    <motion.div 
                      className="w-6 h-6 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] border border-black/5"
                      animate={{ x: sync ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center mt-4 px-2">
              <button className="w-14 h-14 rounded-full bg-white/60 border border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center text-black/50 hover:text-black transition-colors backdrop-blur-xl">
                <Folder size={18} />
              </button>
              
              <Link href="/register">
                <button className="h-16 w-32 rounded-[2rem] bg-gradient-to-tr from-[#FF3B30] to-[#FF9500] hover:scale-105 transition-transform shadow-[0_10px_20px_rgba(255,59,48,0.3)] relative overflow-hidden flex items-center justify-center group border border-white/20">
                  <div className="absolute inset-2 border-[2px] border-dotted border-white/40 rounded-[1.5rem] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <Power className="text-white z-10" size={24} />
                </button>
              </Link>

              <button className="w-14 h-14 rounded-full bg-white/60 border border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center text-black/50 hover:text-black transition-colors backdrop-blur-xl">
                <Globe size={18} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-black/30 font-bold">Explore below</span>
          <div className="w-[2px] h-12 bg-black/5 overflow-hidden relative rounded-full">
            <motion.div 
              animate={{ y: [0, 48] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-full h-1/2 bg-[#FF3B30] absolute top-0 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Interface Showcase Section */}
      <section className="relative w-full py-32 px-4 z-10 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-5xl aspect-video rounded-[3rem] border border-white/80 bg-white/40 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden relative"
        >
          {/* Mock UI Header */}
          <div className="h-12 border-b border-black/5 flex items-center px-6 gap-4 bg-white/20">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-black/10"></div>
              <div className="w-3 h-3 rounded-full bg-black/10"></div>
              <div className="w-3 h-3 rounded-full bg-black/10"></div>
            </div>
            <div className="mx-auto w-48 h-1 bg-black/10 rounded-full"></div>
          </div>
          
          {/* Mock UI Content */}
          <div className="flex-1 p-8 flex gap-8">
            <div className="w-1/3 flex flex-col gap-4">
              <div className="w-full h-8 bg-white/60 rounded-xl border border-white/80 shadow-sm"></div>
              <div className="w-3/4 h-8 bg-white/60 rounded-xl border border-white/80 shadow-sm"></div>
              <div className="w-full h-32 bg-white/80 rounded-3xl border border-white mt-auto backdrop-blur-xl flex items-center justify-center relative overflow-hidden shadow-sm">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#FF3B30]/10 to-transparent"></div>
                 <div className="w-12 h-12 rounded-full border-2 border-[#FF3B30] flex items-center justify-center text-[#FF3B30] font-dot text-xl shadow-[0_0_15px_rgba(255,59,48,0.2)]">100</div>
              </div>
            </div>
            <div className="w-2/3 flex flex-col gap-4">
              <div className="w-full flex-1 bg-white/60 rounded-[2rem] border border-white/80 relative overflow-hidden shadow-sm">
                <div className="absolute top-4 left-4 font-mono text-xs text-black/40 tracking-widest uppercase font-bold">Workspace Env</div>
                <div className="absolute inset-x-8 bottom-8 top-12 bg-white rounded-2xl border border-black/5 shadow-inner font-mono text-sm text-black/70 p-4 font-medium">
                  <span className="text-[#FF3B30]">const</span> <span className="text-black font-bold">mission</span> = <span className="text-[#FF3B30]">new</span> <span className="text-black font-bold">DeluluHunt()</span>;<br/><br/>
                  <span className="text-black font-bold">mission</span>.<span className="text-[#FF3B30]">execute</span>();
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {[
            { title: "Pure Glassmorphism", desc: "Built with vivid translucent depth, frosted white panels, and pristine borders." },
            { title: "Luminous & Light", desc: "A premium flagship design embracing bright themes and high-end vibrancy." },
            { title: "Live Telemetry", desc: "Proctored analytics flowing seamlessly in real-time." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="p-8 rounded-[2.5rem] bg-white/60 border border-white/80 backdrop-blur-xl hover:bg-white/80 transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
            >
              <h3 className="font-mono text-xl text-black tracking-tight font-bold mb-3">{feature.title}</h3>
              <p className="text-black/60 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
    </div>
  );
}
