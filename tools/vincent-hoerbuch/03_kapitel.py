#!/usr/bin/env python3
"""Schritt 3: Text in Kapitel teilen.

Beispiele:
    python3 03_kapitel.py --liste                 # nur anzeigen, was erkannt wuerde
    python3 03_kapitel.py
    python3 03_kapitel.py --quelle Vincent_Hoerbuch/vincent_de.txt --ziel Vincent_Hoerbuch/kapitel_de
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import textclean


def main() -> int:
    p = argparse.ArgumentParser(description="Teilt den Buchtext in einzelne Kapiteldateien.")
    p.add_argument("--quelle", default="Vincent_Hoerbuch/vincent_nl.txt", help="Eingabedatei.")
    p.add_argument("--ziel", default="Vincent_Hoerbuch/kapitel_nl", help="Zielordner fuer kapitel_01.txt usw.")
    p.add_argument("--min-zeichen", type=int, default=1200, help="Kuerzere Abschnitte an das vorige Kapitel haengen.")
    p.add_argument("--liste", action="store_true", help="Nur die erkannten Kapitel anzeigen, nichts schreiben.")
    args = p.parse_args()

    quelle = Path(args.quelle)
    if not quelle.exists():
        sys.exit(f"Datei nicht gefunden: {quelle.resolve()}")

    kapitel = textclean.teile_kapitel(quelle.read_text(encoding="utf-8"), args.min_zeichen)
    if not kapitel:
        sys.exit("Keine Kapitel erkannt - ist die Quelldatei leer?")

    print(f"{len(kapitel)} Kapitel erkannt:\n")
    for nummer, (titel, inhalt) in enumerate(kapitel, start=1):
        minuten = len(inhalt.split()) / 130  # etwa 130 Woerter je Minute bei ruhigem Tempo
        print(f"  {nummer:02d}  {titel[:48]:<50} {len(inhalt):>7,} Zeichen  ~{minuten:4.1f} min")

    if args.liste:
        print(
            "\nNur angezeigt, nichts geschrieben. Sieht die Teilung falsch aus, hilft\n"
            "--min-zeichen, oder im Text von Hand eine Zeile als Ueberschrift setzen\n"
            "(kurze Zeile in Grossbuchstaben oder 'Kapitel 7')."
        )
        return 0

    ziel = Path(args.ziel)
    ziel.mkdir(parents=True, exist_ok=True)
    for nummer, (titel, inhalt) in enumerate(kapitel, start=1):
        datei = ziel / f"kapitel_{nummer:02d}.txt"
        datei.write_text(f"{titel}\n\n{inhalt}\n", encoding="utf-8")

    print(f"\n{len(kapitel)} Dateien geschrieben nach {ziel.resolve()}")
    print("Weiter mit:  python3 04_uebersetzen.py     (oder direkt 05_audio.py bei deutschem Text)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
