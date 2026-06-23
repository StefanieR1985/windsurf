# Move-in2Stay – n8n Automation Workflows

Diese Workflows automatisieren die operativen Abläufe von Move-in2Stay (Buchungen,
Anfragen, Tages-Briefing, Bewertungen, Verfügbarkeitsabfragen) und liefern alle
Ergebnisse zur Freigabe in dedizierte Telegram-Gruppen.

## Inhalt

| Datei | Use Case | Trigger |
|---|---|---|
| `workflows/01-email-classifier-router.json` | E-Mails klassifizieren und in passende Telegram-Gruppen routen (Anfrage / Buchung / Bewertung / Sonstiges) | IMAP-Email-Trigger |
| `workflows/02-booking-com-new-reservation.json` | Neue Booking.com-Reservierung → Begrüßungs-E-Mail-Entwurf, Reinigungs-Task, Telegram-Notification | HTTP-Webhook (Booking.com Reservation Push) |
| `workflows/03-morning-briefing.json` | Tagesbriefing 07:00 Uhr (Check-ins/-outs heute via Lodgify) | Cron |
| `workflows/04-telegram-auslastung.json` | Telegram-Befehl `/auslastung <Monat>` rechnet Belegung über Lodgify | Telegram Bot Trigger |
| `workflows/05-booking-review-response.json` | Neue Booking.com-Bewertung → Antwortvorschlag mit Approve-Buttons | HTTP-Webhook (Booking.com Review Push) |
| `workflows/06-telegram-freie-wohnung.json` | Telegram-Befehl `/freie_wohnung <Stadt> <von>-<bis>` listet freie Apartments mit Preisen | Telegram Bot Trigger |

## Import in n8n

1. n8n öffnen → **Workflows** → **Import from File**.
2. Eine JSON-Datei aus `workflows/` auswählen.
3. Nach dem Import die Knoten mit roter Markierung anklicken und **Credentials** zuweisen
   (siehe Abschnitt unten).
4. Workflow per Toggle aktivieren.

> Die Workflow-JSONs enthalten Platzhalter (`REPLACE_ME_*`) für IDs, Chat-IDs und
> Credential-Referenzen. Nach dem Import konfigurierst du sie in der n8n-UI.

## Benötigte Credentials in n8n

| Credential | Typ | Verwendung |
|---|---|---|
| `Telegram Move-in2Stay Bot` | Telegram API | alle Telegram-Sende-/Trigger-Knoten |
| `Lodgify API` | HTTP Header Auth (`X-ApiKey: <KEY>`) | Lodgify-Property- und Verfügbarkeits-Abfragen |
| `Anthropic Claude` | Anthropic API | Klassifizierung, Briefings, Antwort-Entwürfe |
| `Move-in2Stay IMAP` | IMAP | E-Mail-Trigger für Workflow 01 |
| `Move-in2Stay SMTP` | SMTP | Versand der Begrüßungs-/Antwort-E-Mails |
| `Booking.com Webhook Secret` | HTTP Header Auth | Validierung eingehender Booking.com-Webhooks |

## Telegram-Gruppen (Chat-IDs)

Lege pro Kategorie eine Gruppe an, füge den Bot als Admin hinzu, und trage die
numerische Chat-ID (negative Zahl bei Gruppen) in n8n als **Workflow-Variablen**
oder direkt im JSON ein. Empfohlene Aufteilung:

| Variable | Beschreibung |
|---|---|
| `TELEGRAM_CHAT_ANFRAGEN` | E-Mail- und Telefon-Anfragen, Antwort-Entwürfe |
| `TELEGRAM_CHAT_BUCHUNGEN` | Neue Buchungen (Booking.com, Lodgify) |
| `TELEGRAM_CHAT_BEWERTUNGEN` | Bewertungen + Antwortvorschläge |
| `TELEGRAM_CHAT_BRIEFING` | Tägliches 7:00-Uhr-Briefing |
| `TELEGRAM_CHAT_OPS` | Befehle wie `/auslastung`, `/freie_wohnung` |
| `TELEGRAM_CHAT_SONSTIGES` | Fallback für nicht klassifizierbare E-Mails |

**Chat-ID herausfinden**: Bot in die Gruppe einladen, irgendeine Nachricht
schreiben, dann `https://api.telegram.org/bot<TOKEN>/getUpdates` aufrufen –
in der Antwort steht `chat.id`.

## Lodgify-Endpoints (Referenz)

- `GET https://api.lodgify.com/v2/properties` – Apartments
- `GET https://api.lodgify.com/v2/reservations/bookings?stayFilter=Today` – Heutige Buchungen
- `GET https://api.lodgify.com/v2/availability?from=YYYY-MM-DD&to=YYYY-MM-DD` – Verfügbarkeit
- `GET https://api.lodgify.com/v2/quote/{propertyId}` – Preis-Quote

Header: `X-ApiKey: <LODGIFY_KEY>`, `Accept: application/json`.

## Anthropic-Modell

Standardmodell in allen Claude-Knoten: `claude-sonnet-4-6` (gutes Verhältnis
aus Qualität und Kosten). Für besonders sensitive Antworten (Bewertungen,
formelle Korrespondenz) kann `claude-opus-4-7` gesetzt werden.

## Sicherheit

- **Booking.com-Webhook**: Header `X-Booking-Signature` (oder vergleichbar) im
  ersten Knoten prüfen – sonst Workflow abbrechen.
- **Telegram-Trigger**: Nur Befehle aus erlaubten Chat-IDs akzeptieren – ein
  IF-Knoten direkt nach dem Trigger filtert fremde Anfragen weg.
- **Anthropic**: Keine personenbezogenen Daten loggen; n8n-Execution-Daten regelmäßig
  bereinigen (Settings → Workflow → "Save Manual Executions" auf `false`).
