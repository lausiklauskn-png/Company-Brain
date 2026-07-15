/*
 * Company Brain — Rendezvous-Init (Modul 23, „🌐 Mit Kollegen verbinden").
 *
 * App-eigener Klebstoff (NICHT byte-kopiert) nach dem Rezept des Skills
 * `saubere-netz-anmeldung` und der Referenz Kim-Bell/assets/rendezvous-init.js:
 *   - Modus A (SbkimRendezvous.ensureIdentity): sanft, automatisch beim Mount,
 *     idempotent, NICHT zerstörend, KEINE Netz-Aktion — sichert die eigene
 *     Schublade `sbkim_companybrain` + eine stabile Identität.
 *   - Modus B (Knopf „🧹 Aufräumen & neu anmelden"): reinigt NUR die eigene
 *     Origin (geteilter Alt-Topf `sbkim`, Service-Worker, Caches; eigene
 *     Schublade bleibt), dann frische Anmeldung + „hart neu laden".
 *
 * Verfassungstreu: alles nutzer-ausgelöst, kein Dauer-Piepser, `init()` baut
 * nichts ins Netz auf (Empfangsmodus). Fail-soft: fehlt ein Modul/Netz, bleibt
 * die App voll nutzbar — nur der Netz-Knopf meldet ehrlich, was fehlt.
 */
