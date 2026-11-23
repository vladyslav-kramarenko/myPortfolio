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
for(const path of ['/', '/resume', '/projects/lagrange-interpolation?ref=check&v=1']){
 const from='https://www.kramarenko.info'+path;
 const r=await get(from);
 const loc=r.headers.get('location');
 console.log('WWW '+JSON.stringify({from,status:r.status,location:loc}));
 assert.equal(r.status,301,'Expected permanent www to apex redirect for '+path);
 assert.equal(new URL(loc,from).href,'https://kramarenko.info'+path,
   'WWW redirect must preserve path and query: '+path);
 const end=await fetch(from,{redirect:'follow',signal:AbortSignal.timeout(12000)});
 assert.equal(end.status,200,'Redirected www destination must load: '+path);
 assert.equal(end.url,'https://kramarenko.info'+path,
   'WWW request ended at an unexpected URL: '+path);
}
console.log('HTTPS AND WWW REDIRECT PASS');
