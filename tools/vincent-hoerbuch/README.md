# Vincent – Hörbuch-Pipeline

Werkzeuge, um aus einem selbst gekauften E-Book eine vorgelesene Fassung zu
machen – als barrierefreie Privatkopie im Rahmen eines schulischen
Nachteilsausgleichs.

## Bitte zuerst lesen

**Es gibt eine deutsche Übersetzung des Buches.** Enne Koens: *Ich bin Vincent
und ich habe keine Angst*, aus dem Niederländischen von Andrea Kluitmann,
Gerstenberg 2019, 192 Seiten, ISBN 978-3-8369-5679-6.

Das ist der deutlich bessere Weg, und zwar aus einem sachlichen Grund: Dieser
Ablauf hat zwei Stellen, an denen Qualität verloren geht – die Texterkennung
(verwechselte Buchstaben, zerrissene Absätze) und die maschinelle Übersetzung.
Bei einem Kinderroman trifft Letzteres genau das, was zählt: Rhythmus, Tonfall,
wörtliche Rede. Eine Maschine schreibt hier steifes Deutsch, wo eine
Übersetzerin einen Klang gefunden hat. Für ein Kind, dem das Zuhören das Lesen
ersetzen soll, ist das der Unterschied zwischen einem Buch und einem Text.

Deshalb die Empfehlung, der Reihe nach:

1. **Nach einem deutschen Hörbuch suchen.** Dann ist überhaupt nichts zu tun.
   Bei Verlag, Buchhandel, Audible und in der Stadtbibliothek Leipzig fragen
   (Onleihe). Auch die Büchereien führen oft Hörbücher für den
   Nachteilsausgleich.
2. **Für Kilian als Blindenhörbuch-Berechtigten prüfen:** Bei einem
   anerkannten Nachteilsausgleich wegen einer Lesebeeinträchtigung bekommt man
   über die **dzb lesen** in Leipzig und den **Medibus**-Verbund fertige
   Hörfassungen – kostenlos, von Menschen gelesen, legal. Das ist genau der
   Zweck dieser Einrichtungen, und die dzb lesen sitzt in Leipzig.
3. **Deutsche Ausgabe kaufen** und diesen Ablauf nur für Schritt 1, 2, 3, 5, 6
   nutzen – also ohne Übersetzung. Dann fällt die größte Fehlerquelle weg:

   ```
   python3 01_aufnahme.py --bereich ...
   python3 02_ocr.py --sprache deu --ausgabe Vincent_Hoerbuch/vincent_de.txt
   python3 03_kapitel.py --quelle Vincent_Hoerbuch/vincent_de.txt --ziel Vincent_Hoerbuch/kapitel_de
   python3 05_audio.py
   python3 06_uebersicht.py
   ```
4. **Nur wenn nichts davon geht:** der vollständige Weg aus dem
   niederländischen Original, mit Übersetzung. Dafür ist alles hier vorbereitet.

## Rechtlicher Rahmen

Diese Werkzeuge **umgehen keinen Kopierschutz**. Sie fotografieren nur, was auf
dem Bildschirm zu sehen ist. Es ist kein DeDRM, kein Calibre-Plugin und kein
Eingriff in die Lese-App beteiligt.

`01_aufnahme.py` bricht ab, wenn die Aufnahmen einfarbig sind. Genau so sieht
es aus, wenn eine Lese-App Bildschirmaufnahmen selbst unterbindet. Das ist eine
technische Schutzmaßnahme, und an der Stelle endet der Weg – sie wird nicht
umgangen. Dann gilt die Empfehlung oben.

Der Rahmen, in dem das hier läuft: Das Buch ist gekauft, die Kopie entsteht in
einem barrierefreien Format für den eigenen Gebrauch einer Person mit
Leseeinschränkung, und sie wird nicht weitergegeben und nicht veröffentlicht
(§ 45b und § 53 UrhG). Dabei sollte es bleiben – die Dateien gehören auf das
Gerät von Kilian und sonst nirgendwohin.

## Einrichten

Python 3.10 oder neuer.

```bash
pip install -r requirements.txt
```

Dazu kommen zwei Programme, die nicht über pip kommen:

