#!/usr/bin/env python3
"""Schritt 5: Aus den deutschen Kapiteln je eine MP3 erzeugen.

Nutzt edge-tts (kostenlos, keine Anmeldung) mit einer deutschen Stimme und
ruhigem Lesetempo.

Beispiele:
    python3 05_audio.py --stimmen                 # verfuegbare deutsche Stimmen zeigen
    python3 05_audio.py
    python3 05_audio.py --stimme de-DE-KatjaNeural --tempo -15%
    python3 05_audio.py --nur 3                   # nur Kapitel 3 neu erzeugen
"""

from __future__ import annotations

import argparse
import asyncio
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    import edge_tts
except ImportError:  # pragma: no cover
    sys.exit("Paket edge-tts fehlt:  pip install edge-tts")


def vorlesbar_machen(text: str) -> str:
    """Nimmt dem Text die Stolperstellen fuer eine Vorlesestimme."""
    # Gedankenstrich-Rede wird sonst als Bindestrich verschluckt.
    text = re.sub(r"^\s*[-–—]\s*", '"', text, flags=re.MULTILINE)
    # Auslassungspunkte als Pause sprechen lassen.
    text = text.replace("...", " ... ")
    # Mehrfache Leerzeilen zu einer Absatzpause.
    text = re.sub(r"\n{3,}", "\n\n", text)
    return re.sub(r"[ \t]{2,}", " ", text).strip()


def in_stuecke(text: str, max_zeichen: int = 2500) -> list[str]:
    """Teilt den Kapiteltext an Absatz- und notfalls Satzgrenzen."""
    stuecke: list[str] = []
    puffer = ""
    for absatz in text.split("\n\n"):
        absatz = absatz.strip()
        if not absatz:
            continue
        if len(absatz) > max_zeichen:
            # Sehr langer Absatz: an Satzenden trennen.
            satz_puffer = ""
            for satz in re.split(r"(?<=[.!?\"])\s+", absatz):
                if len(satz_puffer) + len(satz) > max_zeichen and satz_puffer:
                    stuecke.append(satz_puffer.strip())
                    satz_puffer = ""
                satz_puffer += satz + " "
            if satz_puffer.strip():
                absatz = satz_puffer.strip()
            else:
                continue
        if len(puffer) + len(absatz) > max_zeichen and puffer:
            stuecke.append(puffer.strip())
            puffer = ""
        puffer += absatz + "\n\n"
    if puffer.strip():
        stuecke.append(puffer.strip())
    return stuecke


async def stimmen_zeigen() -> None:
    alle = await edge_tts.list_voices()
    deutsch = sorted(s["ShortName"] for s in alle if s["Locale"].startswith("de-"))
    print(f"{len(deutsch)} deutsche Stimmen:\n")
    for name in deutsch:
        print(f"  {name}")
    print("\nFuer ein Hoerbuch bewaehrt: de-DE-ConradNeural (maennlich), de-DE-KatjaNeural (weiblich).")


async def sprich(text: str, ziel: Path, stimme: str, tempo: str, lautstaerke: str) -> None:
    for versuch in range(4):
        try:
            mitteilung = edge_tts.Communicate(text, stimme, rate=tempo, volume=lautstaerke)
            await mitteilung.save(str(ziel))
            if ziel.exists() and ziel.stat().st_size > 1024:
                return
            raise RuntimeError("leere Audiodatei erhalten")
        except Exception as fehler:
            if versuch == 3:
                raise
            wartezeit = 2 ** (versuch + 1)
            print(f"\n      Versuch {versuch + 1} fehlgeschlagen ({fehler}), warte {wartezeit}s", end="", flush=True)
            await asyncio.sleep(wartezeit)


def zusammenfuegen(teile: list[Path], ziel: Path) -> None:
    """Haengt die Teilstuecke ohne Neukodierung zu einer MP3 zusammen."""
    if len(teile) == 1:
        shutil.copy(teile[0], ziel)
        return
    liste = ziel.with_suffix(".txt.tmp")
    liste.write_text("".join(f"file '{t.as_posix()}'\n" for t in teile), encoding="utf-8")
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0",
             "-i", str(liste), "-c", "copy", str(ziel)],
            check=True,
        )
    finally:
        liste.unlink(missing_ok=True)


