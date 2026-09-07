# Portfolio-Toolkit fuer Aktien und ETFs

Kommandozeilen-Werkzeug, das ein Depot aus einer CSV-Datei liest, Kurse von Yahoo Finance
laedt und Bestand, Gewinn/Verlust, Risikokennzahlen, Dividenden und einen Rebalancing-Plan
ausgibt. Alle Werte werden in eine Basiswaehrung (Standard EUR) umgerechnet.

Das Toolkit ist unabhaengig von der Website in diesem Repo. Es liegt nur hier, damit es
versioniert ist.

## Einrichtung (einmalig, auf deinem Rechner)

```bash
cd tools/portfolio
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Voraussetzung: Python 3.10 oder neuer und Internetzugang zu Yahoo Finance.

## Depot pflegen

`portfolio.csv` bearbeiten. Eine Zeile pro Position:

| Spalte          | Bedeutung                                                        |
|-----------------|------------------------------------------------------------------|
| `ticker`        | Yahoo-Ticker, z.B. `IWDA.AS`, `SAP.DE`, `AAPL`, `EIMI.L`          |
| `name`          | Anzeigename                                                      |
| `type`          | Frei waehlbar, z.B. `ETF` oder `Aktie`, dient der Gruppierung    |
| `shares`        | Stueckzahl                                                       |
| `avg_cost`      | Durchschnittlicher Einstandskurs je Stueck in der Handelswaehrung|
| `currency`      | Handelswaehrung des Tickers (`EUR`, `USD`, `GBp` fuer Pence ...)  |
| `target_weight` | Zielgewicht in Prozent, Summe idealerweise 100                   |

Die Handelswaehrung muss zum Ticker passen. Yahoo zeigt sie auf der Kursseite an.
Londoner ETFs wie `EIMI.L` notieren oft in USD, Londoner Aktien in `GBp` (Pence).

## Befehle

```bash
python portfolio.py fetch                 # Kurse + Wechselkurse laden (Standard: 5 Jahre)
python portfolio.py fetch --period max    # gesamte Historie
python portfolio.py report                # Bestand, Wert, G/V, Gewichtung vs. Ziel
python portfolio.py report --csv out.csv  # Report zusaetzlich als CSV
python portfolio.py risk                  # Vola, Sharpe, Max Drawdown, Beta zum DAX, Korrelation
python portfolio.py risk --benchmark ^GSPC --lookback 3
python portfolio.py rebalance --cash 2000 # Kauf-/Verkaufsplan inkl. 2000 EUR frischem Kapital
python portfolio.py rebalance --fractional --min-trade 25   # fuer Sparplan-Broker
python portfolio.py dividends             # Dividenden der letzten 12 Monate
```

`report`, `risk` und `rebalance` arbeiten offline aus dem Cache in `data/`. Nur `fetch` und
`dividends` brauchen Internet. `fetch` regelmaessig ausfuehren, damit die Kurse aktuell sind.

Andere Basiswaehrung: `python portfolio.py --base USD report`.
Anderes Depot: `python portfolio.py --portfolio depot-kinder.csv report`.

## Was die Kennzahlen bedeuten

- **G/V** vergleicht den heutigen Wert mit `shares * avg_cost`, beides zum aktuellen
  Wechselkurs. Waehrungsgewinne auf den Einstand werden also nicht getrennt ausgewiesen.
- **Rendite p.a. / Vola p.a.** sind annualisierte Werte aus Tagesrenditen (252 Handelstage).
- **Sharpe** = (Rendite p.a. minus risikofreier Zins) / Vola p.a. Risikofreier Zins per `--rf`.
- **Max DD** ist der groesste Rueckgang vom Hoch im betrachteten Zeitraum.
- **Beta** misst die Sensitivitaet zur Benchmark. Steht `-`, fehlt die Benchmark im Cache.
- **PORTFOLIO** rechnet mit den heutigen Gewichten als konstant ueber den Zeitraum.
  Das ist eine Naeherung, keine echte Depothistorie.
- **Rebalancing** rundet auf ganze Stuecke ab, Orders unter `--min-trade` werden
  weggelassen. Steuern und Gebuehren sind nicht beruecksichtigt.

## Grenzen

- Yahoo Finance ist eine inoffizielle Datenquelle. Ticker koennen sich aendern, Daten
  einzelner Tage fehlen. Bei leeren Spalten `fetch` spaeter erneut ausfuehren.
- Keine Anlageberatung. Die Ausgaben sind Rechenhilfen fuer eigene Entscheidungen.
- Der Cache in `data/` ist per `.gitignore` ausgeschlossen und landet nicht im Repo.

## Alternative: Kursdaten direkt in Claude

Statt Yahoo ueber dieses Skript lassen sich Marktdaten auch als Connector in claude.ai
anbinden. Im Connector-Verzeichnis gibt es unter anderem **Alpha Vantage**, **Twelve Data**
und **FMP** (Financial Modeling Prep). Einmal unter Einstellungen > Connectors verbinden,
dann kann Claude Kurse, Fundamentaldaten und Nachrichten direkt abfragen.
