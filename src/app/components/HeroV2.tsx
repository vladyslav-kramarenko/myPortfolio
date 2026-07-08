'use client';

import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import styles from './HeroV2.module.css';

// ── Statement — the centrepiece copy ────────────────────────────────────────
// Three visual lines; last line renders in accent colour.
const LINES: { words: string[]; accent: boolean }[][] = [
  [
    { words: ['I', 'work', 'on', 'the', 'systems'],  accent: false },
  ],
  [
    { words: ['no', 'one', 'sees,'],                  accent: false },
  ],
  [
    { words: ['but', 'everyone', 'depends', 'on.'],   accent: true  },
  ],
];

const SKILLS = [
  'AWS', 'Python', 'Node.js', 'BigQuery', 'Looker Studio',
  'React', 'Next.js', 'Google Workspace', 'Apple MDM', 'Make',
  'Airtable', 'SQL', 'Linux', 'Entra ID', 'Git', 'Spring Boot',
];

// ── Count-up via Framer Motion ────────────────────────────────────────────────
function useCountUp(target: number, duration = 1.4, delay = 0) {
  const mv      = useMotionValue(0);
  const rounded = useTransform(mv, v => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const unsub = rounded.on('change', v => setDisplay(v));
    const ctrl  = animate(mv, target, { duration, delay, ease: 'easeOut' });
    return () => { ctrl.stop(); unsub(); };
  }, [target, duration, delay, mv, rounded]);
  return display;
}

// ── Particle canvas ───────────────────────────────────────────────────────────
function ParticleField() {
  useEffect(() => {
    const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: -999, y: -999 };
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    window.addEventListener('mousemove', onMove);

    interface P { x: number; y: number; vx: number; vy: number; }
    const N = 55;
    const pts: P[] = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
    }));

    const getAccent = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();
      const m6 = raw.match(/^#([0-9a-f]{6})$/i);
      if (m6) { const h = m6[1]; return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`; }
      const mr = raw.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (mr) return `${mr[1]},${mr[2]},${mr[3]}`;
      return '0,229,255';
    };

    const CONN = 130, MR = 200, MS = 0.005;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rgb = getAccent();

      pts.forEach(p => {
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.sqrt(dx*dx+dy*dy);
        if (d < MR && d > 0) { p.vx += dx/d*MS; p.vy += dy/d*MS; }
        p.vx *= 0.998; p.vy *= 0.998;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0)             { p.x = 0;             p.vx *= -1; }
        if (p.x > canvas.width)  { p.x = canvas.width;  p.vx *= -1; }
        if (p.y < 0)             { p.y = 0;             p.vy *= -1; }
        if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -1; }
      });

      for (let i = 0; i < N; i++) for (let j = i+1; j < N; j++) {
        const dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y;
        const d  = Math.sqrt(dx*dx+dy*dy);
        if (d < CONN) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${rgb},${(1-d/CONN)*0.12})`;
          ctx.lineWidth   = 0.7;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
      pts.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb},0.28)`;
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI*2);
        ctx.fill();
      });

      if (!reduced) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); ro.disconnect(); window.removeEventListener('mousemove', onMove); };
  }, []);

  return (
    <canvas
      id="hero-canvas"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}
      aria-hidden="true"
    />
  );
}

// ── Word wipe — the key animation technique ───────────────────────────────────
// Each word slides up out of an overflow:hidden parent — no opacity tricks,
// just a clean theatrical reveal used by top creative studios.
function WordWipe({
  word,
  accent,
  delay,
}: {
  word: string;
  accent: boolean;
  delay: number;
}) {
  return (
    <span className={styles.lineClip} style={{ display: 'inline-block' }}>
      <motion.span
        className={`${styles.word} ${accent ? styles.wordAccent : ''}`}
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {word}
      </motion.span>
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HeroV2() {
  const weather = useWeather();
  const years   = useCountUp(8,   1.3, 1.4);
  const locs    = useCountUp(100, 1.6, 1.5);

  // Flatten all words with their stagger delay
  let wordIndex = 0;
  const allWords = LINES.flatMap(segments =>
    segments.flatMap(seg =>
      seg.words.map(w => ({ word: w, accent: seg.accent, delay: 0.35 + wordIndex++ * 0.06 }))
    )
  );

  // Rebuild line structure with delays assigned
  let wi = 0;
  const linesWithDelays = LINES.map(segments =>
    segments.flatMap(seg =>
      seg.words.map(w => ({ word: w, accent: seg.accent, delay: allWords[wi++].delay }))
    )
  );
  // Reset wi for actual use
  wi = 0;
  const renderedLines = LINES.map(segments =>
    segments.flatMap(seg => seg.words.map(w => ({ w, accent: seg.accent })))
  );

  // Recompute delays cleanly
  let idx = 0;
  const lineData = renderedLines.map(words =>
    words.map(({ w, accent }) => ({ word: w, accent, delay: 0.35 + idx++ * 0.065 }))
  );

  return (
    <section id="about" className={styles.hero}>
      <ParticleField />

      {/* Aurora */}
      <motion.div
        className={styles.aurora}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
        aria-hidden="true"
      />

      <div className={styles.content}>

        {/* ── Identity row ────────────────────────────────── */}
        <motion.div
          className={styles.identity}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
          <div className={styles.nameBlock}>
            <span className={styles.name}>Vladyslav Kramarenko</span>
            <span className={styles.titleTag}>
              <span className={styles.titleDot} aria-hidden="true" />
              IT Systems &amp; Automation Engineer
            </span>
          </div>

          {weather && (
            <motion.div
              className={styles.weatherChip}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span aria-hidden="true">{weather.emoji}</span>
              <span className={styles.weatherTemp}>{weather.temp}°C</span>
              <span>Vancouver</span>
            </motion.div>
          )}
        </motion.div>

        {/* ── Statement — word-wipe reveal ────────────────── */}
        <div className={styles.statement} role="heading" aria-level={1} aria-label="I work on the systems no one sees, but everyone depends on.">
          {lineData.map((words, li) => (
            <div key={li} className={styles.lineClip} style={{ overflow: 'visible' }}>
              {words.map(({ word, accent, delay }, wi2) => (
                <WordWipe key={wi2} word={word} accent={accent} delay={delay} />
              ))}
            </div>
          ))}
        </div>

        {/* ── Divider ─────────────────────────────────────── */}
        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ transformOrigin: 'left' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 1.3 }}
          aria-hidden="true"
        />

        {/* ── Stats + CTA ─────────────────────────────────── */}
        <motion.div
          className={styles.bottomRow}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 1.5 }}
        >
          <div className={styles.statList}>
            {[
              { num: `${years}+`, label: 'Yrs Building Systems' },
              { num: `${locs}+`, label: 'Locations Automated' },
              { num: '3×',       label: 'AWS Certified' },
            ].map(s => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          <div className={styles.ctaGroup}>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Resume
            </a>
            <a href="#experience" className={styles.btnSecondary}>See Experience →</a>
          </div>
        </motion.div>
      </div>

      {/* ── Skills ticker — full-bleed ───────────────────── */}
      <motion.div
        className={styles.tickerWrap}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        aria-hidden="true"
      >
        <div className={styles.tickerTrack}>
          {[...SKILLS, ...SKILLS].map((s, i) => (
            <span key={i} className={styles.chip}>{s}</span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
