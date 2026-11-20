import { chromium } from 'playwright-core';
import { root } from './build.mjs';
import { join } from 'node:path';
import { company } from '../src/data/courses.mjs';

const base = new URL(new URL(company.siteUrl).pathname, 'http://127.0.0.1:4321').href;

// Run with npm run preview active. Creates a static social preview from native HTML.
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : process.platform === 'win32' ? { channel: 'msedge' } : { channel: 'chrome' }),
});
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(base);
  await page.setContent(`<!doctype html><html lang="ko"><head><style>
    @font-face { font-family: Pretendard; src: url('${base}assets/PretendardVariable.woff2'); }
    * { box-sizing: border-box; } body { margin: 0; width: 1200px; height: 630px; padding: 66px 72px; background: #f8fafc; color: #0f172a; font-family: Pretendard, sans-serif; border-top: 8px solid #2563eb; }
    img { width: 220px; } h1 { font-size: 59px; font-weight: 600; line-height: 1.3; letter-spacing: -2px; margin: 64px 0 28px; } span { color: #2563eb; } p { color: #475569; font-size: 26px; }
    </style></head><body><img src="${base}assets/edublue-logo.png" alt="EduBlue"><h1>실무에 필요한 보안교육,<br><span>블루시큐리티에서 시작하세요.</span></h1><p>인프라 진단 · 웹 취약점 진단 · 모의침투</p></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('img').evaluate(image => image.decode());
  await page.screenshot({ path: join(root, 'src/assets/og-cover.png') });
  console.log('Generated src/assets/og-cover.png');
} finally { await browser.close(); }
