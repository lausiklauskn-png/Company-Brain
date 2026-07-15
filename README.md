# Company Brain

Ein **offline, vertrauensstarker Kasten**, der das **Datenchaos einer Firma oder
Person** nach **Bedeutung** durchsuchbar und nutzbar macht — ohne dass Originaldateien
bewegt, verändert oder verloren gehen.

> Wirf deine Dateien hinein → der Kasten liest jede einmal, merkt sich ihre Bedeutung,
> und du findest alles wieder — nach Sinn, nicht nach Dateinamen. Die Originale bleiben
> unangetastet.

## ▶ Die App (Probeversion v0.1 — gebaut 2026-07-15)

Die erste **Probeversion** ist gebaut: eine schlanke, offline-fähige **Browser-PWA**
(eine `index.html`, keine externen Abhängigkeiten). Sie setzt genau den Fluss aus
[`BRIEF_PROBEVERSION.md`](BRIEF_PROBEVERSION.md) um:

**Einwurf → Signieren (mit Fortschritt) → virtuelle Ordnung → Suche mit Umschalter
„Namenssuche ↔ Bedeutungssuche“ — Treffer mit Begründung.**

| Datei | Zweck |
|---|---|
| `index.html` | Die ganze App (offline, installierbar, alles inline) |
| `app-manifest.json`, `sw.js`, `icon-*.png` | PWA-Grundausstattung (installierbar, offline) |
| `impressum.html` | Datenschutz & Impressum (ohne PII) |
| `tools/e2e-test.mjs`, `tools/e2e-compressed.mjs` | Headless-Beweis (echte Chromium-Läufe) |
| `tools/make-icons.mjs` | Icons offline erzeugen (Node-zlib, keine Abhängigkeit) |

### Was sie kann (alles offline, ohne Cloud-Pflicht)

- **Zerstörungsfrei:** „Ordner verbinden“ (File System Access API) merkt sich nur einen
  **Zeiger** auf den Ordner — **kein Kopieren, kein Verschieben, kein Löschen**. Fallback:
  „Dateien wählen“ (nur diese Sitzung). Öffnen liest das Original über den Zeiger neu.
- **Signieren einmal je Datei:** SHA-256-Fingerabdruck (Dedupe) · Text aus
  **Text-/PDF-/Office-Dateien** (PDF `FlateDecode` und `.docx/.xlsx/.pptx` werden im
  Browser über `DecompressionStream` entpackt) · **Bild-OCR** über die Browser-Texterkennung,
  wo das Gerät sie mitbringt · Bedeutungs-Vektor + Steckbrief + Kategorie-Vorschlag.
- **Bedeutungssuche:** Cosinus-Vorfilter + BM25 + kleine Synonym-Brücke → Treffer **mit
  Begründung** (welches Wort wo traf: Name / Inhalt / aus Bild-Text) + Schnipsel + „Öffnen“.
  Suche in **Millisekunden**.
- **Virtuelle Ordnung:** aufgeräumte Gruppen (Rechnung / Vertrag / Foto / …) — **nur
  Vorschlag**, es wird nichts bewegt.
- **Doppelte-Finder:** gleicher Inhalt an mehreren Stellen (per Fingerabdruck erkannt,
  auch bei anderem Namen — typisch bei mehreren Arbeitsplätzen). **Freiwillige Auswahl**,
  „alle außer je einer" auf einen Klick. Entfernt nur den **Katalog-Eintrag**, nie eine Datei.
- **Ordner aus der App entfernen:** verbundene Ordner werden in den Einstellungen gelistet
  und lassen sich trennen (Einträge raus, Dateien unberührt).
- **Sprachsuche (🎤):** Suchfeld per Mikrofon diktieren (Browser-Spracherkennung, fail-soft).
- **Optionale EU-KI (BYOK):** standardmäßig **aus**. Bild-Texterkennung wahlweise über
  **Mistral OCR (EU)** oder **Google Cloud Vision (EU-Endpunkt)** — nur wenn du bewusst
  einen eigenen Schlüssel hinterlegst; „Nur-EU"-Schalter erzwingt Datenhoheit.

### Ausprobieren

Offline im Browser: `python3 -m http.server 8000` im Ordner starten, dann
`http://localhost:8000/` öffnen (Chrome für „Ordner verbinden“). Oder als GitHub-Pages-
Seite installieren.

### Beweis (headless)

`npm test` fährt die **echte App** in Chromium hoch, signiert echte Dateien und prüft:
Bedeutung schlägt Name, PDF-/DOCX-Text wird gefunden, Dedupe/Doppelte-Finder greift,
Suche < 1 s. Zuletzt grün: **8 + 3 + 10 Prüfungen bestanden (2026-07-15)**. Klaus'
Browser-Sichttest am Tablet steht noch aus — bis dahin ehrlich: *„Logik bewiesen, Sicht
am Gerät ungeprüft.“*

## Drei Vertrauens-Säulen

1. **Arbeitet an einer Kopie / liest nur** → Original unantastbar.
2. **Schlägt vor — du bestätigst** → nichts wird eigenmächtig gelöscht.
3. **Sortiert virtuell — bewegt nichts** → keine feste Verlinkung bricht.

## Dokumente

- **[`KONZEPT.md`](KONZEPT.md)** — Vision, wie es technisch läuft, Vergleich zum Markt,
  Kasten-vs-Software, Kosten-Nutzen + Marktanalyse.
- **[`BRIEF_PROBEVERSION.md`](BRIEF_PROBEVERSION.md)** — Anschlussbrief: der Bauauftrag für
  diese Probeversion.

---

*Stand 2026-07-15 · Probeversion v0.1 gebaut. Privat.*
