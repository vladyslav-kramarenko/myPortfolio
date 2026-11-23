// Date consistency regression based on user-supplied LinkedIn Experience screenshots.
// Dates are self-reported, not independently verified employment dates.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const home = await readFile('preview/index.html','utf8');
const resume = await readFile('preview/resume.html','utf8');
const samples = [
  ['home: Ideal Siding current role',home,'IT Systems &amp; Operations Specialist <span>since Mar 2026</span>'],
  ['home: Ideal Siding previous role',home,'Systems Onboarding &amp; Support Technician <span>Apr 2025 – Mar 2026</span>'],
  ['home: Ideal Siding group start',home,'<time datetime="2025-04">Apr 2025</time> – Present'],
  ['home: TEUS start and end',home,'<time datetime="2023-05">May 2023</time> – <time datetime="2025-09">Sep 2025</time>'],
  ['home: TEUS part-time status',home,'Systems &amp; Automation Engineer <span>Part-time contract</span>'],
  ['home: ZHYTLOBUD-2 group dates',home,'<time datetime="2018-11">Nov 2018</time> – <time datetime="2022-02">Feb 2022</time>'],
  ['home: ZHYTLOBUD-2 Head of IT',home,'Head of Information Technology Department <span>Dec 2020 – Feb 2022</span>'],
  ['home: ZHYTLOBUD-2 Project Manager',home,'Project Manager <span>Nov 2018 – Dec 2020</span>'],
  ['home: Just Cat',home,'<div class="background-year">Sep 2017 – Nov 2018</div>'],
  ['home: Ecofuel Trade',home,'<div class="background-year">Sep 2015 – Sep 2017</div>'],
  ['resume: Ideal Siding current role',resume,'<h3>IT Systems &amp; Operations Specialist</h3><span class="period">Mar 2026 – Present</span>'],
  ['resume: Ideal Siding previous role',resume,'<h3>Systems Onboarding &amp; Support Technician</h3><span class="period">Apr 2025 – Mar 2026</span>'],
  ['resume: TEUS',resume,'<h3>Systems &amp; Automation Engineer</h3><span class="period">May 2023 – Sep 2025</span>'],
  ['resume: ZHYTLOBUD-2 Head of IT',resume,'<h3>Head of Information Technology Department</h3><span class="period">Dec 2020 – Feb 2022 (active IT scope)</span>'],
  ['resume: ZHYTLOBUD-2 Project Manager',resume,'<h3>Project Manager</h3><span class="period">Nov 2018 – Dec 2020</span>'],
  ['resume: Just Cat',resume,'<h3>Entrepreneur — Just Cat</h3><span class="period">Sep 2017 – Nov 2018</span>'],
  ['resume: Ecofuel Trade',resume,'<h3>Co-Founder — Ecofuel Trade</h3><span class="period">Sep 2015 – Sep 2017</span>'],
  ['resume: Freelance developer',resume,'<h3>Software Developer — Freelance</h3><span class="period">Sep 2011 – Aug 2012</span>']
];
for (const [name,source,needle] of samples) {
  assert.equal(source.split(needle).length-1,1,'LinkedIn date mismatch or duplicate: '+name);
}
for (const yearOnly of ['2017–2018','2015–2017']) {
  assert.ok(!home.includes('<div class="background-year">'+yearOnly+'</div>'),'Imprecise business dates remain: '+yearOnly);
}
console.log('LinkedIn timeline consistency: PASS '+samples.length+' exact role/date checks across homepage and resume');
