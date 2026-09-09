"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Home() {
  const [stars, setStars] = useState<{ x: number; y: number; size: number; duration: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 120, hours: 18, minutes: 12, seconds: 2 });

  useEffect(() => {
    // Generate stars on client side to avoid hydration mismatch
    const newStars = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
    }));
    setStars(newStars);

    // Mock countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden bg-[#0A0B1A] text-white" style={{ fontFamily: 'var(--font-vt323), monospace' }}>
      {/* Starry Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: star.duration, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      {/* Top Navbar Simulation */}
      <div className="z-10 w-full flex justify-between items-center p-6 text-xl tracking-widest text-[#B3B4CD]">
        <div className="text-[#FF2A5F] font-bold">INNOVATEX</div>
        <div className="hidden md:flex gap-8">
          <span className="hover:text-white cursor-pointer">SCHEDULE</span>
          <span className="hover:text-white cursor-pointer">TRACKS</span>
          <span className="hover:text-white cursor-pointer">PRIZE</span>
          <span className="hover:text-white cursor-pointer">MORE</span>
        </div>
        <div className="text-xs uppercase tracking-widest text-right">
          Powered by<br/><span className="text-white text-lg">DELULU</span>
        </div>
      </div>

      <div className="z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center mt-12 flex-1">
        {/* Main Title */}
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl md:text-8xl text-white tracking-widest text-center"
          style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.5)' }}
        >
          INNOVATEX <span className="text-[#FF2A5F]">DELULU</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-3xl text-[#B3B4CD] tracking-widest text-center mt-6 uppercase"
        >
          Think. Solve. Strategize. Conquer.
        </motion.p>

        {/* Pixel Art / Center Graphic Simulation */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 mb-12 relative flex justify-center items-center"
        >
          {/* A retro placeholder graphic (using pure CSS/shapes to mimic the red hood) */}
          <div className="w-48 h-56 bg-[#FF2A5F] relative" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)' }}>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#0A0B1A] flex justify-center items-center gap-6" style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 10%, 100% 100%, 0 100%, 0 10%)' }}>
               <div className="w-4 h-10 bg-white"></div>
               <div className="w-4 h-10 bg-white"></div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <Link href="/register" className="z-20">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-[#FF2A5F] text-2xl md:text-3xl px-12 py-4 uppercase tracking-widest relative overflow-hidden"
            style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)' }}
          >
            <span className="flex items-center gap-4">
              <span className="w-6 h-6 bg-[#3B82F6] block"></span>
              Initialize Sequence
            </span>
          </motion.button>
        </Link>

        <p className="text-[#8485A5] text-center max-w-3xl mt-8 text-xl leading-relaxed tracking-wide">
          Unleash your creativity and join Innovatex Delulu Hunt, the ultimate coding extravaganza! Compete across diverse categories, showcasing your skills, ingenuity, and collaborative spirit alongside like-minded individuals. Discover the perfect platform to challenge yourself.
        </p>
      </div>

      {/* Countdown Timer */}
      <div className="z-10 w-full pb-12 pt-8 flex flex-col items-center border-t border-white/5 mt-auto bg-gradient-to-t from-black/50 to-transparent">
        <p className="text-[#B3B4CD] text-2xl mb-2 tracking-widest">Hacking ends in!</p>
        <p className="text-[#FF2A5F] text-3xl font-bold mb-6 tracking-widest animate-pulse">Hurry Up</p>
        
        <div className="flex gap-4 md:gap-8 text-white text-5xl md:text-7xl">
          <div className="flex flex-col items-center">
            <span>{timeLeft.days.toString().padStart(3, '0')}</span>
            <span className="text-sm md:text-xl text-[#8485A5] mt-2 tracking-widest uppercase">Days</span>
          </div>
          <span className="text-[#FF2A5F] pb-8">:</span>
          <div className="flex flex-col items-center">
            <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="text-sm md:text-xl text-[#8485A5] mt-2 tracking-widest uppercase">Hours</span>
          </div>
          <span className="text-[#FF2A5F] pb-8">:</span>
          <div className="flex flex-col items-center">
            <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="text-sm md:text-xl text-[#8485A5] mt-2 tracking-widest uppercase">Minutes</span>
          </div>
          <span className="text-[#FF2A5F] pb-8">:</span>
          <div className="flex flex-col items-center">
            <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="text-sm md:text-xl text-[#8485A5] mt-2 tracking-widest uppercase">Seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}
