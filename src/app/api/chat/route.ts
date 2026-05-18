import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { experiences } from '../../../data/experience';
import { schools } from '../../../data/education';
import { profile } from '../../../data/profile';
import { aiContext } from '../../../data/ai-context';

export const runtime = 'nodejs';

function buildSystemPrompt(): string {
  // ── Experience ──────────────────────────────────────────────────────────
  const experienceText = experiences.map(exp => {
    const start = exp.roles[exp.roles.length - 1].period.split('–')[0].trim();
    const end   = exp.roles[0].period.split('–')[1].trim();
    const rolesText = exp.roles.map(r => {
      const bullets = r.bullets.map(b => `    - ${b}`).join('\n');
      return `  Role: ${r.role} (${r.period})\n${bullets}`;
    }).join('\n');
    return `${exp.company} | ${exp.location ?? ''} | ${start} – ${end}\n${rolesText}`;
  }).join('\n\n');

  // ── Education ───────────────────────────────────────────────────────────
  const educationText = schools.map(s => {
    const degrees = s.degrees.map(d =>
      `  ${d.title} — ${d.field} (${d.period})${d.distinction ? ' [' + d.distinction + ']' : ''}`
    ).join('\n');
    return `${s.institution} | ${s.location}\n${degrees}${s.note ? '\n  Note: ' + s.note : ''}`;
  }).join('\n\n');

  // ── Certifications ──────────────────────────────────────────────────────
  const certsText = profile.certifications
    .map(c => `  - ${c.name} (${c.id})`)
    .join('\n');

  // ── Skills ──────────────────────────────────────────────────────────────
  const skillsText = Object.entries(profile.skills)
    .map(([k, v]) => `  ${k}: ${v}`)
    .join('\n');

  // ── FAQ ─────────────────────────────────────────────────────────────────
  const faqText = aiContext.faq
    .map(({ q, a }) => `Q: ${q}\nA: ${a}`)
    .join('\n\n');

  return `
You are an AI assistant on Vladyslav Kramarenko's portfolio website.
Your job: help recruiters and engineering managers learn about Vladyslav's background.

RULES:
1. Only answer questions about Vladyslav's professional background, skills, and experience.
2. Never make up facts not present in the context below. If you don't know, say so.
3. If asked something unrelated (politics, coding help, other people), politely redirect.
4. Keep answers concise and professional. Use bullet points when it aids clarity.
5. Speak in third person about Vladyslav (e.g. "He built...", "Vladyslav has...").

=== CONTACT & IDENTITY ===
Name: ${profile.name}
Title: ${profile.title}
Location: ${profile.location}
Email: ${profile.email}
LinkedIn: https://${profile.linkedin}
GitHub: https://${profile.github}

=== BACKGROUND ===
${aiContext.background.trim()}

=== WORK EXPERIENCE ===
${experienceText}

=== EDUCATION ===
${educationText}

=== CERTIFICATIONS ===
${certsText}

=== TECHNICAL SKILLS ===
${skillsText}

=== PROJECT DETAILS (beyond resume bullets) ===
${aiContext.projects.trim()}

=== OPEN TO / LOOKING FOR ===
${aiContext.openTo.trim()}

=== WORK STYLE ===
${aiContext.workStyle.trim()}

=== KEY HIGHLIGHTS ===
${aiContext.highlights.trim()}

=== FAQ ===
${faqText}
`.trim();
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Missing OpenAI API Key.' }),
      { status: 503 }
    );
  }

  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: buildSystemPrompt(),
    messages,
    maxOutputTokens: 600,
  });

  return result.toUIMessageStreamResponse();
}
