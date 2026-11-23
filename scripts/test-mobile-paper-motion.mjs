// Browser regression: a real CSS mobile viewport must advance the paper
// at the hard newline inside the first statement, not only between sections.
// Uses the runner's installed Chrome and Node's native CDP WebSocket; no npm deps.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const html = await readFile('preview/index.html');
const featured = await readFile('preview/featured-projects.json');
const server = createServer((req, res) => {
  if (req.url === '/' || req.url?.startsWith('/index.html')) {
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    return res.end(html);
  }
  if (req.url?.startsWith('/featured-projects.json')) {
    res.writeHead(200, {'Content-Type':'application/json'});
    return res.end(featured);
  }
  res.writeHead(404);
  res.end();
});
server.listen(0, '127.0.0.1');
await once(server,'listening');

const chromePath = ['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/google-chrome-stable']
  .find(path => existsSync(path));
assert.ok(chromePath,'No system Chrome/Chromium available for mobile motion regression');
const chromeDir = await mkdtemp(join(tmpdir(),'paper-motion-'));
const browser = spawn(chromePath, [
  '--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
  '--no-first-run','--disable-extensions','--remote-allow-origins=*',
  '--remote-debugging-port=9227','--user-data-dir='+chromeDir,'about:blank'
], {stdio:'ignore'});

let ws;
try {
  let pageSocket;
  for (let attempt=0;attempt<100;attempt++) {
    if (browser.exitCode !== null) throw Error('Chrome exited with '+browser.exitCode);
    try {
      const response = await fetch('http://127.0.0.1:9227/json');
      const targets = await response.json();
      pageSocket = targets.find(t => t.type === 'page')?.webSocketDebuggerUrl;
      if (pageSocket) break;
    } catch {}
    await sleep(120);
  }
  assert.ok(pageSocket,'Could not connect to the headless Chrome debugging endpoint');

  ws = new WebSocket(pageSocket);
  await new Promise((resolve,reject)=>{
    ws.addEventListener('open',resolve,{once:true});
    ws.addEventListener('error',reject,{once:true});
  });
  let nextId=0;
  const pending=new Map();
  ws.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    const request=pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if(message.error)request.reject(Error(JSON.stringify(message.error)));
    else request.resolve(message.result);
  });
  function send(method,params={}) {
    return new Promise((resolve,reject)=>{
      const id=++nextId;
      pending.set(id,{resolve,reject});
      ws.send(JSON.stringify({id,method,params}));
    });
  }
  async function inspect() {
    const expression = `(() => {
      const elements=['line2','line3','line4'].map(id=>document.getElementById(id));
      const paper=document.getElementById('paper');
      if (!paper || elements.some(x=>!x)) return {ready:false};
      const cursor=document.getElementById('cursor');
      return {
        ready: document.readyState === 'complete',
        mobile: window.matchMedia('(max-width:700px)').matches,
        statement:elements[0].textContent,
        process:elements[1].textContent,
        tools:elements[2].textContent,
        lift:parseFloat(getComputedStyle(paper).getPropertyValue('--paper-lift'))||0,
        firstTop:elements[0].offsetTop,
        processTop:elements[1].offsetTop,
        toolsTop:elements[2].offsetTop,
        lineHeight:parseFloat(getComputedStyle(elements[0]).lineHeight),
        cursorHidden:cursor?.style.display==='none'
      };
    })()`;
    const response=await send('Runtime.evaluate',{expression,returnByValue:true});
    if(response.exceptionDetails)throw Error(JSON.stringify(response.exceptionDetails));
    return response.result.value;
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',{
    width:390,height:844,deviceScaleFactor:1,mobile:true
  });
  const site='http://127.0.0.1:'+server.address().port+'/';
  await send('Page.navigate',{url:site});

  const found={};
  let resetObserved=false;
  let final;
  for (let attempt=0;attempt<230;attempt++) {
    await sleep(100);
    const state=await inspect();
    if (!state?.ready) continue;
    assert.ok(state.mobile,'Expected the normal mobile CSS breakpoint');
    if (!resetObserved) {
      resetObserved=state.statement==='' && state.process==='' && state.tools==='';
      continue;
    }
    const second=state.statement.split('\n')[1];
    if (!found.second && second?.length>=2 && !state.process) found.second=state;
    if (!found.process && state.process.length>=2 && !state.tools) found.process=state;
    if (!found.tools && state.tools.length>=2) found.tools=state;
    if (state.cursorHidden && state.tools.includes('SECOND.')) {
      final=state;
      break;
    }
  }
  assert.ok(resetObserved,'Animation never began');
  assert.ok(found.second,'Did not observe the hard line-break typing phase');
  assert.ok(found.process,'Did not observe the next text block');
  assert.ok(found.tools && final,'Animation did not finish');
  assert.ok(found.second.lift >= found.second.lineHeight-1,
    'Paper failed to advance for the second statement line: '+JSON.stringify(found.second));
  assert.ok(found.process.lift > found.second.lift,
    'Paper did not feed when moving to process line');
  assert.ok(found.tools.lift > found.process.lift,
    'Paper did not feed when moving to tools line');
  assert.ok(Math.abs(final.lift-(final.toolsTop-final.firstTop)) < 2,
    'Paper feed does not match final rendered text position');
  console.log('MOBILE PAPER FEED PASS — newline: '+found.second.lift.toFixed(1)+
    'px, process: '+found.process.lift.toFixed(1)+
    'px, tools: '+final.lift.toFixed(1)+'px, rendered in Chromium at 390px');
} finally {
  ws?.close();
  browser.kill('SIGKILL');
  server.close();
  await rm(chromeDir,{recursive:true,force:true});
}
