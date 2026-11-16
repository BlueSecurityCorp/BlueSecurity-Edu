import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { setTimeout } from 'node:timers/promises';

export async function verifyDeployment(siteUrl, revision) {
  const base = new URL(siteUrl);
  assert.ok(['http:', 'https:'].includes(base.protocol), 'Expected an HTTP website URL');
  const response = await fetch(base, { signal: AbortSignal.timeout(15000), cache: 'no-store' });
  assert.equal(response.status, 200, `Homepage returned HTTP ${response.status}`);
  assert.ok(response.headers.get('content-type')?.includes('text/html'), 'Homepage is not HTML');
  const html = await response.text();
  assert.ok(html.includes('BlueSecurity EDU'), 'Unexpected homepage');
  for (const course of ['infrastructure', 'web', 'pentest']) {
    assert.ok(html.includes(`id="curriculum-${course}"`), `Missing course: ${course}`);
  }
  if (revision) {
    assert.ok(html.includes(`<meta name="build-revision" content="${revision}">`), `Published site does not match revision ${revision}`);
  }
  const assets = new Set([...html.matchAll(/(?:src|href)="(\.\/assets\/[^"#]+)"/g)].map(match => match[1]));
  assert.ok(assets.size >= 5, 'Expected local CSS, JavaScript, logo, font, and favicon');
  assets.add('./assets/og-cover.png');
  assets.add('./sitemap.xml');
  await Promise.all([...assets].map(async (path) => {
    const url = new URL(path, base);
    assert.ok(url.href.startsWith(base.href), `Asset escapes the deployment path: ${url}`);
    const asset = await fetch(url, { signal: AbortSignal.timeout(15000), cache: 'no-store' });
    assert.equal(asset.status, 200, `${path} returned HTTP ${asset.status}`);
    assert.ok((await asset.arrayBuffer()).byteLength > 0, `${path} is empty`);
  }));
  console.log(`Verified ${base.href} (${revision || 'current'}): homepage and ${assets.size} assets`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.ok(process.env.SITE_URL, 'SITE_URL is required');
  for (let attempt = 1; attempt <= 12; attempt++) {
    try {
      await verifyDeployment(process.env.SITE_URL, process.env.DEPLOYED_SHA);
      break;
    } catch (error) {
      if (attempt === 12) throw error;
      console.log(`Waiting for Pages propagation (${attempt}/12): ${error.message}`);
      await setTimeout(10000);
    }
  }
}
