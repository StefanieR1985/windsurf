#!/usr/bin/env python3
"""Schritt 4: Kapitel ins Deutsche uebertragen.

Drei Wege, je nachdem was vorhanden ist:

  --weg blocks    Kein Schluessel noetig. Legt handliche Textblocks samt
                  fertigem Auftragstext ab, die in der Claude-App uebersetzt
                  und dann zurueckgelegt werden. Beste Sprachqualitaet,
                  dafuer Handarbeit.
  --weg claude    Braucht ANTHROPIC_API_KEY. Uebersetzt kapitelweise mit
                  Vorgaben zu Zielgruppe und Namen.
  --weg deepl     Braucht DEEPL_API_KEY. Schnell und guenstig, klingt bei
                  Kinderliteratur aber nuechterner.

Beispiele:
    python3 04_uebersetzen.py --weg blocks
    python3 04_uebersetzen.py --weg claude
    python3 04_uebersetzen.py --einsammeln        # uebersetzte Blocks zusammenfuegen
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

import textclean

AUFTRAG = """\
Uebersetze den folgenden Abschnitt eines niederlaendischen Kinderromans ins Deutsche.

Vorgaben:
- Zielgruppe ist ein Kind ab etwa 10 Jahren. Die Sprache soll fluessig und
  natuerlich klingen, so wie ein gutes deutsches Kinderbuch - keine woertliche,
  steife Uebersetzung.
- Der Text wird vorgelesen. Also kurze, sprechbare Saetze und klare woertliche Rede.
- Erzaehlzeit, Perspektive und Tonfall des Originals beibehalten. Nichts
  hinzufuegen, nichts weglassen, nichts erklaeren.
- Namen und feste Begriffe genau so verwenden:
{glossar}
- Absatzgrenzen beibehalten.
- Der Text stammt aus einer Texterkennung und kann Lesefehler enthalten. Offensichtlich
  verstuemmelte Woerter sinnvoll ergaenzen, aber nichts dazuerfinden.

Gib nur die deutsche Uebersetzung aus, ohne Vorbemerkung und ohne Kommentar.

