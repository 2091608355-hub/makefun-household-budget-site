// Local preview server for the budget site (Node 22, standard library only).
// Serves the app/ folder on http://localhost:8080 by default.
// Usage: node serve.ts  (or: node serve.ts --port 8081)
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(fileURLToPath(new URL('./app', import.meta.url)));
const flagAt = process.argv.indexOf('--port');
const wanted = flagAt === -1 ? 8080 : Number(process.argv[flagAt + 1]);
const port = Number.isInteger(wanted) && wanted > 0 && wanted < 65536 ? wanted : 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

createServer((req, res) => {
  const rawPath = new URL(req.url ?? '/', 'http://127.0.0.1').pathname;
  let cleaned;
  try {
    cleaned = decodeURIComponent(rawPath);
  } catch {
    res.writeHead(400).end('bad path');
    return;
  }
  if (cleaned.endsWith('/')) cleaned += 'index.html';
  const target = resolve(join(appRoot, normalize(cleaned)));
  if (target !== appRoot && !target.startsWith(appRoot + sep)) {
    res.writeHead(403).end('not allowed');
    return;
  }
  let bytes;
  try {
    const info = statSync(target);
    if (!info.isFile()) throw new Error('no such file');
    bytes = info.size;
  } catch {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, {
    'content-type': TYPES[extname(target).toLowerCase()] ?? 'application/octet-stream',
    'content-length': bytes,
    'cache-control': 'no-store',
  });
  createReadStream(target).pipe(res);
}).listen(port, '127.0.0.1', () => {
  console.log(`Hearth & Ledger preview: http://localhost:${port}`);
});
