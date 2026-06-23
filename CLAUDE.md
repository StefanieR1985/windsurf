# CLAUDE.md – Move-in2Stay

Kontextdokument für Claude Code beim Übernehmen einer Session in diesem Repo.

## Projekt

**move-in2stay-website** – Next.js 15 Website für eine Vermietung möblierter Apartments
und Monteurzimmer (Leipzig, Halle, Merseburg, Delitzsch, Bitterfeld). Inhaberin: Stefanie
Ressel. Buchungsplattformen: Lodgify (primär) und Booking.com.

Plus: 6 importierbare n8n-Workflow-JSONs für Operations-Automation (Telegram-Bot,
E-Mail-Klassifizierung, Buchungs-Pushes, Briefings, Bewertungen).

## Stack

- **Framework**: Next.js 15.1 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS 3.4 mit eigenen Farben (`primary`, `navy`, `accent` in `tailwind.config.ts`)
- **Icons**: `lucide-react`
- **Build-Output**: `output: "export"` → statischer Export nach `dist/`
- **Hosting**: Netlify (Konfig in `netlify.toml`, Plugin `@netlify/plugin-nextjs`)
- **Daten**: Lodgify v2 API für Apartments (`src/lib/lodgify.ts`, fester Property-ID-Mapping)
- **Automation**: n8n (selbst-gehostet oder Cloud), Telegram-Bot, Anthropic Claude API

> Wichtig: Wegen `output: "export"` sind **keine Next.js API-Routes oder SSR-Features**
> verwendbar. Alles, was Server-Code bräuchte (Form-Submission, Webhook-Endpoint, etc.),
> muss client-seitig oder über externe Services (n8n) gelöst werden.

## Repo-Layout

```
src/
  app/              # Next.js App-Router Pages
    page.tsx        # Startseite
    kontakt/        # Kontaktformular (sendet an n8n-Webhook)
    buchung/        # Buchungsseite (linkt zu Lodgify)
    standorte/      # Städteseiten (leipzig, halle, merseburg, delitzsch, bitterfeld)
    investieren/, ueber-uns/, blog/, via-regia/, datenschutz/, impressum/, unterkuenfte/
  components/       # React-Komponenten (Navbar, Footer, Hero, ContactForm, ...)
  lib/
    lodgify.ts      # Lodgify-API-Client + PROPERTY_MAPPING (alle 26 Apartments)
    n8n.ts          # Client-Side n8n-Webhook-Helper
n8n/
  README.md         # n8n-Setup-Anleitung
  workflows/        # 6 importierbare Workflow-JSONs
public/             # Statische Assets
.env.example        # Doku der Env-Variablen
next.config.js, netlify.toml, tailwind.config.ts, tsconfig.json
```

## Environment-Variablen

| Variable | Pflicht | Verwendung |
|---|---|---|
| `LODGIFY_API_KEY` | ja | Server-seitiger Lodgify-Aufruf in `src/lib/lodgify.ts` |
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | für Kontaktformular | Client-seitiger POST an n8n-Workflow |

Hinweis: `LODGIFY_API_KEY` hat aktuell einen hartcodierten Fallback in `lodgify.ts:2`,
der nur Lese-Operationen für öffentliche Property-Daten erlaubt. Bei produktivem Setup
unbedingt via Env-Variable überschreiben.

## n8n-Integration

### Kontaktformular → n8n

`/kontakt` ist eine Client-Komponente (`src/components/ContactForm.tsx`), die per
`sendToN8n()` (in `src/lib/n8n.ts`) an `NEXT_PUBLIC_N8N_WEBHOOK_URL` POSTet. Felder:
`firstName, lastName, email, phone, subject, message, privacy, pageUrl, receivedAt,
source: 'movein2stay-website', form: 'kontakt'`. Honeypot-Feld `website` erkennt Bots.

### Workflow-JSONs (`n8n/workflows/`)

1. **`01-email-classifier-router.json`** – IMAP-Trigger → deterministischer Pre-Classifier
   (Keywords `gebucht`, `Buchung`, `Reservierung` u. a., Banking-False-Positives ausgefiltert)
   → fallback Claude → Switch routet in 4 Telegram-Gruppen.
2. **`02-booking-com-new-reservation.json`** – Booking-Webhook → Signatur-Check →
   Claude-Welcome-Mail-Entwurf → SMTP-Versand → Telegram-Notification.
3. **`03-morning-briefing.json`** – Cron 07:00 Europe/Berlin → Lodgify Today-Bookings →
   Claude-Briefing → Telegram.
