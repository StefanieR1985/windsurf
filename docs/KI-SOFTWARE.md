# KI-Software bei move-in2stay

Diese Seite beschreibt, welche KI-Werkzeuge wir nutzen, wie sie installiert
werden und wofuer sie gedacht sind.

## Schnellstart

Zwei Skripte, je nach Rechner. Beide sind idempotent – ein zweiter Durchlauf
ueberspringt alles, was schon da ist.

### macOS und Linux

```bash
# CLI-Agenten, Python-Umgebung, Ollama und Playwright
./scripts/setup-ki-tools.sh

# zusaetzlich Desktop-Apps und lokale Modelle (mehrere GB Download)
./scripts/setup-ki-tools.sh --all

# vorher anschauen, was passieren wuerde
./scripts/setup-ki-tools.sh --all --dry-run
```

### Windows

```powershell
# Werkzeuge installieren und Arbeitsprojekt anlegen
powershell -ExecutionPolicy Bypass -File .\scripts\setup-ki-laptop.ps1

# zusaetzlich die Desktop-Apps
powershell -ExecutionPolicy Bypass -File .\scripts\setup-ki-laptop.ps1 -Desktop

# vorher anschauen, was passieren wuerde
powershell -ExecutionPolicy Bypass -File .\scripts\setup-ki-laptop.ps1 -DryRun
```

Das Windows-Skript installiert ueber `winget` (Git, Node.js, Python, uv,
Ollama), holt die CLI-Agenten und legt anschliessend unter
`%USERPROFILE%\KI-Arbeitsplatz` ein fertiges Projekt an:

    .venv\                     Python-Umgebung mit den KI-Bibliotheken
    .env                       Vorlage fuer die API-Keys
    beispiele\frage-claude.py  eine Frage an Claude schicken
    beispiele\transkribiere.py Sprachaufnahme lokal in Text verwandeln
    notizen\                   Ablage fuer Audiodateien und Texte
    requirements.txt           Liste der Python-Pakete

Der Ordner laesst sich mit `-ProjectPath` frei waehlen. Vorhandene Dateien
werden nie ueberschrieben. Paket-IDs von `winget` aendern sich gelegentlich –
findet das Skript eine nicht, nennt es den Download-Link statt still zu
scheitern.

## Was installiert wird

### CLI-Agenten (Terminal)

Agenten, die im Terminal Code lesen und schreiben – das ist die Kategorie, mit
der wir diese Website weiterentwickeln.

| Werkzeug | Befehl | Anbieter | Anmeldung |
|---|---|---|---|
| Claude Code | `claude` | Anthropic | Abo oder `ANTHROPIC_API_KEY` |
| Codex CLI | `codex` | OpenAI | ChatGPT-Konto oder `OPENAI_API_KEY` |
| Gemini CLI | `gemini` | Google | Google-Konto oder `GEMINI_API_KEY` |
| Kimi CLI | `kimi` | Moonshot AI | `MOONSHOT_API_KEY` |

### Desktop-Apps (`--desktop`)

| App | Wofuer | Download |
|---|---|---|
| Wispr Flow | Diktieren in jedes Textfeld – gut fuer Exposés, Mails und Besichtigungsnotizen | https://wisprflow.ai/ |
| Perplexity | Recherche mit Quellenangaben (Marktdaten, Foerderprogramme, Wettbewerb) | https://www.perplexity.ai/personal-computer |
| Claude | Chat mit Dateianhang, Projekte | https://claude.com/download |
| ChatGPT | Chat, Bildgenerierung | https://chatgpt.com/download |
| LM Studio | Modelle lokal mit Oberflaeche ausprobieren | https://lmstudio.ai/ |
| Ollama | lokale Modelle im Hintergrund | https://ollama.com/download |

