// Fail-soft proof for Teil B ("Mit Kollegen verbinden"). The live relay is wss://
// and NOT reachable in this sandbox (like the whole SBKIM ecosystem) — so this proves
// the WIRING is present and degrades gracefully offline, never crashing the app.
// The real cross-computer handshake is verified by Klaus on two devices in a browser.
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const EXEC = process.env.CB_CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const MIME = { '.html':'text/html','.json':'application/json','.js':'text/javascript','.png':'image/png' };
const server = createServer(async (req,res)=>{ try{ let p=decodeURIComponent(req.url.split('?')[0]); if(p==='/')p='/index.html';
  const b=await readFile(join(ROOT,p)); res.writeHead(200,{'content-type':MIME[extname(p)]||'application/octet-stream'}); res.end(b);
} catch{ res.writeHead(404); res.end('nf'); }});
await new Promise(r=>server.listen(0,r));
const PORT=server.address().port;

const browser = await chromium.launch({executablePath:EXEC, args:['--no-sandbox']});
const page = await browser.newPage();
const errors=[];
page.on('pageerror', e=>errors.push(e.message));
await page.goto(`http://127.0.0.1:${PORT}/index.html`, {waitUntil:'load'});
await page.waitForTimeout(500); // let module scripts + Modus A run
let pass=0, fail=0; const ok=(n,c,x='')=>{(c?pass++:fail++);console.log(`${c?'✅':'❌'} ${n}${x?'  '+x:''}`);};

// modules loaded (globals present)
const globals = await page.evaluate(()=>({
  storage: !!window.SbkimStorage, spore: !!window.SbkimSpore, ana: !!window.SbkimAnastomose,
  relay: !!window.SbkimNostrRelay, rdv: !!window.SbkimRendezvous, emb: !!window.SbkimEmbedding, match: !!window.SbkimMatch,
  suffix: (window.SbkimRendezvous && window.SbkimRendezvous._meta && window.SbkimRendezvous._meta.dbSuffix) || null,
}));
ok('Relais-Stack geladen (Storage/Spore/Anastomose/Relay/Rendezvous)', globals.storage&&globals.spore&&globals.ana&&globals.relay&&globals.rdv, JSON.stringify(globals));
ok('Modul 03/04 geladen (Modell + Match)', globals.emb&&globals.match);
ok('Modus A: eigene Schublade dbSuffix="companybrain"', globals.suffix==='companybrain', `(${globals.suffix})`);

// UI present in settings
await page.click('.tab[data-tab="settings"]');
for(const id of ['cbnetConnect','cbnetDiscover','cbnetAnswer','cbnetRepair']){
  ok(`Knopf #${id} vorhanden`, await page.$('#'+id)!==null);
}

// discover offline -> graceful message, no crash
await page.click('#cbnetDiscover');
await page.waitForTimeout(2500);
const out1 = await page.textContent('#sbkim-rdv-out');
ok('„Wer ist im Raum?" degradiert sauber (kein Crash offline)', /Raum|Relais|Kollege|niemand/i.test(out1), `("${(out1||'').slice(0,70)}")`);

// connect offline -> fail-soft message (model/relay unreachable), no crash
await page.click('#cbnetConnect');
await page.waitForTimeout(2500);
const out2 = await page.textContent('#sbkim-rdv-out');
ok('„Verbinden" fail-soft offline (kein Crash)', out2 && out2.length>0);

ok('Keine unbehandelten Seiten-Fehler', errors.length===0, errors.slice(0,3).join(' | '));

await browser.close(); server.close();
console.log(`\n${pass} bestanden, ${fail} fehlgeschlagen`);
if(fail) process.exit(1);
