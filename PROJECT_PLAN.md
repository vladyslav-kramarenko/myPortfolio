# Portfolio Rebuild: "The Autonomous Engineer"

A complete redesign and rebuild of Vladyslav Kramarenko's portfolio. This plan incorporates strategic feedback from both the **Engineering Manager (EM)** and **Senior IT Recruiter** perspectives to ensure the site is both technically impressive and highly optimized for the hiring process.

## Strategic Direction

*   **Focus**: Showcase scale, business impact, and architectural understanding.
*   **Target Roles**: Cloud Engineer, Automation Engineer, Data Integration Specialist.
*   **Aesthetic**: "Deep Tech" – dark mode, clean lines, glassmorphism, prioritizing scannability over complex animations.

## Core Concepts & Safeguards

> **Shift to Next.js**: We are building on Next.js 14+ (App Router). It is the industry standard for high-performance, AI-integrated web applications.
> **AI Safeguards**: To prevent abuse and manage costs on the OpenAI API, we will implement:
    - **Rate Limiting**: Limit the number of messages per session/IP.
    - **Prompt Hardening**: Strict system prompts to ensure the bot stays on topic (career/resume only).
    - **Max Token Limits**: Cap the length of AI responses to keep costs low.
> **Deployment**: Next.js optimized deployment (Vercel recommended for Edge functions/AI, or standalone build for `adm.tools`).

## Proposed Features (EM & Recruiter Approved)

### 1. The Hero Section (The 3-Second Hook)
- **Clear Positioning**: A bold, minimalist greeting identifying the exact roles targeted ("Cloud & Automation Engineer").
- **ATS Compatibility [RECRUITER UPDATE]**: A highly visible, primary "Download Resume (PDF)" button above the fold. 
- **Tech Focus**: Explicit mention of JS, Node.js, and Google Apps Script, dropping the over-emphasis on Python.

### 2. The Bento Grid (The Executive Summary)
- **Impact & Scale [EM UPDATE]**: Concrete metrics (e.g., "100+ Franchise Locations", "8+ Years Engineering") rather than vague technology counts.
- **Categorized Tech Stack [EM UPDATE]**: Technologies organized by function (Languages, Cloud, Data) rather than a messy list, highlighting Node, GAS, AWS, and GCP.
- **Work Authorization**: Prominent "Canadian PR" badge to instantly answer visa questions for recruiters.

### 3. Architecture & Deep Dives (The Proof)
- **[STRATEGIC PIVOT - EM UPDATE]**: We are dropping the "Contract/Freelance Portal" to avoid signaling a lack of commitment to full-time roles. 
- **Case Studies**: In its place, we will build an "Architecture" section showcasing 1-2 complex workflows built at Ideal Siding or TEUS Group (e.g., CRM to BigQuery ETL pipelines).

### 4. The AI Career Agent (The "Wow" Factor)
- **Interactive Chat**: A sidebar or floating chat interface powered by OpenAI/Gemini that uses RAG (Retrieval-Augmented Generation) against `master_resume.md`.
- **Suggestion Chips [RECRUITER UPDATE]**: Pre-filled questions (e.g., "Tell me about his GCP experience" or "What did he build at Ideal Siding?") so recruiters instantly understand how to use the tool without having to think of a prompt.

## Technical Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Modules + Framer Motion (for smooth, non-blocking transitions)
- **Intelligence**: OpenAI API + LangChain/Vercel AI SDK
