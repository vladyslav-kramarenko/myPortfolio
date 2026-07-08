'use client';

import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import styles from './HeroV3.module.css';

const LINES = [
  { words: ['I', 'work', 'on', 'the', 'systems'], accent: false },
  { words: ['no', 'one', 'sees,'],                accent: false },
  { words: ['but', 'everyone', 'depends', 'on.'], accent: true  },
];

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

function WordWipe({ word, accent, delay }: { word: string; accent: boolean; delay: number }) {
  return (
    <span className={styles.lineClip}>
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

// ── Infrastructure topology diagram ───────────────────────────────────────────
// viewBox 0 0 420 375; nodes are 84×38 rects centered at (x, y)
const NODES = [
  { key: 'aws',   x: 210, y: 44,  abbr: 'AWS',   label: 'CLOUD',      dotDelay: '0s'   },
  { key: 'api',   x: 80,  y: 148, abbr: 'API',   label: 'COMPUTE',    dotDelay: '0.8s' },
  { key: 'db',    x: 340, y: 148, abbr: 'SQL',   label: 'DATABASE',   dotDelay: '1.6s' },
  { key: 'auto',  x: 210, y: 252, abbr: 'AUTO',  label: 'AUTOMATION', dotDelay: '2.1s' },
  { key: 'saas',  x: 80,  y: 345, abbr: 'SaaS',  label: 'WORKSPACE',  dotDelay: '0.4s' },
  { key: 'bi',    x: 340, y: 345, abbr: 'BI',    label: 'ANALYTICS',  dotDelay: '1.2s' },
];

// Paths connect bottom-center of source to top-center of target (rect is 84×38, center at x,y)
const EDGES = [
  { path: 'M 210 63 L 80 129',   dur: '2.2s', begin: '0s'   },
  { path: 'M 210 63 L 340 129',  dur: '1.8s', begin: '0.9s' },
  { path: 'M 80 167 L 210 233',  dur: '2.5s', begin: '0.3s' },
  { path: 'M 340 167 L 210 233', dur: '2.0s', begin: '1.2s' },
  { path: 'M 210 271 L 80 326',  dur: '1.9s', begin: '0.6s' },
  { path: 'M 210 271 L 340 326', dur: '2.3s', begin: '1.5s' },
];

function ArchDiagram() {
  return (
    <svg
      viewBox="0 0 420 375"
      className={styles.archSvg}
      aria-hidden="true"
    >
      {/* Connection lines */}
      {EDGES.map((e, i) => (
        <g key={i}>
          {/* Static base line */}
          <path d={e.path} stroke="var(--border-color)" strokeWidth="1.5" fill="none" />
          {/* Animated dashes — data flow direction */}
          <path
            d={e.path}
            stroke="var(--accent-primary)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="4 10"
            opacity="0.45"
          >
            {/* @ts-ignore — SMIL attribute, works in all modern browsers */}
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-14"
              dur={e.dur}
              repeatCount="indefinite"
            />
          </path>
          {/* Traveling particle */}
          <circle r="2.5" fill="var(--accent-primary)" opacity="0.9">
            {/* @ts-ignore */}
            <animateMotion
              dur={e.dur}
              repeatCount="indefinite"
              begin={e.begin}
              path={e.path}
            />
          </circle>
        </g>
      ))}

      {/* Nodes */}
      {NODES.map((n, i) => (
        <g key={n.key} className={styles.archNode} style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
          <rect
            x={n.x - 42} y={n.y - 19} width="84" height="38" rx="7"
            fill="var(--bg-secondary)"
            stroke="var(--border-color)"
            strokeWidth="1"
          />
          {/* Accent inner tint */}
          <rect
            x={n.x - 42} y={n.y - 19} width="84" height="38" rx="7"
            fill="var(--accent-primary)"
            opacity="0.05"
          />
          {/* Abbreviation */}
          <text
            x={n.x} y={n.y - 2}
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fontFamily="monospace"
            fill="var(--accent-primary)"
          >
            {n.abbr}
          </text>
          {/* Full label */}
          <text
            x={n.x} y={n.y + 13}
            textAnchor="middle"
            fontSize="8"
            fontFamily="monospace"
            fill="var(--text-muted)"
            letterSpacing="0.07em"
          >
            {n.label}
          </text>
          {/* Status dot — top-right corner */}
          <circle cx={n.x + 35} cy={n.y - 13} r="3.5" fill="#22c55e">
            {/* @ts-ignore */}
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="2.4s"
              repeatCount="indefinite"
              begin={n.dotDelay}
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function HeroV3() {
  const weather = useWeather();
  const years   = useCountUp(8,   1.3, 1.4);
  const locs    = useCountUp(100, 1.6, 1.5);

  let idx = 0;
  const lineData = LINES.map(seg =>
    seg.words.map(word => ({ word, accent: seg.accent, delay: 0.35 + idx++ * 0.07 }))
  );

  return (
    <section id="about" className={styles.hero}>
      {/* Dot-grid background */}
      <div className={styles.dotGrid} aria-hidden="true" />

      {/* Aurora */}
      <motion.div
        className={styles.aurora}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
        aria-hidden="true"
      />

      <div className={styles.layout}>

        {/* ── Left column ──────────────────────────────────── */}
        <div className={styles.left}>

          {/* Identity */}
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

          {/* Statement */}
          <div
            className={styles.statement}
            role="heading"
            aria-level={1}
            aria-label="I work on the systems no one sees, but everyone depends on."
          >
            {lineData.map((words, li) => (
              <div key={li} className={styles.statementLine}>
                {words.map(({ word, accent, delay }, wi) => (
                  <WordWipe key={wi} word={word} accent={accent} delay={delay} />
                ))}
              </div>
            ))}
          </div>

          {/* Divider */}
          <motion.div
            className={styles.divider}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            style={{ transformOrigin: 'left' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 1.3 }}
            aria-hidden="true"
          />

          {/* Stats + CTA */}
          <motion.div
            className={styles.bottomRow}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 1.5 }}
          >
            <div className={styles.statList}>
              {[
                { num: `${years}+`, label: 'Yrs Building Systems' },
                { num: `${locs}+`, label: 'Locations Automated'  },
                { num: '3×',       label: 'AWS Certified'        },
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

          {/* Status bar — embodies the "invisible systems" tagline */}
          <motion.div
            className={styles.statusBar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0 }}
          >
            <span className={styles.statusDot} aria-hidden="true" />
            <span>All systems operational</span>
            <span className={styles.statusSep} aria-hidden="true">·</span>
            <span>47 automations running</span>
            <span className={styles.statusSep} aria-hidden="true">·</span>
            <span>3 AWS regions</span>
          </motion.div>

        </div>

        {/* ── Right column — arch diagram ───────────────────── */}
        <motion.div
          className={styles.right}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
        >
          <div className={styles.archPanel}>
            <div className={styles.archHeader}>
              <span className={styles.archTitle}>Infrastructure Overview</span>
              <span className={styles.archLive}>
                <span className={styles.archLiveDot} />
                LIVE
              </span>
            </div>
            <ArchDiagram />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
