/**
 * Additional context for the AI portfolio assistant.
 * Edit this file to control what the AI knows and says.
 * The structured data (experience, education, skills) is pulled
 * automatically from the other data files — add things here that
 * are hard to express in structured form: stories, preferences, FAQ.
 */
export const aiContext = {

  // ── Who he is ────────────────────────────────────────────────────────────
  background: `
Vladyslav (Vlad) Kramarenko is a Ukrainian-born IT Automation and Cloud Engineer
now based in Coquitlam, BC, Canada (Metro Vancouver) as a Permanent Resident.
His technical background starts at university — Computer Science Bachelor's and Project Management
Master's (both with honors-level IT software projects as theses), plus a Java/Spring/Arduino
web project built during the degree (2011–2012). He then founded two manufacturing businesses
before returning to IT full-time in 2018.
His professional IT career began at ZHYTLOBUD-2, a large Ukrainian construction company (1000+ employees),
where he was initially hired as Project Manager to implement a 1C ERP system,
then promoted to Head of IT Department to lead the infrastructure team.
He relocated to Canada in 2022 following the Russian invasion of Ukraine.
During the transition period he completed EPAM Systems' Java Engineering training program
(Spring Boot, AWS, Auth0) including a mentoring track — treated as professional development,
not employment.
  `,

  // ── What he's looking for ─────────────────────────────────────────────────
  openTo: `
Vladyslav is actively looking for senior IT automation, cloud engineering,
or systems engineering roles in British Columbia, Canada (preferably Vancouver or remote).
He is open to hybrid or fully remote positions. He is NOT looking for pure helpdesk,
junior support, or non-technical management roles.
Ideal role: senior/staff-level position involving automation, cloud infrastructure,
data pipelines, or internal tooling — ideally at a growth-stage tech company or
a company undergoing digital transformation.
  `,

  // ── Work style ────────────────────────────────────────────────────────────
  workStyle: `
Vladyslav prefers to own problems end-to-end rather than work on isolated tickets.
He is comfortable being the sole technical owner of a system or a small team lead.
He has a strong bias toward automation: if something is done manually more than twice,
he will build a script or workflow to handle it.
He works well with non-technical stakeholders and has experience translating business
requirements into technical solutions (from his ERP project management days).
  `,

  // ── Notable project details (beyond the resume bullets) ──────────────────
  projects: `
IDEAL SIDING - CRM AUTOMATION:
Vladyslav built a suite of Node.js and Google Apps Script automations that connect
the franchise CRM to Google Workspace, automatically provisioning accounts, sending
onboarding emails, and syncing data — eliminating about 2–3 hours of manual work per
new franchise location onboarded.

IDEAL SIDING - MDM & COMPLIANCE:
He owns the MDM rollout across 100+ franchise locations using Microsoft Entra ID
and Apple Business Manager. This includes policy enforcement, conditional access,
and endpoint compliance monitoring — effectively acting as a one-person IT security team
for a distributed franchise network.

TEUS Group - CLOUD BACKUP PIPELINE:
Designed and deployed an EC2-based job that continuously syncs Google Shared Drives
to AWS S3, with CloudWatch alerts for pipeline health. This replaced a manual,
error-prone backup process and gave the company a reliable disaster recovery foundation.

TEUS Group - RPA & SCRAPERS:
Maintained Python-based RPA scrapers integrated with the company CRM to pull
competitor pricing and market data automatically on a schedule.

ZHYTLOBUD-2 - 1C ERP IMPLEMENTATION:
Led the full implementation of 1C ERP across a 1000+ employee construction company.
This included gathering requirements from department heads, configuring the system,
training staff, and driving adoption. The transport department integration reduced
a month-long data entry cycle to a single day by connecting 1C with GPS and weight systems.

ZHYTLOBUD-2 - FACE RECOGNITION ACCESS:
Deployed a face-recognition based access control and absenteeism detection system
across the company's offices and construction sites.

JUST CAT - ENTREPRENEURSHIP:
Founded a pellet manufacturing business in Ukraine, grew it to 100 tonnes/month
production. Expanded into retail by introducing small-format consumer packaging (3–5 kg)
alongside bulk supply — accessing higher-margin channels with the same product.
  `,

  // ── Frequently asked questions ────────────────────────────────────────────
  faq: [
    {
      q: "Why did you leave Ukraine / move to Canada?",
      a: "Vladyslav relocated to Canada in 2022 following the Russian invasion of Ukraine. He was living in Kharkiv, one of the most heavily impacted cities. He obtained Canadian Permanent Residency and is now based in Coquitlam, BC (Metro Vancouver)."
    },
    {
      q: "Are you authorized to work in Canada?",
      a: "Yes. Vladyslav is a Canadian Permanent Resident and is fully authorized to work in Canada without any restrictions or sponsorship requirements."
    },
    {
      q: "Why did you go from running businesses to IT?",
      a: "While running his manufacturing companies, Vladyslav was already the person building the tech tools — automating logistics, building tracking systems, managing websites. When he joined ZHYTLOBUD-2 he shifted fully into IT and found it was where he wanted to be. The entrepreneurial background gives him a business-first perspective on technology decisions."
    },
    {
      q: "What is your strongest technical area?",
      a: "Automation and cloud infrastructure. Vladyslav's core strength is taking a manual, repetitive process and replacing it with a reliable automated system — whether that's a Node.js script, a Google Apps Script workflow, a Python job on EC2, or a no-code integration via Make/Pabbly. He backs this with AWS (two certs) and GCP experience."
    },
    {
      q: "Do you have team leadership experience?",
      a: "Yes. At ZHYTLOBUD-2 he led a team of 6 IT professionals. He has also managed contractor relationships, onboarded staff across 100+ locations, and mentored junior team members. He is comfortable in both individual contributor and lead roles."
    },
    {
      q: "What is your salary expectation?",
      a: "Vladyslav hasn't shared a specific number publicly. He'd encourage you to connect with him directly on LinkedIn or reach out by email to discuss compensation."
    },
    {
      q: "Are you open to relocating?",
      a: "He is currently based in Coquitlam, BC (Metro Vancouver) and prefers to stay in the Lower Mainland. He is open to fully remote roles across Canada."
    },
    {
      q: "Do you have experience with Salesforce / HubSpot / other CRM?",
      a: "Yes — Vladyslav has worked extensively with enterprise CRM systems (configuration, API integrations, automation workflows). He has experience building CRM-to-reporting pipelines (CRM → Google Sheets → BigQuery → Looker) and CRM-triggered automations via Node.js and Google Apps Script. He also has hands-on experience with Zapier, Make (Integromat), and Pabbly Connect for no-code/low-code integration workflows."
    },
  ],

  // ── Things to proactively mention when relevant ───────────────────────────
  highlights: `
- Two AWS certifications (Solutions Architect Associate + Developer Associate) verifiable on Credly.
- Meta Front-End Developer Professional Certificate (Coursera).
- Master's degree in Project Management (graduated with honors / Red Diploma).
- Built a real-time executive dashboard pipeline: CRM → Google Sheets → BigQuery → Looker Studio.
- Managed IT infrastructure across 100+ franchise locations — security, MDM, identity, provisioning.
- Has both engineering AND project management / leadership experience — rare combination.
- Entrepreneurial background (2 businesses) — understands the business side of technology.
- Fluent in Ukrainian and Russian; professional working proficiency in English.
  `,
};
