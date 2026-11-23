// Verify the currently deployed Cloudflare staging site in headless Chrome.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const origin='https://myportfolio.kramarenko-vladyslav-92.workers.dev';
const paths=['/','/resume.html','/projects/local-rag-support-bot.html','/projects/teus-website.html','/projects/production-workflow-integration.html'];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const pages=new Map(),issues=[];
for(const p of paths){
  const response=await fetch(origin+p,{headers:{'Cache-Control':'no-cache'}});
  assert.equal(response.status,200,'Live page missing '+p);
  assert.match(response.headers.get('content-type')||'',/text\/html/i,'Bad MIME '+p);
  assert.match(response.headers.get('x-robots-tag')||'',/noindex/i,'Missing staging X-Robots-Tag '+p);
  const body=await response.text();
  console.log('HTTP PAGE '+p+' -> '+response.url+' '+response.status);
  assert.ok(body.includes('<meta name="robots" content="noindex,nofollow">'),'Missing staging robots meta '+p);
  pages.set(p,body);
}
const home=pages.get('/');
assert.ok(home.includes('Google Maps · Local Guide'),'Latest footer absent');
assert.ok(!home.includes('Local Guide Level 8'),'Old footer remains');
assert.ok(home.includes('finalMobilePaperFeed'),'Final paper-feed correction absent');
for(const [p,html] of pages){
  for(const match of html.matchAll(/<a\b[^>]*href="([\/#][^"]*)"/g)){
    const href=match[1];
    const dest=new URL(href,origin+p);
    if(dest.pathname!=='/'&&!dest.pathname.endsWith('.html'))continue;
    const target=pages.get(dest.pathname);
    if(!target)issues.push('Missing internal page '+p+' -> '+href);
    else if(dest.hash&&!target.includes('id="'+dest.hash.slice(1)+'"'))
      issues.push('Missing internal anchor '+p+' -> '+href);
  }
}
const chrome=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/google-chrome-stable'].find(existsSync);
assert.ok(chrome,'Chromium unavailable');
const dir=await mkdtemp(join(tmpdir(),'portfolio-audit-'));
const child=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--disable-extensions','--remote-allow-origins=*','--remote-debugging-port=9234','--user-data-dir='+dir,'about:blank'],{stdio:'ignore'});
let ws;
try{
  let socketUrl;
  for(let a=0;a<100;a++){
    if(child.exitCode!==null)throw Error('Browser exited '+child.exitCode);
    try{
      const targets=await (await fetch('http://127.0.0.1:9234/json')).json();
      socketUrl=targets.find(t=>t.type==='page')?.webSocketDebuggerUrl;
      if(socketUrl)break;
    }catch{}
    await sleep(100);
  }
  assert.ok(socketUrl,'No CDP websocket');
  ws=new WebSocket(socketUrl);
  await new Promise((resolve,reject)=>{
    ws.addEventListener('open',resolve,{once:true});
    ws.addEventListener('error',reject,{once:true});
  });
  let n=0;
  const pending=new Map();
  ws.addEventListener('message',e=>{
    const event=JSON.parse(e.data),p=pending.get(event.id);
    if(!p)return;
    pending.delete(event.id);
    event.error?p.reject(Error(JSON.stringify(event.error))):p.resolve(event.result);
  });
  const cmd=(method,params={})=>new Promise((resolve,reject)=>{
    const id=++n;
    pending.set(id,{resolve,reject});
    ws.send(JSON.stringify({id,method,params}));
  });
  const evalJS=async expression=>{
    const result=await cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const ready=async path=>{
    let last;
    for(let i=0;i<120;i++){
      const v=await evalJS('({path:location.pathname,ready:document.readyState,url:location.href})');
      last=v;
      const clean=s=>s.replace(/\.html$/,'').replace(/\/$/,'')||'/';
      if(clean(v.path)===clean(path)&&v.ready==='complete')return;
      await sleep(100);
    }
    throw Error('Page load timed out: '+path+', last observed '+JSON.stringify(last));
  };
  await cmd('Page.enable');
  await cmd('Runtime.enable');
  const views=[];
  for(const [width,height,theme,mobile] of [
    [390,844,'dark',true],[390,844,'light',true],
    [900,900,'dark',false],[1440,900,'dark',false],[1440,900,'light',false]
  ]){
    await cmd('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
    await cmd('Emulation.setEmulatedMedia',{features:[
      {name:'prefers-color-scheme',value:theme},
      {name:'prefers-reduced-motion',value:'reduce'}
    ]});
    await cmd('Page.navigate',{url:origin+'/'});
    await ready('/');
    await sleep(400);
    const result=await evalJS('(() => {const box=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),bottom:Math.round(r.bottom)};};return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,bg:getComputedStyle(document.documentElement).getPropertyValue("--bg").trim(),theme:matchMedia("(prefers-color-scheme: light)").matches?"light":"dark",paper:box(".paper"),machine:box(".machine"),location:box(".location"),h1:box("h1"),cards:document.querySelectorAll("#featuredProjects .project-card").length,menuHidden:document.getElementById("siteMenu").hidden};})()');
    if(result.scrollWidth>width+3)issues.push('Horizontal overflow '+width+' '+theme+': '+result.scrollWidth);
    if(result.cards!==2)issues.push('Featured cards '+width+' '+theme+': '+result.cards);
    if(!result.paper||!result.machine||!result.h1)issues.push('Missing hero element '+width);
    if(result.location&&result.paper&&result.paper.y<result.location.bottom-2&&width<=900)
      issues.push('Paper overlaps location at '+width+' '+theme);
    views.push(result);
    console.log('VIEWPORT '+JSON.stringify(result));
    if(width===390&&theme==='dark'){
      await evalJS('document.getElementById("menuTrigger").click()');
      const state=await evalJS('({expanded:document.getElementById("menuTrigger").getAttribute("aria-expanded"),hidden:document.getElementById("siteMenu").hidden})');
      if(state.expanded!=='true'||state.hidden)issues.push('Mobile menu fails to open');
      await evalJS('document.getElementById("menuTrigger").click()');
    }
  }
  if(views[0].bg===views[1].bg)issues.push('Mobile theme does not change');
  if(views[3].bg===views[4].bg)issues.push('Desktop theme does not change');
  await cmd('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  for(const p of paths.slice(1)){
    await cmd('Page.navigate',{url:origin+p});
    await ready(p);
    const m=await evalJS('({title:document.title,h1:document.querySelector("h1")?.textContent,scrollWidth:document.documentElement.scrollWidth,width:innerWidth,links:document.querySelectorAll("a[href]").length,print:!!document.getElementById("printResume")})');
    console.log('PAGE '+p+' '+JSON.stringify(m));
    if(m.scrollWidth>m.width+3)issues.push('Horizontal overflow '+p);
    if(!m.h1||m.links<2)issues.push('Missing content '+p);
    if(p==='/resume.html'&&!m.print)issues.push('Print control missing');
  }
  assert.deepEqual(issues,[],'Live audit issues');
  console.log('LIVE SITE AUDIT PASS: five pages, five viewport/theme states, links and menu.');
}finally{
  ws?.close();
  child.kill('SIGKILL');
  await rm(dir,{recursive:true,force:true});
}
