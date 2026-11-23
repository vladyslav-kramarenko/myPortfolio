// Preserve the public file URLs of the previous Angular and static portfolio.
// Keep staging and production on the same asset/redirect inventory.
import { createHash } from 'node:crypto';
import { cp, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const directories = ['img', 'custom', 'assets'];
const files = ['main.js', 'style.scss', 'favicon.ico'];

export const legacyRedirects = [
  '/home / 301',
  '/justCatPackage.html /#background 301',
  '/justCatLogo.html /#background 301',
  '/tax_service.html https://github.com/vladyslav-kramarenko/taxService 301',
  '/inner-page.html /#projects 301',
  '/img/profile-photo.jpg /img/profile-photo.webp 301',
  '/img/logo/JustCatLogo.png /img/logo/JustCatLogo.webp 301',
  '/img/portfolio/Just_cat_3.png /img/portfolio/Just_cat_3_full.png 301',
  '/img/portfolio/Just_cat_5.png /img/portfolio/Just_cat_5_full.png 301',
  '/img/portfolio/tax_service/tax_service_reports.png /img/portfolio/tax_service/tax_service_reports.webp 301',
  '/portfolio/ecofuel-plus /archive#ecofuel-plus 301',
  '/portfolio/desire-quiz /archive#desire-quiz 301',
  '/portfolio/portfolio_website / 301',
  '/portfolio/prolisok /archive#prolisok 301',
  '/portfolio/Gift-Certificates-system /archive#Gift-Certificates-system 301',
  '/portfolio/moviesApi /archive#moviesApi 301',
  '/portfolio/Just-Cat /archive#Just-Cat 301',
  '/portfolio/scratching-post /archive#scratching-post 301',
  '/portfolio/roller-for-granulator /archive#roller-for-granulator 301',
  '/portfolio/tax-service /archive#tax-service 301',
  '/portfolio/lagrange%20Interpolation /projects/lagrange-interpolation 301',
  '/portfolio/tic-tac-toe /archive#tic-tac-toe 301',
  '/portfolio/cmvi /archive#cmvi 301',
  '/Vladyslav-Kramarenko-Resume.pdf /resume 301'
];

export async function copyLegacyAssets(destination) {
  for (const directory of directories) {
    await cp(resolve(directory), join(destination, directory), { recursive: true });
  }
  for (const file of files) {
    await cp(resolve(file), join(destination, file));
  }
}

export async function writeLegacyRedirects(destination) {
  await writeFile(join(destination, '_redirects'), legacyRedirects.join('\n') + '\n');
}

async function listRelativeFiles(folder, prefix = '') {
  const result = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const name = prefix ? prefix + '/' + entry.name : entry.name;
    if (entry.isDirectory()) result.push(...await listRelativeFiles(join(folder, entry.name), name));
    else result.push(name);
  }
  return result;
}

const sha256 = data => createHash('sha256').update(data).digest('hex');
const gitBlobHash = data => createHash('sha1').update('blob ' + data.length + '\0').update(data).digest('hex');
const manifest = JSON.parse(await readFile(new URL('./legacy-url-manifest.json', import.meta.url), 'utf8')).files;
export async function verifyLegacyAssets(destination) {
  const paths = [...files];
  for (const directory of directories) {
    for (const rel of await listRelativeFiles(resolve(directory))) {
      paths.push(directory + '/' + rel);
    }
  }
  const published = new Set(paths);
  for (const path of Object.keys(manifest)) {
    if (!published.has(path)) {
      throw new Error('Baseline legacy public URL removed from source: /' + path);
    }
  }
  for (const path of paths) {
    const src = resolve(path);
    const dest = join(destination, ...path.split('/'));
    let actual;
    try { actual = await stat(dest); }
    catch { throw new Error('Missing legacy public file: /' + path); }
    const expected = await stat(src);
    if (!actual.isFile() || actual.size !== expected.size) {
      throw new Error('Legacy public file size mismatch: /' + path);
    }
    const original = await readFile(src);
    const deployed = await readFile(dest);
    if (sha256(original) !== sha256(deployed)) {
      throw new Error('Legacy public file checksum mismatch: /' + path);
    }
    if (manifest[path] && gitBlobHash(original) !== manifest[path]) {
      throw new Error('Baseline legacy public file changed: /' + path);
    }
  }
  return paths.length;
}
