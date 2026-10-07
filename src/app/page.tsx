"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { DB } from '@/services/db';
import './home.css';

const DEFAULT_CONFIG = {
  ORGANIZER: "INNOVATEX",
  EVENT_DATE: "OCT 28 2026", 
  VENUE: "INNOVATEX HQ",
  REGISTRATION_URL: "/register",
  ROUNDS: [
    { id: 1, name: "FIX THE CODE", desc: "Teams receive code containing errors and must identify, debug, and fix the mistakes to make it run correctly." },
    { id: 2, name: "CRACK THE MESSAGE", desc: "Teams receive a message written using a simple code or cipher and must decode it to uncover the hidden message." },
    { id: 3, name: "BUILD SOMETHING SMALL", desc: "Teams receive a short specification and must quickly design and build a basic working solution." },
    { id: 4, name: "USE AI THE SMART WAY", desc: "Teams must use an AI tool effectively to achieve a given target through smart prompting, problem solving, or analysis." }
  ]
};

export default function DeluluHome() {
  const [mounted, setMounted] = useState(false);
  const [dynConfig, setDynConfig] = useState<any>(null);

  const [timeLeft, setTimeLeft] = useState({ days: 31, hours: 16, mins: 20, secs: 50 });
  const [activeTab, setActiveTab] = useState('online'); // For schedule tabs
  const [isDarkMode, setIsDarkMode] = useState(true);

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch dynamic data from database to populate home page
    const dbRounds = DB.getRounds() || [];
    const dbSettings = DB.getGlobalSettings() || {};
    
    const mappedRounds = dbRounds.map((r, i) => ({
      id: r.roundNumber,
      name: r.title,
      desc: r.description,
    }));

    setDynConfig({
      EVENT_DATE: dbSettings.eventDate || DEFAULT_CONFIG.EVENT_DATE,
      VENUE: dbSettings.venue || DEFAULT_CONFIG.VENUE,
      REGISTRATION_URL: dbSettings.registrationUrl || DEFAULT_CONFIG.REGISTRATION_URL,
      ROUNDS: mappedRounds.length > 0 ? mappedRounds : DEFAULT_CONFIG.ROUNDS
    });
    setMounted(true);
  }, []);

  // Simple countdown timer logic
  useEffect(() => {
    if (!mounted) return;
    const targetDate = Date.now() + (((31 * 24 + 16) * 60 + 20) * 60 + 50) * 1000;
    
    const timer = setInterval(() => {
      const s = Math.max(0, Math.ceil((targetDate - Date.now()) / 1000));
      setTimeLeft({
        days: Math.floor(s / 86400),
        hours: Math.floor((s % 86400) / 3600),
        mins: Math.floor((s % 3600) / 60),
        secs: s % 60
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mounted]);
  // Handle horizontal scrolling with mouse wheel on the track
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleWheel = (e: WheelEvent) => {
      // If the scroll is predominantly vertical, intercept it for horizontal scrolling
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        // Only prevent default if we actually have room to scroll, so we don't trap the user
        const isScrollable = track.scrollWidth > track.clientWidth;
        const isAtStart = track.scrollLeft === 0;
        const isAtEnd = Math.abs(track.scrollWidth - track.clientWidth - track.scrollLeft) < 1;

        if (isScrollable) {
          const scrollSpeed = 3; // Multiplier to make it scroll faster
          
          // If trying to scroll down/right and we're not at the end
          if (e.deltaY > 0 && !isAtEnd) {
            e.preventDefault();
            track.scrollLeft += (e.deltaY * scrollSpeed);
          }
          // If trying to scroll up/left and we're not at the start
          else if (e.deltaY < 0 && !isAtStart) {
            e.preventDefault();
            track.scrollLeft += (e.deltaY * scrollSpeed);
          }
        }
      }
    };

    // { passive: false } is required to allow e.preventDefault()
    track.addEventListener('wheel', handleWheel, { passive: false });
    return () => track.removeEventListener('wheel', handleWheel);
  }, [mounted]);


  const scrollTrack = () => {
    if (trackRef.current) {
      const t = trackRef.current;
      t.scrollBy({ left: t.scrollLeft > 5 ? -t.clientWidth * 0.5 : t.clientWidth * 0.5, behavior: 'smooth' });
    }
  };

  if (!mounted || !dynConfig) return null;

  return (
    <div className={`delulu-home ${!isDarkMode ? 'light-theme' : ''}`}>
      <i className="glow" style={{ left: '-120px', top: '-120px', zIndex: 0 }}></i>
      
      {/* HEADER */}
      <header className="w nav">
        <a className="logo">
          <b>Delulu Hunt</b>
          <small>by Innovatex</small>
        </a>
        <nav>
          <a>About</a>
          <a>Sectors</a>
          <a>Schedule</a>
          <a>Prizes</a>
          <a>FAQs</a>
        </nav>
        <Link href={dynConfig.REGISTRATION_URL} className="reg">Registration</Link>
      </header>

      {/* HERO */}
      <section className="w hero">
        <i className="d sq" style={{ left: '42%', top: '-6px' }}></i>
        <i className="d sq wh" style={{ right: '-2%', top: '-2px' }}></i>
        <i className="d tri" style={{ left: '-3%', bottom: '52px', transform: 'rotate(180deg) scale(.8)' }}></i>
        
        <div>
          <h1>Learn , Build , Innovate</h1>
          <div className="out">Delulu Hunt</div>
          <p>National Level Hackathon</p>
          <Link href={dynConfig.REGISTRATION_URL} className="btn">Register Now</Link>
          <a href="#sectors" className="btn g">View Problem Statement</a>
        </div>
        
        <img className="mon" src="/hero_monitor.jpg" alt="3D Monitor" style={{ borderRadius: '12px' }} />
      </section>

      {/* ABOUT */}
      <section className="w about">
        <div className="ph">
          <i className="p1"></i>
          <i className="p2"></i>
          <i className="d ring" style={{ right: '-8%', top: '-6%' }}></i>
        </div>
        <div>
          <h2>About <b>Delulu Hunt</b></h2>
          <p>Delulu Hunt is a premier hackathon organized by Innovatex to challenge the sharpest minds across multiple technical rounds. Think, build, and deploy!</p>
          <p className="v">Venue : <span className="o">{dynConfig.VENUE}</span></p>
          <div className="cd" id="cd">
            <div><b>{String(timeLeft.days).padStart(2, '0')}</b>Days</div><span>:</span>
            <div><b>{String(timeLeft.hours).padStart(2, '0')}</b>Hours</div><span>:</span>
            <div><b>{String(timeLeft.mins).padStart(2, '0')}</b>Mins</div><span>:</span>
            <div><b>{String(timeLeft.secs).padStart(2, '0')}</b>Secs</div>
          </div>
        </div>
        <svg className="d arc" viewBox="0 0 60 80">
          <path d="M6 4C10 40 30 60 52 72" stroke="#ffa20f" strokeWidth="9" fill="none" strokeLinecap="round"/>
        </svg>
      </section>

      {/* PROBLEM SECTORS */}
      <section className="w ps" id="sectors">
        <i className="glow" style={{ left: 'calc(50% - 50vw - 190px)', top: '-120px', zIndex: -1 }}></i>
        <h2>Problem <b>Sector - Theme</b></h2>
        <small>sds</small>
        <div className="car">
          <div className="trk" id="trk" ref={trackRef}>
            {dynConfig.ROUNDS.map((r: any, idx: number) => {
              const bgClass = `c${(idx % 4) + 1}`; // cycles through c1, c2, c3, c4
              return (
                <article key={r.id} className={`c ${bgClass}`}>
                  <h3>{r.name}</h3>
                  <p>{r.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w cta">
        <i className="ic">&lt;/&gt;</i>
        <b>Convert Your Idea <span className="o">&#128640;</span> Into Action / Product</b>
        <Link href={dynConfig.REGISTRATION_URL} className="btn">Register Now</Link>
      </section>

      {/* PARTNERS */}
      <section className="w pt">
        <h2>Our <b>Partners</b></h2>
        <div className="lg">
          <span>GLEC</span>
          <span>GRIET</span>
          <span>INNOVATEX</span>
          <span>Microsoft</span>
        </div>
      </section>

      {/* SCHEDULE */}
      <section className="w sc">
        <i className="d sq" style={{ left: '-4%', top: '72%' }}></i>
        <i className="d ring" style={{ right: '6%', top: '74%' }}></i>
        <h2>Hackathon <b>Schedule</b></h2>
        <p>  A thrilling journey of clues, challenges, teamwork, and surprises. Are you ready to find what’s hidden?</p>
        <div className="dt">
          <i className="tri"></i>
          <b>Friday, {dynConfig.EVENT_DATE}</b>
          <i className="sq"></i>
        </div>
        <div className="tabs">
          <button 
            className={`t ${activeTab === 'online' ? 'on' : ''}`} 
            onClick={() => setActiveTab('online')}
          >
            Delulu Hunt
          </button>
    </div>
        <div className="rows">
          <div className="r">
            <b>10:00-11:00</b>
            <div>
              <b>Phase - I</b>
              <p>Registration &amp; Briefing — Check in, form your teams, understand the rules, and get ready for the hunt.</p>
            </div>
          </div>

          <div className="r">
            <b>12:00-02:00</b>
            <div>
              <b>Phase - II</b>
              <p>The Hunt Begins — Follow the clues, solve puzzles, explore, and uncover hidden surprises.</p>
            </div>
          </div>

          <div className="r">
            <b>03:00-04:00</b>
            <div>
              <b>Phase - III</b>
              <p>The Ultimate Challenge — Put your teamwork, creativity, and quick thinking to the test.</p>
            </div>
          </div>

          <div className="r">
            <b>04:00-05:00</b>
            <div>
              <b>Phase - IV</b>
              <p>Grand Finale — Complete the final challenge, reach the finish line, and claim the EduLulu Hunt victory!</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRIZES */}
      <section className="w pz">
        <div>
          <h2><b>Prize</b> &amp; More</h2>
          <div className="tiles">
            <div>
              <div className="tl g">Exciting Gadgets</div>
              <div className="tl a">Goodies which bring a smile of your face</div>
            </div>
            <div>
              <div className="tl x">
                <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
                  <rect width="160" height="90" fill="#f4b30c"/>
                  <path d="M20 4h30l38 44-16 22-28-30z" fill="#111"/>
                  <path d="M60 90l24-52 26 52z" fill="#fff"/>
                  <path d="M122 8h14v22h22v14h-22v22h-14V44h-22V30h22z" fill="#b6e82e"/>
                </svg>
              </div>
              <div className="tl l">Golden Opportunity </div>
            </div>
          </div>
        </div>
        <div className="pr">
          <div><b>Rs. 5,000</b><small>FIRST PRIZE</small></div>
          <div><b>Rs. 3,000</b><small>SECOND PRIZE</small></div>
          <div><b>Rs. 2,000</b><small>THIRD PRIZE</small></div>
        </div>
      </section>

      {/* FAQS */}
<section className="fq">
  <h2 className="o">FAQs</h2>

  <details open>
    <summary>What is EduLulu Hunt?</summary>
    <p>
      EduLulu Hunt is an exciting clue-based challenge where participants
      solve puzzles, complete tasks, explore, and compete to reach the final
      destination.
    </p>
  </details>

  <details>
    <summary>How to participate in EduLulu Hunt?</summary>
    <p>
      You can participate by clicking the Register button on this website
      and completing the registration process.
    </p>
  </details>

  <details>
    <summary>Who can participate?</summary>
    <p>
      Students and enthusiastic participants who are ready to take on
      challenges, solve clues, and have fun can participate in EduLulu Hunt.
    </p>
  </details>

  <details>
    <summary>Can I participate as a team?</summary>
    <p>
      Yes! Participants can form a team and work together to solve clues,
      complete challenges, and progress through the hunt.
    </p>
  </details>

  <details>
    <summary>What should I bring?</summary>
    <p>
      Bring your college ID, a fully charged smartphone, and anything
      mentioned in the event instructions. Most importantly, bring your
      problem-solving skills and team spirit!
    </p>
  </details>

  <details>
    <summary>Is there a registration fee?</summary>
    <p>
      Registration details and participation fees, if applicable, will be
      mentioned on the registration page. Please check the latest event
      information before registering.
    </p>
  </details>

  <details>
    <summary>What happens during the hunt?</summary>
    <p>
      Teams will receive clues and challenges that require observation,
      logical thinking, teamwork, and creativity. Solve each challenge to
      unlock the next stage of the hunt.
    </p>
  </details>

  <details>
    <summary>How will the winner be decided?</summary>
    <p>
      The winning team will be determined based on successful completion of
      the challenges, accuracy, and the time taken to finish the hunt.
    </p>
  </details>

  <details>
    <summary>What if I get stuck on a clue?</summary>
    <p>
      Don't panic! Work with your teammates, think creatively, and look for
      the hidden hints. Every clue is designed to test your observation and
      problem-solving skills.
    </p>
  </details>

  <details>
    <summary>Where can I get event updates?</summary>
    <p>
      Follow the official EduLulu Hunt social media pages and check this
      website regularly for announcements, updates, and important
      instructions.
    </p>
  </details>
</section>

      {/* THEME TOGGLE BUTTON */}
      <button 
        className="theme-toggle" 
        onClick={() => setIsDarkMode(!isDarkMode)}
        aria-label="Toggle Theme"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

    </div>
  );
}
