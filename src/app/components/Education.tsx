'use client';

import { useEffect, useRef, useState } from 'react';
import { schools } from '../../data/education';
import type { CertLink } from '../../data/education';
import styles from './Education.module.css';

export default function Education() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className={`${styles.section} ${visible ? styles.visible : ''}`} id="education">
      <h2 className={styles.sectionTitle}>Education</h2>
      <div className={styles.grid}>
        {schools.map((s, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardHeader}>
              {s.url ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className={styles.institutionLink}>
                  {s.institution}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:'5px',opacity:0.5,verticalAlign:'middle'}}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              ) : (
                <span className={styles.institution}>{s.institution}</span>
              )}
              <span className={styles.location}>{s.location}</span>
            </div>
            <div className={styles.degrees}>
              {s.degrees.map((d, j) => (
                <div key={j} className={`${styles.degreeRow} ${j > 0 ? styles.degreeRowDivided : ''}`}>
                  <div className={styles.degreeLeft}>
                    <span className={styles.degreeTitle}>{d.title}</span>
                    <span className={styles.degreeField}>{d.field}</span>
                    {d.distinction && <span className={styles.distinction}>{d.distinction}</span>}
                  </div>
                  <span className={styles.period}>{d.period}</span>
                </div>
              ))}
            </div>
            {s.note && (
              Array.isArray(s.note)
                ? <div className={styles.note}>{s.note.map((p, k) => <p key={k}>{p}</p>)}</div>
                : <p className={styles.note}>{s.note}</p>
            )}
            {s.certLinks && s.certLinks.length > 0 && (
              <div className={styles.certLinks}>
                {s.certLinks.map((cl: CertLink) => (
                  <a key={cl.url} href={cl.url} target="_blank" rel="noopener noreferrer" className={styles.certLinkChip}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    {cl.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
