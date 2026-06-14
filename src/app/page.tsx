"use client";

import { useEffect, useRef, useState } from 'react';
import BentoGrid from './components/BentoGrid';
import CaseStudies from './components/CaseStudies';
import Education from './components/Education';
import ExperienceTimeline from './components/ExperienceTimeline';
import Testimonials from './components/Testimonials';
import CloudDecoration from './components/CloudDecoration';
import WeatherBackground from './components/WeatherBackground';
import { useWeather } from './hooks/useWeather';
import styles from './page.module.css';

const TYPEWRITER_PHRASES = [
  'I automate what teams repeat manually',
  'Zero-touch MDM across 100+ locations',
  'Turning hours of reports into live dashboards',
  '3× AWS Certified · 8 yrs building systems',
  'Open to full-time roles in BC, Canada',
];

const SKILLS = ['AWS', 'Python', 'Node.js', 'BigQuery', 'Looker Studio', 'React', 'Next.js', 'Google Workspace', 'Apple MDM', 'Make', 'Airtable', 'SQL', 'Linux', 'Entra ID', 'Git'];

const AWS_CERTS = [
  { name: 'Solutions Architect – Associate', id: 'SAA-C03' },
  { name: 'Developer – Associate', id: 'DVA-C02' },
  { name: 'Cloud Practitioner', id: 'CLF-C02' },
];

// Typewriter hook
function useTypewriter(phrases: string[], speed = 55, pause = 2200) {
  const [charIdx, setCharIdx] = useState(0);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && charIdx < phrase.length) {
      t = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting) {
      t = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      t = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setPhraseIdx(p => (p + 1) % phrases.length);
    }
    return () => clearTimeout(t);
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause]);

  return phrases[phraseIdx].slice(0, charIdx);
}

