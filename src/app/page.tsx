"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
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
    <div ref={containerRef} className="relative min-h-[200vh] flex flex-col items-center bg-transparent text-[#e4e4e7] overflow-hidden selection:bg-[#f8312f]/30">
      
      {/* Top Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 px-6 py-5 flex justify-between items-center backdrop-blur-md bg-black/20 border-b border-white/5"
      >
        <div className="font-mono text-xl tracking-tighter text-white font-bold uppercase flex items-center gap-2">
          <div className="w-3 h-3 bg-[#f8312f] rounded-full animate-pulse"></div>
          INNOVATEX
        </div>
        <div className="hidden md:flex gap-10 font-mono text-xs tracking-widest text-white/50 uppercase">
          <span className="hover:text-white transition-colors cursor-pointer">Specs</span>
          <span className="hover:text-white transition-colors cursor-pointer">Design</span>
          <span className="hover:text-white transition-colors cursor-pointer">Platform</span>
        </div>
        <Link href="/login">
          <button className="text-xs font-mono uppercase tracking-widest border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all">
            Access Portal
          </button>
        </Link>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center pt-20 perspective-1000">
        
        {/* Floating Glass Orbs/Panels */}
        <motion.div style={{ y: y1 }} className="absolute left-[10%] top-[20%] w-64 h-64 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl z-0 hidden md:block" />
        <motion.div style={{ y: y2 }} className="absolute right-[15%] bottom-[20%] w-96 h-48 bg-[#f8312f]/10 backdrop-blur-3xl rounded-[3rem] border border-[#f8312f]/20 shadow-2xl z-0 hidden md:block transform -rotate-12" />

        <div className="z-10 w-full max-w-6xl mx-auto px-4 flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#f8312f]"></span>
            <span className="text-xs font-mono tracking-widest text-white/70 uppercase">Delulu Hunt OS (1.0.0)</span>
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f8312f] to-[#ff6b6b]">INSTINCT.</span>
            </motion.h1>
          </div>
          
          <motion.p 
            style={{ opacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-2xl text-white/50 max-w-2xl mt-8 font-light tracking-wide"
          >
            A flagship competitive programming experience. Transparent logic. Visceral design. Master the 6-round technical challenge.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row gap-6 z-20"
          >
            <Link href="/register">
              <button className="group relative px-10 py-4 bg-white text-black font-mono tracking-widest uppercase text-sm font-bold overflow-hidden rounded-full">
                <span className="relative z-10 flex items-center gap-2">
                  Initialize Sequence
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:translate-x-1 transition-transform"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </span>
                <div className="absolute inset-0 bg-[#f8312f] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                <span className="absolute inset-0 flex items-center justify-center gap-2 text-white font-mono tracking-widest uppercase text-sm font-bold z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  Initialize Sequence
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform translate-x-1"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </span>
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/30">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-white/10 overflow-hidden relative">
            <motion.div 
              animate={{ y: [0, 48] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-full h-1/2 bg-[#f8312f] absolute top-0"
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
          className="w-full max-w-5xl aspect-video rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden relative"
        >
          {/* Mock UI Header */}
          <div className="h-12 border-b border-white/5 flex items-center px-6 gap-4">
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
              <div className="w-full h-8 bg-white/5 rounded-lg border border-white/5"></div>
              <div className="w-3/4 h-8 bg-white/5 rounded-lg border border-white/5"></div>
              <div className="w-full h-32 bg-[#f8312f]/10 rounded-2xl border border-[#f8312f]/20 mt-auto backdrop-blur-md flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#f8312f]/20 to-transparent"></div>
                 <div className="w-12 h-12 rounded-full border border-[#f8312f]/50 flex items-center justify-center text-[#f8312f] font-mono font-bold">100</div>
              </div>
            </div>
            <div className="w-2/3 flex flex-col gap-4">
              <div className="w-full flex-1 bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-4 left-4 font-mono text-xs text-white/30 tracking-widest uppercase">Workspace Env</div>
                <div className="absolute inset-x-8 bottom-8 top-12 bg-black/40 rounded-xl border border-white/5 font-mono text-sm text-white/50 p-4 font-light">
                  <span className="text-[#f8312f]">const</span> <span className="text-white">mission</span> = <span className="text-[#f8312f]">new</span> <span className="text-white">DeluluHunt()</span>;<br/><br/>
                  <span className="text-white">mission</span>.<span className="text-[#f8312f]">execute</span>();
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {[
            { title: "Glass Architecture", desc: "Built with pure translucent depth and frosted panels." },
            { title: "Monochrome & Red", desc: "Minimalist brutalism meets high-contrast flagship design." },
            { title: "Live Telemetry", desc: "Proctored analytics flowing seamlessly in real-time." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors"
            >
              <h3 className="font-mono text-xl text-white tracking-tight font-bold mb-3">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
    </div>
  );
}
