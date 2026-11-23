// Read-only review of old.kramarenko.info after moving the live site.
// The archive remains on its own hostname; it should not serve the new Worker.
import assert from 'node:assert/strict';
import {resolve4,resolve6} from 'node:dns/promises';
const host='https://old.kramarenko.info';
const current='https://kramarenko.info';
const ids=["ecofuel-plus","desire-quiz","portfolio_website","prolisok","Gift-Certificates-system","moviesApi","Just-Cat","scratching-post","roller-for-granulator","tax-service","lagrange Interpolation","tic-tac-toe","cmvi"];
const get=async path=>fetch(host+path,{redirect:'manual',signal:AbortSignal.timeout(20000),headers:{'Cache-Control':'no-cache'}});
const dns=await Promise.all([
  resolve4('old.kramarenko.info').catch(e=>({error:e.code})),
  resolve6('old.kramarenko.info').catch(e=>({error:e.code}))
]);
console.log('OLD DNS '+JSON.stringify({A:dns[0],AAAA:dns[1]}));
assert.ok(dns.some(x=>Array.isArray(x)&&x.length>0),'old.kramarenko.info DNS not resolving');
const response=await get('/');
const apex=await fetch(current+'/',{redirect:'manual',signal:AbortSignal.timeout(20000)});
console.log('OLD HOME '+JSON.stringify({status:response.status,location:response.headers.get('location'),type:response.headers.get('content-type'),robots:response.headers.get('x-robots-tag')}));
assert.equal(response.status,200,'Old archive homepage unavailable');
assert.equal(apex.status,200,'Current production homepage unavailable');
const oldBody=await response.text(),prodBody=await apex.text();
const looksAngular=oldBody.includes('<app-root')||oldBody.includes('ng-version')||oldBody.includes('polyfills.')&&oldBody.includes('main.');
assert.ok(looksAngular,'Old hostname does not appear to serve historical Angular site');
assert.notEqual(oldBody,prodBody,'Old hostname serves new production homepage instead of archive');
assert.ok(!oldBody.includes('data-project-id="lagrange-web"'),'Old site unexpectedly serves new portfolio');

let redirects=[],failures=[];
for(const id of ids){
  const path='/portfolio/'+encodeURIComponent(id);
  const r=await get(path);
  if(r.status===200){
    const body=await r.text();
    if(!body.includes('<app-root')&&!body.includes('ng-version'))failures.push(path+': 200 without Angular shell');
  }else if(r.status>=300&&r.status<400)redirects.push({path,status:r.status,to:r.headers.get('location')});
  else failures.push(path+': '+r.status);
}
console.log('OLD ANGULAR ROUTES '+JSON.stringify({count:ids.length,redirects,failures}));

const header=response.headers.get('x-robots-tag')||'';
const metaRobots=oldBody.match(/<meta[^>]*name=["']robots["'][^>]*>/i)?.[0]||'';
if(/noindex/i.test(header+' '+metaRobots)){
  console.log('OLD ARCHIVE INDEXING: noindex present (recommended)');
}else{
  console.log('OLD ARCHIVE INDEXING WARNING: archive has no noindex. Add host-specific Cloudflare response header X-Robots-Tag: noindex, nofollow to old.kramarenko.info only.');
}
if(/https:\/\/www\.kramarenko\.info\//i.test(oldBody))console.log('OLD ARCHIVE METADATA WARNING: old source still references www.kramarenko.info; prefer host-specific noindex.');
assert.deepEqual(failures,[],'Old archive does not support all original project URLs');
console.log('OLD ARCHIVE PASS: homepage serves the original Angular app, '+ids.length+' historical project routes respond, current production remains separate');
