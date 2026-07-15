// Drift-Guard: die aus dem SBKIM-Baukasten byte-1:1 übernommenen Module dürfen
// hier NICHT abgewandelt werden ("Kopieren, nicht klonen"). Ändert sich der Inhalt,
// schlägt der Test an — dann bewusst die Quelle in Sage-Protokol pflegen und neu kopieren.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
// Erwartete Hashes der 1:1-Kopien aus Sage-Protokol/src/modules/*.
const EXPECT = {
  'modules/01_storage.js':      'e507aec18d75bde66b81b9eba9738650000d9686aac90c6817679e7df06d61c1',
  'modules/02_spore.js':        '0dcde79489a5884f9358009a38411d88291a5cdf6e3c486b41f3d4944f915e47',
  'modules/03_embedding.js':    'e4bb8bd6a237914e7841cab5165912daf636adf0ee90c5d4ffd0c74cc5d706e5',
  'modules/04_match.js':        '9e2648729758f644fe8e35b0e049ba8d66668a72dc6b7e4b41ebd75d52c0826a',
  'modules/05_anastomose.js':   '255ac79aeb3b0203e92f0cebd0a905e47c488b43efe18f41332a7d35520bbf23',
  'modules/05b_nostr_relay.js': '030aa2d260149f5627b84694a0b55e916cc186158009e260117d1e4f60d429bd',
  'modules/noble-secp256k1.js': '8f3879ca422c4fdfe7ca0361688636fa7cc550a59bd94d512ed6ec79aa3d55d1',
  'modules/23_rendezvous.js':   '9f3a20856c33080989db278a54ee23d723eeec82e169e2c4aee67dbc236f992a',
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
