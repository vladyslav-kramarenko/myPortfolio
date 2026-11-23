// Read-only verification of the DEV custom domain before attaching production.
import assert from 'node:assert/strict';
import {resolve4,resolve6} from 'node:dns/promises';

const base='https://dev.kramarenko.info';
const original='https://myportfolio.kramarenko-vladyslav-92.workers.dev';
const paths=['/','/resume','/projects/local-rag-support-bot',
'/projects/teus-website','/projects/production-workflow-integration',
'/projects/lagrange-interpolation','/archive'];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const request=async url=>fetch(url,{
  redirect:'manual',signal:AbortSignal.timeout(16000),headers:{'Cache-Control':'no-cache'}
});
let dns;
for(let attempt=0;attempt<40;attempt++){
  try{
    const [a,aaaa]=await Promise.all([
      resolve4('dev.kramarenko.info').catch(()=>[]),
      resolve6('dev.kramarenko.info').catch(()=>[])
    ]);
    if(a.length||aaaa.length){dns={A:a,AAAA:aaaa};break;}
  }catch{}
  await sleep(2000);
}
assert.ok(dns,'DEV custom domain DNS has no A/AAAA answers');
console.log('DEV DOMAIN DNS '+JSON.stringify(dns));
let ready=false;
for(let attempt=0;attempt<35;attempt++){
  try {
    const r=await request(base+'/?preflight='+attempt);
    if(r.status===200 && /noindex/i.test(r.headers.get('x-robots-tag')||'')){
      const s=await r.text();
      if(s.includes('<meta name="robots" content="noindex,nofollow">')&&s.includes('data-project-id="lagrange-web"')){
        ready=true; break;
      }
    }
  }catch{}
  await sleep(2000);
}
assert.ok(ready,'DEV domain did not serve latest non-indexable portfolio within propagation window');
let checks=0;
for(const path of paths){
  const [r,ref]=await Promise.all([request(base+path),request(original+path)]);
  assert.equal(r.status,200,'DEV page not reachable '+path+' -> '+r.status);
  assert.equal(ref.status,200,'Original Worker preview not reachable '+path);
  const robots=r.headers.get('x-robots-tag')||'';
  assert.match(robots,/noindex/i,'DEV indexed by robots headers: '+path);
  assert.match(robots,/nofollow/i,'DEV nofollow policy missing: '+path);
  const body=await r.text();
  const expected=await ref.text();
  assert.ok(body.includes('<meta name="robots" content="noindex,nofollow">'),'DEV meta robots missing: '+path);
  assert.ok(!body.includes('<meta name="robots" content="index,follow">'),'Production meta leaked onto DEV: '+path);
  assert.equal(body,expected,'DEV domain does not match its staging Worker: '+path);
  checks++;
}
const hrefs=[
  '/assets/documents/2024_DEV_Kramarenko_Vladyslav.pdf',
  '/assets/data/portfolioItems.json',
  '/favicon.ico'
];
for(const p of hrefs){
  const r=await request(base+p);
  assert.equal(r.status,200,'Historical DEV file missing: '+p);
  checks++;
}
const unknown=await request(base+'/__dev-nonexistent-route-check__');
assert.equal(unknown.status,404,'Unknown DEV URL should be a 404');
checks++;
console.log('DEV CUSTOM DOMAIN PASS: '+checks+' checks; 7 pages match staging Worker, noindex/nofollow enforced, 3 old files, 404');
