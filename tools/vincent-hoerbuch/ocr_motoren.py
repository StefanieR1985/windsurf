"""Texterkennungs-Motoren: Tesseract (lokal) und PaddleOCR (lokal).

Absichtlich NICHT eingebaut ist die Baidu-Cloud-OCR. Begruendung steht im
README: Dafuer muessten die Seitenbilder eines gekauften Buches auf fremde
Server geladen werden. PaddleOCR ist dieselbe Technik aus demselben Haus,
laeuft aber auf dem eigenen Rechner - die Seiten verlassen den PC nicht.

Die Auswertung der Ergebnisse liegt hier als reine Funktion, damit sie ohne
die schweren Pakete pruefbar ist.
"""

from __future__ import annotations

from typing import Any

SPRACHEN_PADDLE = {"nld": "nl", "deu": "german", "eng": "en"}


def paddle_ergebnis_zu_text(ergebnis: Any) -> str:
    """Macht aus einer PaddleOCR-Antwort Text in Lesereihenfolge.

    PaddleOCR hat sein Rueckgabeformat zwischen den Hauptversionen geaendert.
    Beide Formen werden hier behandelt:

    Version 2.x:  [[[Viereck, (Text, Guete)], ...]]
    Version 3.x:  [{"rec_texts": [...], "rec_polys": [...]}]

    Sortiert wird nach der Hoehe der Textkaestchen, denn PaddleOCR liefert
    die Zeilen nicht zwingend von oben nach unten.
    """
    if not ergebnis:
        return ""

    # Der dritte Wert ist die Reihenfolge der Erkennung. Er dient als letztes
    # Unterscheidungsmerkmal beim Sortieren - sonst wuerden Texte bei gleicher
    # Position alphabetisch geordnet, und die Lesereihenfolge waere zerstoert.
    zeilen: list[tuple[float, float, int, str]] = []

    def eintragen(viereck: Any, text: str) -> None:
        if not text or not str(text).strip():
            return
        try:
            punkte = [(float(x), float(y)) for x, y in viereck]
            oben = min(y for _, y in punkte)
            links = min(x for x, _ in punkte)
        except (TypeError, ValueError):
            # Ohne Positionsangabe bleibt nur die Reihenfolge der Erkennung.
            oben, links = float(len(zeilen)), 0.0
        zeilen.append((oben, links, len(zeilen), str(text).strip()))

    erster = ergebnis[0] if isinstance(ergebnis, (list, tuple)) else ergebnis

    # Form von Version 3.x
    if isinstance(erster, dict):
        texte = erster.get("rec_texts") or []
        vierecke = erster.get("rec_polys") or erster.get("dt_polys") or []
        for i, text in enumerate(texte):
            eintragen(vierecke[i] if i < len(vierecke) else None, text)

    # Form von Version 2.x
    elif isinstance(erster, (list, tuple)):
        for zeile in erster:
            if not zeile:
                continue
            try:
                viereck, erkannt = zeile[0], zeile[1]
                text = erkannt[0] if isinstance(erkannt, (list, tuple)) else erkannt
            except (IndexError, TypeError):
                continue
            eintragen(viereck, text)

    if not zeilen:
        return ""

    # Nach Zeilen gruppieren: was auf aehnlicher Hoehe liegt, gehoert zusammen.
    zeilen.sort(key=lambda z: (z[0], z[1], z[2]))
    hoehen = [z[0] for z in zeilen]
    spanne = max(hoehen) - min(hoehen)
    toleranz = max(6.0, spanne / max(len(zeilen), 1) * 0.6)

    ausgabe: list[str] = []
    puffer: list[tuple[float, int, str]] = []
    letzte_hoehe = zeilen[0][0]

    def puffer_abschliessen() -> None:
        if puffer:
            ausgabe.append(" ".join(t for _, _, t in sorted(puffer)))
            puffer.clear()

    for oben, links, folge, text in zeilen:
        if abs(oben - letzte_hoehe) > toleranz:
            puffer_abschliessen()
        puffer.append((links, folge, text))
        letzte_hoehe = oben
    puffer_abschliessen()

    return "\n".join(ausgabe)


def paddle_motor(sprache: str):
    """Laedt PaddleOCR und gibt eine Funktion Bildpfad -> Text zurueck."""
    try:
        from paddleocr import PaddleOCR
    except ImportError:
        raise SystemExit(
            "PaddleOCR ist nicht installiert.\n"
            "  pip install paddlepaddle paddleocr\n"
            "Das ist ein grosser Download (etwa 500 MB mit den Modellen).\n"
            "Alternativ bei Tesseract bleiben:  --motor tesseract"
        ) from None

    paddle_sprache = SPRACHEN_PADDLE.get(sprache, sprache)
    try:
        leser = PaddleOCR(use_angle_cls=True, lang=paddle_sprache, show_log=False)
    except TypeError:
        # Version 3.x kennt diese Schalter nicht mehr.
        leser = PaddleOCR(lang=paddle_sprache)

    def lesen(pfad: str) -> str:
        if hasattr(leser, "predict"):
            return paddle_ergebnis_zu_text(leser.predict(pfad))
        try:
            return paddle_ergebnis_zu_text(leser.ocr(pfad, cls=True))
        except TypeError:
            return paddle_ergebnis_zu_text(leser.ocr(pfad))

    return lesen
