"""Tests fuer textclean.py.

Alle Beispieltexte sind frei erfunden - sie pruefen nur die Mechanik der
Bereinigung, nicht einen bestimmten Buchinhalt.

Ausfuehren:  python3 test_textclean.py
"""

from __future__ import annotations

import textclean as tc

fehler: list[str] = []


def pruefe(name: str, ist, soll) -> None:
    if ist == soll:
        print(f"  ok   {name}")
    else:
        print(f"  FEHL {name}\n       ist : {ist!r}\n       soll: {soll!r}")
        fehler.append(name)


def wahr(name: str, bedingung: bool) -> None:
    pruefe(name, bool(bedingung), True)


print("Normalisierung")
pruefe(
    "typografische Zeichen",
    tc.normalisiere('„Hallo“ — zei hij…'),
    '"Hallo" - zei hij...',
)
pruefe("Leerzeichen vor Satzzeichen", tc.normalisiere("Hallo , daar !"), "Hallo, daar!")
pruefe("weiches Trennzeichen", tc.normalisiere("Zim­mer"), "Zimmer")

print("\nSeitenzahlen und Oberflaeche")
for probe in ["14", " 7 ", "- 23 -", "14 | Het boek", "Seite 14 von 192", "Pagina 3 van 10", "47 %"]:
    wahr(f"erkennt {probe!r}", tc.ist_seitenzahl(probe))
for probe in ["Hij liep naar buiten.", "Kapitel 3", "7 jongens stonden daar"]:
    wahr(f"laesst {probe!r} stehen", not tc.ist_seitenzahl(probe))

print("\nKolumnentitel ueber viele Seiten")
seiten = [["Het grote boek", f"Zin nummer {i} op de bladzijde.", "Het grote boek"] for i in range(8)]
titel = tc.finde_kolumnentitel(seiten)
wahr("wiederkehrender Titel erkannt", tc._schluessel("Het grote boek") in titel)
gesaeubert = tc.saeubere_seite("Het grote boek\nZin nummer 1 op de bladzijde.\nHet grote boek", titel)
pruefe("Titel entfernt", gesaeubert, ["Zin nummer 1 op de bladzijde."])

print("\nUeberlappung beim Umblaettern")
pruefe(
    "doppelte Zeilen am Seitenanfang",
    tc.entferne_ueberlappung(
        ["Eerste zin.", "Tweede zin.", "Derde zin."],
        ["Tweede zin.", "Derde zin.", "Vierde zin."],
    ),
    ["Vierde zin."],
)
pruefe(
    "ohne Ueberlappung unveraendert",
    tc.entferne_ueberlappung(["Eerste zin."], ["Vierde zin."]),
    ["Vierde zin."],
)

print("\nTrennungen und Absaetze")
pruefe(
    "Worttrennung zusammengefuegt",
    tc.verbinde_trennungen(["Hij woonde in een groot huis met een vlie-", "ring eronder."]),
    ["Hij woonde in een groot huis met een vliering eronder."],
)
pruefe(
    "Absatz aus harten Umbruechen",
    tc.verbinde_absaetze(["Hij liep naar de", "deur en keek naar buiten.", "", "Het regende."]),
    ["Hij liep naar de deur en keek naar buiten.", "Het regende."],
)
pruefe(
    "woertliche Rede bleibt getrennt",
    tc.verbinde_absaetze(["Hij zei iets zachts.", "- Kom je nog?"]),
    ["Hij zei iets zachts.", "- Kom je nog?"],
)
pruefe(
    "doppelte Absaetze weg",
    tc.entferne_doppelzeilen(["Het regende.", "Het regende.", "De zon kwam op."]),
    ["Het regende.", "De zon kwam op."],
)

print("\nGesamtweg Seiten -> Text")
roh = [
    "Het grote boek\n14\nHij liep naar de\ndeur en keek naar buiten.\nHet grote boek",
    "Het grote boek\n15\nHet regende die hele dag door.\nHet grote boek",
    "Het grote boek\n16\nHet regende die hele dag door.\nDaarna werd het stil.\nHet grote boek",
]
text = tc.seiten_zu_text(roh)
wahr("kein Kolumnentitel mehr", "grote boek" not in text)
wahr("keine Seitenzahl mehr", "\n14\n" not in text)
wahr("Absatz zusammengesetzt", "deur en keek naar buiten" in text)
wahr("Ueberlappung getilgt", text.count("Het regende die hele dag door") == 1)