// Count-up hook for animated stats
function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// Intersection observer hook for scroll-reveal
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function Home() {
  const { ref: heroRef, inView: heroVisible } = useInView(0.1);
  const { ref: statsRef, inView: statsVisible } = useInView(0.3);
  const { ref: bentoRef, inView: bentoVisible } = useInView(0.1);
  const { ref: expRef, inView: expVisible } = useInView(0.05);
  const { ref: projRef, inView: projVisible } = useInView(0.1);

  const yearsCount = useCountUp(8, 1200, statsVisible);
  const locationsCount = useCountUp(100, 1500, statsVisible);
  const weather = useWeather();
  const typewriterText = useTypewriter(TYPEWRITER_PHRASES);

  return (
    <main className={styles.main}>
      <div className={styles.backgroundGlow} />

      {/* ── Hero ─────────────────────────────────── */}
      <section id="about" className={`${styles.hero} ${heroVisible ? styles.visible : ''}`} ref={heroRef}>
        <WeatherBackground condition={weather?.condition ?? null} />
        <div className={styles.heroAurora} aria-hidden="true" />
        <div className={styles.heroLeft}>
          <p className={styles.greeting}>IT Systems &amp; Automation Engineer</p>
          <h1 className={styles.name}>Vladyslav<br />Kramarenko</h1>
          <p className={styles.typewriterLine} aria-live="polite">
            {typewriterText}<span className={styles.cursor} aria-hidden="true" />
          </p>
          <p className={styles.voiceParagraph}>
            I work on the systems no one sees but everyone depends on. When I notice a team repeating manual work, I find a way to fix it — turning a pain point into something practical and maintainable.
          </p>
          <div className={styles.heroActions}>
            <a href="/resume.pdf" target="_blank" className={styles.primaryButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle', marginRight:'6px'}}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Resume
            </a>
            <a href="#experience" className={styles.secondaryButton}>
              See Experience
            </a>
          </div>
          <div className={styles.heroBadges}>
            <span className={styles.badge}>
              <svg width="16" height="11" viewBox="0 0 900 450" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign:'middle',marginRight:'5px'}}>
                <rect width="900" height="450" fill="#d52b1e"/><rect x="225" width="450" height="450" fill="#fff"/>
                <path d="M450 168.22l-18.42 16.57-41.9-5.18 5.17 29.82-36.21 16.57 26.9 20.7-22.77 56.92 57.96-26.91 32.08 19.67-17.6-43.47 5.18-5.17 28.98 12.42-7.25-34.16 28.98 5.18-20.7-33.12 18.63-2.07-28.98-33.12 28.98 7.25-24.84-25.88 15.53 15.53-26.9-20.7v-24.84l-11.39 16.56-11.39-24.84v28.98l-18.63-14.49v24.84z" fill="#d52b1e"/>
              </svg>
              Canadian Permanent Resident
            </span>
          </div>
        </div>

        <div className={styles.heroRight} ref={statsRef}>
          <CloudDecoration condition={weather?.condition ?? null} />
          {weather && (
            <div className={styles.weatherRow}>
              <span className={styles.weatherEmoji}>{weather.emoji}</span>
              <span className={styles.weatherTemp}>{weather.temp}°C</span>
              <span className={styles.weatherSep}>·</span>
              <span className={styles.weatherLabel}>
                {weather.label} in{' '}
                {weather.condition === 'rainy' ? (
                  <span className={styles.raincoverWrapper}>
                    Vancouver
                    <span className={styles.raincoverTip}>that&apos;s why locals call it Raincover</span>
                  </span>
                ) : 'Vancouver'}
              </span>
            </div>
          )}
          <div className={styles.statCard}>
            <span className={styles.statNum}>{yearsCount}+</span>
            <span className={styles.statLabel}>Yrs Building Systems</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{locationsCount}+</span>
            <span className={styles.statLabel}>Locations Automated</span>
          </div>
          <div className={`${styles.statCard} ${styles.awsCertCard}`}>
            <span className={styles.awsCertTitle}>AWS Certified</span>
            {AWS_CERTS.map(cert => (
              <span key={cert.id} className={styles.awsCertItem}>
                <svg className={styles.awsCertCheck} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span className={styles.awsCertName}>{cert.name}</span>
                <span className={styles.awsCertId}>{cert.id}</span>
              </span>
            ))}
          </div>
          <div className={styles.skillTicker} aria-hidden="true">
            <div className={styles.skillTickerTrack}>
              {[...SKILLS, ...SKILLS].map((skill, i) => (
                <span key={i} className={styles.skillChip}>{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Experience Timeline ──────────────────────── */}
      <div id="experience" className={`${styles.fadeSection} ${expVisible ? styles.visible : ''}`} ref={expRef}>
        <ExperienceTimeline />
      </div>

      {/* ── Skills & Stack ────────────────────────────── */}
      <div id="skills" className={`${styles.fadeSection} ${bentoVisible ? styles.visible : ''}`} ref={bentoRef}>
        <BentoGrid />
      </div>

      {/* ── Architecture Deep Dives ──────────────────── */}
      <div id="projects" className={`${styles.fadeSection} ${projVisible ? styles.visible : ''}`} ref={projRef}>
        <CaseStudies />
      </div>

      {/* ── Education ────────────────────────────────── */}
      <Education />

      {/* ── Testimonials ─────────────────────────────── */}
      <Testimonials />

      {/* ── Contact ──────────────────────────────────── */}
      <section id="contact" className={styles.contactSection}>
        <h2 className={styles.contactTitle}>Let's Work Together</h2>
        <p className={styles.contactText}>
          Open to IT systems and automation roles in BC, Canada.<br/>
          Reach out on LinkedIn, by email, or call <a href="tel:+12369929229" style={{color:'var(--accent-primary)'}}>+1 236 992 9229</a>.
        </p>
        <div className={styles.contactLinks}>
          <a href="https://linkedin.com/in/vladyslav-kramarenko" target="_blank" rel="noopener noreferrer" className={styles.primaryButton}>
            Connect on LinkedIn
          </a>
          <a href="mailto:vladyslav.kramarenko.92@gmail.com" className={styles.secondaryButton}>
            Email
          </a>
          <a href="https://github.com/vladyslav-kramarenko" target="_blank" rel="noopener noreferrer" className={styles.secondaryButton}>
            GitHub
          </a>
          <a href="/resume.pdf" target="_blank" className={styles.secondaryButton}>
            Resume
          </a>
        </div>
      </section>
    </main>
  );
}
