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
    <div ref={containerRef} className="relative min-h-[200vh] flex flex-col items-center bg-[#050507] text-[#F5F5F7] overflow-hidden selection:bg-[#FACC15]/20 font-sans">
      
      {/* Subtle Ambient Background Light */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#A855F7] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4F46E5] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />

      {/* Top Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 px-6 py-5 flex justify-between items-center backdrop-blur-xl bg-[#050507]/40 border-b border-white/5"
      >
        <div className="font-mono text-xl tracking-tighter text-white font-bold uppercase flex items-center gap-2">
          <div className="w-3 h-3 bg-[#FACC15] rounded-full animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.4)]"></div>
          INNOVATEX
        </div>
        <div className="hidden md:flex gap-10 font-mono text-xs tracking-widest text-[#8B8D98] uppercase font-medium">
          <span className="hover:text-white transition-colors cursor-pointer">Specs</span>
          <span className="hover:text-white transition-colors cursor-pointer">Design</span>
          <span className="hover:text-white transition-colors cursor-pointer">Platform</span>
        </div>
        <Link href="/login">
          <button className="text-xs font-mono uppercase tracking-widest border border-white/10 bg-white/5 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all">
            Access Portal
          </button>
        </Link>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center pt-20 perspective-1000">
        
        {/* Floating Glass Orbs/Panels */}
        <motion.div style={{ y: y1 }} className="absolute left-[10%] top-[20%] w-64 h-64 glass-panel z-0 hidden md:block" />
        <motion.div style={{ y: y2 }} className="absolute right-[15%] bottom-[20%] w-96 h-48 card-purple-glow opacity-30 z-0 hidden md:block transform -rotate-12" />

        <div className="z-10 w-full max-w-6xl mx-auto px-4 flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#A855F7]"></span>
            <span className="text-xs font-mono tracking-widest text-[#8B8D98] uppercase font-medium">Delulu Hunt OS (Dark)</span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-7xl md:text-[9rem] font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40"
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#4F46E5]">INSTINCT.</span>
            </motion.h1>
          </div>
          
          <motion.p 
            style={{ opacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-2xl text-[#8B8D98] max-w-2xl mt-8 font-light tracking-wide"
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
              <div className="flex-1 glass-panel p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="text-white font-semibold text-lg">Assist Limit</div>
                
                <div className="flex flex-col items-center justify-center flex-1">
                  <div className="font-dot text-5xl text-white tracking-widest">74%</div>
                  <div className="flex justify-between w-full text-[10px] text-[#8B8D98] mt-1 font-mono font-medium">
                    <span>73%</span>
                    <span>75%</span>
                  </div>
                </div>

                <div className="w-full relative mt-4">
                  <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden flex">
                    <div className="h-full bg-[#FACC15] w-[74%] rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                    <div className="h-full w-[26%] border-b-[2px] border-dotted border-white/20"></div>
                  </div>
                  {/* Little triangle slider handle */}
                  <div className="absolute top-1/2 left-[74%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#FACC15]"></div>
                  
                  <div className="flex justify-between w-full text-[10px] text-[#8B8D98] mt-3 uppercase tracking-wider font-semibold">
                    <span>Min</span>
                    <span>Max</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                {/* Strain Card (Purple) */}
                <div className="flex-1 card-purple-glow p-5 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
                  <div className="text-white font-semibold text-lg">Strain</div>
                  <div className="self-end relative w-16 h-16 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="2 4" />
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#FACC15" strokeWidth="2" strokeDasharray="175" strokeDashoffset="119" strokeLinecap="round" />
                    </svg>
                    <span className="font-dot text-lg text-white font-bold">32%</span>
                  </div>
                </div>

                {/* Sync Card (Blue) */}
                <div 
                  className="flex-1 card-blue-glow p-5 flex items-center justify-between cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                  onClick={() => setSync(!sync)}
                >
                  <div className="text-white font-semibold text-lg">Sync</div>
                  <div className="w-14 h-8 bg-black/40 rounded-full p-1 shadow-inner relative flex items-center transition-all duration-300 border border-white/5">
                    <motion.div 
                      className="w-6 h-6 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                      animate={{ x: sync ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center mt-4 px-2">
              <button className="w-14 h-14 rounded-full bg-[#0B0C12] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <Folder size={18} />
              </button>
              
              <Link href="/login">
                <button className="h-16 w-32 rounded-[2rem] bg-gradient-to-tr from-[#FACC15] to-[#FDE047] hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(250,204,21,0.2)] relative overflow-hidden flex items-center justify-center group border border-white/10">
                  <div className="absolute inset-2 border-[2px] border-dotted border-black/20 rounded-[1.5rem] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <Power className="text-black z-10" size={24} />
                </button>
              </Link>

              <button className="w-14 h-14 rounded-full bg-[#0B0C12] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center text-white/50 hover:text-white transition-colors">
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
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8B8D98] font-bold">Explore below</span>
          <div className="w-[2px] h-12 bg-white/5 overflow-hidden relative rounded-full">
            <motion.div 
              animate={{ y: [0, 48] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-full h-1/2 bg-[#A855F7] absolute top-0 rounded-full"
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
          className="w-full max-w-5xl aspect-video glass-panel flex flex-col overflow-hidden relative"
        >
          {/* Mock UI Header */}
          <div className="h-12 border-b border-white/5 flex items-center px-6 gap-4 bg-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-white/10"></div>
              <div className="w-3 h-3 rounded-full bg-white/10"></div>
              <div className="w-3 h-3 rounded-full bg-white/10"></div>
            </div>
            <div className="mx-auto w-48 h-1 bg-white/10 rounded-full"></div>
          </div>
          
          {/* Mock UI Content */}
          <div className="flex-1 p-8 flex gap-8">
            <div className="w-1/3 flex flex-col gap-4">
              <div className="w-full h-8 bg-white/5 rounded-2xl border border-white/5 shadow-sm"></div>
              <div className="w-3/4 h-8 bg-white/5 rounded-2xl border border-white/5 shadow-sm"></div>
              <div className="w-full h-32 card-purple-glow mt-auto flex items-center justify-center relative overflow-hidden">
                 <div className="w-12 h-12 rounded-full border-2 border-[#FACC15] flex items-center justify-center text-[#FACC15] font-dot text-xl shadow-[0_0_15px_rgba(250,204,21,0.2)]">100</div>
              </div>
            </div>
            <div className="w-2/3 flex flex-col gap-4">
              <div className="w-full flex-1 card-blue-glow relative overflow-hidden">
                <div className="absolute top-6 left-6 font-mono text-xs text-[#8B8D98] tracking-widest uppercase font-bold">Workspace Env</div>
                <div className="absolute inset-x-8 bottom-8 top-16 bg-[#050507]/60 rounded-2xl border border-white/5 shadow-inner font-mono text-sm text-white/70 p-6 font-medium">
                  <span className="text-[#A855F7]">const</span> <span className="text-white font-bold">mission</span> = <span className="text-[#A855F7]">new</span> <span className="text-white font-bold">DeluluHunt()</span>;<br/><br/>
                  <span className="text-white font-bold">mission</span>.<span className="text-[#A855F7]">execute</span>();
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {[
            { title: "Premium Dark Glass", desc: "Built with vivid translucent depth, frosted black panels, and pristine borders." },
            { title: "Luminous Accents", desc: "A flagship design embracing dark themes and high-end purple/blue vibrancy." },
            { title: "Live Telemetry", desc: "Proctored analytics flowing seamlessly in real-time." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="p-8 glass-panel"
            >
              <h3 className="font-mono text-xl text-white tracking-tight font-bold mb-3">{feature.title}</h3>
              <p className="text-[#8B8D98] text-sm leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
    </div>
  );
}
