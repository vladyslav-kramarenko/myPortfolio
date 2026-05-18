export type Role = { role: string; period: string; location?: string; bullets: string[] };
export type GapNote = { text: string; linkTo?: string };
export type Experience = { company: string; url: string | null; logo?: string; location?: string; roles: Role[]; gapBefore?: GapNote };

export const experiences: Experience[] = [
  {
    company: 'Ideal Siding',
    url: 'https://idealsiding.com',
    logo: '/logos/idealsiding.png',
    location: 'Burnaby, BC',
    roles: [
      {
        role: 'IT Systems & Operations Specialist',
        period: 'Mar 2026 – Present',
        bullets: [
          'Promoted after building the IT function from scratch — now owning security governance, automation, and internal tooling across the company.',
          'Manage identity and access for 100+ franchise locations via Microsoft Entra ID and Google Workspace — covering email provisioning, onboarding/offboarding, and conditional access.',
          'Own endpoint compliance and MDM policy enforcement for HQ devices via Apple Business Manager and Mosyle MDM.',
          'Architect and ship Node.js, Google Apps Script, and Zapier automations that eliminate recurring manual workflows; maintain RPA scrapers integrated with CRM.',
          'Administer the company GitHub org and drive engineering standards for internal tooling.',
          'First-responder for the main WordPress site during EU dev team off-hours — triaging unreachable pages, restoring broken assets, managing redirects, and auditing server configuration (identified an exposed root user on a newly provisioned server).',
          'Built AI-assisted workflows (OpenAI API) to extract structured data from unformatted vendor emails — eliminating manual data entry and feeding results directly into CRM and reporting pipelines.',
        ],
      },
      {
        role: 'Systems Onboarding & Support Technician',
        period: 'Apr 2025 – Mar 2026',
        bullets: [
          'Joined as the first dedicated IT hire as Ideal Siding scaled from startup phase to a 100+ location franchise — no IT department, processes, or tooling existed.',
          'Built identity and access management from scratch: Entra ID and Google Workspace provisioning across 100+ locations, covering onboarding, offboarding, and hardware.',
          'Designed and delivered a CRM → Google Sheets → BigQuery → Looker Studio pipeline that replaced a manual weekly reporting process with hourly-refreshed executive dashboards.',
          'Developed Python and Google Apps Script automations for onboarding workflows and operational data processing.',
        ],
      },
    ],
  },
  {
    company: 'TEUS Group',
    url: 'https://www.teus-group.com',
    logo: '/logos/teusgroup.jpg',
    roles: [
      {
        role: 'Systems & Automation Engineer',
        period: 'May 2023 – Sep 2025',
        location: 'Remote',
        bullets: [
          'Sole engineer supporting CRM, hosting, backups, and internal tools for an international real estate developer with resort projects across Turkey and Bali.',
          'Built Python and Google Apps Script automations to eliminate repetitive operational tasks.',
          'Designed and deployed an EC2-based job to continuously sync Google Shared Drives to S3; monitored pipeline health with CloudWatch.',
          'Rebuilt the company website in React/Next.js after the previous vendor refused to return source code; delivered PPC landing pages and built internal Asana reporting dashboards via Google Apps Script; maintained a separate project site (Desire Antalya) on WordPress — content updates, template adjustments, and redirects.',
          'Investigated root causes of failed scheduled jobs, broken integrations, and data mismatches using Linux CLI log analysis.',
          'Final months (Apr – Sep 2025) part-time — transitioning to Ideal Siding while handing off systems and knowledge to an incoming administrator.',
        ],
      },
    ],
  },
  {
    company: 'ZHYTLOBUD-2',
    gapBefore: {
      text: 'Feb 2022 – May 2023 · Career gap explained: relocated from Kharkiv to Canada following the Russian invasion of Ukraine. Used the 15-month transition for structured upskilling — EPAM Java Spring program (196 h, certified) and AWS foundation courses. Converted that coursework into 3 AWS certifications within the first 4 months at the next role.',
      linkTo: '#education',
    },
    url: 'https://zhilstroj-2.ua/?lang=en',
    logo: '/logos/zhytlobud2.webp',
    location: 'Kharkiv, Ukraine',
    roles: [
      {
        role: 'Head of IT Department',
        period: 'Dec 2020 – Feb 2022',
        bullets: [
          'Led a team of 6 IT professionals owning infrastructure, web properties, and 1C ERP systems.',
          'Deployed a face-recognition access control system with automated absenteeism detection.',
          'Modernized network infrastructure: migrated user data from local machines to a centralized server with backup.',
          'Replaced two external vendors (access control installer + 1C integrator) with dedicated in-house hires at the same cost — gaining immediate on-site repair capability, centralised control across all buildings, and the capacity to build the company\'s first on-premises server room.',
          'Developed custom 1C accounting add-ons and maintained company websites (PHP, WordPress, JavaScript).',
        ],
      },
      {
        role: 'ERP Project Manager',
        period: 'Nov 2018 – Dec 2020',
        bullets: [
          'Led end-to-end implementation of the 1C ERP system across a 1000+ employee construction company — gathered requirements, trained staff, and drove adoption.',
          'Automated transport department document flow — reduced a month-long data entry cycle to a single day by integrating 1C with truck GPS trackers, vehicle weight scales, and concrete production software, giving operations a unified view of every delivery.',
          'Managed delivery of three Android & iOS apartment catalogue apps through an external dev team — company overview and two project-specific apps with 2D floor-plan views for in-office sales use.',
          'Built a Java tool for daily concrete mixer route planning, improving logistics efficiency.',
        ],
      },
    ],
  },
  {
    company: 'Just Cat',
    url: 'https://justcat.com.ua',
    logo: '/logos/justcat.webp',
    roles: [
      {
        role: 'Founder',
        period: 'Sep 2017 – Nov 2018',
        location: 'Ukraine',
        bullets: [
          'Founded a pellet manufacturing business producing up to 100 tonnes/month.',
          'Expanded into retail by introducing small-format consumer packaging (3–5 kg) alongside bulk industrial supply — accessing higher-margin channels with the same product.',
          'Managed production, supplier relationships, and regional sales logistics end-to-end.',
        ],
      },
    ],
  },
  {
    company: 'Ecofuel Trade',
    url: null,
    logo: '/logos/ecofueltrade.webp',
    roles: [
      {
        role: 'Founder & Operations Manager',
        period: 'Sep 2015 – Sep 2017',
        location: 'Ukraine',
        bullets: [
          'Founded a solid fuel (briquettes/pellets) manufacturing company and scaled it to a team of 6–20 across production, logistics, and procurement.',
          'Managed end-to-end operations: supplier sourcing, production scheduling, inventory control, and regional distribution.',
        ],
      },
    ],
  },
];
