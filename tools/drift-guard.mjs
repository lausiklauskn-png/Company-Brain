// Drift-Guard: die aus dem SBKIM-Baukasten byte-1:1 übernommenen Module dürfen
// hier NICHT abgewandelt werden ("Kopieren, nicht klonen"). Ändert sich der Inhalt,
// schlägt der Test an — dann bewusst die Quelle in Sage-Protokol pflegen und neu kopieren.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
// Erwartete Hashes der 1:1-Kopien aus Sage-Protokol/src/modules/*.
const EXPECT = {
  'modules/03_embedding.js': 'e4bb8bd6a237914e7841cab5165912daf636adf0ee90c5d4ffd0c74cc5d706e5',
  'modules/04_match.js':     '9e2648729758f644fe8e35b0e049ba8d66668a72dc6b7e4b41ebd75d52c0826a',
};
let fail = 0;
for (const [rel, want] of Object.entries(EXPECT)) {
  const buf = await readFile(join(ROOT, rel));
  const got = createHash('sha256').update(buf).digest('hex');
  const ok = got === want;
  if (!ok) fail++;
  console.log(`${ok ? '✅' : '❌'} byte-1:1 ${rel}  ${ok ? '' : `(erwartet ${want.slice(0,12)}…, ist ${got.slice(0,12)}…)`}`);
}
console.log(`\n${Object.keys(EXPECT).length - fail} byte-identisch, ${fail} abgewichen`);
if (fail) process.exit(1);