def dauer(datei: Path) -> float:
    """Laenge einer Audiodatei in Sekunden, 0.0 wenn nicht messbar."""
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


async def hauptlauf(args: argparse.Namespace) -> int:
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg wurde nicht gefunden - es wird zum Zusammenfuegen gebraucht.\n"
                 "  Windows: winget install Gyan.FFmpeg\n  macOS: brew install ffmpeg\n"
                 "  Linux: sudo apt install ffmpeg")

    kapitel = sorted(Path(args.kapitel).glob("kapitel_*.txt"))
    if not kapitel:
        sys.exit(f"Keine Kapiteldateien in {Path(args.kapitel).resolve()}.")
    if args.nur:
        kapitel = [k for k in kapitel if int(re.search(r"\d+", k.stem).group()) in args.nur]
        if not kapitel:
            sys.exit("Die gewaehlten Kapitelnummern gibt es nicht.")

    ziel = Path(args.ausgabe)
    ziel.mkdir(parents=True, exist_ok=True)

    print(f"{len(kapitel)} Kapitel, Stimme {args.stimme}, Tempo {args.tempo}\n")
    gesamt = 0.0
    erzeugt = 0

    for datei in kapitel:
        mp3 = ziel / f"{datei.stem}.mp3"
        if mp3.exists() and not args.neu:
            laenge = dauer(mp3)
            gesamt += laenge
            print(f"  {datei.stem}: liegt vor ({als_zeit(laenge)}), uebersprungen")
            continue

        text = vorlesbar_machen(datei.read_text(encoding="utf-8"))
        if not text:
            print(f"  {datei.stem}: leer, uebersprungen")
            continue

        stuecke = in_stuecke(text, args.max_zeichen)
        print(f"  {datei.stem}: {len(text):,} Zeichen in {len(stuecke)} Stueck(en) ", end="", flush=True)

        with tempfile.TemporaryDirectory() as ablage:
            teile: list[Path] = []
            for nummer, stueck in enumerate(stuecke, start=1):
                teil = Path(ablage) / f"teil_{nummer:03d}.mp3"
                try:
                    await sprich(stueck, teil, args.stimme, args.tempo, args.lautstaerke)
                except Exception as fehler:
                    print(f"\n    Abbruch bei {datei.stem}, Stueck {nummer}: {fehler}")
                    return 1
                teile.append(teil)
                print(".", end="", flush=True)
            zusammenfuegen(teile, mp3)

        laenge = dauer(mp3)
        gesamt += laenge
        erzeugt += 1
        print(f" {als_zeit(laenge)}  ({mp3.stat().st_size / 1_048_576:.1f} MB)")

    print(f"\n{erzeugt} neue Datei(en), Gesamtdauer {als_zeit(gesamt)}")
    print(f"Ordner: {ziel.resolve()}")
    print("\nWeiter mit:  python3 06_uebersicht.py")
    return 0


def main() -> int:
    p = argparse.ArgumentParser(
        description="Erzeugt je Kapitel eine deutsche MP3.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    p.add_argument("--kapitel", default="Vincent_Hoerbuch/kapitel_de", help="Ordner mit den deutschen Kapiteln.")
    p.add_argument("--ausgabe", default="Vincent_Hoerbuch/audio", help="Zielordner fuer die MP3-Dateien.")
    p.add_argument("--stimme", default="de-DE-ConradNeural", help="Stimme (siehe --stimmen).")
    p.add_argument("--tempo", default="-10%", help="Lesetempo, negativ ist langsamer (Standard -10%%).")
    p.add_argument("--lautstaerke", default="+0%", help="Lautstaerke (Standard +0%%).")
    p.add_argument("--max-zeichen", type=int, default=2500, help="Groesse eines Sprachstuecks.")
    p.add_argument("--nur", type=int, nargs="+", metavar="N", help="Nur diese Kapitelnummern erzeugen.")
    p.add_argument("--neu", action="store_true", help="Vorhandene MP3-Dateien ueberschreiben.")
    p.add_argument("--stimmen", action="store_true", help="Deutsche Stimmen auflisten und beenden.")
    args = p.parse_args()

    if args.stimmen:
        asyncio.run(stimmen_zeigen())
        return 0
    return asyncio.run(hauptlauf(args))


if __name__ == "__main__":
    sys.exit(main())
