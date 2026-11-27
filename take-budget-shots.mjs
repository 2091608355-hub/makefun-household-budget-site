// Renders the budget site in Chrome and saves 4 screenshots.
// First start the preview server: node serve.ts --port 8081
// Then run: node take-budget-shots.mjs
import { chromium } from '/home/hatch/workspace/makefun/shots/node_modules/playwright-core/index.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const SHOTS = [
  { file: '1-overview.jpg', path: '#/overview', viewport: { width: 1280, height: 800 } },
  { file: '2-budget.jpg', path: '#/budget', viewport: { width: 1280, height: 800 } },
  { file: '3-charts.jpg', path: '#/charts', viewport: { width: 1280, height: 800 } },
  { file: '4-add-phone.jpg', path: '#/add', viewport: { width: 390, height: 844 } },
];
const outDir = join(homedir(), 'workspace', 'makefun', 'budget-site-repo', 'screenshots');
mkdirSync(outDir, { recursive: true });
const chromeExe = join(homedir(), 'workspace', 'makefun', 'shots', 'chrome', 'chrome-linux64', 'chrome');

const browser = await chromium.launch({ executablePath: chromeExe, args: ['--no-sandbox'] });
const errors = [];
for (const shot of SHOTS) {
  const page = await browser.newPage({ viewport: shot.viewport });
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(shot.file + ': ' + msg.text()); });
  page.on('pageerror', (err) => errors.push(shot.file + ': ' + err.message));
  await page.goto('http://localhost:8081/' + shot.path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  const picture = await page.screenshot({ type: 'jpeg', quality: 82 });
  writeFileSync(join(outDir, shot.file), picture);
  console.log(shot.file, picture.length, 'bytes');
  await page.close();
}
await browser.close();
console.log('console errors:', errors.length ? errors : 'none');
