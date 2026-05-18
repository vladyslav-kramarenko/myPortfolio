'use client';

import { useEffect, useRef, useState } from 'react';
import { experiences } from '../../data/experience';
import styles from './ExperienceTimeline.module.css';

const ExternalLinkIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', verticalAlign: 'middle' }}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export default function ExperienceTimeline() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(experiences.length).fill(false));
  const [lineVisible, setLineVisible] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    if (timelineRef.current) {
      const lineObs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setLineVisible(true); lineObs.disconnect(); } },
        { threshold: 0.05 }
      );
      lineObs.observe(timelineRef.current);
      observers.push(lineObs);
    }

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => { const next = [...prev]; next[i] = true; return next; });
            obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section className={styles.section} id="experience">
      <h2 className={styles.sectionTitle}>Work Experience</h2>
      <div ref={timelineRef} className={`${styles.timeline} ${lineVisible ? styles.lineVisible : ''}`}>
        {experiences.flatMap((exp, i) => {
          const card = (
            <div
              key={i}
              ref={el => { itemRefs.current[i] = el; }}
              className={`${styles.item} ${visibleItems[i] ? styles.visible : ''}`}
            >
              <div className={styles.dot} />
              <div className={styles.card}>

                <div className={styles.companyRow}>
                  <div className={styles.companyMeta}>
                    {exp.logo && (
                      <div className={styles.logoWrap}>
                        <img src={exp.logo} alt={exp.company} className={styles.logo} />
                      </div>
                    )}
                    <div className={styles.companyText}>
                      {exp.url ? (
                        <a href={exp.url} target="_blank" rel="noopener noreferrer" className={styles.companyLink}>
                          {exp.company}<ExternalLinkIcon />
                        </a>
                      ) : (
                        <span className={styles.company}>{exp.company}</span>
                      )}
                      {exp.location && <span className={styles.cardLocation}>{exp.location}</span>}
                    </div>
                  </div>
                  <span className={styles.totalPeriod}>
                    {exp.roles[exp.roles.length - 1].period.split('–')[0].trim()} – {exp.roles[0].period.split('–')[1].trim()}
                  </span>
                </div>

                {exp.roles.map((r, j) => (
                  <div key={j} className={`${styles.roleBlock} ${j > 0 ? styles.roleBlockDivided : ''}`}>
                    <div className={styles.roleHeader}>
                      <h3 className={styles.role}>{r.role}</h3>
                      {exp.roles.length > 1 && (
                        <span className={styles.period}>{r.period}</span>
                      )}
                    </div>
                    {r.location && <p className={styles.location}>{r.location}</p>}
                    <ul className={styles.bullets}>
                      {r.bullets.map((b, k) => (
                        <li key={k}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}

              </div>
            </div>
          );

          if (!exp.gapBefore) return [card];
          return [
            <div key={`gap-${i}`} className={styles.gapNote}>
              <span className={styles.gapText}>{exp.gapBefore.text}</span>
              {exp.gapBefore.linkTo && (
                <a href={exp.gapBefore.linkTo} className={styles.gapLink}>See Education ↓</a>
              )}
            </div>,
            card,
          ];
        })}
      </div>
    </section>
  );
}
