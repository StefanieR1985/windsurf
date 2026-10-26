#!/usr/bin/env python3
"""Schritt 0: Was fuer eine Datei liegt da, und ist sie verschluesselt?

Diese Pruefung entscheidet den ganzen weiteren Weg:

  Keine Verschluesselung -> Der Text laesst sich direkt entnehmen. Keine
                            Bildschirmaufnahme, kein OCR, keine Lesefehler.
  Verschluesselt         -> Die Datei ist fuer jedes Programm unlesbar. Dann
                            bleibt nur der Weg ueber die Bildschirmaufnahme
                            (01_aufnahme.py).

Das Skript liest nur Kopfdaten und entschluesselt nichts. Es entfernt keinen
Kopierschutz und zeigt keinen Weg, das zu tun.

Beispiele:
    python3 00_datei_pruefen.py "C:/Users/Steffi/Documents/My Kindle Content"
    python3 00_datei_pruefen.py buch.azw3
"""

from __future__ import annotations

import argparse
import struct
import sys
import zipfile
from pathlib import Path

INTERESSANT = {".epub", ".azw", ".azw3", ".azw4", ".kfx", ".kfx-zip", ".mobi", ".prc", ".pdf", ".txt"}


def epub_pruefen(datei: Path) -> tuple[str, bool, list[str]]:
    """EPUB: ZIP-Archiv. Adobe-DRM zeigt sich an encryption.xml."""
    hinweise: list[str] = []
    try:
        with zipfile.ZipFile(datei) as archiv:
            namen = set(archiv.namelist())
    except zipfile.BadZipFile:
        return "EPUB (beschaedigt?)", True, ["Das Archiv liess sich nicht oeffnen."]

    verschluesselt = False
    if "META-INF/encryption.xml" in namen:
        verschluesselt = True
        hinweise.append("META-INF/encryption.xml vorhanden - Inhalte sind verschluesselt.")
    if "META-INF/rights.xml" in namen:
        verschluesselt = True
        hinweise.append("META-INF/rights.xml vorhanden - Adobe-Lizenzdatei.")
    if not verschluesselt:
        kapitel = [n for n in namen if n.endswith((".xhtml", ".html", ".htm"))]
        hinweise.append(f"{len(kapitel)} Textdatei(en) im Archiv, unverschluesselt lesbar.")
    return "EPUB", verschluesselt, hinweise


def mobi_pruefen(datei: Path, rohdaten: bytes) -> tuple[str, bool, list[str]]:
    """MOBI/AZW/AZW3: PalmDB-Behaelter.

    Im PalmDOC-Kopf von Datensatz 0 steht an Position 12 die Art der
    Verschluesselung: 0 = keine, 1 = alt, 2 = Mobipocket.
    """
    hinweise: list[str] = []
    art = "MOBI/AZW"
    if len(rohdaten) > 68 and rohdaten[60:68] == b"BOOKMOBI":
        art = "MOBI/AZW3 (BOOKMOBI)"

    try:
        anzahl = struct.unpack(">H", rohdaten[76:78])[0]
        datensatz0 = struct.unpack(">I", rohdaten[78:82])[0]
        hinweise.append(f"{anzahl} Datensaetze im Behaelter.")
        schluesselart = struct.unpack(">H", rohdaten[datensatz0 + 12 : datensatz0 + 14])[0]
    except (struct.error, IndexError):
        return art, True, ["Kopfdaten unvollstaendig - Art der Verschluesselung nicht lesbar."]

    bezeichnung = {0: "keine", 1: "alt (Mobipocket)", 2: "Mobipocket-DRM"}.get(
        schluesselart, f"unbekannt ({schluesselart})"
    )
    hinweise.append(f"Verschluesselung im Kopf: {bezeichnung}.")
    return art, schluesselart != 0, hinweise


def kfx_pruefen(datei: Path, rohdaten: bytes) -> tuple[str, bool, list[str]]:
    """KFX: neueres Kindle-Format. Die DRM-Variante enthaelt eine DRMION-Marke."""
    hinweise: list[str] = []
    verschluesselt = False
    if b"\xeaDRMION\xee" in rohdaten[:65536]:
        verschluesselt = True
        hinweise.append("DRMION-Marke gefunden - Inhalt ist verschluesselt.")
    begleiter = [
        p.name
        for p in datei.parent.iterdir()
        if p.is_file() and p.suffix.lower() in (".voucher", ".res") and p.stem.startswith(datei.stem[:8])
    ]
    if begleiter:
        verschluesselt = True
        hinweise.append(f"Lizenzdateien daneben: {', '.join(sorted(begleiter)[:4])}")
    if not verschluesselt:
        hinweise.append("Keine DRM-Marke in den Kopfdaten gefunden - bitte trotzdem pruefen.")
    return "KFX", verschluesselt, hinweise