--- Abschnitt beginnt ---
{text}
--- Abschnitt endet ---
"""


def glossar_laden(pfad: Path) -> dict[str, str]:
    if not pfad.exists():
        return {}
    daten = json.loads(pfad.read_text(encoding="utf-8"))
    begriffe = daten.get("begriffe", daten)
    return {k: v for k, v in begriffe.items() if not k.startswith("_")}


def glossar_als_text(begriffe: dict[str, str]) -> str:
    if not begriffe:
        return "  (keine besonderen Vorgaben)"
    return "\n".join(f'  "{k}" -> "{v}"' for k, v in begriffe.items() if k != v) or "  (Namen unveraendert)"


def in_stuecke(text: str, max_zeichen: int) -> list[str]:
    """Teilt einen Kapiteltext an Absatzgrenzen in Stuecke."""
    stuecke: list[str] = []
    aktuell: list[str] = []
    laenge = 0
    for absatz in text.split("\n\n"):
        if laenge + len(absatz) > max_zeichen and aktuell:
            stuecke.append("\n\n".join(aktuell))
            aktuell, laenge = [], 0
        aktuell.append(absatz)
        laenge += len(absatz) + 2
    if aktuell:
        stuecke.append("\n\n".join(aktuell))
    return stuecke


# ------------------------------------------------------------------ Weg: blocks

def weg_blocks(kapitel: list[Path], ziel: Path, begriffe: dict[str, str], max_zeichen: int) -> int:
    """Legt Auftragsdateien zum Uebersetzen von Hand ab."""
    auftragsordner = ziel / "zum_uebersetzen"
    rueckordner = ziel / "uebersetzt_hier_ablegen"
    auftragsordner.mkdir(parents=True, exist_ok=True)
    rueckordner.mkdir(parents=True, exist_ok=True)

    anzahl = 0
    for datei in kapitel:
        text = datei.read_text(encoding="utf-8")
        for nummer, stueck in enumerate(in_stuecke(text, max_zeichen), start=1):
            name = f"{datei.stem}_teil_{nummer:02d}.txt"
            auftrag = AUFTRAG.format(glossar=glossar_als_text(begriffe), text=stueck)
            (auftragsordner / name).write_text(auftrag, encoding="utf-8")
            anzahl += 1

    print(f"{anzahl} Auftragsdatei(en) in {auftragsordner.resolve()}\n")
    print("So geht es weiter:")
    print(f"  1. Eine Datei aus {auftragsordner.name} oeffnen, den ganzen Inhalt kopieren")
    print("     und in die Claude-App einfuegen.")
    print(f"  2. Die deutsche Antwort unter demselben Dateinamen in {rueckordner.name} speichern.")
    print("  3. Wenn alle fertig sind:  python3 04_uebersetzen.py --einsammeln")
    return 0


def weg_einsammeln(ziel: Path, begriffe: dict[str, str]) -> int:
    """Fuegt die von Hand uebersetzten Teile wieder zu Kapiteln zusammen."""
    rueckordner = ziel / "uebersetzt_hier_ablegen"
    if not rueckordner.exists():
        sys.exit(f"Ordner fehlt: {rueckordner.resolve()}")

    teile = sorted(rueckordner.glob("kapitel_*_teil_*.txt"))
    if not teile:
        sys.exit(f"Keine uebersetzten Dateien in {rueckordner.resolve()}")

    nach_kapitel: dict[str, list[Path]] = {}
    for datei in teile:
        treffer = re.match(r"(kapitel_\d+)_teil_\d+", datei.stem)
        if treffer:
            nach_kapitel.setdefault(treffer.group(1), []).append(datei)

    kapitelordner = ziel / "kapitel_de"
    kapitelordner.mkdir(parents=True, exist_ok=True)
    for name, dateien in sorted(nach_kapitel.items()):
        text = "\n\n".join(d.read_text(encoding="utf-8").strip() for d in sorted(dateien))
        text = textclean.wende_glossar_an(textclean.normalisiere(text), begriffe)
        (kapitelordner / f"{name}.txt").write_text(text.strip() + "\n", encoding="utf-8")
        print(f"  {name}: {len(dateien)} Teil(e), {len(text):,} Zeichen")

    gesamt_schreiben(kapitelordner, ziel / "vincent_de.txt")
    return 0


# ------------------------------------------------------------------ Weg: APIs

def uebersetze_mit_claude(text: str, begriffe: dict[str, str], modell: str, schluessel: str) -> str:
    import httpx

    antwort = httpx.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": schluessel,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": modell,
            "max_tokens": 8000,
            "messages": [
                {"role": "user", "content": AUFTRAG.format(glossar=glossar_als_text(begriffe), text=text)}
            ],
        },
        timeout=300.0,
    )
    antwort.raise_for_status()
    daten = antwort.json()
    return "".join(teil.get("text", "") for teil in daten.get("content", [])).strip()


def uebersetze_mit_deepl(text: str, schluessel: str) -> str:
    import httpx

    basis = "https://api-free.deepl.com" if schluessel.endswith(":fx") else "https://api.deepl.com"
    antwort = httpx.post(
        f"{basis}/v2/translate",
        headers={"Authorization": f"DeepL-Auth-Key {schluessel}"},
        data={
            "text": text,
            "source_lang": "NL",
            "target_lang": "DE",
            "split_sentences": "nonewlines",
            "preserve_formatting": "1",
        },
        timeout=180.0,
    )
    antwort.raise_for_status()
    return "\n\n".join(t["text"] for t in antwort.json()["translations"]).strip()


def weg_api(
    weg: str, kapitel: list[Path], ziel: Path, begriffe: dict[str, str], modell: str, max_zeichen: int
) -> int:
    umgebungsname = "ANTHROPIC_API_KEY" if weg == "claude" else "DEEPL_API_KEY"
    schluessel = os.environ.get(umgebungsname)
    if not schluessel:
        sys.exit(
            f"{umgebungsname} ist nicht gesetzt.\n"
            f"  Linux/macOS:  export {umgebungsname}='...'\n"
            f"  Windows:      set {umgebungsname}=...\n"
            "Ohne Schluessel geht es auch:  python3 04_uebersetzen.py --weg blocks"
        )

    try:
        import httpx  # noqa: F401
    except ImportError:
        sys.exit("Paket httpx fehlt:  pip install httpx")

    kapitelordner = ziel / "kapitel_de"
    kapitelordner.mkdir(parents=True, exist_ok=True)

    for datei in kapitel:
        zieldatei = kapitelordner / datei.name
        if zieldatei.exists():
            print(f"  {datei.name}: liegt schon vor, uebersprungen")
            continue

        stuecke = in_stuecke(datei.read_text(encoding="utf-8"), max_zeichen)
        print(f"  {datei.name}: {len(stuecke)} Stueck(e) ...", end="", flush=True)

        ergebnis: list[str] = []
        for stueck in stuecke:
            for versuch in range(4):
                try:
                    if weg == "claude":
                        ergebnis.append(uebersetze_mit_claude(stueck, begriffe, modell, schluessel))
                    else:
                        ergebnis.append(uebersetze_mit_deepl(stueck, schluessel))
                    break
                except Exception as fehler:
                    if versuch == 3:
                        print(f"\n    Fehlgeschlagen: {fehler}")
                        return 1
                    wartezeit = 2 ** (versuch + 1)
                    print(f"\n    Versuch {versuch + 1} fehlgeschlagen ({fehler}), warte {wartezeit}s", end="")
                    time.sleep(wartezeit)
            print(".", end="", flush=True)

        text = textclean.wende_glossar_an("\n\n".join(ergebnis), begriffe)
        zieldatei.write_text(text.strip() + "\n", encoding="utf-8")
        print(f" fertig ({len(text):,} Zeichen)")

    gesamt_schreiben(kapitelordner, ziel / "vincent_de.txt")
    return 0


def gesamt_schreiben(kapitelordner: Path, zieldatei: Path) -> None:
    dateien = sorted(kapitelordner.glob("kapitel_*.txt"))
    teile = [d.read_text(encoding="utf-8").strip() for d in dateien]
    zieldatei.write_text("\n\n\n".join(teile) + "\n", encoding="utf-8")
    print(f"\nGesamtdatei: {zieldatei.resolve()}  ({len(dateien)} Kapitel)")
    print(f"Kapiteldateien: {kapitelordner.resolve()}")
    print("\nBitte eine Seite gegenlesen, bevor die Sprachausgabe laeuft.")
    print("Weiter mit:  python3 05_audio.py")


def main() -> int:
    p = argparse.ArgumentParser(
        description="Uebertraegt die Kapitel ins Deutsche.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    p.add_argument("--weg", choices=["blocks", "claude", "deepl"], default="blocks")
    p.add_argument("--kapitel", default="Vincent_Hoerbuch/kapitel_nl", help="Ordner mit den niederlaendischen Kapiteln.")
    p.add_argument("--ziel", default="Vincent_Hoerbuch", help="Projektordner.")
    p.add_argument("--glossar", default="glossar.json", help="Datei mit Namen und festen Begriffen.")
    p.add_argument("--modell", default="claude-sonnet-5-5", help="Modell fuer --weg claude.")
    p.add_argument("--max-zeichen", type=int, default=6000, help="Groesse eines Uebersetzungsstuecks.")
    p.add_argument("--einsammeln", action="store_true", help="Von Hand uebersetzte Blocks zusammenfuegen.")
    args = p.parse_args()

    ziel = Path(args.ziel)
    begriffe = glossar_laden(Path(args.glossar))

    if args.einsammeln:
        return weg_einsammeln(ziel, begriffe)

    kapitel = sorted(Path(args.kapitel).glob("kapitel_*.txt"))
    if not kapitel:
        sys.exit(f"Keine Kapiteldateien in {Path(args.kapitel).resolve()}. Bitte zuerst 03_kapitel.py laufen lassen.")

    print(f"{len(kapitel)} Kapitel, Weg '{args.weg}'\n")
    if args.weg == "blocks":
        return weg_blocks(kapitel, ziel, begriffe, args.max_zeichen)
    return weg_api(args.weg, kapitel, ziel, begriffe, args.modell, args.max_zeichen)


if __name__ == "__main__":
    sys.exit(main())
