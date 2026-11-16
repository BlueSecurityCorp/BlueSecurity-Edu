import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';
import { company } from '../src/data/courses.mjs';
import { createPages, escape } from '../src/pages.mjs';

export const root = fileURLToPath(new URL('../', import.meta.url));

export async function build() {
  const dist = join(root, 'dist');
  const base = new URL(company.siteUrl).pathname;
  const pages = createPages(base);
  const layout = await readFile(join(root, 'src/index.html'), 'utf8');
  await mkdir(dist, { recursive: true });
  await cp(join(root, 'src/assets'), join(dist, 'assets'), { recursive: true });
  for (const page of pages) {
    const navigation = [['courses', '교육과정'], ['approach', '교육 방식'], ['faq', '자주 묻는 질문']].map(([id, label]) =>
      `<a href="${base}${id}/" data-link data-nav="${id}"${page.nav === id ? ` aria-current="${page.id === id ? 'page' : 'true'}"` : ''}>${label}</a>`).join('');
    const replacements = {
      '__PRIMARY_NAV__': navigation, '__CONTACT_CURRENT__': page.id === 'contact' ? 'aria-current="page"' : '',
      '__PAGE_ID__': page.id, '__NAV_SECTION__': page.nav, '__PAGE_TITLE__': escape(page.title),
      '__PAGE_DESCRIPTION__': escape(page.description), '__PAGE_URL__': escape(new URL(page.path, company.siteUrl).href),
      '__PAGE_CONTENT__': page.content, '__BASE_PATH__': base, '__EMAIL__': escape(company.email),
      '__WEBSITE__': escape(company.website), '__SITE_URL__': escape(company.siteUrl),
      '__YEAR__': new Date().getFullYear(), '__BUILD_REVISION__': escape(process.env.GITHUB_SHA || 'local'),
    };
    let html = layout;
    for (const [key, value] of Object.entries(replacements)) html = html.replaceAll(key, String(value));
    if (/__[A-Z_]+__/.test(html)) throw new Error(`Unresolved template placeholder in ${page.path}`);
    const directory = join(dist, page.path);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.html'), html);
  }
  await writeFile(join(dist, '.nojekyll'), '');
  await writeFile(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(page => `<url><loc>${escape(new URL(page.path, company.siteUrl).href)}</loc></url>`).join('')}</urlset>\n`);
  await writeFile(join(dist, '404.html'), `<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>페이지를 찾을 수 없습니다 | BlueSecurity EDU</title><body style="font-family:system-ui;text-align:center;padding:15vh 24px;color:#0f172a"><p>BlueSecurity EDU · 404</p><h1>페이지를 찾을 수 없습니다.</h1><p>주소가 변경되었거나 존재하지 않는 페이지입니다.</p><a href="${escape(base)}">교육과정 홈으로 이동 →</a></body></html>`);
  console.log(`Built ${pages.length} static pages → dist/`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
