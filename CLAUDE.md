# Company Brain — Sitzungs-Anker

**Kurz-Verfassung.** Ausführliches steht netzweit in **Sage-Protokol**; hier steht nur,
was eine Sitzung wissen muss, **bevor** sie hier etwas anfasst.

## Was dieses Repo ist

Ein **offline, vertrauensstarker Kasten**, der das Datenchaos einer Firma oder Person
nach **Bedeutung** durchsuchbar macht — die Originaldateien werden **nicht** bewegt,
verändert oder gelöscht. Drei Vertrauens-Säulen: *liest nur · schlägt vor · bewegt
nichts.*

Läuft unter einer **eigenen Adresse** (`company-brain.family-projekt.de`, siehe
`DEPLOY.md`) — es gibt hier keine Geschwister-App auf derselben Adresse.

## Prüfen

```bash
npm install    # EINMALIG je Container — sonst fehlt playwright-core
npm test       # Drift-Guard + sieben headless e2e-Läufe
```
**Wichtig:** ohne `npm install` brechen die Proben mit `ERR_MODULE_NOT_FOUND` ab. Das
ist **nicht rot, sondern nicht lauffähig** — wer das verwechselt, sucht am falschen
Ende. Zuletzt gemessen: **9 grün, 0 rot**.

## Was hier leicht kaputtgeht

- **Das Gerätenamen-Feld liegt hier in der Seite, nicht im Panel** — dieses Repo hat
  keine geteilte Panel-Datei. Das ist die in §11.7 benannte Ausnahme; Marke und
  Abgleich gelten trotzdem. Wo das Feld hier hängt, entscheidet
  `modules/rendezvous-init.js`; die Regel selbst steht in
  [NETZWEIT § 2](https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/NETZWEIT.md).
- **Cache-Bump:** `CACHE` in `sw.js` (`company-brain-vX-Y`) erhöhen, wenn eine Datei
  aus dem Vorrat sich ändert — `index.html` gehört dazu.
- Die byte-kopierten SBKIM-Module unter `modules/` werden **nicht** abgewandelt.

## Netzweit — gilt in jedem Repo, steht in Sage

Freibrief zum Selbst-Mergen · Gerätename im Verbinden-Panel · frisch von
`origin/main` vor jeder Arbeit · Ton · kein PII · Ehrlichkeit:
**[`Sage-Protokol/docs/NETZWEIT.md`](https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/NETZWEIT.md)**

Verbindliche Verträge: **[`INTERFACES.md`](https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/INTERFACES.md)** (Andock §11,
Briefkasten §11.6, Gerätename §11.7). Die Fallen beim Abzweigen und
Veröffentlichen: **[`LEHREN.md`](https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/LEHREN.md)**.

Das Kurze davon, weil es täglich gebraucht wird:

```bash
git fetch origin --quiet && git checkout -B <branch> origin/main
git push -u origin refs/heads/<branch>:refs/heads/<branch>
git diff --stat origin/main origin/<branch>     # leer = der PR wäre leer
```

> **Bis 2026-08-22 stand das hier ausgeschrieben** — und wortgleich in bis zu
> 19 weiteren Repos. Zwanzig Kopien einer Regel sind nicht zwanzigmal so
> verbindlich; sie sind zwanzig Stellen, an denen sie auseinanderlaufen kann.
> Genau das war passiert. Die alte Fassung dieser Datei steht vollständig in
> [`docs/archiv/CLAUDE-2026-08-22.md`](docs/archiv/CLAUDE-2026-08-22.md).

## 🛡 Prüfliste und 🧽 Reinigung vor der KI (Sage Bau 04.J, Klaus 2026-10-14, Sitzung 2 von 4)

- **Modul 04 aus dem Kanon** (Sage #1082, ein Generationen-Sprung von 227 Zeilen), dazu `modules/pruefer-mail.js` (byte-1:1, direkt nach 04, im Vorrat, gepinnt). Company Brain ruft den KI-Richter nirgends auf; die Liste steht trotzdem da, sonst stünde er still, sobald er gebraucht wird (Klaus: „Richter aus + ich verteile"). Gemessen im Browser: `SbkimMatch._meta.prueflisteGeladen` ist true.
- **Fotos an Mistral OCR / Google Vision gingen als Original hinaus** (samt EXIF/GPS). Jetzt immer neu gezeichnet (`KiReinigung.bildOhneMeta`); klappt das nicht, geht nichts hinaus.
- **🧠 KI zu einer Datei:** PDF-Text kommt aus pdf.js **ohne** versteckte Stücke (Halt „Versteckten Text gefunden" → „Ohne ihn senden"/„Abbrechen", Vermerk `kiEntfernt` am Eintrag und auf der Karte); eine Anweisung an eine KI im Text hält **einmal** an („Trotzdem senden"/„Abbrechen"); der Systemkanal nennt den Text DATEN.
- `modules/reinigung.js` ist **byte-1:1 aus Workflow PDF**, `modules/ki-reinigung.js` ist app-eigener Klebstoff und steht **identisch in Privat-Brain**. pdf.js liegt hier unter `vendor/pdfjs/` (byte-gleich aus Workflow PDF, gepinnt, `THIRD_PARTY.md`) — diese App hat eine **eigene Adresse**, `/Workflow-PDF/` gibt es hier nicht. Nicht im Installations-Vorrat; der Worker legt es beim ersten Abruf ab.
- ⚠ **Benannte Grenzen:** nur die ersten 10 Seiten · Text über einem Foto/über sichtbarer Schrift bleibt · schräger Text nicht beurteilt · die Prüfliste sucht feste Wendungen · Halt-Texte nur DE/EN.
- Probe `tools/e2e-ki-reinigung.mjs` (in `npm test`; KI gestellt; der Workflow-PDF-Klon liefert nur pdf-lib für die Probe, `WFPDF_KLON`). Gegenprobe: in Privat-Brain (`tools/gegenprobe-ki-reinigung.mjs`, derselbe Klebstoff).
- ⚠ Nicht gemessen: am Gerät, mit echten Dokumenten, mit echter KI. Cache v0-9.
