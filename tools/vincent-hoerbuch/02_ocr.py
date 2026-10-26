#!/usr/bin/env python3
"""Schritt 2: Texterkennung auf allen Aufnahmen.

Liest die Bilder aus vincent_screens, erkennt den Text (Standard: Niederlaendisch)
und schreibt eine bereinigte Fassung nach vincent_nl.txt.

Beispiele:
    python3 02_ocr.py
    python3 02_ocr.py --sprache deu --ausgabe Vincent_Hoerbuch/vincent_de_original.txt
    python3 02_ocr.py --pruefen        # nur die Voraussetzungen testen
"""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

import textclean

try:
    import pytesseract
    from PIL import Image, ImageOps
except ImportError as exc:  # pragma: no cover
    sys.exit(f"Fehlendes Paket: {exc.name}\nBitte installieren:  pip install -r requirements.txt")


def tesseract_pruefen(sprache: str) -> None:
    """Bricht mit einer verstaendlichen Meldung ab, wenn Tesseract fehlt."""
    if not shutil.which("tesseract") and not getattr(pytesseract.pytesseract, "tesseract_cmd", None):
        sys.exit(
            "Das Programm 'tesseract' wurde nicht gefunden.\n"
            "  Windows: https://github.com/UB-Mannheim/tesseract/wiki installieren,\n"
            "           danach in diesem Skript den Pfad setzen oder Tesseract in den PATH legen.\n"
            "  macOS:   brew install tesseract tesseract-lang\n"
            "  Linux:   sudo apt install tesseract-ocr tesseract-ocr-nld tesseract-ocr-deu"
        )
    try:
        vorhanden = set(pytesseract.get_languages(config=""))
    except Exception:
        return  # Abfrage nicht moeglich - dann beim ersten Bild sehen wir es.
    if sprache not in vorhanden:
        sys.exit(
            f"Das Sprachpaket '{sprache}' fehlt. Vorhanden: {', '.join(sorted(vorhanden)) or '(keins)'}\n"
            f"  Linux: sudo apt install tesseract-ocr-{sprache}\n"
            "  macOS: brew install tesseract-lang\n"
            "  Windows: beim Installieren die Sprache mit auswaehlen."
        )


def vorbereiten(bild: Image.Image, skalieren: float) -> Image.Image:
    """Hebt den Kontrast, damit Tesseract die Buchschrift sicherer liest."""
    grau = ImageOps.grayscale(bild)
    grau = ImageOps.autocontrast(grau, cutoff=2)
    if skalieren != 1.0:
        neu = (int(grau.width * skalieren), int(grau.height * skalieren))
        grau = grau.resize(neu, Image.LANCZOS)
    return grau


def main() -> int:
    p = argparse.ArgumentParser(description="Texterkennung auf den Bildschirmaufnahmen.")
    p.add_argument("--bilder", default="Vincent_Hoerbuch/vincent_screens", help="Ordner mit den Aufnahmen.")
    p.add_argument("--ausgabe", default="Vincent_Hoerbuch/vincent_nl.txt", help="Zieldatei fuer den Text.")
    p.add_argument("--sprache", default="nld", help="Tesseract-Sprache: nld (niederlaendisch) oder deu.")
    p.add_argument("--psm", default="6", help="Tesseract-Layoutmodus, 6 = ein Textblock (Standard).")
    p.add_argument("--skalieren", type=float, default=1.5, help="Bilder vor der Erkennung vergroessern (Standard 1.5).")
    p.add_argument("--rohtext", action="store_true", help="Zusaetzlich den unbereinigten Text je Seite ablegen.")
    p.add_argument("--pruefen", action="store_true", help="Nur Voraussetzungen und Bildanzahl pruefen.")
    args = p.parse_args()

    tesseract_pruefen(args.sprache)

    ordner = Path(args.bilder)
    bilder = sorted(ordner.glob("seite_*.png"))
    if not bilder:
        sys.exit(f"Keine Aufnahmen in {ordner.resolve()} gefunden. Bitte zuerst 01_aufnahme.py laufen lassen.")

    if args.pruefen:
        print(f"Tesseract gefunden, Sprache '{args.sprache}' verfuegbar.")
        print(f"{len(bilder)} Aufnahmen in {ordner.resolve()}")
        return 0

    print(f"{len(bilder)} Aufnahmen, Sprache '{args.sprache}'. Das dauert etwa 1-2 Sekunden je Seite.\n")
    konfiguration = f"--psm {args.psm}"
    seiten: list[str] = []
    leer = 0

    for i, datei in enumerate(bilder, start=1):
        with Image.open(datei) as bild:
            text = pytesseract.image_to_string(
                vorbereiten(bild, args.skalieren), lang=args.sprache, config=konfiguration
            )
        seiten.append(text)
        if not text.strip():
            leer += 1
        if i % 10 == 0 or i == len(bilder):
            print(f"  {i}/{len(bilder)} Seiten erkannt", end="\r", flush=True)
    print()

    if args.rohtext:
        rohordner = Path(args.ausgabe).parent / "ocr_rohtext"
        rohordner.mkdir(parents=True, exist_ok=True)
        for datei, text in zip(bilder, seiten):
            (rohordner / f"{datei.stem}.txt").write_text(text, encoding="utf-8")
        print(f"Rohtext je Seite: {rohordner.resolve()}")

    if leer:
        print(f"Hinweis: {leer} Seite(n) ohne erkannten Text - bitte diese Bilder ansehen.")

    text = textclean.seiten_zu_text(seiten)
    ziel = Path(args.ausgabe)
    ziel.parent.mkdir(parents=True, exist_ok=True)
    ziel.write_text(text, encoding="utf-8")

    woerter = len(text.split())
    print(f"\nGeschrieben: {ziel.resolve()}")
    print(f"  {len(text):,} Zeichen, etwa {woerter:,} Woerter, {text.count(chr(10) + chr(10)) + 1} Absaetze")
    print(
        "\nBitte jetzt die Datei oeffnen und ueberfliegen. Typische Fehler der Texterkennung\n"
        "sind verwechselte Buchstaben und zerrissene Absaetze - das hoert man spaeter deutlich.\n"
        "Weiter mit:  python3 03_kapitel.py"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
