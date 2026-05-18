'use client';

import PipelineDiagram from './PipelineDiagram';
import styles from './CaseStudies.module.css';

const featuredCase = {
  title: 'Executive Reporting Pipeline',
  company: 'Ideal Siding',
  description:
    'A manager previously downloaded a raw CRM export each week, manually cleaned data across 100+ franchise locations, stripped inactive orgs, averaged KPIs, and emailed a summary to leadership. Replaced the entire workflow with a CRM → Google Sheets → BigQuery → Looker Studio pipeline — giving leadership hourly-refreshed dashboards with data visibility the business had never had before.',
  tags: ['Google BigQuery', 'Looker Studio', 'Google Apps Script', 'CRM API'],
};

const otherCases = [
  {
    title: 'Identity & Device Management — 100+ Locations',
    company: 'Ideal Siding',
    description:
      'Manages identity and access for 100+ franchise locations via Microsoft Entra ID — email provisioning, onboarding/offboarding, and conditional access without manual IT steps. Device management and MDM policy enforcement via Apple Business Manager covers HQ endpoints, with ongoing compliance monitoring across the fleet.',
    tags: ['Microsoft Entra ID', 'Apple Business Manager', 'MDM', 'Conditional Access'],
  },
  {
    title: 'AI-Assisted Email Intelligence',
    company: 'Ideal Siding',
    description:
      'Built a workflow using the OpenAI API to extract structured fields from non-standardized vendor and partner emails — inferring amounts, dates, locations, and categories from free-text. Eliminated manual data entry and feeds the parsed data directly into CRM and reporting pipelines. Also built an internal RAG proof-of-concept to validate technical feasibility for company knowledge retrieval — the working prototype gave management the confidence to commit to a commercial solution rather than build blind.',
    tags: ['OpenAI API', 'Google Apps Script', 'Node.js', 'RAG', 'Workflow Automation'],
  },
];

export default function CaseStudies() {
  return (
    <div className={styles.caseStudiesContainer}>
      <h2 className={styles.sectionTitle}>Architecture & Deep Dives</h2>

      {/* Featured case — full width, diagram inline */}
      <div className={`${styles.featuredCard} glass-panel`}>
        <div className={styles.featuredTop}>
          <div>
            <h3 className={styles.cardTitle}>{featuredCase.title}</h3>
            <p className={styles.company}>{featuredCase.company}</p>
            <p className={styles.description}>{featuredCase.description}</p>
            <div className={styles.tagContainer}>
              {featuredCase.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.diagramInline}>
          <p className={styles.diagramLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px',verticalAlign:'middle'}}>
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            GAS-triggered · hourly refresh
          </p>
          <PipelineDiagram />
        </div>
      </div>

      {/* Other cases */}
      <div className={styles.grid}>
        {otherCases.map((c, i) => (
          <div key={i} className={`${styles.card} glass-panel`}>
            <div>
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.company}>{c.company}</p>
            </div>
            <p className={styles.description}>{c.description}</p>
            <div className={styles.tagContainer}>
              {c.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
