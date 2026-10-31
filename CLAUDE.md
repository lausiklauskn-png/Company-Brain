**🔬 Regel: Forschung nur in Kimhub (Klaus 2026-10-31: „einheitlich alles in Kimhub … in den einzelnen Repos soll keine Forschungseinträge sein“):** jeder Forschungseintrag (Sitzungs-Befunde, Messungen, Stunden-Auswertungen, Forschungsnotizen) kommt nach **Kimhub `forschung/messungen/`**; in diesem Repo werden keine Forschungseinträge geführt und keine Forschungsdateien angelegt. Öffentliche Forschungs**aufgaben** stehen in Sage-Protokol.

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

## ⬇ Installieren-Knopf (2026-10-18, Klaus: „unter Einstellungen, Installier-Button hinten“)

`assets/installieren.js` ist byte-1:1 aus Sage-Protokol (SHA-256 `e0644084…c3`) — nie hier abwandeln. Der Knopf steht im
Reiter ⚙️ Einstellungen im letzten Kasten `#install-box` hinten (`data-in`). Als installierte App verschwinden Knopf und
Kasten. Im Vorrat (`?v=1`), Cache `company-brain-v0-19`. Gemessen im Browser: sichtbar als letztes Element, als App weg,
Meldung lesbar, `getInstallabilityErrors` leer, App-Id `/index.html` (eigene Adresse, kein `id` im Manifest).
`npm test` grün (die Probe zur KI-Reinigung braucht `WFPDF_KLON`, sonst „nicht lauffähig“). Am Tablet nicht gemessen.

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

## ⬇ Installieren auch oben in der Kopfleiste (Klaus 2026-10-18)

Klaus: *„da, wo der Installationsbutton in den Einstellungen zu finden ist, vermutet keiner, dass er die App installieren
kann … setze den Installationsbutton oben in die Navi-Leiste zusätzlich.“* Dieselbe Datei `assets/installieren.js`
(unverändert, Sage `e0644084…c3`) setzt jetzt zwei Knöpfe: `data-vor="install-platz"` rechts in der Kopfzeile und weiter
`data-in="#install-box"` in den Einstellungen. Als installierte App sind beide weg. `#install-platz` (Klasse `kopfknopf`,
unsichtbar) hält den Platz frei, bis der Knopf davor steht. Bis 620 px nur ⬇, bis 420 px Abstand 10 px und Knopf 34 px.
Gemessen im Browser (Kopfhöhe vorher → nachher): 320 px 91 → 111 (der Untertitel bricht in eine dritte Zeile) ·
360 px 91 → 91 · 412 px 91 → 91 · 1280 px 71 → 71, kein Querlaufen, CLS 0; als App beide weg; Tipp ohne Angebot →
lesbare Meldung; `getInstallabilityErrors` leer. Cache `company-brain-v0-20`. `npm test` grün (mit `WFPDF_KLON`).
⚠ Am Tablet nicht gemessen.
