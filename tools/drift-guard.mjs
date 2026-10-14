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
  'modules/04_match.js':        '721eecc3c0d6ea4c259259e6071215ec1cd16f1c43c87b42ce9e72e9a0b5e41c',
  'modules/pruefer-mail.js':    'cdf3ca7881bfa68763a2c0be7436d35a65bea4dbd03f606e02eaec5c613632d7', // Prüfliste (Auslieferungsprüfer), Bau 04.J
  'modules/reinigung.js':       'c3420fb57875db193096b13bd586387d41b383bd9625b54145dece8c4b65ac0e', // byte-1:1 aus Workflow-PDF assets/reinigung.js
  'vendor/pdfjs/pdf.min.js':    '978fd1b2d134a98e98966186a97777bebf87d8e770dadab1ece3687e21a5aa6c', // PDF.js 3.11.174, byte-gleich aus Workflow PDF
  'vendor/pdfjs/pdf.worker.min.js': '38cde5311957b86bc3669f93e7d2566de333a90055ed6635bef60d9bf00e96f2',
  'modules/05_anastomose.js':   '255ac79aeb3b0203e92f0cebd0a905e47c488b43efe18f41332a7d35520bbf23',
  'modules/05b_nostr_relay.js': '37eee5b196b3efad57131edd1cc3c0ee23acb97b5ca40740d6a0771db4b4a421',
  'modules/noble-secp256k1.js': '8f3879ca422c4fdfe7ca0361688636fa7cc550a59bd94d512ed6ec79aa3d55d1',
  'modules/23_rendezvous.js':   '9464fba75e5a4ed46ebabcd05b2b62f118a5a056f10ebf929421b282d4f6631f',
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
