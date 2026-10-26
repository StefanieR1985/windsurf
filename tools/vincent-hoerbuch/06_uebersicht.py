#!/usr/bin/env python3
"""Schritt 6: Uebersicht ueber das fertige Hoerbuch.

Zaehlt Kapitel, misst die Gesamtdauer und schreibt uebersicht.md in den
Projektordner.

Beispiel:
    python3 06_uebersicht.py
"""

from __future__ import annotations

import argparse
import subprocess
from datetime import date
from pathlib import Path


def dauer(datei: Path) -> float:
    try:
        ergebnis = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", str(datei)],
            capture_output=True, text=True, check=True,
        )
        return float(ergebnis.stdout.strip())
    except Exception:
        return 0.0


def als_zeit(sekunden: float) -> str:
    stunden, rest = divmod(int(sekunden), 3600)
    minuten, sek = divmod(rest, 60)
    return f"{stunden}:{minuten:02d}:{sek:02d}" if stunden else f"{minuten}:{sek:02d}"


def main() -> int:
    p = argparse.ArgumentParser(description="Schreibt eine Uebersicht ueber das Ergebnis.")
    p.add_argument("--projekt", default="Vincent_Hoerbuch", help="Projektordner.")
    args = p.parse_args()

    projekt = Path(args.projekt)
    bilder = sorted((projekt / "vincent_screens").glob("seite_*.png"))
    kapitel_nl = sorted((projekt / "kapitel_nl").glob("kapitel_*.txt"))
    kapitel_de = sorted((projekt / "kapitel_de").glob("kapitel_*.txt"))
    audio = sorted((projekt / "audio").glob("kapitel_*.mp3"))

    zeilen: list[str] = []
    zeilen.append("# Vincent - Hoerbuch")
    zeilen.append("")
    zeilen.append(f"Stand: {date.today().isoformat()}")
    zeilen.append("")
    zeilen.append("Privatkopie in barrierefreiem Format fuer den eigenen Gebrauch.")
    zeilen.append("Nicht weitergeben, nicht veroeffentlichen.")
    zeilen.append("")
    zeilen.append("## Umfang")
    zeilen.append("")
    zeilen.append("| Schritt | Ergebnis |")
    zeilen.append("| --- | --- |")
    zeilen.append(f"| Aufnahmen | {len(bilder)} Seiten |")
    zeilen.append(f"| Kapitel niederlaendisch | {len(kapitel_nl)} |")
    zeilen.append(f"| Kapitel deutsch | {len(kapitel_de)} |")
    zeilen.append(f"| Audiodateien | {len(audio)} |")

    gesamt = 0.0
    if audio:
        zeilen.append("")
        zeilen.append("## Kapitel")
        zeilen.append("")
        zeilen.append("| Nr. | Datei | Dauer | Groesse |")
        zeilen.append("| --- | --- | --- | --- |")
        for nummer, datei in enumerate(audio, start=1):
            laenge = dauer(datei)
            gesamt += laenge
            groesse = datei.stat().st_size / 1_048_576
            zeilen.append(f"| {nummer:02d} | {datei.name} | {als_zeit(laenge)} | {groesse:.1f} MB |")
        zeilen.append("")
        zeilen.append(f"**Gesamtdauer: {als_zeit(gesamt)}**")
        if len(audio):
            zeilen.append("")
            zeilen.append(f"Durchschnitt je Kapitel: {als_zeit(gesamt / len(audio))}")

    zeilen.append("")
    zeilen.append("## Ablage")
    zeilen.append("")
    for beschreibung, pfad in [
        ("Bildschirmaufnahmen", projekt / "vincent_screens"),
        ("Text niederlaendisch", projekt / "vincent_nl.txt"),
        ("Kapitel niederlaendisch", projekt / "kapitel_nl"),
        ("Kapitel deutsch", projekt / "kapitel_de"),
        ("Gesamttext deutsch", projekt / "vincent_de.txt"),
        ("Audiodateien", projekt / "audio"),
    ]:
        merkmal = "vorhanden" if pfad.exists() else "fehlt noch"
        zeilen.append(f"- **{beschreibung}** ({merkmal}): `{pfad.resolve()}`")

    bericht = "\n".join(zeilen) + "\n"
    projekt.mkdir(parents=True, exist_ok=True)
    (projekt / "uebersicht.md").write_text(bericht, encoding="utf-8")

    print(bericht)
    print(f"Geschrieben: {(projekt / 'uebersicht.md').resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