(function () {
  "use strict";

  var DB_SUFFIX = "companybrain";
  var CFG = {
    nodeName: "Company Brain",
    domain: "Firmen-Datei-Bedeutungssuche",
    endpoint: "https://lausiklauskn-png.github.io/Company-Brain/",
    nodeType: "hybrid",
    domainDescription: "Company Brain — durchsucht das Datenchaos einer Firma nach Bedeutung; Rechnungen, Verträge, Fotos, Dokumente über alle Formate.",
    domainKeywords: ["Datei", "Dokument", "Bedeutungssuche", "Rechnung", "Vertrag", "Ordnung", "Firma", "Katalog"],
  };

  function out(msg, append) {
    try {
      var el = document.getElementById("sbkim-rdv-out");
      if (el) el.textContent = append ? (el.textContent + "\n" + msg) : msg;
    } catch (_e) {}
  }

  // ---- app-eigener Identitäts-Erzeuger (Spore aus Modul 02/03, mit %-Balken) ----
  function createIdentity() {
    if (!window.SbkimEmbedding || !window.SbkimSpore) {
      return Promise.reject(new Error("Bedeutungs-Modell/Spore (Modul 02/03) nicht geladen."));
    }
    out("Bedeutungs-Modell wird geladen (einmalig, ~30 MB — am Tablet 1–2 Min.)…", true);
    function progEl() {
      var host = document.getElementById("sbkim-rdv-out");
      if (!host || !host.parentNode) return null;
      var el = document.getElementById("cb-model-progress");
      if (!el) {
        el = document.createElement("div");
        el.id = "cb-model-progress";
        el.style.cssText = "margin:6px 0 0;font:.74rem/1.4 ui-monospace,monospace;color:#8b9cff;white-space:pre-wrap";
        host.parentNode.insertBefore(el, host.nextSibling);
      }
      return el;
    }
    var onProg = function (ev) {
      var d = ev && ev.detail; if (!d) return; var el = progEl(); if (!el) return;
      if (typeof d.progress === "number" && isFinite(d.progress)) {
        var pct = Math.max(0, Math.min(100, Math.round(d.progress)));
        var f = Math.round(pct / 5);
        el.textContent = "Modell lädt  " + "█".repeat(f) + "░".repeat(20 - f) + "  " + pct + " %";
      } else if (d.status === "done" || d.status === "ready") { el.textContent = "Modell geladen ✓"; }
    };
    function stop() { try { window.removeEventListener("sbkim:embedding-progress", onProg); } catch (_e) {} }
    try { window.addEventListener("sbkim:embedding-progress", onProg); } catch (_e) {}
    return window.SbkimEmbedding.init()
      .then(function () { return window.SbkimEmbedding.embedPassage(CFG.domainDescription + ". " + CFG.domainKeywords.join(", ")); })
      .then(function (vec) {
        return window.SbkimSpore.generateOwnSpore({
          domain: CFG.domain, endpoint: CFG.endpoint, nodeType: CFG.nodeType, nodeName: CFG.nodeName,
          domainDescription: CFG.domainDescription, domainKeywords: CFG.domainKeywords, domainVector: Array.from(vec),
        });
      })
      .then(function (spore) { stop(); out("Identität fertig — melde dich im Raum an…", true); return spore; })
      .catch(function (e) { stop(); out("✗ Identität fehlgeschlagen: " + (e && e.message ? e.message : e), true); throw e; });
  }

  // app-eigener Korpus-Provider: der Katalog beantwortet Kollegen-Fragen.
  function prepareCorpus() {
    try { return (typeof window.__CB_getCorpus === "function") ? window.__CB_getCorpus() : []; }
    catch (_e) { return []; }
  }

  var R = function () { return window.SbkimRendezvous; };

  async function doConnect() {
    if (!R()) { out("Netz-Modul nicht geladen."); return; }
    out("Verbinde & melde an…");
    try {
      var res = await R().connectAndAnnounce({ createIdentity: createIdentity });
      out(res && res.ok ? "✓ Angemeldet im Raum. Kollegen können dich jetzt finden." : "Nicht angemeldet: " + ((res && res.reason) || "unbekannt") + " (offline? Relais nicht erreichbar?)", true);
    } catch (e) { out("Fehler: " + (e && e.message ? e.message : e), true); }
  }
  async function doAnswer() {
    if (!R()) { out("Netz-Modul nicht geladen."); return; }
    try { await R().enableAnswering(); out("✓ Antwortrecht an — dein Katalog beantwortet Kollegen-Fragen (nur solange dieser Tab vorn & wach ist)."); }
    catch (e) { out("Antwortrecht fehlgeschlagen: " + (e && e.message ? e.message : e)); }
  }
  async function doDiscover() {
    if (!R()) { out("Netz-Modul nicht geladen."); return; }
    out("Suche Kollegen im Raum…");
    var room = document.getElementById("cbnet-room"); if (room) room.innerHTML = "";
    try {
      var cards = await R().discover();
      if (!cards || !cards.length) { out("Niemand im Raum (oder Relais nicht erreichbar). Ein Kollege muss erst „Verbinden & anmelden“ drücken.", true); return; }
      out(cards.length + " Kollege(n) im Raum.", true);
      renderRoom(cards);
    } catch (e) { out("Suche fehlgeschlagen: " + (e && e.message ? e.message : e), true); }
  }
  function renderRoom(cards) {
    var room = document.getElementById("cbnet-room"); if (!room) return;
    room.innerHTML = cards.map(function (c, i) {
      var age = c.ageSec != null ? (" · " + Math.round(c.ageSec) + " s alt") : "";
      return '<div class="card" style="margin-top:8px">'
        + '<div class="fname">👤 ' + esc(c.nodeName || c.nodeId || "Knoten") + '<span style="color:var(--mut);font-weight:400;font-size:.8rem">' + age + '</span></div>'
        + '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">'
        + '<input type="text" id="cbnet-q-' + i + '" placeholder="Frage an diesen Kollegen…" style="flex:1;min-width:160px">'
        + '<button class="cbnet-ask" data-i="' + i + '">Fragen</button></div>'
        + '<div class="out" id="cbnet-a-' + i + '" style="display:none"></div></div>';
    }).join("");
    room._cards = cards;
    room.querySelectorAll(".cbnet-ask").forEach(function (b) {
      b.addEventListener("click", function () { doAsk(cards[+b.dataset.i], +b.dataset.i); });
    });
  }
  async function doAsk(card, i) {
    var q = (document.getElementById("cbnet-q-" + i) || {}).value || "";
    var a = document.getElementById("cbnet-a-" + i); if (a) { a.style.display = "block"; a.textContent = "… frage " + (card.nodeName || "Kollege"); }
    if (!q.trim()) { if (a) a.textContent = "Bitte eine Frage eingeben."; return; }
    try {
      var res = await R().askNode(card, q, {});
      if (res && res.ok && res.hits && res.hits.length) {
        if (a) a.textContent = res.hits.map(function (h) { return "• " + (h.label || h.text || "") + (h.score != null ? "  (" + Math.round(h.score * 100) + "%)" : ""); }).join("\n");
      } else if (res && res.pending) { if (a) a.textContent = "Frage abgeschickt — Antwort kommt evtl. später (Kollege-Tab muss vorn sein)."; }
      else { if (a) a.textContent = "Keine Antwort / kein Treffer."; }
    } catch (e) { if (a) a.textContent = "Fehler: " + (e && e.message ? e.message : e); }
  }
  async function doRepair() {
    if (!R()) { out("Netz-Modul nicht geladen."); return; }
    if (!window.confirm("Aufräumen & neu anmelden? Reinigt nur die Netz-Daten dieser Seite (nicht deine Dateien, nicht den Katalog). Danach bitte Strg+Umschalt+R.")) return;
    out("Räume auf & melde neu an…");
    try {
      var res = await R().repairAndReconnect({ createIdentity: createIdentity });
      out((res && res.ok ? "✓ Aufgeräumt & neu angemeldet." : "Aufgeräumt. Anmeldung: " + ((res && res.reason) || "offline?")) + "\nBitte jetzt hart neu laden (Strg+Umschalt+R).", true);
    } catch (e) { out("Fehler: " + (e && e.message ? e.message : e), true); }
  }
  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function wireUI() {
    var byId = function (id) { return document.getElementById(id); };
    if (byId("cbnetConnect")) byId("cbnetConnect").addEventListener("click", doConnect);
    if (byId("cbnetAnswer")) byId("cbnetAnswer").addEventListener("click", doAnswer);
    if (byId("cbnetDiscover")) byId("cbnetDiscover").addEventListener("click", doDiscover);
    if (byId("cbnetRepair")) byId("cbnetRepair").addEventListener("click", doRepair);
  }

  function mount() {
    if (R() && typeof R().init === "function") {
      try {
        R().init({ nodeName: CFG.nodeName, dbSuffix: DB_SUFFIX, createIdentity: createIdentity, prepareCorpus: prepareCorpus, ensureIdentity: true });
      } catch (e) { console.warn("[CompanyBrain] Rendezvous Modus A übersprungen:", e); }
    } else {
      out("Netz-Modul (Modul 23) nicht geladen — „Mit Kollegen verbinden“ ist aus.");
    }
    wireUI();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
