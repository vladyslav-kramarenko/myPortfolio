// Production canonical/sitemap must match Cloudflare Workers clean HTML URLs.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const origin='https://kramarenko.info';
const urls=[
  ['index.html','/'],
  ['resume.html','/resume'],
  ['projects/local-rag-support-bot.html','/projects/local-rag-support-bot'],
  ['projects/teus-website.html','/projects/teus-website'],
  ['projects/production-workflow-integration.html','/projects/production-workflow-integration'],
  ['projects/lagrange-interpolation.html','/projects/lagrange-interpolation'],
  ['archive.html','/archive'],
  ['portfolio.html','/portfolio']
];
const sitemap=await readFile('dist-production/sitemap.xml','utf8');
const robots=await readFile('dist-production/robots.txt','utf8');
assert.ok(robots.includes('Sitemap: '+origin+'/sitemap.xml'));
for(const [file,route] of urls){
  const html=await readFile('dist-production/'+file,'utf8');
  assert.ok(html.includes('<link rel="canonical" href="'+origin+route+'">'),'Noncanonical production page '+file);
  assert.ok(html.includes('<meta name="robots" content="index,follow">'),'Non-indexable production page '+file);
  assert.ok(sitemap.includes('<loc>'+origin+route+'</loc>'),'Missing clean route in sitemap: '+route);
  assert.ok(!sitemap.includes('<loc>'+origin+'/'+file+'</loc>'),'Obsolete .html route in sitemap '+file);
  for(const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)){
    const href=match[1];
    assert.ok(!href.startsWith('/resume.html')&&!href.startsWith('/projects/')||!href.endsWith('.html'),
      'Internal link uses old .html URL in '+file+': '+href);
  }
}
console.log('PRODUCTION SEO PASS: 7 canonical URLs, clean navigation and sitemap agree with Workers routing');
