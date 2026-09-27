"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import './home.css';

const CONFIG = {
  ORGANIZER: "INNOVATEX",
  EVENT_DATE: "", 
  VENUE: "",
  REGISTRATION_URL: "/register",
  ROUNDS: [
    { id: 1, name: "FIX THE CODE", desc: "Teams receive code containing errors and must identify, debug, and fix the mistakes to make it run correctly.", points: 100, time: "50 MIN", color: 0x8a5cff },
    { id: 2, name: "CRACK THE MESSAGE", desc: "Teams receive a message written using a simple code or cipher and must decode it to uncover the hidden message.", points: 100, time: "50 MIN", color: 0xff5f87 },
    { id: 3, name: "BUILD SOMETHING SMALL", desc: "Teams receive a short specification and must quickly design and build a basic working solution.", points: 150, time: "70 MIN", color: 0x2fe6c2 },
    { id: 4, name: "USE AI THE SMART WAY", desc: "Teams must use an AI tool effectively to achieve a given target through smart prompting, problem solving, or analysis.", points: 150, time: "50 MIN", color: 0xffb15c },
    { id: 5, name: "FIND THE HIDDEN CLUE", desc: "Teams investigate a safe practice website or file and must discover the hidden clue concealed inside it.", points: 200, time: "70 MIN", color: 0xff8a5c },
    { id: 6, name: "FINAL CHALLENGE", desc: "Teams receive a real-world problem, develop a basic solution, and present their approach to the judges.", points: 300, time: "90 MIN", color: 0xffffff },
  ]
};

