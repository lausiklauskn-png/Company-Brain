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

- **Echtes Bedeutungs-Modell (neu):** ein neuronales, mehrsprachiges Modell
  (`Xenova/multilingual-e5-small`, Modul 03 aus dem SBKIM-Baukasten, byte-1:1) versteht
  **Synonyme, Umschreibung und Sprachen** — „vehicle“ findet den „Wagen“, „rental contract“
  den „Mietvertrag“. **Selbst gehostet** (Gewichte im eigenen Origin, per GitHub-Action geholt);
  solange das Modell lädt/fehlt, greift der **Stichwort-Rückfall**. Das ist der Unterschied zu
  Metadaten-/Spalten-Sortierung: *Verstehen statt Stichwort.*
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
- **Filter & Sortierung:** nach Kategorie, Typ, Zeitraum, Tag filtern; nach Relevanz/Datum/
  Größe/Name sortieren. Leere Suche + Filter = **Stöber-Modus**.
- **Tags & gespeicherte Suchen:** eigene Schlagworte an Dateien; häufige Suchen als Knopf.
- **Mehrere Rechner:** Katalog **vollständig sichern** und auf einem anderen Gerät
  **zusammenführen** → eine durchsuchbare Gesamtsicht. Es reisen nur Steckbriefe, keine Dateien.
- **🌐 Mit Kollegen verbinden (live, server-los) — optional, Standard aus:** über ein „dummes"
  Relais treffen sich mehrere Rechner in einem gemeinsamen Raum und fragen sich **gegenseitig
  die Kataloge live ab** (Modul 23 aus dem SBKIM-Baukasten, byte-1:1). Nur **Fragen und Antworten**
  reisen, **keine Dateien**. Eigene, stabile Identität pro Gerät (`dbSuffix=companybrain`);
  „🧹 Aufräumen & neu anmelden" heilt Alt-Zustände. Der antwortende Tab muss vorn/wach sein.
- **🧠 KI pro Datei (opt-in):** einen Beleg/ein PDF per **Mistral (EU)** zusammenfassen oder
  gezielt befragen — Datei-Text geht nur bei Klick an die EU-KI.
- **🔀 Neu ordnen (zerstörungsfrei):** legt **Kopien** nach Schema (Kategorie/Jahr/Typ) in einen
  **neuen, leeren Zielordner** (File System Access). Originale bleiben; Rückgängig = Ordner löschen.
  Ein Manifest dokumentiert jede Kopie.

### Ausprobieren

Offline im Browser: `python3 -m http.server 8000` im Ordner starten, dann
`http://localhost:8000/` öffnen (Chrome für „Ordner verbinden“). Oder als GitHub-Pages-
Seite installieren.

### Beweis (headless)

`npm test` fährt die **echte App** in Chromium hoch, signiert echte Dateien und prüft:
Bedeutung schlägt Name, PDF-/DOCX-Text wird gefunden, Dedupe/Doppelte-Finder greift,
Filter/Tags/gespeicherte Suchen, Mehr-Rechner-Merge, Suche < 1 s. Zuletzt grün:
**Drift-Guard + 8 + 3 + 10 + 14 + 7 Prüfungen bestanden (2026-07-15)**.

**Das Bedeutungs-Modell selbst hosten:** GitHub → **Actions → „Embedding-Modell ins Repo
holen" → Run workflow** — das holt die Gewichte (~30 MB) und committet sie unter
`models/…`. Danach lädt die App das Modell aus dem eigenen Origin.

**Ehrlich, nur per Browser/CI prüfbar (nicht headless):** das **echte e5-Modell**
(transformers.js/HuggingFace sind in der Bau-Sandbox gesperrt → die Adapter-/Rang-Logik
ist mit einem eingespritzten Stub bewiesen, die echte Modell-Qualität zeigt sich im Browser
bzw. nach dem Action-Lauf), die **Kopie-in-neuen-Ordner**-Aktion und die **KI-pro-Datei**.
Alle fail-soft. Klaus' Browser-Sichttest am Tablet steht aus.

**„Mit Kollegen verbinden" (Modul 23):** das Relais ist `wss://` und in der Bau-Sandbox
**nicht erreichbar** (wie im ganzen SBKIM-Ökosystem) → headless ist nur die **fail-soft-
Verdrahtung** bewiesen (`e2e-relay.mjs`: Stack lädt, eigene Identität `companybrain`, Knöpfe,
sauberes Degradieren offline, keine Fehler). Die **echte Live-Suche zwischen zwei Rechnern**
muss Klaus im Browser auf **zwei Geräten** bestätigen — bis dahin „ungeprüft".

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
