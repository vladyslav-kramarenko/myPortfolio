// Read-only pre-cutover snapshot: DNS and HTTP routes. Do not write Cloudflare settings.
import {resolve4,resolve6,resolveCname,resolveMx,resolveNs,resolveTxt} from 'node:dns/promises';

const lookup=async(host,kind,fn)=>{
  try {return await fn(host);}
  catch(e) {return {unavailable:e.code||String(e)};}
};
const probes=['kramarenko.info','www.kramarenko.info','lagrange.kramarenko.info'];
for(const host of probes){
  const [a,aaaa,cname]=await Promise.all([
    lookup(host,'A',resolve4),lookup(host,'AAAA',resolve6),lookup(host,'CNAME',resolveCname)
  ]);
  console.log('DNS HOST '+host+' '+JSON.stringify({A:a,AAAA:aaaa,CNAME:cname}));
}
const [mx,ns,spf,dmarc]=await Promise.all([
  lookup('kramarenko.info','MX',resolveMx),
  lookup('kramarenko.info','NS',resolveNs),
  lookup('kramarenko.info','TXT',resolveTxt),
  lookup('_dmarc.kramarenko.info','TXT',resolveTxt)
]);
console.log('DNS MAIL '+JSON.stringify({
  mx: Array.isArray(mx)?mx.map(x=>({exchange:x.exchange,priority:x.priority})):mx,
  nameservers:ns,
  spfPresent: Array.isArray(spf)&&spf.some(x=>x.join('').toLowerCase().startsWith('v=spf1')),
  dmarcPresent: Array.isArray(dmarc)&&dmarc.some(x=>x.join('').toLowerCase().startsWith('v=dmarc1'))
}));
for(const url of [
 'http://kramarenko.info/',
 'https://kramarenko.info/',
 'https://www.kramarenko.info/',
 'https://lagrange.kramarenko.info/',
 'https://myportfolio-production.kramarenko-vladyslav-92.workers.dev/'
]){
  try{
    const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(15000)});
    console.log('HTTP HOST '+JSON.stringify({url,status:r.status,location:r.headers.get('location'),contentType:r.headers.get('content-type'),xRobotsTag:r.headers.get('x-robots-tag')}));
  }catch(e){console.log('HTTP HOST '+JSON.stringify({url,error:String(e)}));}
}
console.log('DNS SNAPSHOT COMPLETE — verify any Cloudflare dashboard changes against these public records before cutover');
