#!/usr/bin/env python3
"""Schritt 1: Bildschirmaufnahme des Lesebereichs, Seite fuer Seite.

Nimmt den Lesebereich auf, blaettert mit der Pfeiltaste weiter und stoppt,
wenn zwei aufeinanderfolgende Aufnahmen gleich sind.

WICHTIG: Dieses Skript umgeht keinen Kopierschutz. Es fotografiert nur, was
auf dem Bildschirm zu sehen ist. Wenn die Lese-App die Bildschirmaufnahme
selbst blockiert (schwarze oder leere Bilder), bricht das Skript ab - das ist
eine technische Schutzmassnahme, und die wird nicht umgangen.

Beispiele:
    python3 01_aufnahme.py --kalibrieren
    python3 01_aufnahme.py --bereich 300,120,1320,980
    python3 01_aufnahme.py --bereich 300,120,1320,980 --pause 1.5 --max-seiten 400
"""

from __future__ import annotations

import argparse
import platform
import sys
import time
from pathlib import Path

try:
    import mss
    import numpy as np
    import pyautogui
    from PIL import Image
except ImportError as exc:  # pragma: no cover - Umgebungsproblem
    sys.exit(
        f"Fehlendes Paket: {exc.name}\n"
        "Bitte zuerst installieren:  pip install -r requirements.txt"
    )


def bereich_parsen(text: str) -> dict[str, int]:
    """'links,oben,rechts,unten' -> mss-Rechteck."""
    try:
        links, oben, rechts, unten = (int(t) for t in text.split(","))
    except ValueError:
        raise argparse.ArgumentTypeError(
            "Bereich bitte als vier Zahlen angeben: links,oben,rechts,unten"
        ) from None
    if rechts <= links or unten <= oben:
        raise argparse.ArgumentTypeError("Rechts muss groesser als links sein, unten groesser als oben.")
    return {"left": links, "top": oben, "width": rechts - links, "height": unten - oben}


def als_graustufen(bild: Image.Image, kante: int = 64) -> np.ndarray:
    """Kleines Graustufenbild als Vergleichsgrundlage.

    Das Verkleinern macht den Vergleich unempfindlich gegen einzelne
    Pixelunterschiede, etwa durch Kantenglaettung der Schrift.
    """
    return np.asarray(bild.convert("L").resize((kante, kante), Image.LANCZOS), dtype=np.float32)


def sind_gleich(a: np.ndarray, b: np.ndarray, schwelle: float = 2.0) -> bool:
    """Wahr, wenn sich zwei Aufnahmen praktisch nicht unterscheiden."""
    return float(np.abs(a - b).mean()) < schwelle


def ist_leer(bild: Image.Image) -> bool:
    """Wahr, wenn die Aufnahme einfarbig ist - also ohne Text.

    Genau so sieht es aus, wenn eine App die Bildschirmaufnahme unterbindet.
    """
    graustufen = np.asarray(bild.convert("L"), dtype=np.float32)
    return float(graustufen.std()) < 3.0


def kalibrieren(ziel: Path) -> None:
    """Nimmt den ganzen Bildschirm auf, damit der Lesebereich ausgemessen werden kann."""
    ziel.mkdir(parents=True, exist_ok=True)
    datei = ziel / "kalibrierung.png"
    print("Vollbild-Aufnahme in 10 Sekunden - bitte jetzt das Kindle-Fenster nach vorn holen.")
    for rest in range(10, 0, -1):
        print(f"  {rest} ...", end="\r", flush=True)
        time.sleep(1)
    print(" " * 20, end="\r")

    with mss.mss() as sct:
        rohbild = sct.grab(sct.monitors[0])
        bild = Image.frombytes("RGB", rohbild.size, rohbild.bgra, "raw", "BGRX")
    bild.save(datei)

    print(f"Gespeichert: {datei.resolve()}")
    print(f"Bildschirmgroesse: {bild.width} x {bild.height} Pixel")
    if ist_leer(bild):
        print(
            "\nACHTUNG: Die Aufnahme ist einfarbig. Entweder war kein Fenster sichtbar,\n"
            "oder die Lese-App blockiert Bildschirmaufnahmen. Im zweiten Fall ist hier\n"
            "Schluss - ein solcher Schutz wird nicht umgangen."
        )
        return
    print(
        "\nBitte das Bild oeffnen, die Ecken des reinen Textbereichs ablesen\n"
        "(ohne Menueleiste, ohne Fusszeile mit Seitenzahl) und dann starten mit:\n"
        "  python3 01_aufnahme.py --bereich links,oben,rechts,unten"
    )