print("\nTrennung der Vergleichsschluessel")
wahr(
    "Identitaet beachtet Ziffern",
    tc._schluessel("Hoofdstuk 1") != tc._schluessel("Hoofdstuk 2"),
)
wahr(
    "Kopfzeile ignoriert Ziffern",
    tc._kopf_schluessel("14 Ik ben Vincent") == tc._kopf_schluessel("15 Ik ben Vincent"),
)
wahr(
    "Identitaet ignoriert Satzzeichen und Grossschreibung",
    tc._schluessel("Het regende!") == tc._schluessel("het regende"),
)

print("\nRegression: Fliesstext darf nicht als Kopfzeile gelten")
# Zeilen, die sich nur in Ziffern unterscheiden, haben denselben Vergleichs-
# schluessel. Sie sind trotzdem Text und muessen erhalten bleiben.
seiten_roh = []
for k in range(6):
    koerper = "\n".join(
        f"Dit is regel {k}-{i} van een verzonnen alinea die lang genoeg is." for i in range(8)
    )
    seiten_roh.append(f"Het grote boek\n{k + 10}\n{koerper}\nHet grote boek")
ergebnis = tc.seiten_zu_text(seiten_roh)
wahr("Kolumnentitel entfernt", "grote boek" not in ergebnis)
wahr("Seitenzahlen entfernt", "\n10\n" not in ergebnis)
wahr("Fliesstext erhalten", ergebnis.count("verzonnen alinea") >= 40)
wahr("nicht leergeraeumt", len(ergebnis) > 2000)

print("\nRegression: lange wiederkehrende Zeile ist kein Kolumnentitel")
wahr(
    "57 Zeichen ohne Punkt gilt als Prosa",
    not tc._kann_kolumnentitel_sein("Dit is regel 0-0 van een verzonnen alinea die lang genoeg"),
)
wahr("kurzer Titel gilt als Kolumnentitel", tc._kann_kolumnentitel_sein("Ik ben Vincent"))

print("\nKapitelerkennung")
wahr("'Hoofdstuk 3'", tc.ist_kapitelzeile("Hoofdstuk 3"))
wahr("'Kapitel 12'", tc.ist_kapitelzeile("Kapitel 12"))
wahr("bloße Zahl '7'", tc.ist_kapitelzeile("7"))
wahr("Versalien 'DE EERSTE DAG'", tc.ist_kapitelzeile("DE EERSTE DAG"))
wahr("Fliesstext ist kein Kapitel", not tc.ist_kapitelzeile("Hij liep naar buiten en keek omhoog naar de lucht boven hem."))

langer_absatz = "Dit is een zin die lang genoeg is om als inhoud te gelden. " * 30
kapitel = tc.teile_kapitel(f"Hoofdstuk 1\n\n{langer_absatz}\n\nHoofdstuk 2\n\n{langer_absatz}")
pruefe("zwei Kapitel", len(kapitel), 2)
pruefe("Titel uebernommen", [t for t, _ in kapitel], ["Hoofdstuk 1", "Hoofdstuk 2"])

kurz = tc.teile_kapitel(f"Hoofdstuk 1\n\n{langer_absatz}\n\nHoofdstuk 2\n\nKort.")
pruefe("zu kurzer Abschnitt verschmolzen", len(kurz), 1)

print("\nGlossar")
pruefe(
    "Mehrwortbegriff zuerst",
    tc.wende_glossar_an("De Jas hing daar. Dilan zag de jas.", {"De Jas": "Die Jacke", "de jas": "die Jacke"}),
    "Die Jacke hing daar. Dilan zag die Jacke.",
)
pruefe(
    "keine Teilwort-Ersetzung",
    tc.wende_glossar_an("Jassen en Jasmijn.", {"Jas": "Jacke"}),
    "Jassen en Jasmijn.",
)

print()
if fehler:
    raise SystemExit(f"{len(fehler)} Test(s) fehlgeschlagen: {', '.join(fehler)}")
print("Alle Tests bestanden.")
