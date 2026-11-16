import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, access } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import { root } from './build.mjs';
import { join } from 'node:path';

const port = 4322;
const base = `http://127.0.0.1:${port}/BlueSecurity-Edu/`;
const server = spawn(process.execPath, ['scripts/serve.mjs', '--production'], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
let browser;
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
  browser = await chromium.launch(executablePath ? { executablePath, headless: true } : { channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  assert.equal((await page.goto(base)).status(), 200);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('.course-card').count(), 3);
  assert.equal(await page.locator('.curriculum-panel:visible').count(), 1);

  // Validate deployed subpath asset URLs, not just local root rendering.
  const assetUrls = await page.locator('img[src], link[rel="stylesheet"], script[src]').evaluateAll(nodes => nodes.map(node => node.src || node.href));
  for (const url of assetUrls) {
    assert.ok(url.startsWith(base), `Asset escapes project subpath: ${url}`);
    assert.equal((await page.request.get(url)).status(), 200, url);
  }
  const missingTargets = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => !document.getElementById(link.hash.slice(1))).map(link => link.hash));
  assert.deepEqual(missingTargets, []);

  for (const id of ['web', 'pentest', 'infrastructure']) {
    await page.locator(`[data-course="${id}"]`).click();
    assert.equal(await page.locator(`#curriculum-${id}`).isVisible(), true);
    assert.equal(await page.locator(`#tab-${id}`).getAttribute('aria-selected'), 'true');
    await page.locator(`[data-inquiry-course="${id}"]`).click();
    assert.equal(await page.locator('#inquiry-course').inputValue(), id);
    const mailto = new URL(await page.locator('#email-inquiry').getAttribute('href'));
    assert.equal(mailto.protocol, 'mailto:');
    assert.equal(mailto.pathname, 'blue@bluesecurity.online');
    assert.ok(mailto.searchParams.get('body').includes(await page.locator(`#panel-title-${id}`).textContent()));
  }
  await page.locator('#tab-infrastructure').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#tab-web').getAttribute('aria-selected'), 'true');
  await page.keyboard.press('End');
  assert.equal(await page.locator('#tab-pentest').getAttribute('aria-selected'), 'true');
  await page.keyboard.press('Home');
  assert.equal(await page.locator('#tab-infrastructure').getAttribute('aria-selected'), 'true');

  await page.locator('summary').first().click();
  assert.equal(await page.locator('details').first().getAttribute('open'), '');
  await page.locator('summary').first().click();
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.locator('#copy-email').click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'blue@bluesecurity.online');
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('denied')) } }));
  await page.locator('#copy-email').click();
  await page.waitForFunction(() => document.querySelector('#copy-status').textContent.includes('직접 선택'));

  for (const id of ['infrastructure', 'web', 'pentest']) {
    await page.goto(`${base}#curriculum-${id}`);
    await page.reload();
    assert.equal(await page.locator(`#curriculum-${id}`).isVisible(), true, 'Deep link must survive refresh');
  }
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  assert.deepEqual(accessibility.violations.map(v => ({ id: v.id, impact: v.impact, targets: v.nodes.map(n => n.target) })), [], 'Accessibility violations');
  await mkdir(join(root, '.artifacts'), { recursive: true });
  await page.screenshot({ path: join(root, '.artifacts/desktop.png'), fullPage: true });

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
    if (width <= 860) {
      assert.equal(await page.locator('#main-navigation').isVisible(), false);
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('#main-navigation').isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#main-navigation').isVisible(), false);
      await page.locator('.menu-toggle').click();
      await page.locator('#main-navigation a[href="#courses"]').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    }
    if (width === 390) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: join(root, '.artifacts/mobile.png'), fullPage: true });
      const mobileAccessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      assert.deepEqual(mobileAccessibility.violations.map(v => v.id), []);
    }
  }
  const noJsContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const noJsPage = await noJsContext.newPage();
  await noJsPage.goto(base);
  assert.equal(await noJsPage.locator('.curriculum-panel:visible').count(), 3);
  assert.equal(await noJsPage.locator('#main-navigation').isVisible(), true);
  assert.ok((await noJsPage.locator('#email-inquiry').getAttribute('href')).startsWith('mailto:'));
  assert.equal(await noJsPage.locator('#copy-email').isVisible(), false);
  assert.deepEqual(errors, [], 'Browser errors or failed requests');
  console.log('PASS: project subpath assets, links, course tabs, keyboard navigation, email drafts, clipboard, deep links, FAQ, five viewport widths, accessibility, and no-JS fallback.');
} finally {
  await browser?.close();
  server.kill();
}
