#!/usr/bin/env node
/*
 * Probe — das Such-Mikrofon hoert die Sprache, die gesprochen wird.
 *
 * Klaus 2026-08-12: die Sprachliste aus Kimboard gehoert in jede App, die ein
 * Mikrofon hat. Hier stand vorher fest `r.lang = "de-DE"` — fuer jeden, der
 * kein Deutsch spricht, war die Sprachsuche damit kaputt. Auf einem Marktplatz,
 * der Fremden offensteht, ist das kein Schoenheitsfehler.
 *
 * GEPRUEFT WIRD DIE TAT: eine eigene SpeechRecognition schreibt mit, welches
 * `lang` die Seite WIRKLICH gesetzt hat. Ein Blick in den Quelltext wuerde auch
 * dann gruen melden, wenn die Zuweisung nie ausgefuehrt wird.
 *
 * Sabotage-Probe gemacht: `r.lang` wieder fest auf "de-DE" -> 3 Proben rot.
 *
 * Voraussetzung: npm install --no-save playwright-core
 * Aufruf: node tools/probe-mikrofon-sprachen.mjs   ·   Exit 0 = gruen.
 */
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
const ROOT=new URL('..', import.meta.url).pathname, PORT=8503;
const srv=spawn('python3',['-m','http.server',String(PORT)],{cwd:ROOT,stdio:'ignore'});
await new Promise(r=>setTimeout(r,900));
/* Der Spion ahmt den ECHTEN Ablauf nach: `start()` kehrt sofort zurueck, das
   Ergebnis kommt SPAETER. Sonst misst man an der Wirklichkeit vorbei — die App
   schreibt „Ich hoere zu …" direkt nach `start()`, und ein sofortiges Ergebnis
   wuerde davon ueberschrieben. Genau daran ist diese Probe einmal falsch rot
   geworden. */
const SPION=`window.__gehoert=[];window.__ergebnis=null;
window.SpeechRecognition=function(){var self=this;this.start=function(){window.__gehoert.push(self.lang);
 if(self.onstart)self.onstart();
 setTimeout(function(){
   if(window.__ergebnis!==null&&self.onresult)self.onresult({results:[[{transcript:window.__ergebnis}]]});
   if(window.__ergebnis!==null&&self.onend)self.onend();
 },0);};
 this.stop=function(){if(this.onend)this.onend();};};
window.webkitSpeechRecognition=window.SpeechRecognition;`;
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
let pass=0,fail=0; const ok=(n,c,x='')=>{c?pass++:fail++;console.log(`${c?'✅':'❌'} ${n}${x?'  ('+x+')':''}`);};
async function seite(loc){const ctx=await b.newContext({locale:loc});await ctx.addInitScript(SPION);
 const p=await ctx.newPage();const e=[];p.on('pageerror',x=>e.push(String(x).slice(0,90)));
 await p.goto(`http://127.0.0.1:${PORT}/`,{waitUntil:'load'});await p.waitForTimeout(700);return{ctx,p,e};}
for(const [loc,erw] of [['de-DE','de-DE'],['ar-EG','ar-SA'],['ps-AF','ps-AF'],['ru-RU','ru-RU'],['ja-JP','de-DE']]){
  const {ctx,p,e}=await seite(loc);
  const r=await p.evaluate(()=>{const s=document.getElementById('micLang');
    document.getElementById('mic').click();
    return {anz:s?s.options.length:0,wahl:s?s.value:null,
            dir:document.getElementById('q').getAttribute('dir'),g:window.__gehoert[0]||null};});
  ok(`Gerät ${loc} → Mikrofon hört ${r.g}`, r.g===erw, 'erwartet '+erw);
  if(loc==='de-DE'){ok('zwölf Sprachen im Wähler',r.anz>=12,String(r.anz));
    ok('Suchfeld inhalts-abhängig ausgerichtet',r.dir==='auto',String(r.dir));
    ok('keine Seiten-Fehler',e.length===0,e[0]||'');}
  await ctx.close();
}
{ const {ctx,p}=await seite('de-DE');
  const r=await p.evaluate(async()=>{const s=document.getElementById('micLang');
    s.value='ps-AF';s.dispatchEvent(new Event('change'));
    window.__ergebnis='Salaam';document.getElementById('mic').click();
    await new Promise(x=>setTimeout(x,250));
    const n=document.querySelector('#toast,.toast,#toastbox');
    return n?n.textContent.trim():'(keine Notiz gefunden)';});
  ok('Hinweis beim stillen Fehlschlag',/پښتو/.test(r)&&/lateinischer Schrift/.test(r),r.slice(0,90));
  await ctx.close(); }
await b.close(); srv.kill();
console.log(`\n${pass} grün, ${fail} rot`); process.exit(fail?1:0);
