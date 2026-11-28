// Read-only deployment acceptance test. Probe PROD without changing DNS or the Worker.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {extname} from 'node:path';
import {legacyRedirects} from './legacy-static.mjs';

const worker=process.env.AUDIT_BASE_URL || "https://myportfolio-production.kramarenko-vladyslav-92.workers.dev";
const canonicalOrigin='https://kramarenko.info';
const pages=["/","/resume","/projects/local-rag-support-bot","/projects/teus-website","/projects/production-workflow-integration","/projects/lagrange-interpolation","/archive"];
const manifest=JSON.parse(await readFile(new URL('./legacy-url-manifest.json',import.meta.url),'utf8')).files;
const get=async path=>fetch(new URL(path,worker),{redirect:'manual',signal:AbortSignal.timeout(20000),headers:{'Cache-Control':'no-cache'}});
const sha1=data=>createHash('sha1').update('blob '+data.length+'\0').update(data).digest('hex');
const types={'.pdf':'application/pdf','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.json':'application/json'};
let checks=0;
const html=new Map();
for(const path of pages){
  let response=await get(path);
  assert.equal(response.status,200,'Production HTML '+path+' returned '+response.status);
  assert.match(response.headers.get('content-type')||'',/text\/html/,'Bad HTML MIME at '+path);
  assert.ok(!/noindex|nofollow/i.test(response.headers.get('x-robots-tag')||''),'Staging robots header on '+path);
  const body=await response.text();
  assert.match(body,/<meta name="robots" content="index,follow">/,'Production robots meta missing '+path);
  assert.ok(!body.includes('noindex,nofollow'),'Staging page published on '+path);
  const expected='<link rel="canonical" href="'+canonicalOrigin+path+'">';
  assert.ok(body.includes(expected),'Production canonical mismatch '+path);
  html.set(path,body);
  checks++;
}
const home=html.get('/');
assert.ok(html.get('/projects/lagrange-interpolation').includes('github.com/vladyslav-kramarenko/LagrangeWeb'),'Lagrange project page missing on live production');
assert.ok(home.includes('href="tel:+12369929229"'),'Public phone contact missing');
assert.ok(home.includes('href="/archive"'),'Historical archive link missing');
for(const [path,body] of html){
  for(const m of body.matchAll(/<a\b[^>]*href="([\/#][^"]*)"/g)){
    const url=new URL(m[1],worker+path);
    if(!pages.includes(url.pathname))continue;
    const target=html.get(url.pathname);
    assert.ok(target,'Link target absent: '+path+' -> '+m[1]);
    if(url.hash)assert.ok(target.includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'),'Broken anchor '+m[1]);
  }
}
const sitemap=await get('/sitemap.xml');
assert.equal(sitemap.status,200,'No production sitemap');
const sm=await sitemap.text();
for(const path of pages)assert.ok(sm.includes('<loc>'+canonicalOrigin+path+'</loc>'),'Missing sitemap page '+path);
assert.ok(!sm.includes('.html</loc>'),'Sitemap contains obsolete .html URLs');checks++;
const robots=await get('/robots.txt');
assert.equal(robots.status,200,'No robots.txt');
const rt=await robots.text();
assert.ok(rt.includes('Allow: /'),'robots.txt does not allow search');
assert.ok(rt.includes('Sitemap: '+canonicalOrigin+'/sitemap.xml'),'Wrong sitemap origin');
assert.ok(!/Disallow:\s*\//i.test(rt),'robots.txt blocks site');checks++;
const notices=[];
for(const [path,gitHash] of Object.entries(manifest)){
  const orig=new URL('/'+path,worker);
  let resp=await get('/'+path);
  if(resp.status>=300&&resp.status<400){
    const next=new URL(resp.headers.get('location'),orig);
    assert.equal(next.origin,orig.origin,'Legacy file redirected off-site: '+orig);
    notices.push(resp.status+' '+orig.pathname+' -> '+next.pathname);
    resp=await fetch(next,{redirect:'follow',signal:AbortSignal.timeout(20000)});
  }
  assert.equal(resp.status,200,'Missing production legacy file '+path+' got '+resp.status);
  const mime=types[extname(path).toLowerCase()];
  if(mime)assert.ok((resp.headers.get('content-type')||'').startsWith(mime),'Wrong MIME for '+path);
  const bytes=Buffer.from(await resp.arrayBuffer());
  assert.equal(sha1(bytes),gitHash,'Changed contents of legacy file '+path);
  checks++;
}
for(const line of legacyRedirects){
  const [from,to,code]=line.trim().split(/\s+/);
  assert.equal(code,'301');
  const response=await get(from);
  assert.equal(response.status,301,'Legacy redirect '+from+' returned '+response.status);
  const actual=new URL(response.headers.get('location'),new URL(from,worker));
  const expected=new URL(to,new URL(from,worker));
  assert.equal(actual.href,expected.href,'Wrong legacy redirect '+from);
  checks++;
}
const unknown=await get('/__production-nonexistent-url-check__');
assert.equal(unknown.status,404,'Missing URL should be a 404');checks++;
console.log('PRODUCTION HTTP PASS: '+checks+' checks — '+pages.length+' indexable HTML pages, 173 SHA-verified assets, '+legacyRedirects.length+' permanent redirects, sitemap, robots and 404');
if(notices.length)console.log('EXPECTED URL ENCODING NORMALIZATION: '+JSON.stringify(notices));
