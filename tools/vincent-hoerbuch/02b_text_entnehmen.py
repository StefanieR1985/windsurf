#!/usr/bin/env python3
"""Schritt 2b: Text direkt aus einer unverschluesselten Buchdatei entnehmen.

Nur fuer Dateien, die 00_datei_pruefen.py als "offen" gemeldet hat. Dieser Weg
ist dem Umweg ueber Bildschirmaufnahme und Texterkennung deutlich vorzuziehen,
weil er fehlerfrei ist: kein verwechseltes Zeichen, kein zerrissener Absatz.

Verschluesselte Dateien werden abgewiesen. Dieses Skript entschluesselt nichts.

Beispiele:
    python3 02b_text_entnehmen.py buch.epub
    python3 02b_text_entnehmen.py buch.epub --ausgabe Vincent_Hoerbuch/vincent_nl.txt
"""

from __future__ import annotations

import argparse
import html
import re
import shutil
import subprocess
import sys
import zipfile
from html.parser import HTMLParser
from pathlib import Path
from xml.etree import ElementTree

import textclean

# Elemente, die im gelesenen Text eine Absatzgrenze bedeuten.
BLOCK = {
    "p", "div", "br", "li", "h1", "h2", "h3", "h4", "h5", "h6",
    "blockquote", "tr", "section", "article",
}
UEBERSPRINGEN = {"script", "style", "head", "title"}


class TextSammler(HTMLParser):
    """Holt den sichtbaren Text aus einer XHTML-Datei, mit Absatzgrenzen."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.teile: list[str] = []
        self._stumm = 0

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag in UEBERSPRINGEN:
            self._stumm += 1
        elif tag in BLOCK:
            self.teile.append("\n\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in UEBERSPRINGEN:
            self._stumm = max(0, self._stumm - 1)
        elif tag in BLOCK:
            self.teile.append("\n\n")

    def handle_data(self, daten: str) -> None:
        if not self._stumm:
            self.teile.append(daten)

    def text(self) -> str:
        roh = "".join(self.teile)
        roh = re.sub(r"[ \t\r\f\v]+", " ", roh)
        roh = re.sub(r" *\n *", "\n", roh)
        return re.sub(r"\n{3,}", "\n\n", roh).strip()


def epub_reihenfolge(archiv: zipfile.ZipFile) -> list[str]:
    """Liest aus container.xml und der OPF-Datei die richtige Kapitelreihenfolge."""
    try:
        behaelter = ElementTree.fromstring(archiv.read("META-INF/container.xml"))
        opf_pfad = behaelter.find(
            ".//{urn:oasis:names:tc:opendocument:xmlns:container}rootfile"
        ).get("full-path")
    except (KeyError, AttributeError, ElementTree.ParseError):
        # Ohne OPF: alle Textdateien in Namensreihenfolge.
        return sorted(n for n in archiv.namelist() if n.endswith((".xhtml", ".html", ".htm")))

    opf = ElementTree.fromstring(archiv.read(opf_pfad))
    ns = {"opf": "http://www.idpf.org/2007/opf"}
    wurzel = str(Path(opf_pfad).parent)

    bausteine: dict[str, str] = {}
    for eintrag in opf.findall(".//opf:manifest/opf:item", ns):
        kennung, ziel = eintrag.get("id"), eintrag.get("href")
        if kennung and ziel:
            bausteine[kennung] = ziel if wurzel in (".", "") else f"{wurzel}/{ziel}"

    reihenfolge: list[str] = []
    for verweis in opf.findall(".//opf:spine/opf:itemref", ns):
        ziel = bausteine.get(verweis.get("idref", ""))
        if ziel:
            reihenfolge.append(ziel.replace("//", "/"))
    return reihenfolge or sorted(
        n for n in archiv.namelist() if n.endswith((".xhtml", ".html", ".htm"))
    )


def aus_epub(datei: Path) -> str:
    with zipfile.ZipFile(datei) as archiv:
        namen = set(archiv.namelist())
        if "META-INF/encryption.xml" in namen or "META-INF/rights.xml" in namen:
            sys.exit(
                "Diese EPUB ist verschluesselt (Adobe-DRM).\n"
                "Hier ist Schluss - ein Kopierschutz wird nicht umgangen.\n"
                "Bitte den Weg ueber die Bildschirmaufnahme nehmen: 01_aufnahme.py"
            )

        abschnitte: list[str] = []
        for ziel in epub_reihenfolge(archiv):
            if ziel not in namen:
                continue
            sammler = TextSammler()
            sammler.feed(archiv.read(ziel).decode("utf-8", errors="replace"))
            text = sammler.text()
            if text:
                abschnitte.append(text)
    return "\n\n".join(abschnitte)


def aus_pdf(datei: Path) -> str:
    if not shutil.which("pdftotext"):
        sys.exit(
            "Fuer PDF wird 'pdftotext' gebraucht:\n"
            "  Linux: sudo apt install poppler-utils\n"
            "  macOS: brew install poppler\n"
            "  Windows: poppler fuer Windows installieren"
        )
    ergebnis = subprocess.run(
        ["pdftotext", "-layout", "-enc", "UTF-8", str(datei), "-"],
        capture_output=True, text=True, check=True,
    )
    return ergebnis.stdout


def main() -> int:
    p = argparse.ArgumentParser(
        description="Entnimmt den Text einer unverschluesselten Buchdatei.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    p.add_argument("datei", help="EPUB, PDF oder Textdatei.")
    p.add_argument("--ausgabe", default="Vincent_Hoerbuch/vincent_nl.txt", help="Zieldatei.")
    p.add_argument("--roh", action="store_true", help="Ohne die Bereinigung aus textclean ablegen.")
    args = p.parse_args()

    datei = Path(args.datei).expanduser()
    if not datei.exists():
        sys.exit(f"Nicht gefunden: {datei}")

    endung = datei.suffix.lower()
    if endung == ".epub":
        text = aus_epub(datei)
    elif endung == ".pdf":
        text = aus_pdf(datei)
    elif endung == ".txt":
        text = datei.read_text(encoding="utf-8", errors="replace")
    else:
        sys.exit(
            f"Format '{endung}' wird hier nicht gelesen.\n\n"
            "Ist die Datei unverschluesselt, wandelt Calibre sie zuverlaessig um -\n"
            "das normale Programm, ohne Zusatzmodule:\n"
            "  ebook-convert buch.azw3 buch.epub\n"
            "Danach dieses Skript auf die EPUB anwenden.\n\n"
            "Ist die Datei verschluesselt, hilft das nicht, und es bleibt der Weg\n"
            "ueber die Bildschirmaufnahme: 01_aufnahme.py"
        )

    if not text.strip():
        sys.exit("Es wurde kein Text gefunden. Ist die Datei vielleicht doch verschluesselt?")

    if not args.roh:
        text = textclean.normalisiere(text)
        absaetze = textclean.entferne_doppelzeilen(
            [a.strip() for a in text.split("\n\n") if a.strip()]
        )
        text = "\n\n".join(absaetze) + "\n"

    ziel = Path(args.ausgabe)
    ziel.parent.mkdir(parents=True, exist_ok=True)
    ziel.write_text(text, encoding="utf-8")

    print(f"Geschrieben: {ziel.resolve()}")
    print(f"  {len(text):,} Zeichen, etwa {len(text.split()):,} Woerter")
    print(
        "\nDieser Text ist fehlerfrei entnommen - keine Texterkennung beteiligt.\n"
        "Weiter mit:  python3 03_kapitel.py"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
