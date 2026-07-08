"use client";

import { useEffect, useRef, useState } from 'react';
import BentoGrid from './components/BentoGrid';
import CaseStudies from './components/CaseStudies';
import Education from './components/Education';
import ExperienceTimeline from './components/ExperienceTimeline';
import Testimonials from './components/Testimonials';
import HeroV3 from './components/HeroV3';
import styles from './page.module.css';

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
  const { ref: bentoRef, inView: bentoVisible } = useInView(0.1);
  const { ref: expRef,  inView: expVisible  } = useInView(0.05);
  const { ref: projRef, inView: projVisible } = useInView(0.1);

  return (
    <>
      {/* Hero sits outside max-width main so names can span full viewport */}
      <HeroV3 />

      <main className={styles.main}>
      <div className={styles.backgroundGlow} />

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
    </>
  );
}
