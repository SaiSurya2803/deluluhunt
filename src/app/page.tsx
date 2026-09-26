"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { DB } from '@/services/db';

export default function Home() {
  const [faqMsg, setFaqMsg] = useState('');
  const [faqSent, setFaqSent] = useState(false);

  const handleFaqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqMsg.trim()) return;
    
    const notifs = DB.getNotifications() || [];
    notifs.push({
      id: `faq-${Date.now()}`,
      teamId: 'ALL',
      title: 'New FAQ Question (From Homepage)',
      message: faqMsg,
      type: 'INFO',
      isRead: false,
      createdAt: new Date().toISOString()
    });
    DB.setNotifications(notifs);
    setFaqSent(true);
    setFaqMsg('');
    setTimeout(() => setFaqSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#6D5D9E] p-4 md:p-8 flex items-center justify-center font-sans overflow-hidden">
      
      {/* The main 'Tablet' Container */}
      <div className="w-full max-w-7xl bg-[#F8F9FB] rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col h-[90vh] md:h-[95vh] border-8 border-white/20">
        
        {/* Soft Pastel Gradient Mesh Background inside the tablet */}
        <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FFD1E8] blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#C4F1F9] blur-[120px] rounded-full"></div>
          <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-[#E2D8FF] blur-[90px] rounded-full"></div>
        </div>

        {/* Content Wrapper (Scrollable) */}
        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar flex flex-col text-[#2D2D3F]">
          
          {/* Header */}
          <header className="flex justify-between items-center p-8 md:px-12">
            <div className="font-bold text-3xl tracking-tighter text-[#1C1C28]">
              INNOVATEX
            </div>
            <nav className="hidden md:flex gap-8 text-sm font-bold tracking-widest text-[#6B6B80] uppercase">
              <a href="#about" className="hover:text-[#2D2D3F] transition-colors">About</a>
              <a href="#rounds" className="hover:text-[#2D2D3F] transition-colors">Rounds</a>
              <a href="#faq" className="hover:text-[#2D2D3F] transition-colors">FAQ</a>
            </nav>
            <div className="flex gap-4">
              <Link href="/login">
                <button className="text-xs font-bold uppercase tracking-widest text-[#6B6B80] hover:text-[#2D2D3F] transition-colors">
                  Login
                </button>
              </Link>
              {/* Google Form Link Placeholder */}
              <a href="#" target="_blank" rel="noopener noreferrer">
                <button className="flex items-center gap-2 bg-[#2D2D3F] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#1C1C28] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Register <div className="w-2 h-2 bg-white rounded-full"></div>
                </button>
              </a>
            </div>
          </header>

          {/* Hero Section */}
          <main className="flex-1 px-8 md:px-12 py-12 md:py-20 flex flex-col md:flex-row relative">
            <div className="md:w-1/2 flex flex-col justify-center relative z-20">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <span className="text-[#A8A8C0] text-6xl md:text-8xl font-black absolute -top-12 -left-6 opacity-30 select-none">#</span>
                <h1 className="text-[5rem] md:text-[8rem] font-black leading-[0.85] tracking-tighter text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] uppercase">
                  DELULU<br/>HUNT
                </h1>
                
                <div id="about" className="mt-12 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    IN
                  </div>
                  <div className="text-xs font-bold text-[#6B6B80] tracking-widest uppercase">
                    A FLAGSHIP TECHNOLOGY CHALLENGE
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="md:w-1/2 flex items-center justify-center relative mt-16 md:mt-0 z-10">
              {/* Abstract 3D-ish Shapes for visual interest mimicking the NFT art style */}
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-64 h-[400px] bg-gradient-to-br from-white/60 to-white/10 backdrop-blur-md rounded-full border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative flex items-center justify-center"
              >
                <div className="w-48 h-48 bg-gradient-to-tr from-[#FFD1E8] to-[#C4F1F9] rounded-full blur-[20px] opacity-70"></div>
                <div className="absolute top-10 right-[-30px] w-20 h-20 rounded-full bg-white shadow-xl flex flex-col items-center justify-center text-[10px] font-bold text-[#2D2D3F] uppercase tracking-widest">
                  <span className="text-xl mb-1">👁</span> Explore
                </div>
              </motion.div>
            </div>
          </main>

          {/* About & Rounds Description */}
          <section id="rounds" className="px-8 md:px-12 py-16 bg-white/40 backdrop-blur-sm border-t border-white/40">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-black uppercase tracking-tight text-[#1C1C28] mb-6">The Challenge (6 Rounds)</h2>
              <p className="text-[#6B6B80] leading-relaxed font-medium mb-12">
                Delulu Hunt is an intense, multi-stage competitive programming and logical reasoning event. 
                <strong className="text-[#2D2D3F]"> Strategy and intellect</strong> are your best weapons. 
                Navigate through the cryptic terminal, solve complex algorithms, and secure your place on the global leaderboard.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { num: 1, title: 'Logic Gates', desc: 'Basic algorithmic puzzles and boolean logic.' },
                  { num: 2, title: 'Cipher Break', desc: 'Decrypt hidden messages to unlock the next stage.' },
                  { num: 3, title: 'Data Structures', desc: 'Optimize the flow of data under strict time constraints.' },
                  { num: 4, title: 'System Architecture', desc: 'Identify bottlenecks in a mock distributed system.' },
                  { num: 5, title: 'The Sandbox', desc: 'A live coding environment where your code attacks other teams.' },
                  { num: 6, title: 'Boss Fight', desc: 'The ultimate algorithmic showdown against the AI.' },
                ].map((r) => (
                  <div key={r.num} className="bg-white/60 p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-xs font-black text-[#A8A8C0] mb-1">ROUND 0{r.num}</div>
                    <div className="text-lg font-bold text-[#1C1C28] mb-2">{r.title}</div>
                    <div className="text-sm text-[#6B6B80] font-medium">{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ / Message Admin */}
          <section id="faq" className="px-8 md:px-12 py-20 bg-gradient-to-b from-transparent to-[#F0F2F9]">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-3xl font-black uppercase tracking-tight text-[#1C1C28] mb-4">Have Questions? (FAQ)</h2>
              <p className="text-[#6B6B80] text-sm font-medium mb-8">Send a direct message to the Innovatex Admin Panel. We will review and respond during the event briefing.</p>
              
              <form onSubmit={handleFaqSubmit} className="flex flex-col gap-4">
                <textarea 
                  value={faqMsg}
                  onChange={(e) => setFaqMsg(e.target.value)}
                  placeholder="Ask your question here..."
                  className="w-full bg-white/80 border border-white/50 p-4 rounded-2xl shadow-inner outline-none focus:border-[#2D2D3F]/30 transition-colors text-sm font-medium text-[#2D2D3F] resize-none h-32"
                  required
                />
                <button type="submit" className="bg-[#2D2D3F] text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#1C1C28] transition-colors shadow-md">
                  {faqSent ? 'Message Sent to Admins!' : 'Submit Question'}
                </button>
              </form>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-auto p-8 border-t border-[#E5E7EB]/50 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/30 backdrop-blur-md">
            <div className="text-[10px] font-bold text-[#6B6B80] tracking-widest uppercase">
              Developed by BHEEMA SAISURYA
            </div>
            <div className="text-[10px] font-bold text-[#6B6B80] tracking-widest uppercase">
              @COPYRIGHTS RESERVED TO INNOVATEX OFFICIAL
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}