def pruefen(datei: Path) -> tuple[str, bool, list[str]]:
    with datei.open("rb") as f:
        rohdaten = f.read(65536)

    endung = datei.suffix.lower()
    if rohdaten[:4] == b"PK\x03\x04" and endung in (".epub", ".kfx-zip", ".zip"):
        return epub_pruefen(datei)
    if len(rohdaten) > 68 and rohdaten[60:68] in (b"BOOKMOBI", b"TEXtREAd"):
        return mobi_pruefen(datei, rohdaten)
    if endung in (".kfx", ".azw8") or rohdaten[:4] == b"CONT":
        return kfx_pruefen(datei, rohdaten)
    if rohdaten[:5] == b"%PDF-":
        verschluesselt = b"/Encrypt" in rohdaten
        return "PDF", verschluesselt, [
            "Verschluesselt." if verschluesselt else "Keine Verschluesselung in den Kopfdaten."
        ]
    if endung == ".txt":
        return "Nur Text", False, ["Reiner Text, direkt verwendbar."]
    return "unbekannt", True, [f"Erste Bytes: {rohdaten[:16].hex(' ')}"]


def main() -> int:
    p = argparse.ArgumentParser(
        description="Stellt fest, welches Format eine Buchdatei hat und ob sie verschluesselt ist.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    p.add_argument("pfad", help="Eine Buchdatei oder ein Ordner (z. B. 'My Kindle Content').")
    args = p.parse_args()

    ziel = Path(args.pfad).expanduser()
    if not ziel.exists():
        sys.exit(
            f"Nicht gefunden: {ziel}\n\n"
            "Der Kindle-Ordner liegt meist hier:\n"
            "  Windows: C:\\Users\\<Name>\\Documents\\My Kindle Content\n"
            "  macOS:   ~/Library/Application Support/Kindle/My Kindle Content"
        )

    if ziel.is_file():
        dateien = [ziel]
    else:
        dateien = sorted(
            p for p in ziel.rglob("*") if p.is_file() and p.suffix.lower() in INTERESSANT
        )
    if not dateien:
        sys.exit(f"Keine Buchdateien in {ziel.resolve()} gefunden.")

    print(f"{len(dateien)} Datei(en) geprueft:\n")
    offen: list[Path] = []
    zu: list[Path] = []

    for datei in dateien:
        art, verschluesselt, hinweise = pruefen(datei)
        marke = "VERSCHLUESSELT" if verschluesselt else "offen"
        groesse = datei.stat().st_size / 1_048_576
        print(f"  {datei.name}")
        print(f"    Format: {art}   Zustand: {marke}   {groesse:.1f} MB")
        for hinweis in hinweise:
            print(f"    - {hinweis}")
        print()
        (zu if verschluesselt else offen).append(datei)

    print("=" * 68)
    if offen:
        print(f"\n{len(offen)} Datei(en) OHNE Verschluesselung:")
        for datei in offen:
            print(f"  {datei}")
        print(
            "\nDa laesst sich der Text direkt entnehmen - ohne Bildschirmaufnahme\n"
            "und ohne Texterkennung. Also ohne Lesefehler. Weiter mit:\n"
            "  python3 02b_text_entnehmen.py <datei>"
        )
    if zu:
        print(f"\n{len(zu)} Datei(en) sind verschluesselt.")
        print(
            "Diese sind fuer jedes Programm unlesbar - das ist keine Einstellung,\n"
            "sondern Verschluesselung. Ein OCR-Dienst aendert daran nichts, denn\n"
            "OCR liest Bilder, und hier liegt Geheimtext vor.\n\n"
            "Fuer diese Buecher bleibt der Weg ueber die Bildschirmaufnahme:\n"
            "  python3 01_aufnahme.py --kalibrieren\n\n"
            "Der Kopierschutz wird dabei nicht angetastet. Aufgenommen wird nur,\n"
            "was die Lese-App auf dem Bildschirm zeigt."
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