def aufnehmen(args: argparse.Namespace) -> int:
    ziel = Path(args.ausgabe)
    ziel.mkdir(parents=True, exist_ok=True)

    vorhandene = sorted(ziel.glob("seite_*.png"))
    beginn = 1
    if vorhandene and not args.neu:
        beginn = int(vorhandene[-1].stem.split("_")[1]) + 1
        print(f"{len(vorhandene)} Aufnahmen gefunden, setze bei Seite {beginn} fort.")
        print("(Mit --neu von vorn beginnen.)")

    print(f"\nSystem: {platform.system()} {platform.release()}")
    print(f"Bereich: {args.bereich['width']} x {args.bereich['height']} Pixel")
    print(f"Blaettern mit: Taste '{args.taste}', Pause {args.pause} s")
    print(f"Ziel: {ziel.resolve()}\n")

    print("Start in 10 Sekunden. Bitte JETZT das Kindle-Fenster nach vorn holen")
    print("und die Maus nicht mehr bewegen. Abbruch jederzeit mit Strg+C.")
    for rest in range(10, 0, -1):
        print(f"  {rest} ...", end="\r", flush=True)
        time.sleep(1)
    print(" " * 20)

    vergleich_vorher: np.ndarray | None = None
    gleich_in_folge = 0
    gespeichert = 0
    nummer = beginn

    try:
        with mss.mss() as sct:
            while nummer - beginn < args.max_seiten:
                rohbild = sct.grab(args.bereich)
                bild = Image.frombytes("RGB", rohbild.size, rohbild.bgra, "raw", "BGRX")

                # Schutzmassnahme erkannt? Dann Schluss.
                if ist_leer(bild):
                    print(
                        "\nABBRUCH: Die Aufnahme ist einfarbig - es ist kein Text darauf.\n"
                        "Moegliche Gruende:\n"
                        "  1. Der Bereich ist falsch gesetzt (mit --kalibrieren pruefen).\n"
                        "  2. Das Kindle-Fenster war nicht im Vordergrund.\n"
                        "  3. Die Lese-App blockiert Bildschirmaufnahmen.\n"
                        "Im Fall 3 endet der Weg hier. Ein Kopierschutz wird nicht umgangen.\n"
                        "Dann bitte die deutsche Ausgabe nutzen, siehe README."
                    )
                    return 1

                vergleich = als_graustufen(bild)
                if vergleich_vorher is not None and sind_gleich(
                    vergleich, vergleich_vorher, args.schwelle
                ):
                    gleich_in_folge += 1
                    print(
                        f"  Seite {nummer}: unveraendert "
                        f"({gleich_in_folge}/{args.stopp_nach})"
                    )
                    if gleich_in_folge >= args.stopp_nach:
                        print("\nBuchende erreicht: Die Seite wechselt nicht mehr.")
                        break
                    # Nicht speichern - nur noch einmal blaettern und nachsehen.
                    pyautogui.press(args.taste)
                    time.sleep(args.pause)
                    continue

                gleich_in_folge = 0
                vergleich_vorher = vergleich
                datei = ziel / f"seite_{nummer:04d}.png"
                bild.save(datei, optimize=True)
                gespeichert += 1
                nummer += 1
                if gespeichert % 10 == 0:
                    print(f"  {gespeichert} Seiten aufgenommen (letzte: {datei.name})")

                pyautogui.press(args.taste)
                time.sleep(args.pause)
            else:
                print(
                    f"\nGrenze von {args.max_seiten} Seiten erreicht. "
                    "Mit erneutem Aufruf fortsetzen oder --max-seiten erhoehen."
                )
    except KeyboardInterrupt:
        print(f"\nAbgebrochen. {gespeichert} Seiten sind gespeichert.")

    print(f"\nFertig: {gespeichert} neue Aufnahmen in {ziel.resolve()}")
    if gespeichert:
        print("Bitte stichprobenartig zwei oder drei Bilder ansehen, bevor es weitergeht.")
        print("Weiter mit:  python3 02_ocr.py")
    return 0


def main() -> int:
    p = argparse.ArgumentParser(
        description="Bildschirmaufnahme eines E-Books, Seite fuer Seite.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    p.add_argument("--kalibrieren", action="store_true", help="Nur ein Vollbild aufnehmen, um den Bereich auszumessen.")
    p.add_argument("--bereich", type=bereich_parsen, help="Lesebereich als links,oben,rechts,unten.")
    p.add_argument("--ausgabe", default="Vincent_Hoerbuch/vincent_screens", help="Zielordner fuer die Bilder.")
    p.add_argument("--pause", type=float, default=1.5, help="Wartezeit nach dem Blaettern in Sekunden (Standard 1.5).")
    p.add_argument("--taste", default="right", help="Taste zum Blaettern: right, pagedown, space (Standard right).")
    p.add_argument("--max-seiten", type=int, default=500, help="Obergrenze als Notbremse (Standard 500).")
    p.add_argument("--stopp-nach", type=int, default=2, help="Nach so vielen gleichen Aufnahmen beenden (Standard 2).")
    p.add_argument("--schwelle", type=float, default=2.0, help="Ab welchem Unterschied zwei Seiten als verschieden gelten.")
    p.add_argument("--neu", action="store_true", help="Vorhandene Aufnahmen ignorieren und bei 1 beginnen.")
    p.add_argument("--ja", action="store_true", help="Rueckfrage vor dem Start ueberspringen.")
    args = p.parse_args()

    if args.kalibrieren:
        kalibrieren(Path(args.ausgabe))
        return 0

    if not args.bereich:
        p.error(
            "Bitte --bereich angeben. Den Bereich zuerst ausmessen mit:\n"
            "  python3 01_aufnahme.py --kalibrieren"
        )

    if not args.ja:
        print("Vor dem Start bitte kurz bestaetigen:")
        print("  - Das Kindle-Fenster ist offen und zeigt die erste Seite des Buches.")
        print("  - Die Schrift ist eher klein eingestellt, die Ansicht einspaltig.")
        print("  - Rand und Zeilenabstand sind schmal, damit viel Text je Seite passt.")
        print("  - Der Bildschirmschoner ist aus.")
        antwort = input("\nAlles bereit? [j/N] ").strip().lower()
        if antwort not in ("j", "ja", "y", "yes"):
            print("Abgebrochen.")
            return 0

    pyautogui.FAILSAFE = True  # Maus in die Ecke oben links bricht ab.
    return aufnehmen(args)


if __name__ == "__main__":
    sys.exit(main())