Wispr Flow braucht beim ersten Start die Rechte fuer **Mikrofon** und
**Bedienungshilfen**, sonst schreibt es nicht in andere Programme.
Perplexity bietet zusaetzlich den Browser *Comet* an
(https://www.perplexity.ai/comet) – der ist im Setup bewusst nicht dabei.

### Lokale Modelle (Ollama)

```bash
ollama pull llama3.2          # kleines Allzweckmodell, ca. 2 GB
ollama pull qwen2.5-coder:7b  # fuer Code, ca. 5 GB
ollama run llama3.2           # Chat im Terminal
```

Laeuft komplett auf dem eigenen Rechner: keine API-Kosten, keine Daten nach
aussen. Dafuer schwaecher als die grossen Modelle und braucht Arbeitsspeicher
(Faustregel: RAM in GB mindestens doppelt so gross wie das Modell).

### Playwright (Browser-Automatisierung)

Playwright steuert einen echten Browser – fuer Klicktests der Website und als
Werkzeug fuer KI-Agenten, die Seiten bedienen oder auslesen sollen.

```bash
./scripts/setup-ki-tools.sh --playwright   # Paket + Browser installieren
npm run test:e2e                           # Testlauf gegen den Dev-Server
```

Der Browser wird nach dem Paket installiert (`npx playwright install chromium`).
Unter **Linux** braucht dieser Schritt einmalig root-Rechte fuer die
Systembibliotheken – das Skript ruft dafuer `sudo playwright install-deps` auf.
Ohne `sudo` laesst es sich spaeter nachholen:

```bash
sudo npx playwright install-deps
npx playwright install chromium
```

Unter **macOS** sind keine Sonderrechte noetig. Mehrere Browser:
`PLAYWRIGHT_BROWSERS="chromium firefox webkit" ./scripts/setup-ki-tools.sh --playwright`.

Die Tests liegen in `tests/e2e/`, die Konfiguration in `playwright.config.ts`.
Der Dev-Server wird automatisch gestartet. Bringt eine Umgebung ihren eigenen
Chromium mit (Container, CI-Image), zeigt `PLAYWRIGHT_CHROMIUM_PATH` darauf.

### Python-Umgebung

Das Setup legt eine virtuelle Umgebung unter `~/.ki-tools/venv` an und
installiert `requirements-ai.txt`:

```bash
source ~/.ki-tools/venv/bin/activate
```

Enthalten sind die offiziellen SDKs (`anthropic`, `openai`, `google-genai`) und
`faster-whisper` fuer lokale Spracherkennung:

```python
from faster_whisper import WhisperModel

model = WhisperModel("base", device="cpu", compute_type="int8")
segments, info = model.transcribe("besichtigung.m4a", language="de")
for segment in segments:
    print(segment.text)
```

Nicht enthalten ist `litellm`: es verlangt `openai<3` und blockiert damit die
aktuelle OpenAI-SDK. Wer es braucht, installiert es in eine eigene venv.

## API-Keys

| Anbieter | Umgebungsvariable | Key anlegen |
|---|---|---|
| Anthropic | `ANTHROPIC_API_KEY` | https://console.anthropic.com/settings/keys |
| OpenAI | `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| Google | `GEMINI_API_KEY` | https://aistudio.google.com/apikey |
| Perplexity | `PERPLEXITY_API_KEY` | https://www.perplexity.ai/account/api/keys |
| Moonshot (Kimi) | `MOONSHOT_API_KEY` | https://platform.moonshot.ai/console/api-keys |

Fuer das Terminal einmalig in `~/.zshrc` eintragen, fuer die Website in
`.env.local` (Vorlage: `.env.example`). `.env.local` steht in `.gitignore` und
darf **nie** committet werden.

### Kosten

Abgerechnet wird pro einer Million Token (grob: 1 Token ≈ 0,75 Woerter), Eingabe
und Ausgabe getrennt. Zum Einordnen die Anthropic-Preise (Stand Juni 2026):

| Modell | Eingabe / 1 Mio. | Ausgabe / 1 Mio. |
|---|---|---|
| Claude Opus 5 | 5 $ | 25 $ |
| Claude Sonnet 5 | 2 $ | 10 $ |
| Claude Haiku 4.5 | 1 $ | 5 $ |

Aktuelle Preise der anderen Anbieter: [OpenAI](https://openai.com/api/pricing/),
[Google](https://ai.google.dev/pricing),
[Perplexity](https://docs.perplexity.ai/getting-started/pricing),
[Moonshot](https://platform.moonshot.ai/docs/pricing). Fuer alle Anbieter gilt:
im Konto ein Ausgabenlimit setzen, bevor Keys in Skripte wandern.

## Nutzung in der Website

`src/lib/ai.ts` buendelt die Anbieter. Aufrufe laufen ueber `getModel()` und
funktionieren fuer jeden Anbieter gleich:

```ts
import { generateText } from 'ai';
import { getModel } from '@/lib/ai';

// Standard ist Claude; 'gpt', 'gemini', 'perplexity', 'kimi' und 'local' gehen genauso.
const { text } = await generateText({
  model: getModel('claude'),
  prompt: 'Formuliere eine freundliche Absage auf diese Mietanfrage: ...',
});
```

Wichtig: nur serverseitig aufrufen (Route Handler oder Server Component). Die
API-Keys duerfen nicht in den Browser gelangen – `getModel()` bricht dort
absichtlich mit einer Fehlermeldung ab.

Welche Keys gesetzt sind, verraet `availableProviders()`.

## Datenschutz

Wir arbeiten mit Mieterdaten, deshalb gilt:

- **Personenbezogene Daten** (Namen, Adressen, Ausweisdaten, Mietvertraege)
  gehen nicht ungeprueft an eine Cloud-API. Entweder vorher anonymisieren oder
  lokal mit Ollama verarbeiten.
- Fuer den regulaeren Einsatz einer Cloud-API braucht es einen
  Auftragsverarbeitungsvertrag (AVV) mit dem Anbieter. Alle oben genannten
  Anbieter stellen einen bereit, er muss aber aktiv abgeschlossen werden.
- Die API-Konten der Anbieter nutzen Eingaben standardmaessig nicht zum
  Training – die kostenlosen Chat-Oberflaechen teilweise schon. Fuer
  Geschaeftsdaten also die API oder ein bezahltes Business-Konto verwenden.
- Diktate mit Wispr Flow laufen ueber deren Server. Fuer vertrauliche Gespraeche
  besser lokal mit `faster-whisper` transkribieren.

Das ist eine Arbeitsgrundlage, kein Rechtsrat.

## Fehlersuche

| Problem | Loesung |
|---|---|
| `EACCES` bei `npm install -g` | `npm config set prefix ~/.npm-global` und `export PATH=$HOME/.npm-global/bin:$PATH` in `~/.zshrc` |
| `kimi: command not found` | `~/.local/bin` liegt nicht im `PATH` – Zeile in `~/.zshrc` ergaenzen |
| Whisper meldet fehlendes `ffmpeg` | `brew install ffmpeg` bzw. `sudo apt-get install ffmpeg` |
| Ollama antwortet nicht | laeuft der Dienst? `ollama serve` bzw. die Ollama-App starten |
| Playwright: `Executable doesn't exist` | `npx playwright install chromium` – der Browser passt zur Playwright-Version |
| Playwright startet unter Linux nicht | `sudo npx playwright install-deps` |
| Key fehlt trotz Eintrag | neues Terminal oeffnen oder `source ~/.zshrc` |
