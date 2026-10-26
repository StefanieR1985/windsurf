"""Textbereinigung und Kapitelerkennung fuer die OCR-Ausgabe.

Reine Funktionen ohne Seiteneffekte, damit sie sich ohne Kindle, Tesseract
und Netz testen lassen (siehe test_textclean.py).
"""

from __future__ import annotations

import re
import unicodedata

# ---------------------------------------------------------------- Normalisierung

# OCR liefert gern typografische Varianten, die die Sprachausgabe stoeren.
_ERSETZUNGEN = {
    "­": "",      # weiches Trennzeichen
    "​": "",      # breitenloses Leerzeichen
    "ﬁ": "fi",
    "ﬂ": "fl",
    "‘": "'",
    "’": "'",
    "‚": "'",
    "“": '"',
    "”": '"',
    "„": '"',
    "‹": "'",
    "›": "'",
    "«": '"',
    "»": '"',
    "−": "-",
    "–": "-",
    "—": "-",
    "…": "...",
}


def normalisiere(text: str) -> str:
    """Vereinheitlicht Unicode, Anfuehrungszeichen und Leerraum."""
    text = unicodedata.normalize("NFC", text)
    for alt, neu in _ERSETZUNGEN.items():
        text = text.replace(alt, neu)
    # Tesseract setzt manchmal Leerzeichen vor Satzzeichen.
    text = re.sub(r" +([,.;:!?])", r"\1", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text


# ---------------------------------------------------------------- Zeilenfilter

# Eine Zeile, die nur aus einer Seitenzahl besteht - auch mit Zierzeichen.
_NUR_ZAHL = re.compile(r"^[\s\-–—.|/*]*\d{1,4}[\s\-–—.|/*]*$")
# "14 | Ik ben Vincent" oder "Ik ben Vincent | 14"
_ZAHL_MIT_TITEL = re.compile(r"^\s*(\d{1,4}\s*[|/]\s*.{0,60}|.{0,60}\s*[|/]\s*\d{1,4})\s*$")
# Kindle-Fusszeilen: "Seite 14 von 192", "Pagina 14 van 192", "Position 1234"
_LESEFORTSCHRITT = re.compile(
    r"^\s*(seite|page|pagina|pos(ition)?|loc(ation)?)\b.*\d.*$", re.IGNORECASE
)
# Restliche Oberflaeche der Lese-App, die versehentlich im Ausschnitt landet.
_OBERFLAECHE = re.compile(
    r"^\s*(\d+\s*%|\d+\s*(min|minuten|minutes)\s*(uebrig|left|resterend)?"
    r"|inhalt|inhoud|contents|aa|◀|▶)\s*$",
    re.IGNORECASE,
)


def ist_seitenzahl(zeile: str) -> bool:
    """Wahr, wenn die Zeile eine Seitenzahl, Kopf-/Fusszeile oder App-Element ist."""
    s = zeile.strip()
    if not s:
        return False
    return bool(
        _NUR_ZAHL.match(s)
        or _ZAHL_MIT_TITEL.match(s)
        or _LESEFORTSCHRITT.match(s)
        or _OBERFLAECHE.match(s)
    )


def _schluessel(zeile: str) -> str:
    """Vergleichsform fuer die Frage: sind das dieselben Zeilen?

    Gross-/Kleinschreibung, Leerraum und Satzzeichen fallen weg, Ziffern
    bleiben. Nur so bleiben "Hoofdstuk 1" und "Hoofdstuk 2" unterscheidbar -
    und zwei Textzeilen, die sich allein in einer Zahl unterscheiden, gelten
    nicht faelschlich als Wiederholung.
    """
    return re.sub(r"[^\w]+", "", zeile.strip().lower())


def _kopf_schluessel(zeile: str) -> str:
    """Vergleichsform fuer die Frage: ist das dieselbe Kopfzeile?

    Hier fallen zusaetzlich die Ziffern weg, damit "14  Ik ben Vincent" und
    "15  Ik ben Vincent" als derselbe Kolumnentitel erkannt werden.
    """
    return _schluessel(re.sub(r"\d+", "", zeile))


def _kann_kolumnentitel_sein(zeile: str) -> bool:
    """Schliesst Zeilen aus, die nach Prosa aussehen.

    Ein Kolumnentitel ist kurz und endet nicht wie ein Satz. Diese Pruefung
    verhindert, dass wiederkehrende Satzanfaenge als Kopfzeile gelten.
    """
    s = zeile.strip()
    # Ein Kolumnentitel ist der Buchtitel, der Autor oder ein Kapitelname -
        # also kurz. Alles Laengere ist Prosa, auch ohne Satzzeichen am Ende.
    if not s or len(s) > 45:
        return False
    return not s.endswith((".", "!", "?", ",", ";", ":"))


def finde_kolumnentitel(seiten: list[list[str]], anteil: float = 0.45) -> set[str]:
    """Findet wiederkehrende Kopf-/Fusszeilen ueber alle Seiten hinweg.

    Geprueft wird nur der Rand jeder Seite. Was dort auf mindestens `anteil`
    der Seiten auftaucht und nicht wie ein Satz endet, ist ein Kolumnentitel
    und kein Text.
    """
    if len(seiten) < 3:
        return set()

    zaehler: dict[str, int] = {}
    for zeilen in seiten:
        belegt = [z for z in zeilen if z.strip()]
        # Auf kurzen Seiten wuerde ein Fenster von zwei Zeilen den ganzen
        # Inhalt erfassen - dann nur die erste und letzte Zeile ansehen.
        breite = 2 if len(belegt) >= 6 else 1
        rand = belegt[:breite] + belegt[-breite:]
        kandidaten = {
            _kopf_schluessel(z)
            for z in rand
            if _kann_kolumnentitel_sein(z) and _kopf_schluessel(z)
        }
        for schl in kandidaten:
            zaehler[schl] = zaehler.get(schl, 0) + 1

    grenze = max(2, int(len(seiten) * anteil))
    return {schl for schl, n in zaehler.items() if n >= grenze and len(schl) <= 60}


# ---------------------------------------------------------------- Seitenlogik

def _rand_positionen(zeilen: list[str], breite: int = 2) -> set[int]:
    """Indizes der ersten und letzten `breite` nichtleeren Zeilen."""
    belegt = [i for i, z in enumerate(zeilen) if z.strip()]
    return set(belegt[:breite]) | set(belegt[-breite:])


def saeubere_seite(rohtext: str, kolumnentitel: set[str] | None = None) -> list[str]:
    """Macht aus dem OCR-Text einer Seite eine Liste sauberer Zeilen."""
    kolumnentitel = kolumnentitel or set()

    zeilen: list[str] = []
    for roh in normalisiere(rohtext).splitlines():
        zeile = roh.strip()
        if not zeile:
            zeilen.append("")
            continue
        if ist_seitenzahl(zeile):
            continue
        # OCR-Schrott: Zeilen fast ohne Buchstaben.
        buchstaben = sum(c.isalpha() for c in zeile)
        if buchstaben == 0 or buchstaben / len(zeile) < 0.35:
            continue
        zeilen.append(zeile)

    # Kolumnentitel nur am Seitenrand tilgen. Mitten im Text stehen keine
    # Kopfzeilen - dort waere eine Uebereinstimmung ein Zufall, und das
    # Loeschen wuerde echten Text kosten.
    if kolumnentitel:
        rand = _rand_positionen(zeilen)
        zeilen = [
            z
            for i, z in enumerate(zeilen)
            if not (
                i in rand and _kopf_schluessel(z) and _kopf_schluessel(z) in kolumnentitel
            )
        ]

    # Fuehrende und abschliessende Leerzeilen entfernen.
    while zeilen and not zeilen[0]:
        zeilen.pop(0)
    while zeilen and not zeilen[-1]:
        zeilen.pop()
    return zeilen


def entferne_ueberlappung(vorher: list[str], aktuell: list[str], fenster: int = 6) -> list[str]:
    """Entfernt Zeilen am Seitenanfang, die am Ende der Vorseite schon standen.

    Beim Umblaettern zeigt die Lese-App manchmal die letzten Zeilen erneut.
    Gesucht wird die laengste Uebereinstimmung zwischen dem Ende von `vorher`
    und dem Anfang von `aktuell`.
    """
    if not vorher or not aktuell:
        return aktuell

    v = [z for z in vorher if z]
    a = [z for z in aktuell if z]
    if not v or not a:
        return aktuell

    grenze = min(fenster, len(v), len(a))
    for laenge in range(grenze, 0, -1):
        if [_schluessel(z) for z in v[-laenge:]] == [_schluessel(z) for z in a[:laenge]]:
            # Die ersten `laenge` nichtleeren Zeilen aus `aktuell` streichen.
            entfernt = 0
            rest: list[str] = []
            for zeile in aktuell:
                if entfernt < laenge and zeile.strip():
                    entfernt += 1
                    continue
                rest.append(zeile)
            while rest and not rest[0]:
                rest.pop(0)
            return rest
    return aktuell


def verbinde_trennungen(zeilen: list[str]) -> list[str]:
    """Fuegt am Zeilenende getrennte Woerter wieder zusammen."""
    ergebnis: list[str] = []
    i = 0
    while i < len(zeilen):
        zeile = zeilen[i]
        # Endet auf Bindestrich und die naechste Zeile beginnt klein -> Trennung.
        while (
            zeile.endswith("-")
            and not zeile.endswith("--")
            and i + 1 < len(zeilen)
            and zeilen[i + 1][:1].islower()
        ):
            i += 1
            zeile = zeile[:-1] + zeilen[i].lstrip()
        ergebnis.append(zeile)
        i += 1
    return ergebnis


def verbinde_absaetze(zeilen: list[str]) -> list[str]:
    """Fuegt harte Umbrueche innerhalb eines Absatzes zu Fliesstext zusammen.

    Ein Absatz endet, wenn eine Leerzeile folgt, wenn die Zeile mit einem
    Satzzeichen schliesst oder wenn die naechste Zeile wie woertliche Rede
    oder eine Ueberschrift beginnt.
    """
    absaetze: list[str] = []
    puffer: list[str] = []

    def leeren() -> None:
        if puffer:
            absaetze.append(" ".join(puffer).strip())
            puffer.clear()

    for i, zeile in enumerate(zeilen):
        if not zeile.strip():
            leeren()
            continue
        puffer.append(zeile.strip())
        naechste = zeilen[i + 1].strip() if i + 1 < len(zeilen) else ""
        endet_satz = zeile.rstrip().endswith((".", "!", "?", '"', ":", "..."))
        neue_rede = naechste.startswith(("-", '"', "–", "—"))
        if not naechste or endet_satz or neue_rede:
            leeren()
    leeren()
    return [a for a in absaetze if a]


def entferne_doppelzeilen(absaetze: list[str]) -> list[str]:
    """Entfernt unmittelbar aufeinanderfolgende gleiche Absaetze."""
    ergebnis: list[str] = []
    for absatz in absaetze:
        if ergebnis and _schluessel(absatz) and _schluessel(absatz) == _schluessel(ergebnis[-1]):
            continue
        ergebnis.append(absatz)
    return ergebnis


def seiten_zu_text(seiten_rohtext: list[str]) -> str:
    """Kompletter Weg von den OCR-Rohtexten aller Seiten zum Buchtext."""
    vorbereitet = [saeubere_seite(s) for s in seiten_rohtext]
    kolumnentitel = finde_kolumnentitel(vorbereitet)

    alle: list[str] = []
    vorige: list[str] = []
    for rohtext in seiten_rohtext:
        zeilen = saeubere_seite(rohtext, kolumnentitel)
        zeilen = entferne_ueberlappung(vorige, zeilen)
        if not zeilen:
            continue
        vorige = zeilen
        alle.extend(zeilen)
        alle.append("")  # Seitengrenze als Absatzgrenze behandeln

    alle = verbinde_trennungen(alle)
    absaetze = entferne_doppelzeilen(verbinde_absaetze(alle))
    return "\n\n".join(absaetze) + "\n"


# ---------------------------------------------------------------- Kapitel

_KAPITEL_MUSTER = [
    re.compile(r"^(hoofdstuk|kapitel|chapter)\s+([0-9]{1,3}|[ivxlc]+)\b.*$", re.IGNORECASE),
    re.compile(r"^[0-9]{1,3}\.?$"),
    re.compile(r"^[IVXLC]{1,6}\.?$"),
]


def ist_kapitelzeile(absatz: str, max_laenge: int = 70) -> bool:
    """Wahr, wenn der Absatz wie eine Kapitelueberschrift aussieht."""
    s = absatz.strip()
    if not s or len(s) > max_laenge:
        return False
    if any(m.match(s) for m in _KAPITEL_MUSTER):
        return True
    # Kurze Zeile in Grossbuchstaben ohne Satzschluss.
    if len(s) <= max_laenge and s.upper() == s and sum(c.isalpha() for c in s) >= 3:
        return not s.endswith((".", "!", "?", ","))
    return False


def teile_kapitel(text: str, min_zeichen: int = 1200) -> list[tuple[str, str]]:
    """Teilt den Text in (Ueberschrift, Inhalt)-Paare.

    Abschnitte unter `min_zeichen` werden an den vorherigen angehaengt, damit
    aus Zwischentiteln keine Zwei-Satz-Kapitel entstehen.
    """
    absaetze = [a.strip() for a in text.split("\n\n") if a.strip()]

    rohkapitel: list[tuple[str, list[str]]] = []
    titel = ""
    inhalt: list[str] = []
    for absatz in absaetze:
        if ist_kapitelzeile(absatz):
            if inhalt or titel:
                rohkapitel.append((titel, inhalt))
            titel, inhalt = absatz, []
        else:
            inhalt.append(absatz)
    if inhalt or titel:
        rohkapitel.append((titel, inhalt))

    # Zu kurze Abschnitte verschmelzen.
    zusammengefasst: list[tuple[str, list[str]]] = []
    for titel, inhalt in rohkapitel:
        laenge = sum(len(a) for a in inhalt)
        if zusammengefasst and laenge < min_zeichen:
            v_titel, v_inhalt = zusammengefasst[-1]
            neu = v_inhalt + ([titel] if titel else []) + inhalt
            zusammengefasst[-1] = (v_titel, neu)
        else:
            zusammengefasst.append((titel, inhalt))

    ergebnis: list[tuple[str, str]] = []
    for nummer, (titel, inhalt) in enumerate(zusammengefasst, start=1):
        if not inhalt and not titel:
            continue
        ergebnis.append((titel or f"Kapitel {nummer}", "\n\n".join(inhalt)))
    return ergebnis


def wende_glossar_an(text: str, begriffe: dict[str, str]) -> str:
    """Erzwingt einheitliche Namen und feste Begriffe.

    Ersetzt nur an Wortgrenzen und laengere Eintraege zuerst, damit
    Mehrwortbegriffe nicht von Einzelwoertern zerlegt werden.
    """
    for quelle in sorted(begriffe, key=len, reverse=True):
        ziel = begriffe[quelle]
        if not quelle or quelle == ziel or quelle.startswith("_"):
            continue
        text = re.sub(rf"\b{re.escape(quelle)}\b", ziel.replace("\\", r"\\"), text)
    return text