export default function DeluluHome() {
  const stageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ------------------------------------------
    // Intersection Observer for scroll reveals
    // ------------------------------------------
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // ------------------------------------------
    // Cursor glow & magnetic buttons
    // ------------------------------------------
    const glow = glowRef.current;
    if (!glow) return;

    const handlePointerMove = (e: PointerEvent) => {
      glow.style.opacity = '1';
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    };
    const handlePointerLeave = () => {
      glow.style.opacity = '0';
    };

    window.addEventListener('pointermove', handlePointerMove);
    document.body.addEventListener('pointerleave', handlePointerLeave);

    const buttons = document.querySelectorAll('.delulu-home .btn');
    buttons.forEach((btn: Element) => {
      const htmlBtn = btn as HTMLElement;
      htmlBtn.addEventListener('pointermove', (e: Event) => {
        const ev = e as PointerEvent;
        const r = htmlBtn.getBoundingClientRect();
        const mx = (ev.clientX - r.left - r.width / 2) * 0.25;
        const my = (ev.clientY - r.top - r.height / 2) * 0.35;
        htmlBtn.style.transform = `translate(${mx}px,${my}px)`;
      });
      htmlBtn.addEventListener('pointerleave', () => {
        htmlBtn.style.transform = '';
      });
    });

    // ------------------------------------------
    // 3D Engine Setup (Three.js)
    // ------------------------------------------
    if (!stageRef.current) return;
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 13);
    
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    stageRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x8a5cff, 0.55));
    const keyLight = new THREE.PointLight(0xffffff, 1.6, 40);
    keyLight.position.set(6, 6, 10);
    scene.add(keyLight);
    
    const rimLight = new THREE.PointLight(0x2fe6c2, 1.2, 40);
    rimLight.position.set(-8, -4, -6);
    scene.add(rimLight);

    const coreGroup = new THREE.Group();
    coreGroup.position.set(2.6, 0, 0); // sits on right side of hero
    scene.add(coreGroup);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.3, 1),
      new THREE.MeshStandardMaterial({ color: 0x120f22, emissive: 0x8a5cff, emissiveIntensity: 0.55, metalness: 0.75, roughness: 0.22, flatShading: true })
    );
    coreGroup.add(core);
    
    const coreWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.34, 1),
      new THREE.MeshBasicMaterial({ color: 0x8a5cff, wireframe: true, transparent: true, opacity: 0.25 })
    );
    coreGroup.add(coreWire);

    const fragGroup = new THREE.Group();
    coreGroup.add(fragGroup);
    const fragments: THREE.Mesh[] = [];
    
    CONFIG.ROUNDS.forEach((r, i) => {
      const m = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.36, 0),
        new THREE.MeshStandardMaterial({ color: r.color, emissive: r.color, emissiveIntensity: 0.9, roughness: 0.3, metalness: 0.4 })
      );
      const angle = (i / 6) * Math.PI * 2;
      m.userData = { angle, baseR: 3.1, round: r };
      fragGroup.add(m);
      fragments.push(m);
    });

    // faint particle field
    const pn = isMobile ? 60 : 150;
    const pgeo = new THREE.BufferGeometry();
    const parr = new Float32Array(pn * 3);
    for (let i = 0; i < pn; i++) {
      parr[i * 3] = (Math.random() - 0.5) * 30;
      parr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      parr[i * 3 + 2] = (Math.random() - 0.5) * 14 - 4;
    }
    pgeo.setAttribute('position', new THREE.BufferAttribute(parr, 3));
    const particles = new THREE.Points(pgeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.045, transparent: true, opacity: 0.4 }));
    scene.add(particles);

    /* mouse parallax */
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMouseMove = (e: PointerEvent) => {
      tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMouseMove);

    /* raycast hover/click on fragments */
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2();
    let lastClientX = 0, lastClientY = 0;
    
    renderer.domElement.style.pointerEvents = 'auto';
    stageRef.current.style.pointerEvents = 'none';
    
    const onCanvasMove = (e: PointerEvent) => {
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onCanvasMove);

    function checkHover() {
      raycaster.setFromCamera(mouseNDC, camera);
      const hits = raycaster.intersectObjects(fragments);
      if (hits.length && tooltipRef.current) {
        document.body.style.cursor = 'pointer';
        const r = hits[0].object.userData.round;
        tooltipRef.current.textContent = "ROUND 0" + r.id + " — " + r.name;
        tooltipRef.current.style.left = lastClientX + 'px';
        tooltipRef.current.style.top = lastClientY + 'px';
        tooltipRef.current.style.opacity = '1';
        return hits[0].object;
      }
      document.body.style.cursor = '';
      if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
      return null;
    }

    const onCanvasClick = () => {
      const hit = checkHover();
      if (hit) {
        const el = document.getElementById('round-' + hit.userData.round.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    window.addEventListener('click', onCanvasClick);

    /* scroll-linked transform */
    let scrollP = 0;
    function scrollProgress() {
      if (!heroRef.current || !spacerRef.current) return 0;
      const total = heroRef.current.offsetHeight + spacerRef.current.offsetHeight;
      const p = window.scrollY / total;
      return Math.max(0, Math.min(1, p));
    }
    
    const onScroll = () => {
      const p = scrollProgress();
      if (stageRef.current) {
        stageRef.current.style.opacity = p > 0.92 ? Math.max(0, 1 - ((p - 0.92) / 0.08)).toString() : '1';
        stageRef.current.style.pointerEvents = 'none';
      }
      scrollP = p;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* animate */
    const clock = new THREE.Clock();
    let animFrameId: number;
    
    function animate() {
      animFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;
      const p = scrollP;

      core.rotation.y = t * 0.18 + mx * 0.3;
      core.rotation.x = Math.sin(t * 0.3) * 0.08 + my * 0.15;
      coreWire.rotation.copy(core.rotation);

      fragGroup.rotation.y = t * 0.12;
      const spread = 1 + p * 2.4; 
      fragments.forEach(f => {
        const a = f.userData.angle + t * 0.15;
        const r = f.userData.baseR * spread;
        f.position.set(Math.cos(a) * r, Math.sin(a * 0.6) * 0.6, Math.sin(a) * r);
        f.rotation.x += 0.01;
        f.rotation.y += 0.015;
      });

      coreGroup.position.x = 2.6 - p * 1.6 + mx * 0.3;
      coreGroup.position.y = my * 0.25 - p * 0.6;
      coreGroup.scale.setScalar(1 - p * 0.25);
      camera.position.x = mx * 0.4;
      camera.position.y = -my * 0.2;
      camera.lookAt(2.6 - p * 1.6, 0, 0);

      particles.rotation.y = t * 0.01;
      checkHover();
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // CLEANUP
    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      document.body.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointermove', onMouseMove);
      window.removeEventListener('pointermove', onCanvasMove);
      window.removeEventListener('click', onCanvasClick);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animFrameId);
      
      // dispose three js
      renderer.dispose();
      if (stageRef.current) {
        stageRef.current.innerHTML = '';
      }
    };
  }, []);

  const metaLineText = [CONFIG.EVENT_DATE, CONFIG.VENUE].filter(Boolean).join(' · ');

  return (
    <div className="delulu-home">
      <div id="stage" ref={stageRef} className="delulu-home-stage"></div>
      <div id="cursorGlow" ref={glowRef} className="delulu-home-cursorGlow"></div>
      <div className="delulu-home-tooltip tooltip" ref={tooltipRef} id="tooltip"></div>

      <nav>
        <div className="brand">INNOVATEX</div>
        <div className="navlinks">
          <a href="#hero">HOME</a>
          <a href="#rounds">ROUNDS</a>
          <a href="#how">HOW IT WORKS</a>
          <Link href={CONFIG.REGISTRATION_URL}>REGISTER</Link>
        </div>
      </nav>

      <main>
        <section id="hero" ref={heroRef}>
          <div className="wrap heroGrid">
            <div className="heroText">
              <div className="eyebrow">INNOVATEX PRESENTS</div>
              <h1 className="title"><span>DELULU</span><span className="accent">HUNT</span></h1>
              <div className="subline">A 6-ROUND TECHNICAL CHALLENGE</div>
              <p className="desc">Think. Build. Decode. Explore.<br/>Six challenges. One final hunt.</p>
              <div className="ctaRow">
                <Link className="btn primary" href={CONFIG.REGISTRATION_URL} id="enterCta">
                  ENTER THE HUNT <span className="arrow">→</span>
                </Link>
                <a className="btn ghost" href="#rounds">EXPLORE ROUNDS</a>
              </div>
            </div>
            <div></div>
          </div>
          <div className="marks">
            <div className="mark mono">01 / 06<b>ROUNDS</b></div>
            <div className="mark mono">6<b>CHALLENGES</b></div>
            <div className="mark mono">01<b>ONE HUNT</b></div>
          </div>
          <div className="gridline"></div>
          <div className="scrollcue">SCROLL<div className="bar"></div></div>
        </section>

        <div id="transformSpacer" ref={spacerRef}></div>

        <section id="hunt" className="wrap">
          <div className="huntHead reveal">
            <div className="kicker">THE HUNT</div>
            <h2>Six rounds.<br/>Six different ways to think.</h2>
            <p>Every round tests a different skill — logic, language, speed, judgement. Together they decide who reaches the final hunt.</p>
          </div>
        </section>

        <section id="rounds" className="wrap">
          {CONFIG.ROUNDS.map(r => (
            <div key={r.id} className="roundRow reveal" id={`round-${r.id}`} data-id={r.id} onClick={() => document.getElementById(`round-${r.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
              <div className="rNum mono">0{r.id}</div>
              <div className="rMain">
                <h3>
                  <span className="dot" style={{ background: '#' + r.color.toString(16).padStart(6, '0') }}></span>
                  {r.name}
                </h3>
                <p>{r.desc}</p>
              </div>
              <div className="rMeta">
                <span><b>{r.points}</b>POINTS</span>
                <span><b>{r.time.split(' ')[0]}</b> {r.time.split(' ')[1]}</span>
              </div>
            </div>
          ))}
        </section>

        <section id="how" className="wrap">
          <div className="huntHead reveal">
            <div className="kicker">HOW IT WORKS</div>
            <h2>Three steps in.</h2>
          </div>
          <div className="howList">
            <div className="howItem reveal"><div className="n">01</div><h4>Register your team</h4><p>Sign up before the gates close and get your round schedule.</p></div>
            <div className="howItem reveal"><div className="n">02</div><h4>Compete across six rounds</h4><p>Each round scores points on its own — speed and accuracy both count.</p></div>
            <div className="howItem reveal"><div className="n">03</div><h4>Reach the final hunt</h4><p>Top teams carry their points into Round 06 and present live to judges.</p></div>
          </div>
        </section>

        <section id="register" className="wrap">
          <div className="kicker" style={{ justifyContent: 'center', display: 'flex' }}>READY?</div>
          <h2>Enter the hunt.</h2>
          <p>Six rounds. One hunt. Only the sharpest hunters reach the finish.</p>
          <div className="ctaRow">
            <Link className="btn primary" id="registerBtn" href={CONFIG.REGISTRATION_URL}>
              JOIN DELULU HUNT <span className="arrow">→</span>
            </Link>
          </div>
        </section>

        <footer className="wrap">
          <span>INNOVATEX © DELULU HUNT</span>
          <span id="metaLine">{metaLineText || "CONFIGURE DATE / VENUE IN CONFIG"}</span>
        </footer>
      </main>
    </div>
  );
}
