import styles from './PipelineDiagram.module.css';

const LAYERS = [
  {
    label: 'Sources',
    sublabel: '6 systems',
    color: '#5a8fa8',
    items: ['ServiceMinder CRM', 'GatherUp Reviews', 'ProfitKeeper P&L', 'Google Ads', 'WhatConverts', 'Facebook Ads'],
  },
  {
    label: 'Ingestion',
    sublabel: 'Google Apps Script',
    color: '#00e5ff',
    items: ['10+ API connectors', 'Drive CSV backups', 'Sheets job queue', 'Daily ~6 AM runs'],
  },
  {
    label: 'Bronze',
    sublabel: 'Raw ingested',
    color: '#cd7f32',
    items: ['Contacts', 'Proposals', 'Appointments', 'GatherUp Reviews', 'P&L Data', 'Call Center'],
  },
  {
    label: 'Silver',
    sublabel: 'Typed · normalized · cleaned',
    color: '#a8a9ad',
    items: ['Contacts', 'Proposals', 'Appointments', 'GatherUp Reviews', 'P&L Data', 'Org Margins', 'FX Rates'],
  },
  {
    label: 'Gold',
    sublabel: 'Analytics · KPIs · Reports',
    color: '#d4a017',
    items: ['KPI Summary', 'KPI by Date', 'Revenue Forecast', 'Customer Reviews', 'Closing Rate', 'Call Center', 'Income Statement'],
  },
  {
    label: 'Franchise Views',
    sublabel: 'Row-level security',
    color: '#ff6b6b',
    items: ['Per-org scoped views', '100+ organizations', 'Zero cross-org access'],
  },
];

const LOOKER_DASHBOARDS = [
  'KPI Dashboard', 'Revenue Forecast', 'GatherUp Reviews',
  'Closing Rate', 'Call Center', 'Marketing', 'Income Statement', 'Funnel Reports',
];

export default function PipelineDiagram() {
  return (
    <div className={styles.wrapper}>
      <p className={styles.caption}>Data flows left → right through a medallion architecture.</p>
      <div className={styles.flow}>
        {LAYERS.map((layer, i) => (
          <div key={i} className={styles.layerGroup}>
            <div
              className={styles.layer}
              style={{ '--layer-color': layer.color } as React.CSSProperties}
            >
              <div className={styles.layerHeader}>
                <span className={styles.layerLabel}>{layer.label}</span>
                <span className={styles.layerSublabel}>{layer.sublabel}</span>
              </div>
              <ul className={styles.layerItems}>
                {layer.items.map(item => (
                  <li key={item} className={styles.layerItem}>{item}</li>
                ))}
              </ul>
            </div>
            {i < LAYERS.length - 1 && (
              <div className={styles.arrow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
                <span
                  className={styles.flowDot}
                  style={{ animationDelay: `${i * 0.65}s` }}
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Looker Studio — output layer, shown as a separate callout */}
      <div className={styles.outputRow}>
        <div className={styles.outputArrow}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
          </svg>
        </div>
        <div className={styles.outputCard} style={{ '--layer-color': '#9c6fe4' } as React.CSSProperties}>
          <div className={styles.outputHeader}>
            <span className={styles.outputLabel}>Looker Studio</span>
            <span className={styles.outputSublabel}>9 live dashboards</span>
          </div>
          <div className={styles.outputDashboards}>
            {LOOKER_DASHBOARDS.map(d => (
              <span key={d} className={styles.outputTag}>{d}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
