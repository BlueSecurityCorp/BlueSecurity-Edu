import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';
import { company, courses } from '../src/data/courses.mjs';

export const root = fileURLToPath(new URL('../', import.meta.url));
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="#icon-${id}"></use></svg>`;

export async function build() {
  const dist = join(root, 'dist');
  await mkdir(dist, { recursive: true });
  await cp(join(root, 'src/assets'), join(dist, 'assets'), { recursive: true });
  const cards = courses.map((course) => `<article class="course-card course-${course.id}">
    <div class="course-body"><div class="course-meta"><span>${course.label}</span><span>${course.level}</span></div>
    <h3>${course.title}</h3><p>${course.description}</p><ul class="tags">${course.tags.map(tag => `<li>${tag}</li>`).join('')}</ul>
    <a class="course-link" data-course="${course.id}" href="#curriculum-${course.id}">${course.title} 자세히 보기 ${icon('arrow')}</a></div></article>`).join('\n');
  const tabs = courses.map((course) => `<a id="tab-${course.id}" class="curriculum-tab" href="#curriculum-${course.id}" data-tab="${course.id}"><span>${course.number}</span>${course.title}${icon('arrow')}</a>`).join('\n');
  const panels = courses.map((course) => `<section class="curriculum-panel" id="curriculum-${course.id}" aria-labelledby="panel-title-${course.id}">
    <div class="panel-intro"><h3 id="panel-title-${course.id}">${course.title}</h3>
    <dl class="course-facts"><div><dt>추천 대상</dt><dd>${course.audience}</dd></div><div><dt>선수 지식</dt><dd>${course.prerequisites}</dd></div><div><dt>학습 산출물</dt><dd>${course.outcome}</dd></div></dl>
    <a class="text-link" data-inquiry-course="${course.id}" href="#contact">이 과정 교육 문의 ${icon('arrow')}</a></div>
    <ol class="module-list">${course.modules.map((module, index) => `<li><span class="module-number">0${index + 1}</span><div><h4>${module.title}</h4><p>${module.description}</p></div>${icon('check')}</li>`).join('')}</ol>
    </section>`).join('\n');
  let html = await readFile(join(root, 'src/index.html'), 'utf8');
  const replacements = {
    '__COURSE_CARDS__': cards, '__CURRICULUM_TABS__': tabs, '__CURRICULUM_PANELS__': panels,
    '__COURSE_OPTIONS__': courses.map(c => `<option value="${c.id}">${c.title}</option>`).join(''),
    '__EMAIL__': escape(company.email), '__WEBSITE__': escape(company.website),
    '__SITE_URL__': escape(company.siteUrl), '__YEAR__': new Date().getFullYear(),
  };
  for (const [key, value] of Object.entries(replacements)) html = html.replaceAll(key, String(value));
  if (/__[A-Z_]+__/.test(html)) throw new Error('Unresolved template placeholder');
  await writeFile(join(dist, 'index.html'), html);
  await writeFile(join(dist, '.nojekyll'), '');
  await writeFile(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(company.siteUrl)}</loc></url></urlset>\n`);
  await writeFile(join(dist, '404.html'), `<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>페이지를 찾을 수 없습니다 | BlueSecurity EDU</title><body style="font-family:system-ui;text-align:center;padding:15vh 24px;color:#0f172a"><p>BlueSecurity EDU · 404</p><h1>페이지를 찾을 수 없습니다.</h1><p>주소가 변경되었거나 존재하지 않는 페이지입니다.</p><a href="${escape(company.siteUrl)}">교육과정 홈으로 이동 →</a></body></html>`);
  console.log('Built static website → dist/');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