4. **`04-telegram-auslastung.json`** – Telegram-Befehl `/auslastung <Monat> [Jahr]` →
   Lodgify-Bookings + Properties → Belegungs-Berechnung → Top/Bottom-3 → Telegram-Reply.
5. **`05-booking-review-response.json`** – Booking-Review-Webhook → Claude (Opus 4.7)
   entwirft Antwort → Telegram mit Inline-Buttons (Senden / Bearbeiten).
6. **`06-telegram-freie-wohnung.json`** – Telegram-Befehl `/freie_wohnung <Stadt>
   <von>-<bis>` → Lodgify-Availability + Properties → Liste mit Preisen.

Credentials und Chat-IDs sind als Platzhalter (`REPLACE_ME_*`, `$vars.TELEGRAM_CHAT_*`)
hinterlegt; werden nach dem Import in n8n konfiguriert. Details in `n8n/README.md`.

## Branch- und Commit-Konventionen

- **Branches**: Claude arbeitet immer auf `claude/<task>-<suffix>`-Branches (z. B.
  `claude/install-n8n-integration-VUzcx`). Nicht auf `main` pushen.
- **Commits**: Kurze deutsche/englische Mischsprache, prägnant, Fokus aufs „warum".
  Co-Author-Footer wird automatisch angehängt.
- **PR-Workflow**: Nach Push immer Draft-PR via `mcp__github__create_pull_request` öffnen,
  wenn nicht schon einer existiert.
- **Git-Operationen**: NIEMALS `--no-verify`, `--no-gpg-sign`, force-push auf `main`,
  oder `-A` beim Staging (Secrets könnten reinrutschen). `.env.local` ist gitignored.

## Lokale Entwicklung

```bash
npm install
npm run dev          # Dev-Server auf http://localhost:3000
npm run build        # Statischer Export → dist/
npm run lint         # Next-Lint (interaktiv beim ersten Aufruf – einmal "Strict" wählen)
npx tsc --noEmit     # Typecheck ohne Emit
```

`tsconfig.tsbuildinfo` ist gitignored.

## Häufige Tasks (Spielregeln)

- **Neue Stadt-Seite**: Datei in `src/app/standorte/<stadt>/page.tsx` anlegen, dem
  Schema der bestehenden Städteseiten folgen, `Navbar`-Link in `src/components/Navbar.tsx`
  ergänzen. Property-IDs ggf. in `src/lib/lodgify.ts` PROPERTY_MAPPING ergänzen.
- **Neuer Workflow**: JSON nach `n8n/workflows/NN-name.json` legen, in `n8n/README.md`
  Tabelle ergänzen. JSON immer mit `python3 -c "import json; json.load(open('...'))"` validieren.
- **Lodgify-Property hinzufügen**: ID + city + area + code in `PROPERTY_MAPPING`
  (`src/lib/lodgify.ts`) eintragen.
- **Kontaktformular-Felder ändern**: `src/components/ContactForm.tsx` UND das Payload-Schema
  in `src/lib/n8n.ts`-Dokumentation gleichzeitig anpassen.

## Bekannte Punkte / TODO

- Lodgify-API gibt aktuell beim Build 403 für die Properties-Abfrage – API-Key prüfen.
- `NEXT_PUBLIC_N8N_WEBHOOK_URL` muss vom Operator (Stefanie) gesetzt werden, sobald der
  n8n-Workflow live ist. Bis dahin zeigt das Formular eine freundliche Fehlermeldung.
- Workflow 02 und 05 setzen einen Booking.com-Webhook-Signaturheader (`X-Booking-Signature`)
  voraus; den echten Header-Namen muss man im Booking-Partner-Hub verifizieren.
- Telegram-Chat-IDs (`TELEGRAM_CHAT_ANFRAGEN`, `_BUCHUNGEN`, `_BEWERTUNGEN`,
  `_SONSTIGES`, `_BRIEFING`, `_OPS`) müssen als n8n-Workflow-Variablen gesetzt werden.

## Operator-Kontext

- **Stefanie Ressel** (Inhaberin, primärer User) – nicht-technisch, kommuniziert in
  Deutsch. Antworten kurz und konkret halten, Setup-Schritte step-by-step. Kontakt:
  moveinn2stay@gmail.com.
- Telegram-Bot ist bereits via @BotFather angelegt.
- API-Zugänge vorhanden: Lodgify, Anthropic, Booking.com Partner, Telegram Bot Token.
  BedBooking ist **nicht** verfügbar – stattdessen wird Lodgify benutzt.
