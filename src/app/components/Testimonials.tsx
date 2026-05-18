'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    quote:
      'Vlad is a highly capable IT specialist with a deep understanding of how complex systems integrate and function at scale. He approaches infrastructure with structure and precision, ensuring stability, security, and proper access control across the organization. He understands not just how to maintain systems, but how to improve them. Any organization looking for a technically strong, reliable, and security-minded IT professional would benefit from having him on their team.',
    name: 'Yuri Brennan',
    title: 'ex-Marketing Director',
    company: 'Ideal Siding',
    linkedin: 'https://www.linkedin.com/in/yuri-brennan',
    date: 'February 2026',
  },
  {
    quote:
      'He quickly became one of the most reliable people I could turn to. Vlad responds quickly, explains everything clearly, and is always willing to help — even with unexpected or urgent issues. Thanks to his support, many transitions and day-to-day tasks became significantly easier. Vladyslav is a responsible, trustworthy, and truly dedicated professional who works for results and maintains a positive attitude in any situation.',
    name: 'Olena Shomko',
    title: 'CFO',
    company: 'TEUS Group',
    linkedin: 'https://www.linkedin.com/in/olena-shomko-221077268',
    date: 'December 2025',
  },
  {
    quote:
      'Vladyslav managed the entire IT infrastructure on his own — systems, CRM solutions, and automations that improved our daily workflow. His strong digital literacy and willingness to support the team made a big difference. Working with him was always easy and enjoyable. Vladyslav is reliable, solution-oriented, and delivers what he promises.',
    name: 'Batuhan Ates',
    title: 'Digital Media & Communication',
    company: 'TEUS Group',
    linkedin: 'https://www.linkedin.com/in/batuhan-ate%C5%9F',
    date: 'December 2025',
  },
];

export default function Testimonials() {
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
    <section ref={ref} id="testimonials" className={`${styles.section} ${visible ? styles.visible : ''}`}>
      <h2 className={styles.sectionTitle}>What Colleagues Say</h2>
      <div className={styles.grid}>
        {testimonials.map((t, i) => (
          <div key={i} className={`${styles.card} glass-panel`} style={{ animationDelay: `${i * 0.1}s` }}>
            <svg className={styles.quoteIcon} width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden="true">
              <path d="M0 22V13.2C0 9.73333 0.933333 6.86667 2.8 4.6C4.66667 2.33333 7.2 0.8 10.4 0L11.6 2.4C9.46667 3.06667 7.8 4.2 6.6 5.8C5.4 7.4 4.86667 9.13333 5 11H10V22H0ZM16 22V13.2C16 9.73333 16.9333 6.86667 18.8 4.6C20.6667 2.33333 23.2 0.8 26.4 0L27.6 2.4C25.4667 3.06667 23.8 4.2 22.6 5.8C21.4 7.4 20.8667 9.13333 21 11H26V22H16Z" fill="currentColor" />
            </svg>
            <p className={styles.quote}>{t.quote}</p>
            <div className={styles.attribution}>
              <div className={styles.attributionText}>
                <span className={styles.name}>{t.name}</span>
                <span className={styles.role}>{t.title} · {t.company}</span>
              </div>
              <a
                href={t.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkedinLink}
                aria-label="View on LinkedIn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
