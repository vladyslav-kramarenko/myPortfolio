// Regression smoke test for legacy public URLs.
// Without TEST_BASE_URL, exercise both built packages using a local HTTP fixture.
// With TEST_BASE_URL, probe the real staging Worker without changing production.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
import { once } from 'node:events';

const manifest = JSON.parse(await readFile(new URL('./legacy-url-manifest.json', import.meta.url), 'utf8')).files;
const legacyPaths = Object.keys(manifest);
const gitSha = data => createHash('sha1').update('blob ' + data.length + '\0').update(data).digest('hex');
const typeMap = {'.pdf':'application/pdf','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.json':'application/json','.ico':'image/'};
const redirects = (await readFile(new URL('../preview/_redirects', import.meta.url), 'utf8'))
  .trim().split(/\r?\n/).filter(Boolean).map(line => {
    const items=line.trim().split(/\s+/);
    assert.equal(items.length, 3, 'Malformed redirect: '+line);
    assert.equal(items[2], '301');
    return [items[0],items[1]];
  });
assert.equal(new Set(redirects.map(x=>x[0])).size,redirects.length,'Duplicate redirects');

async function serveStatic(directory) {
  const server = createServer(async (req,res) => {
    const pathname = decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    const redir = redirects.find(([old])=>old===pathname);
    if(redir){
      res.writeHead(301,{'Location':redir[1]});
      return res.end();
    }
    const path = pathname==='/'?'index.html':pathname.slice(1);
    if(path.split('/').some(s=>s==='..')) {res.writeHead(400);return res.end();}
    const filename=join(directory,...path.split('/'));
    try{
      const file=await readFile(filename);
      const type=typeMap[extname(path).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200,{'Content-Type':type});
      res.end(file);
    }catch{
      res.writeHead(404);res.end('Not Found');
    }
  });
  server.listen(0,'127.0.0.1');
  await once(server,'listening');
  return {server,url:'http://127.0.0.1:'+server.address().port};
}

async function testSite(baseURL,mode) {
  let checks=0;
  const assetRedirects=[];
  for(const path of legacyPaths) {
    const url=new URL('/'+path,baseURL);
    let r=await fetch(url,{redirect:'manual'});
    if(r.status>=300 && r.status<400) {
      const redirect=new URL(r.headers.get('location'),url);
      assert.equal(redirect.origin,url.origin,'Legacy file redirected away from the site: '+url+' -> '+redirect);
      assetRedirects.push({status:r.status,from:url.pathname,to:redirect.pathname});
      r=await fetch(redirect,{redirect:'follow'});
    }
    assert.equal(r.status,200,'Expected available legacy file: '+url+' got '+r.status);
    if(typeMap[extname(path).toLowerCase()] && !path.endsWith('.ico')){
      const mime=r.headers.get('content-type')||'';
      assert.ok(mime.startsWith(typeMap[extname(path).toLowerCase()]),'Wrong MIME '+url+': '+mime);
    }
    const bytes=Buffer.from(await r.arrayBuffer());
    assert.equal(gitSha(bytes),manifest[path],'Original bytes changed at '+url);
    checks++;
  }
  for(const [from,to] of redirects) {
    const url=new URL(from,baseURL);
    const r=await fetch(url,{redirect:'manual'});
    assert.equal(r.status,301,'Expected 301: '+url+' got '+r.status);
    assert.equal(new URL(r.headers.get('location'),url).href,new URL(to,url).href,'Wrong 301 Location '+url);
    checks++;
  }
  const home=await fetch(new URL('/',baseURL));
  assert.equal(home.status,200);
  const html=await home.text();
  assert.ok(mode==='staging'?html.includes('noindex,nofollow'):html.includes('index,follow'),'SEO mode mismatch: '+mode);
  checks++;
  const unknown=await fetch(new URL('/__legacy-url-migration-404-check__',baseURL));
  assert.equal(unknown.status,404,'Unknown URL should return a real 404');
  checks++;
  console.log(mode+': PASS '+checks+' HTTP checks ('+legacyPaths.length+' exact files, '+redirects.length+' redirects, home + real 404)'+(assetRedirects.length?' | asset URL normalizations: '+JSON.stringify(assetRedirects):''));
}
if(process.env.TEST_BASE_URL){
  await testSite(process.env.TEST_BASE_URL,'staging');
}else{
  for(const [dir,mode] of [['preview','staging'],['dist-staging','staging'],['dist-production','production']]){
    const local=await serveStatic(resolve(dir));
    try {await testSite(local.url,mode);}
    finally {local.server.close(); await once(local.server,'close');}
  }
}
