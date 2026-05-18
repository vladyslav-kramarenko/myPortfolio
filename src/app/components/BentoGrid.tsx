import styles from "./BentoGrid.module.css";

const STAT_DETAILS: Record<string, string[]> = {
  cloud: ['AWS', 'GCP', 'DigitalOcean'],
  automation: ['Node.js', 'Python', 'Google Apps Script', 'Make (Integromat)', 'Pabbly Connect', 'Zapier', 'Airtable'],
};

export default function BentoGrid() {
  return (
    <div className={styles.skillsSection}>
    <h2 className={styles.sectionTitle}>Skills & Stack</h2>
    <div className={styles.bentoContainer}>

      {/* Experience Block */}
      <div className={`${styles.bentoItem} ${styles.large} glass-panel`}>
        <h3 className={styles.bentoTitle}>Impact & Scale</h3>
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>3+</span>
            <span className={styles.statLabel}>
              Cloud Platforms
              <svg className={styles.chevron} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
            <div className={styles.statDetail}>
              {STAT_DETAILS.cloud.map(item => (
                <span key={item} className={styles.statTag}>{item}</span>
              ))}
            </div>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>7+</span>
            <span className={styles.statLabel}>
              Automation Tools
              <svg className={styles.chevron} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
            <div className={styles.statDetail}>
              {STAT_DETAILS.automation.map(item => (
                <span key={item} className={styles.statTag}>{item}</span>
              ))}
            </div>
          </div>
        </div>
        <p className={styles.bentoText}>
          Architecting secure, automated, and scalable cloud pipelines. Transitioning legacy systems into modern, data-driven infrastructures.
        </p>
      </div>

      {/* Certifications Block */}
      <div className={`${styles.bentoItem} glass-panel`}>
        <h3 className={styles.bentoTitle}>Certifications</h3>
        <ul className={styles.certList}>
          <li>
            <span className={styles.certIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
            </span>
            <a href="https://www.credly.com/badges/a580dc34-75db-4813-b293-f644c5d47e82/public_url" target="_blank" rel="noopener noreferrer" className={styles.certLink}>
              AWS Solutions Architect <span className={styles.certSub}>SAA-C03</span>
            </a>
          </li>
          <li>
            <span className={styles.certIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </span>
            <a href="https://www.credly.com/badges/c717886f-e53d-4353-9b1a-69f98a97cc44/public_url" target="_blank" rel="noopener noreferrer" className={styles.certLink}>
              AWS Developer Associate <span className={styles.certSub}>DVA-C02</span>
            </a>
          </li>
          <li>
            <span className={styles.certIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><polyline points="16 3 12 7 8 3"/></svg>
            </span>
            <a href="https://www.credly.com/badges/9e1a0e85-5914-4df7-ac87-41fc17eb7c8b/public_url" target="_blank" rel="noopener noreferrer" className={styles.certLink}>
              AWS Cloud Practitioner <span className={styles.certSub}>CLF-C02</span>
            </a>
          </li>
          <li>
            <span className={styles.certIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </span>
            <a href="https://www.credly.com/badges/0f272845-deaa-42ed-83ba-97c607ba1103/public_url" target="_blank" rel="noopener noreferrer" className={styles.certLink}>
              Meta Front-End Dev <span className={styles.certSub}>Professional</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Availability Block */}
      <div className={`${styles.bentoItem} ${styles.accent} glass-panel`}>
        <h3 className={styles.bentoTitle}>Availability</h3>
        <div className={styles.availRow}>
          <span className={styles.availDot} />
          <span className={styles.availStatus}>Open to new roles</span>
        </div>
        <div className={styles.availDetails}>
          <div className={styles.availItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.availIcon}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>BC, Canada</span>
          </div>
          <div className={styles.availItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.availIcon}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <span>IT Automation · Cloud Engineering</span>
          </div>
          <div className={styles.availItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.availIcon}><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
            <span>Remote / hybrid preferred</span>
          </div>
        </div>
      </div>

      {/* Tech Stack Block */}
      <div className={`${styles.bentoItem} ${styles.wide} glass-panel`}>
        <h3 className={styles.bentoTitle}>Technical Stack</h3>
        <div className={styles.techGrid}>
          <div className={styles.techCategory}>
            <span className={styles.techCategoryName}>Languages & Scripting</span>
            <p className={styles.techList}>JavaScript (Node.js · Google Apps Script), Python, SQL, Java</p>
          </div>
          <div className={styles.techCategory}>
            <span className={styles.techCategoryName}>Cloud Platforms</span>
            <p className={styles.techList}>AWS (3× certified), GCP (BigQuery, Apps Script), DigitalOcean</p>
          </div>
          <div className={styles.techCategory}>
            <span className={styles.techCategoryName}>Identity & Endpoint</span>
            <p className={styles.techList}>Microsoft Entra ID, Google Workspace, Apple Business Manager, Mosyle MDM</p>
          </div>
          <div className={styles.techCategory}>
            <span className={styles.techCategoryName}>Data & Pipelines</span>
            <p className={styles.techList}>BigQuery, Looker Studio, CRM → ETL → BI</p>
          </div>
          <div className={styles.techCategory}>
            <span className={styles.techCategoryName}>No-code / Integrations</span>
            <p className={styles.techList}>Make (Integromat), Pabbly Connect, Zapier, Airtable</p>
          </div>
          <div className={styles.techCategory}>
            <span className={styles.techCategoryName}>Web & Frameworks</span>
            <p className={styles.techList}>React, Next.js, Angular, WordPress, Spring Boot</p>
          </div>
          <div className={styles.techCategory}>
            <span className={styles.techCategoryName}>Tools</span>
            <p className={styles.techList}>Git, Jenkins, Postman, Linux CLI, Docker, Jira</p>
          </div>
        </div>
      </div>

    </div>
    </div>
  );
}
