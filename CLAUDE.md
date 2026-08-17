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

## Pflicht vor jeder Arbeit — frisch von `origin/main`

Die Klone im Container können **Monate alt** sein. Eine Aussage über den Stand dieses
Repos ohne vorheriges `fetch` ist **kein Beweis**.

```bash
git fetch origin --quiet
git checkout -B <branch> origin/main
```

Beim Veröffentlichen mit ausdrücklicher Refspec pushen und **danach** prüfen, ob der
Branch gegenüber `main` überhaupt etwas trägt — ein leerer PR lässt sich mergen und
meldet Erfolg:

```bash
git push -u origin refs/heads/<branch>:refs/heads/<branch>
git diff --stat origin/main origin/<branch>     # leer = der PR wäre leer
```

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
  Abgleich gelten trotzdem.
- **Cache-Bump:** `CACHE` in `sw.js` (`company-brain-vX-Y`) erhöhen, wenn eine Datei
  aus dem Vorrat sich ändert — `index.html` gehört dazu.
- Die byte-kopierten SBKIM-Module unter `modules/` werden **nicht** abgewandelt.

## Selbst-Merge-Freibrief (Klaus 2026-06-28, netzweit für ALLE Repos)

Die Sitzung merget ihre **eigenen** PRs selbstständig nach `main`, sobald sie getestet,
abgegrenzt und nicht architektonisch zweifelhaft sind — **ohne** auf ein „X mergen" zu
warten (Draft-PR → ready → squash). **Nicht** bei echtem Zweifel (Richtungsentscheid,
schwer umkehrbar, mehrere gleich gute Wege) oder wenn Klaus vorher draufschauen will.
Klaus' Browser-Sichttest läuft **nach** dem Merge auf der Live-Seite — nicht darauf
warten, sondern mergen und ihn dann sehen lassen.

Jede selbst getroffene Entscheidung wird **dokumentiert** — Commit-Nachricht, PR-Text.
Selbstständig heißt nicht unsichtbar.

## Netzweite Regeln liegen in Sage

Verbindlich für alle Knoten: **[`Sage-Protokol/docs/INTERFACES.md`](https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/INTERFACES.md)**
— Andock-Konventionen §11, Briefkasten-Pflege §11.6, Gerätename §11.7.

**🏷️ Gerätename gehört ins Verbinden-Panel (§11.7):** wer ein Panel „Mit dem Netz
verbinden" hat, hat auch das Gerätenamen-Feld **darin**. Das Feld hängt der
**app-eigene Glue** hinein (`modules/rendezvous-init.js`) — **niemals** in eine byte-kopierte
Panel-Datei schreiben. Jedes Feld trägt `data-sbkim-geraetename`; der Name geht **nur**
an Anzeige und Anmeldung, **nie** an `generateOwnSpore` (kein Spore-Re-Sign).

## Ton

Klaus ist **kein Programmierer** (lernt gern): Antworten auf **Deutsch**, ruhig und
präzise, **Einzelschritte** mit klarem Erfolgsmerkmal. **Keine Terminal-Kommandos für
Klaus** — Bedien-Flüsse laufen über benannte Knöpfe in der Seite. Nach jedem Pull
Hard-Reload, Service-Worker und HTTP-Cache sind hartnäckig.

## Kein PII, keine Geheimnisse

Keine echten personenbezogenen Fremddaten in Commits, kein privater Schlüssel, kein
Passwort, kein Token im Repo. Klaus' eigenes Impressum/Copyright ist gewollt.
