import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { setTimeout } from 'node:timers/promises';

export async function verifyDeployment(siteUrl, revision) {
  const base = new URL(siteUrl);
  assert.ok(['http:', 'https:'].includes(base.protocol), 'Expected an HTTP website URL');
  const routes = [['', 'home'], ['courses/', 'courses'], ['courses/infrastructure/', 'infrastructure'], ['courses/web/', 'web'], ['courses/pentest/', 'pentest'], ['courses/advanced/', 'advanced'], ['approach/', 'approach'], ['faq/', 'faq'], ['contact/', 'contact']];
  const assets = new Set();
  const titles = new Set();
  await Promise.all(routes.map(async ([path, id]) => {
    const url = new URL(path, base);
    const response = await fetch(url, { signal: AbortSignal.timeout(15000), cache: 'no-store' });
    assert.equal(response.status, 200, `${path || '/'} returned HTTP ${response.status}`);
    assert.ok(response.headers.get('content-type')?.includes('text/html'), `${path} is not HTML`);
    const html = await response.text();
    assert.ok(html.includes(`data-page="${id}"`), `Wrong page at ${path}`);
    assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, `${path} must have one heading`);
    assert.ok(html.includes('BlueSecurity EDU'), `Unexpected page at ${path}`);
    if (revision) assert.ok(html.includes(`<meta name="build-revision" content="${revision}">`), `${path} does not match revision ${revision}`);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    assert.equal(new URL(canonical).pathname, url.pathname, `Wrong canonical URL at ${path}`);
    titles.add(html.match(/<title>([^<]+)<\/title>/)?.[1]);
    for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const asset = new URL(match[1], url);
      if (asset.origin === base.origin && asset.pathname.startsWith(base.pathname + 'assets/')) assets.add(asset.href);
    }
  }));
  assert.equal(titles.size, routes.length, 'Every page must have its own title');
  assert.ok(assets.size >= 5, 'Expected local CSS, JavaScript, logo, font, and favicon');
  assets.add(new URL('assets/og-cover.png', base).href);
  assets.add(new URL('sitemap.xml', base).href);
  await Promise.all([...assets].map(async (path) => {
    const url = new URL(path, base);
    assert.ok(url.href.startsWith(base.href), `Asset escapes the deployment path: ${url}`);
    const asset = await fetch(url, { signal: AbortSignal.timeout(15000), cache: 'no-store' });
    assert.equal(asset.status, 200, `${path} returned HTTP ${asset.status}`);
    assert.ok((await asset.arrayBuffer()).byteLength > 0, `${path} is empty`);
  }));
  const sitemap = await (await fetch(new URL('sitemap.xml', base))).text();
  for (const [path] of routes) assert.ok(sitemap.includes(base.pathname + path + '</loc>'), `Sitemap is missing ${path}`);
  console.log(`Verified ${base.href} (${revision || 'current'}): ${routes.length} pages and ${assets.size} assets`);
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
