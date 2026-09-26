"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Database, Folder, Globe, Power } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [sync, setSync] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#000000] text-[#e4e4e7] overflow-hidden selection:bg-[#fce300]/30 font-sans">
      
      {/* Container echoing the phone shape */}
      <div className="relative w-full max-w-[420px] mx-auto p-6 md:p-10 flex flex-col gap-6 z-10">
        
        <div className="text-center mb-8">
          <h1 className="font-sans text-white/50 text-sm tracking-widest uppercase mb-2">Innovatex System</h1>
          <div className="font-dot text-4xl text-white">DELULU_HUNT</div>
        </div>

        <div className="flex gap-4 h-64">
          {/* Assist Limit Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex-1 glass-panel p-6 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="text-white font-medium text-lg">Assist Limit</div>
            
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="font-dot text-5xl text-white tracking-widest drop-shadow-lg">74%</div>
              <div className="flex justify-between w-full text-[10px] text-white/40 mt-1 font-mono">
                <span>73%</span>
                <span>75%</span>
              </div>
            </div>

            <div className="w-full relative mt-4">
              <div className="h-[2px] w-full bg-white/20 rounded-full overflow-hidden flex">
                <div className="h-full bg-[#fce300] w-[74%]"></div>
                <div className="h-full w-[26%] border-b-[2px] border-dotted border-white/20"></div>
              </div>
              {/* Little triangle slider handle */}
              <div className="absolute top-1/2 left-[74%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#fce300]"></div>
              
              <div className="flex justify-between w-full text-[10px] text-white/40 mt-3 uppercase tracking-wider">
                <span>Min</span>
                <span>Max</span>
              </div>
            </div>
          </motion.div>

          <div className="flex-1 flex flex-col gap-4">
            {/* Strain Card (Purple) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 rounded-[2rem] card-purple-glow p-5 flex flex-col justify-between backdrop-blur-xl border border-white/10"
            >
              <div className="text-white font-medium text-lg">Strain</div>
              <div className="self-end relative w-16 h-16 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="2 4" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#fce300" strokeWidth="2" strokeDasharray="175" strokeDashoffset="119" />
                </svg>
                <span className="font-dot text-lg text-white">32%</span>
              </div>
            </motion.div>

            {/* Sync Card (Blue) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-1 rounded-[2rem] card-blue-glow p-5 flex items-center justify-between backdrop-blur-xl border border-white/10 cursor-pointer"
              onClick={() => setSync(!sync)}
            >
              <div className="text-white font-medium text-lg">Sync</div>
              <div className="w-14 h-8 bg-black/40 rounded-full p-1 shadow-inner relative flex items-center transition-all duration-300 border border-white/5">
                <motion.div 
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ x: sync ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-between items-center mt-4 px-2"
        >
          <button className="w-14 h-14 rounded-full bg-[#161618] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <Folder size={18} />
          </button>
          
          <Link href="/login">
            <button className="h-16 w-32 rounded-[2rem] bg-[#fce300] hover:bg-[#e5cd00] transition-colors shadow-[0_0_30px_rgba(252,227,0,0.3)] relative overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-2 border-[2px] border-dotted border-black/20 rounded-[1.5rem] opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <Power className="text-black z-10" size={24} />
            </button>
          </Link>

          <button className="w-14 h-14 rounded-full bg-[#161618] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <Globe size={18} />
          </button>
        </motion.div>
      </div>

    </div>
  );
}
