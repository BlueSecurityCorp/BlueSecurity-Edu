import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, access } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import { root } from './build.mjs';
import { join } from 'node:path';
import { verifyDeployment } from './verify-deployment.mjs';

const port = 4322;
const base = `http://127.0.0.1:${port}/BlueSecurity-Edu/`;
const routes = [['', 'home'], ['courses/', 'courses'], ['courses/infrastructure/', 'infrastructure'], ['courses/web/', 'web'], ['courses/pentest/', 'pentest'], ['courses/advanced/', 'advanced'], ['faq/', 'faq'], ['contact/', 'contact']];
const server = spawn(process.execPath, ['scripts/serve.mjs', '--production'], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
let browser;
const waitPage = (page, id) => page.waitForFunction(id => document.querySelector('main')?.dataset.page === id && !document.querySelector('main').hasAttribute('aria-busy'), id);
const click = async (page, selector, id) => { await page.locator(selector).click(); await waitPage(page, id); };
const audit = async page => {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  assert.deepEqual(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), [], `Accessibility: ${page.url()}`);
};
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Preview server did not start')), 15000);
    server.stdout.on('data', data => { if (data.toString().includes('Local:')) { clearTimeout(timer); resolve(); } });
    server.once('error', error => { clearTimeout(timer); reject(error); });
    server.once('exit', code => { clearTimeout(timer); reject(new Error(`Preview server exited: ${code}`)); });
  });
  let executablePath = process.env.BROWSER_PATH;
  if (!executablePath && process.platform === 'win32') {
    for (const path of ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe']) {
      try { await access(path); executablePath = path; break; } catch { /* Try next installed browser. */ }
    }
  }
  await verifyDeployment(base, process.env.GITHUB_SHA || 'local');
  browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  let documents = 0;
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (request.resourceType() === 'document') documents++; });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(base);
  await page.evaluate(() => { window.originalHeader = document.querySelector('.site-header'); window.sentinel = 'same-document'; });
  await page.evaluate(() => document.fonts.ready);
  const timeOrigin = await page.evaluate(() => performance.timeOrigin);
  await page.evaluate(() => window.scrollTo({ top: 180, behavior: 'instant' }));
  const savedScroll = await page.evaluate(() => scrollY);
  // Avoid Playwright's automatic scroll-to-element when testing saved scroll positions.
  await page.locator('#main-navigation [data-nav="courses"]').evaluate(link => link.click());
  await waitPage(page, 'courses');
  assert.equal(await page.locator('#main-navigation [data-nav="courses"]').getAttribute('aria-current'), 'page');
  await page.goBack();
  await waitPage(page, 'home');
  assert.ok(Math.abs(await page.evaluate(() => scrollY) - savedScroll) < 3, `Back must restore scroll: ${JSON.stringify({ expected: savedScroll, ...(await page.evaluate(() => ({ actual: scrollY, state: history.state }))) })}`);
  await page.goForward();
  await waitPage(page, 'courses');
  assert.equal(await page.evaluate(() => scrollY), 0);

  for (const id of ['infrastructure', 'web', 'pentest']) {
    const selector = id === 'infrastructure' ? `main .course-link[href$="/${id}/"]` : `.course-navigation a[href$="/${id}/"]`;
    await click(page, selector, id);
    assert.equal(await page.locator('.module-list li').count(), 4);
    assert.equal(await page.locator('#main-navigation [data-nav="courses"]').getAttribute('aria-current'), 'true');
    assert.equal(await page.locator('.course-navigation [aria-current]').getAttribute('href'), `/BlueSecurity-Edu/courses/${id}/`);
    assert.equal(await page.evaluate(() => document.activeElement.tagName), 'H1');
    const title = await page.locator('h1').textContent();
    assert.ok((await page.title()).startsWith(title));
    assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 10);
    assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute('href')).pathname, `/BlueSecurity-Edu/courses/${id}/`);
    await click(page, `main a[href$="?course=${id}"]`, 'contact');
    assert.equal(await page.locator('#inquiry-course').inputValue(), id);
    const mailto = new URL(await page.locator('#email-inquiry').getAttribute('href'));
    assert.equal(mailto.pathname, 'blue@bluesecurity.online');
    assert.ok(mailto.searchParams.get('body').includes(title));
    await page.goBack();
    await waitPage(page, id);
  }
  await click(page, '#main-navigation [data-nav="courses"]', 'courses');
  assert.equal(await page.locator('.course-card').count(), 4);
  await click(page, 'main .course-card .course-link[href$="/advanced/"]', 'advanced');
  assert.equal(await page.locator('.course-navigation [aria-current]').getAttribute('href'), '/BlueSecurity-Edu/courses/advanced/');
  assert.equal(await page.locator('.advanced-curriculum').count(), 2);
  for (const id of ['cicd-supply-chain', 'vibe-coding-security']) {
    const title = await page.locator(`#${id}-title`).textContent();
    assert.equal(await page.locator(`[aria-labelledby="${id}-title"] .module-list li`).count(), 4);
    await click(page, `main a[href$="?course=${id}"]`, 'contact');
    assert.equal(await page.locator('#inquiry-course').inputValue(), id);
    const mailto = new URL(await page.locator('#email-inquiry').getAttribute('href'));
    assert.ok(mailto.searchParams.get('subject').includes(title));
    assert.ok(mailto.searchParams.get('body').includes(title));
    await page.goBack();
    await waitPage(page, 'advanced');
  }
  await click(page, 'main a[href$="?course=consultation"]', 'contact');
  assert.equal(await page.locator('#inquiry-course').inputValue(), 'consultation');
  const consultation = await page.locator('#inquiry-course option:checked').textContent();
  assert.ok(new URL(await page.locator('#email-inquiry').getAttribute('href')).searchParams.get('body').includes(consultation));
  await click(page, '.site-header .brand', 'home');
  assert.equal(await page.locator('.course-card').count(), 4);
  await click(page, 'main .course-card .course-link[href$="/advanced/"]', 'advanced');
  await click(page, '#main-navigation [data-nav="faq"]', 'faq');
  await page.locator('summary').first().click();
  assert.equal(await page.locator('details').first().getAttribute('open'), '');
  await click(page, '#main-navigation [data-nav="contact"]', 'contact');
  await page.locator('#inquiry-course').selectOption('web');
  assert.equal(new URL(page.url()).searchParams.get('course'), 'web');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.locator('#copy-email').click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'blue@bluesecurity.online');
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('denied')) } }));
  await page.locator('#copy-email').click();
  await page.waitForFunction(() => document.querySelector('#copy-status').textContent.includes('직접 선택'));
  assert.equal(documents, 1, 'Internal links must not load a new document');
  assert.equal(await page.evaluate(() => performance.timeOrigin), timeOrigin);
  assert.equal(await page.evaluate(() => window.sentinel), 'same-document');
  assert.equal(await page.evaluate(() => window.originalHeader === document.querySelector('.site-header')), true);
  await page.reload();
  assert.equal(await page.locator('#inquiry-course').inputValue(), 'web', 'Course selection survives reload');

  await mkdir(join(root, '.artifacts'), { recursive: true });
  for (const [path, id] of routes) {
    assert.equal((await page.goto(base + path)).status(), 200, `Direct access: ${path}`);
    assert.equal((await page.reload()).status(), 200, `Refresh: ${path}`);
    await waitPage(page, id);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    const missing = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => !document.getElementById(link.hash.slice(1))).map(link => link.hash));
    assert.deepEqual(missing, [], path);
    await page.setViewportSize({ width: 1440, height: 900 });
    await audit(page);
    if (['home', 'web', 'advanced'].includes(id)) await page.screenshot({ path: join(root, `.artifacts/${id}-desktop.png`), fullPage: true });
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${id}: overflow at ${width}px`);
      if (width === 390) {
        await audit(page);
        if (['home', 'web', 'advanced'].includes(id)) await page.screenshot({ path: join(root, `.artifacts/${id}-mobile.png`), fullPage: true });
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.menu-toggle').click();
  assert.equal(await page.locator('#main-navigation').isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#main-navigation').isVisible(), false);
  await page.locator('.menu-toggle').click();
  await click(page, '#main-navigation [data-nav="courses"]', 'courses');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');

  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const plain = await noJs.newPage();
  await plain.goto(base + 'courses/');
  await plain.locator('main .course-link[href$="/web/"]').click();
  assert.equal(await plain.locator('main').getAttribute('data-page'), 'web');
  assert.equal(await plain.locator('.module-list li').count(), 4);
  await plain.locator('main a[href$="?course=web"]').click();
  assert.ok((await plain.locator('#email-inquiry').getAttribute('href')).startsWith('mailto:'));
  assert.equal(await plain.locator('#copy-email').isVisible(), false);
  assert.equal(await plain.locator('#main-navigation').isVisible(), true);
  await plain.locator('#main-navigation [data-nav="courses"]').click();
  await plain.locator('main .course-card .course-link[href$="/advanced/"]').click();
  assert.equal(await plain.locator('main').getAttribute('data-page'), 'advanced');
  assert.equal(await plain.locator('.advanced-curriculum').count(), 2);
  await plain.locator('main a[href$="?course=consultation"]').click();
  assert.equal(await plain.locator('main').getAttribute('data-page'), 'contact');
  const notFound = await plain.goto(base + 'does-not-exist/');
  assert.equal(notFound.status(), 404, 'Unknown pages must not return the home page');
  assert.equal((await plain.goto(base + 'approach/')).status(), 404, 'Removed pages must not remain in the build');

  // Out-of-order responses must not replace the most recently requested page.
  const raceContext = await browser.newContext({ reducedMotion: 'reduce' });
  const race = await raceContext.newPage();
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await race.route('**/courses/advanced/', async route => { await gate; await route.continue(); });
  await race.goto(base);
  const delayed = race.waitForResponse(response => response.url() === base + 'courses/advanced/');
  await race.locator('main .course-link[href$="/advanced/"]').click();
  await click(race, '#main-navigation [data-nav="faq"]', 'faq');
  release();
  await (await delayed).finished();
  await race.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  assert.equal(await race.locator('main').getAttribute('data-page'), 'faq');
  assert.equal(new URL(race.url()).pathname, '/BlueSecurity-Edu/faq/');

  // Fetch failures fall back to the real static page, rather than leaving a blank shell.
  const fallback = await browser.newContext({ reducedMotion: 'reduce' });
  const fallbackPage = await fallback.newPage();
  await fallbackPage.route('**/faq/', route => route.request().resourceType() === 'fetch' ? route.abort() : route.continue());
  await fallbackPage.goto(base);
  const previousOrigin = await fallbackPage.evaluate(() => performance.timeOrigin);
  await click(fallbackPage, '#main-navigation [data-nav="faq"]', 'faq');
  assert.notEqual(await fallbackPage.evaluate(() => performance.timeOrigin), previousOrigin);

  const motion = await browser.newContext({ reducedMotion: 'no-preference' });
  const motionPage = await motion.newPage();
  await motionPage.goto(base);
  const motionOrigin = await motionPage.evaluate(() => performance.timeOrigin);
  await click(motionPage, '#main-navigation [data-nav="courses"]', 'courses');
  await click(motionPage, 'main .course-link[href$="/web/"]', 'web');
  assert.equal(await motionPage.evaluate(() => performance.timeOrigin), motionOrigin);
  await motionPage.goto(base + '#curriculum-pentest');
  await waitPage(motionPage, 'pentest');
  assert.deepEqual(errors, [], 'Browser errors or failed requests');
  console.log('PASS: eight static pages, advanced course cards and curricula, course and custom inquiries, direct access and refresh, navigation without document reloads, back/forward and scroll, race handling, fetch fallback, motion, responsive layouts, accessibility, and no-JS navigation.');
} finally {
  await browser?.close();
  server.kill();
}