| Programm | Windows | macOS | Linux |
| --- | --- | --- | --- |
| Tesseract (Texterkennung) | [Installer von UB Mannheim](https://github.com/UB-Mannheim/tesseract/wiki), beim Installieren **Dutch** und **German** mit auswählen | `brew install tesseract tesseract-lang` | `sudo apt install tesseract-ocr tesseract-ocr-nld tesseract-ocr-deu` |
| ffmpeg (Audio zusammenfügen) | `winget install Gyan.FFmpeg` | `brew install ffmpeg` | `sudo apt install ffmpeg` |

Unter Windows muss Tesseract im PATH liegen. Sonst oben in `02_ocr.py`
ergänzen:

```python
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
```

Prüfen, ob alles da ist:

```bash
python3 02_ocr.py --pruefen
python3 05_audio.py --stimmen
python3 test_textclean.py
```

## Ablauf

### Schritt 0 – Kindle vorbereiten

Vor dem Start der Aufnahme:

- Das Buch ist offen und steht auf **der ersten Seite**.
- **Kleine Schrift**, einspaltige Ansicht, schmale Ränder, kleiner
  Zeilenabstand. Je mehr Text auf eine Seite passt, desto weniger Aufnahmen und
  desto weniger Fehlerquellen.
- Bildschirmschoner und Energiesparmodus aus.
- Das Fenster wird während der Aufnahme **nicht** bewegt oder verdeckt. Der
  Rechner ist für die Dauer blockiert; bei 200 Seiten sind das etwa 8 Minuten.

### Schritt 1 – Bereich ausmessen und aufnehmen

```bash
python3 01_aufnahme.py --kalibrieren
```

Legt `kalibrierung.png` ab. Dort die Ecken des **reinen Textbereichs** ablesen –
ohne Menüleiste, ohne die Fußzeile mit der Seitenzahl. Dann:

```bash
python3 01_aufnahme.py --bereich 300,120,1320,980
```

Das Skript fragt vorher nach, wartet 10 Sekunden, nimmt auf, blättert mit der
Pfeiltaste nach rechts, wartet 1,5 Sekunden und hört auf, sobald zwei
Aufnahmen hintereinander gleich sind.

- Abbruch jederzeit mit `Strg+C`, oder die Maus in die linke obere Ecke.
- Ein erneuter Aufruf **setzt fort**, wo es aufgehört hat. Von vorn: `--neu`.
- Blättert die App nicht mit der Pfeiltaste: `--taste pagedown` oder
  `--taste space`.
- Zu schnell für die App: `--pause 2.5`.

Danach bitte zwei oder drei Bilder ansehen. Steht da kein Text, bringen die
nächsten Schritte nichts.

### Schritt 2 – Texterkennung

```bash
python3 02_ocr.py
```

Schreibt `Vincent_Hoerbuch/vincent_nl.txt`. Entfernt dabei Seitenzahlen,
Kopf- und Fußzeilen, doppelte Zeilen am Seitenübergang und setzt am
Zeilenende getrennte Wörter wieder zusammen.

Diese Datei bitte **überfliegen**. Erkennungsfehler hört man später deutlich.
Hilft die Erkennung nicht: `--skalieren 2.0` oder `--psm 4`. Mit `--rohtext`
wird der unbearbeitete Text je Seite zusätzlich abgelegt.

### Schritt 3 – Kapitel

```bash
python3 03_kapitel.py --liste   # erst ansehen
python3 03_kapitel.py           # dann schreiben
```

Erkannt werden „Hoofdstuk 3“, „Kapitel 3“, bloße Zahlen und kurze Zeilen in
Großbuchstaben. Abschnitte unter 1200 Zeichen werden an das vorige Kapitel
gehängt, damit keine Zwei-Satz-Kapitel entstehen (`--min-zeichen` ändert das).

Sieht die Teilung falsch aus: in `vincent_nl.txt` von Hand eine kurze Zeile als
Überschrift einfügen und erneut laufen lassen.

### Schritt 4 – Übersetzung

Drei Wege. **Nicht nötig, wenn die deutsche Ausgabe genutzt wird.**

```bash
python3 04_uebersetzen.py --weg blocks    # ohne Schlüssel, beste Qualität
python3 04_uebersetzen.py --weg claude    # braucht ANTHROPIC_API_KEY
python3 04_uebersetzen.py --weg deepl     # braucht DEEPL_API_KEY
```

`blocks` legt Auftragsdateien in `Vincent_Hoerbuch/zum_uebersetzen/` ab. Jede
enthält den fertigen Auftragstext samt Vorgaben – Inhalt kopieren, in die
Claude-App einfügen, die deutsche Antwort unter demselben Dateinamen in
`uebersetzt_hier_ablegen/` speichern. Dann:

```bash
python3 04_uebersetzen.py --einsammeln
```

Namen und feste Begriffe stehen in `glossar.json`. Sie gehen in den Auftrag ein
**und** werden danach noch einmal erzwungen, damit „De Jas“ nicht in einem
Kapitel „Die Jacke“ und im nächsten „Der Mantel“ heißt. Dort bitte ergänzen,
was noch auffällt.

Bitte ein Kapitel gegenlesen, bevor die Sprachausgabe läuft.

### Schritt 5 – Audio

```bash
python3 05_audio.py
```

Je Kapitel eine MP3, Stimme `de-DE-ConradNeural`, Tempo −10 %.

> **Achtung bei der Schreibweise:** Ein Wert, der mit `-` beginnt, wird sonst
> als Option gelesen. Deshalb mit Gleichheitszeichen:
> `--tempo=-15%`, nicht `--tempo -15%`.

```bash
python3 05_audio.py --stimmen                      # Stimmen auflisten
python3 05_audio.py --stimme de-DE-KatjaNeural     # weibliche Stimme
python3 05_audio.py --tempo=-15%                   # noch langsamer
python3 05_audio.py --nur 3 7                      # nur Kapitel 3 und 7
```

Vorhandene Dateien werden übersprungen (`--neu` überschreibt). Bei einem
Netzfehler wird bis zu viermal mit wachsender Wartezeit neu versucht; danach
bricht das Skript ab, statt eine halbe Datei zu hinterlassen.

Am besten eine Stimme erst an einem Kapitel hören und dann entscheiden.

### Schritt 6 – Übersicht

```bash
python3 06_uebersicht.py
```

Schreibt `Vincent_Hoerbuch/uebersicht.md` mit Kapitelanzahl, Dauer je Kapitel,
Gesamtdauer und allen Ablageorten.

## Ergebnis

```
Vincent_Hoerbuch/
  vincent_screens/      seite_0001.png …
  vincent_nl.txt        erkannter Text, bereinigt
  kapitel_nl/           kapitel_01.txt …
  kapitel_de/           kapitel_01.txt …
  vincent_de.txt        deutscher Gesamttext
  audio/                kapitel_01.mp3 …
  uebersicht.md
```

## Wenn etwas klemmt

| Problem | Ursache und Abhilfe |
| --- | --- |
| Aufnahmen sind schwarz oder leer | Bereich falsch (`--kalibrieren`), Fenster nicht im Vordergrund – oder die App blockiert Aufnahmen. Im letzten Fall ist Schluss, siehe oben. |
| Immer dieselbe Seite | Die Blättertaste passt nicht: `--taste pagedown`. |
| Hört nach wenigen Seiten auf | Zwei Aufnahmen galten als gleich. `--schwelle 1.0` macht den Vergleich strenger, `--pause 2.5` gibt der App mehr Zeit. |
| Texterkennung liefert Buchstabensalat | Schrift zu klein aufgenommen. Im Kindle größer stellen, neu aufnehmen, oder `--skalieren 2.0`. |
| Alles ist ein Kapitel | Die Überschriften sehen nicht wie Überschriften aus. `--min-zeichen 400`, oder von Hand Überschriften einfügen. |
| `--tempo -10%` wird nicht angenommen | Gleichheitszeichen nutzen: `--tempo=-10%`. |
| Sprachausgabe bricht ab | `speech.platform.bing.com` muss erreichbar sein. Hinter Firewall oder VPN schlägt das fehl. |

## Tests

```bash
python3 test_textclean.py
```

Prüft die Textbereinigung und Kapitelerkennung an erfundenen Beispielen, ohne
Kindle, Tesseract und Netz. Nach Änderungen an `textclean.py` bitte laufen
lassen.
