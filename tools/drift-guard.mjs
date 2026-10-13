// Drift-Guard: die aus dem SBKIM-Baukasten byte-1:1 übernommenen Module dürfen
// hier NICHT abgewandelt werden ("Kopieren, nicht klonen"). Ändert sich der Inhalt,
// schlägt der Test an — dann bewusst die Quelle in Sage-Protokol pflegen und neu kopieren.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
// Erwartete Hashes der 1:1-Kopien aus Sage-Protokol/src/modules/*.
const EXPECT = {
  'modules/01_storage.js':      '5a5a4bf64dfcc107da7ed70fb755d7db5cce7d80e963b3e2fbc2004537747820',
  'modules/02_spore.js':        '0dcde79489a5884f9358009a38411d88291a5cdf6e3c486b41f3d4944f915e47',
  'modules/03_embedding.js':    'a6ac64d7536da3fa5cc426d0f7db9440fdaf5ab4460f0bdc66a10eb8203b1b68',
  'modules/04_match.js':        '9e2648729758f644fe8e35b0e049ba8d66668a72dc6b7e4b41ebd75d52c0826a',
  'modules/05_anastomose.js':   '255ac79aeb3b0203e92f0cebd0a905e47c488b43efe18f41332a7d35520bbf23',
  'modules/05b_nostr_relay.js': '6edc89091861184da3b702b744691a596bbed6051fd40dbdd45492fba2bec363',
  'modules/noble-secp256k1.js': '8f3879ca422c4fdfe7ca0361688636fa7cc550a59bd94d512ed6ec79aa3d55d1',
  'modules/23_rendezvous.js':   'b02f1a1c93130ae74e81796b500d1c613b2504a53c9a9d852ef55ba9eb93891b',
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
