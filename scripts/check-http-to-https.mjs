// Public endpoint smoke check — HTTP -> HTTPS after Cloudflare Always Use HTTPS.
import assert from 'node:assert/strict';
const get=url=>fetch(url,{redirect:'manual',signal:AbortSignal.timeout(12000),headers:{'Cache-Control':'no-cache'}});
for(const path of ['/','/resume','/projects/lagrange-interpolation']){
 const url='http://kramarenko.info'+path;
 const r=await get(url);
 const location=r.headers.get('location');
 console.log('APEX HTTP '+JSON.stringify({url,status:r.status,location}));
 assert.equal(r.status,301,'Cloudflare should issue 301 for HTTP '+path);
 assert.equal(new URL(location,url).href,'https://kramarenko.info'+path,'Bad redirect target '+path);
 const t=await fetch('https://kramarenko.info'+path,{redirect:'follow',signal:AbortSignal.timeout(12000)});
 assert.equal(t.status,200,'HTTPS destination does not load '+path);
}
for(const host of ['dev','old','lagrange']){
 const url='https://'+host+'.kramarenko.info/';
 const r=await get(url);
 console.log('SUBDOMAIN '+JSON.stringify({url,status:r.status,robots:r.headers.get('x-robots-tag')}));
 assert.equal(r.status,200,'Subdomain '+host+' is not reachable');
 if(host==='dev')assert.match(r.headers.get('x-robots-tag')||'',/noindex/i,'DEV should remain noindex');
}
const r=await get('https://www.kramarenko.info/');
const loc=r.headers.get('location');
console.log('WWW '+JSON.stringify({status:r.status,location:loc}));
if(r.status!==301||new URL(loc||'/', 'https://www.kramarenko.info/').origin!=='https://kramarenko.info')
 console.log('WWW NEEDS REDIRECT RULE — set 301 www.kramarenko.info/* to https://kramarenko.info/{path}');
else console.log('WWW 301 OK');
console.log('HTTPS SMOKE PASS');
