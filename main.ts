// Hearth & Ledger hand-in (Node 22, standard library only).
// The site is plain static files under app/, plus 4 screenshots.
// This program copies both into the output folder and writes the
// dossier the judge reads, using the kit library in vendor/.
// Run locally with: MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const dest = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(dest, { recursive: true });
cpSync(join(repoRoot, 'app'), join(dest, 'app'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(dest, 'screenshots'), { recursive: true });
}

const dossierText = buildDossier(dest, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(dest, 'dossier.json'), dossierText);

// Refuse to finish quietly with an empty hand-in: read the dossier
// back and check it actually holds the site text before exiting.
const written = readFileSync(join(dest, 'dossier.json'), 'utf8');
if (written.length < 1000 || !written.includes('Hearth')) {
  throw new Error('dossier.json looks empty or is missing the site text');
}
console.log(`handed in app/ + screenshots/ -> ${dest} (${written.length} dossier bytes)`);
