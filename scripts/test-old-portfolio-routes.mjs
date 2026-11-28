// Historical route mapping is grounded in original Angular portfolio IDs.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {legacyRedirects} from './legacy-static.mjs';
const items=JSON.parse(await readFile('assets/data/portfolioItems.json','utf8'));
const archive=await readFile('preview/archive.html','utf8');
const site=await readFile('preview/index.html','utf8');
const redirectMap=new Map(legacyRedirects.map(line=>{
  const parts=line.split(/\s+/);
  assert.equal(parts.length,3,'Malformed legacy redirect '+line);
  assert.equal(parts[2],'301');
  return [parts[0],parts[1]];
}));
assert.equal(items.length,13);
for(const item of items){
  const from='/portfolio/'+encodeURIComponent(item.id);
  const target=redirectMap.get(from);
  assert.ok(target,'Missing original portfolio route: '+from);
  if(item.id==='portfolio_website')assert.equal(target,'/');
  else if(item.id==='lagrange Interpolation')assert.equal(target,'/projects/lagrange-interpolation');
  else {
    assert.equal(target,'/archive#'+item.id);
    assert.ok(archive.includes('id="'+item.id+'"'),'Missing archived project section '+item.id);
  }
}
assert.ok(site.includes('href="/portfolio"'),'Project library is not linked from home');
assert.equal(redirectMap.get('/Vladyslav-Kramarenko-Resume.pdf'),'/resume');
console.log('ANGULAR ROUTES PASS: 13 historical project URLs and retired resume path mapped');
