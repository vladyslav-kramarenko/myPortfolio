// Build an isolated, non-indexable staging package with the same legacy files
// and redirects as production. Never rewrite preview/ or public DNS.
import { cp, readFile, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { copyLegacyAssets, verifyLegacyAssets, writeLegacyRedirects } from './legacy-static.mjs';

const source = resolve('preview');
const destination = resolve('dist-staging');
await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });
await copyLegacyAssets(destination);
await writeLegacyRedirects(destination);
const count = await verifyLegacyAssets(destination);

const headers = await readFile(join(destination, '_headers'), 'utf8');
if (!/X-Robots-Tag:\s*noindex/i.test(headers)) {
  throw new Error('Staging must send noindex headers');
}
for (const page of [
  'index.html', 'resume.html', 'projects/local-rag-support-bot.html',
  'projects/teus-website.html', 'projects/production-workflow-integration.html'
]) {
  const html = await readFile(join(destination, ...page.split('/')), 'utf8');
  if (!html.includes('<meta name="robots" content="noindex,nofollow">')) {
    throw new Error('Missing staging noindex: ' + page);
  }
}
console.log('Staging package ready: ' + count + ' exact legacy public file paths preserved');
