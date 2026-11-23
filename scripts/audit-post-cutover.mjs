// Read-only post-cutover acceptance: validate the apex mapping and other sites.
import assert from 'node:assert/strict';
import {resolve4,resolve6,resolveMx,resolveTxt} from 'node:dns/promises';

const apex='https://kramarenko.info';
const worker='https://myportfolio-production.kramarenko-vladyslav-92.workers.dev';
const paths=['/','/resume','/projects/local-rag-support-bot','/projects/teus-website',
 '/projects/production-workflow-integration','/projects/lagrange-interpolation','/archive',
 '/robots.txt','/sitemap.xml'];
const fetchDirect=url=>fetch(url,{redirect:'manual',headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(20000)});

for(const path of paths){
  const [production,reference]=await Promise.all([fetchDirect(apex+path),fetchDirect(worker+path)]);
  assert.equal(production.status,200,'Apex missing '+path+': '+production.status);
  assert.equal(reference.status,200,'Production Worker missing '+path);
  const a=Buffer.from(await production.arrayBuffer());
  const b=Buffer.from(await reference.arrayBuffer());
  assert.deepEqual(a,b,'Apex differs from production Worker at '+path+' (wrong worker or stale deployment)');
  assert.ok(!/noindex/i.test(production.headers.get('x-robots-tag')||''),'Apex has noindex: '+path);
}
console.log('APEX WORKER PARITY PASS: '+paths.length+' paths, byte-for-byte');

const http=await fetchDirect('http://kramarenko.info/');
assert.equal(http.status,301,'HTTP must redirect permanently to HTTPS');
assert.equal(new URL(http.headers.get('location'),'http://kramarenko.info/').href,'https://kramarenko.info/');
console.log('HTTP TO HTTPS: PASS 301 -> https://kramarenko.info/');

const www=await fetchDirect('https://www.kramarenko.info/');
const wwwStatus=www.status;
const wwwLocation=www.headers.get('location');
if([301,308].includes(wwwStatus)&&new URL(wwwLocation,'https://www.kramarenko.info/').href==='https://kramarenko.info/')
 console.log('WWW CANONICAL REDIRECT PASS: '+wwwStatus+' -> '+wwwLocation);
else if(wwwStatus===200)
 console.log('WWW CANONICAL WARNING: www returns HTTP 200, not a redirect. Create a 301 rule to apex.');
else
 console.log('WWW CANONICAL WARNING: status='+wwwStatus+' location='+wwwLocation);

for(const [url,expected] of [
 ['https://dev.kramarenko.info/',true],
 ['https://lagrange.kramarenko.info/',false]
]){
  const r=await fetchDirect(url);
  assert.equal(r.status,200,'Required subdomain stopped working: '+url+' -> '+r.status);
  const body=await r.text();
  if(expected){
    assert.match(r.headers.get('x-robots-tag')||'',/noindex/i,'DEV domain lost noindex');
    assert.ok(body.includes('noindex,nofollow'),'DEV has no noindex meta');
    console.log('DEV DOMAIN PASS: 200, noindex');
  }else{
    assert.ok(!/noindex/i.test(r.headers.get('x-robots-tag')||''),'Lagrange accidentally noindexed');
    assert.ok(body.length>500,'Lagrange page unexpectedly empty');
    console.log('LAGRANGE SUBDOMAIN PASS: 200, independently available');
  }
}

const [a4,a6,mx,txt]=await Promise.all([
 resolve4('kramarenko.info'),resolve6('kramarenko.info').catch(()=>[]),
 resolveMx('kramarenko.info'),resolveTxt('kramarenko.info')
]);
assert.ok(a4.length||a6.length,'Apex DNS unavailable');
const exchanges=mx.map(x=>x.exchange.toLowerCase().replace(/\.$/,''));
const expectedMX=['aspmx.l.google.com','alt1.aspmx.l.google.com','alt2.aspmx.l.google.com','alt3.aspmx.l.google.com','alt4.aspmx.l.google.com'];
for(const host of expectedMX)assert.ok(exchanges.includes(host),'Google Workspace MX missing: '+host);
assert.ok(txt.some(row=>row.join('').toLowerCase().startsWith('v=spf1')),'SPF TXT record missing');
console.log('DNS AND MAIL PASS: '+a4.length+' IPv4 addresses; five Google Workspace MX, SPF present');
console.log('POST CUTOVER PASS: apex, HTTP, production parity, DEV, Lagrange and Google Workspace DNS');
