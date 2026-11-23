// Package the reviewed static preview for an indexable production deployment.
// This never modifies preview/ or the currently configured staging Worker.
import { cp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { copyLegacyAssets, verifyLegacyAssets, writeLegacyRedirects } from './legacy-static.mjs';

const source = resolve('preview');
const destination = resolve('dist-production');
const pages = [
  'index.html',
  'resume.html',
  'projects/local-rag-support-bot.html',
  'projects/teus-website.html',
  'projects/production-workflow-integration.html'
];
const originInput = process.env.SITE_ORIGIN || 'https://www.kramarenko.info';
const originURL = new URL(originInput);
if (originURL.protocol !== 'https:' || originURL.pathname !== '/' || originURL.search || originURL.hash) {
  throw new Error('SITE_ORIGIN must be an HTTPS origin, e.g. https://www.kramarenko.info');
}
const origin = originURL.origin;

await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });

// Serve legacy /img, /custom, /assets and /favicon.ico at their exact paths.
await copyLegacyAssets(destination);

// The old PDF is an unreviewed draft and can become stale. The print-ready
// HTML is now the authoritative resume: browser Print -> Save as PDF.
await rm(join(destination, 'Vladyslav-Kramarenko-Resume.pdf'), { force: true });

for (const page of pages) {
  const pathname = page === 'index.html' ? '/' : '/' + page;
  const canonical = origin + pathname;
  const filename = join(destination, ...page.split('/'));
  let html = await readFile(filename, 'utf8');
  const marker = '<meta name="robots" content="noindex,nofollow">';
  if (html.split(marker).length !== 2) {
    throw new Error('Expected exactly one staging noindex tag: ' + page);
  }
  html = html.replace(marker, '<meta name="robots" content="index,follow">');
  if (!html.includes('</head>') || html.includes('rel="canonical"')) {
    throw new Error('Missing head or existing canonical in ' + page);
  }
  html = html.replace('</head>', `<link rel="canonical" href="${canonical}">\n</head>`);
  if (page === 'index.html') {
    html = html.replace('</head>', `<meta property="og:url" content="${canonical}">\n</head>`);
  }
  if (html.includes('/Vladyslav-Kramarenko-Resume.pdf')) {
    throw new Error('Obsolete PDF hyperlink remains in ' + page);
  }
  await writeFile(filename, html, 'utf8');
}

// Do not inherit staging's X-Robots-Tag: noindex.
await writeFile(join(destination, '_headers'),
`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n`);
await writeFile(join(destination, 'robots.txt'),
`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await writeLegacyRedirects(destination);
const escapeXml = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
await writeFile(join(destination, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages.map(page => {
    const url = origin + (page === 'index.html' ? '/' : '/' + page);
    return '  <url><loc>' + escapeXml(url) + '</loc></url>\n';
  }).join('') + '</urlset>\n'
);

async function listFiles(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const name = join(folder, entry.name);
    if (entry.isDirectory()) result.push(...await listFiles(name));
    else result.push(relative(destination, name).split(sep).join('/'));
  }
  return result;
}


const legacyCount = await verifyLegacyAssets(destination);
const allFiles = await listFiles(destination);

for (const file of allFiles.filter(p => p.endsWith('.html'))) {
  const data = await readFile(join(destination, ...file.split('/')), 'utf8');
  if (/noindex|nofollow|Vladyslav-Kramarenko-Resume\.pdf/.test(data)) {
    throw new Error('Found staging/obsolete content in production: ' + file);
  }
}
const headers = await readFile(join(destination, '_headers'), 'utf8');
if (/noindex|nofollow/.test(headers)) throw new Error('Staging headers leaked into production');

const publishedPages = new Map();
for (const page of pages) {
  const filename = join(destination, ...page.split('/'));
  publishedPages.set('/' + page, await readFile(filename, 'utf8'));
}
for (const [page, html] of publishedPages) {
  const localLinks = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)]
    .map(match => match[1]).filter(link => link.startsWith('/') || link.startsWith('#'));
  for (const href of localLinks) {
    const [path, anchor] = href.split('#');
    const target = !path ? page : (path === '/' ? '/index.html' : path);
    const document = publishedPages.get(target);
    if (!document) throw new Error('Broken internal link: ' + page + ' -> ' + href);
    if (anchor && ![...document.matchAll(/\bid="([^"]+)"/g)].some(match => match[1] === anchor)) {
      throw new Error('Broken anchor: ' + page + ' -> ' + href);
    }
  }
}

console.log(`Production package ready: ${allFiles.length} files, ${pages.length} pages, canonical origin ${origin}; ${legacyCount} legacy paths from /img, /custom and /assets preserved`);
