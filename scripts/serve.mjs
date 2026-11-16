import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { build, root } from './build.mjs';
import { company } from '../src/data/courses.mjs';

await build();
const production = process.argv.includes('--production');
const directory = resolve(root, 'dist');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.xml': 'application/xml' };
const port = Number(process.env.PORT || 4321);
const mount = new URL(company.siteUrl).pathname.replace(/\/$/, '');
const server = createServer(async (request, response) => {
  try {
    if (!production && new URL(request.url, 'http://localhost').pathname.endsWith('/')) await build();
    const requested = new URL(request.url, 'http://localhost');
    let path = decodeURIComponent(requested.pathname);
    // Mirrors the project subpath used by GitHub Pages for local verification.
    if (path === mount || path.startsWith(mount + '/')) path = path.slice(mount.length) || '/';
    let target = resolve(directory, `.${path}`);
    if (target !== directory && !target.startsWith(directory + sep)) { response.writeHead(403).end(); return; }
    if ((await stat(target)).isDirectory()) {
      if (!requested.pathname.endsWith('/')) { response.writeHead(308, { Location: requested.pathname + '/' + requested.search }).end(); return; }
      target = resolve(target, 'index.html');
    }
    const body = await readFile(target);
    response.writeHead(200, { 'Content-Type': mime[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(await readFile(resolve(directory, '404.html')));
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}${mount}/`));
