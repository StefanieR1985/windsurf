import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityPageTemplate from "@/components/CityPageTemplate";

export const metadata: Metadata = {
  title: "Monteurzimmer & Studentenunterkünfte Delitzsch | 4 Nächte Mindestmiete",
  description: "Monteurzimmer Delitzsch mit Einzelbetten-Garantie. Mindestmietdauer 4 Nächte, langfristige Miete willkommen. Auch für Studenten. 3 Apartments zwischen Leipzig und Halle, direkt an der A14.",
  keywords: "Monteurzimmer Delitzsch, Studentenunterkunft Delitzsch, Monteurwohnung Delitzsch, möbliertes Apartment Delitzsch, 4 Nächte Mindestmiete, A14 Delitzsch",
  openGraph: {
    title: "Monteurzimmer & Studentenunterkünfte Delitzsch | Move-in2Stay",
    description: "Mindestmietdauer 4 Nächte – Monteure & Studenten willkommen. Einzelbetten-Garantie in Delitzsch.",
    type: "website",
  },
};

const delitzschData = {
  city: "Delitzsch",
  population: "25.000",
  description: "Delitzsch: Monteurzimmer & Studentenunterkünfte zentral zwischen Leipzig-Halle. Mindestmietdauer 4 Nächte, langfristige Miete willkommen. Direkt an der A14 – ideal für Pendler. 3 Apartments mit garantierten Einzelbetten.",
  apartments: 4,
  priceFrom: 22,
  highlights: [
    {
      title: "Barocke Altstadt",
      description: "Historischer Stadtkern mit Marktplatz und Gastronomie.",
    },
    {
      title: "Schloss Delitzsch",
      description: "Ehemalige Herzogsresidenz mit Gartenanlage.",
    },
    {
      title: "Nord-Süd-Verbindung",
      description: "Gleichmäßige Distanz zu Leipzig und Halle.",
    },
    {
      title: "A14 direkt erreichbar",
      description: "Schnelle Anbindung an die Autobahn.",
    },
  ],
  equipment: [
    "Einzelbetten in 1-3 Zimmern",
    "Kostenloses Highspeed-WLAN",
    "Smart-TV mit Streaming",
    "Private Waschmaschine",
    "Voll ausgestattete Küche",
    "Kostenlose Parkplätze",
    "Balkon (teilweise)",
    "Self Check-in",
  ],
  locations: [
    { name: "NS3-DG", area: "Neue Straße", distance: "Zentrum" },
    { name: "NS3-1", area: "Neue Straße", distance: "Zentrum" },
    { name: "NS3-ER", area: "Neue Straße", distance: "Zentrum" },
    { name: "NS3-EL", area: "Neue Straße", distance: "Zentrum" },
  ],
  nearbyCities: [
    { name: "Leipzig", distance: "25 km", url: "/standorte/leipzig" },
    { name: "Halle (Saale)", distance: "52 km", url: "/standorte/halle" },
    { name: "Bitterfeld", distance: "35 km", url: "/standorte/bitterfeld" },
  ],
  faqs: [
    {
      question: "Ist Delitzsch gut für Pendler geeignet?",
      answer: "Ja, Delitzsch liegt etwa 25 km von Leipzig und 52 km von Halle entfernt. Ideal für Monteure, die in beiden Städten arbeiten.",
    },
    {
      question: "Was gibt es in der Freizeit zu tun?",
      answer: "Delitzsch bietet eine schöne barocke Altstadt, das Schloss mit Garten, diverse Restaurants und ist Ausgangspunkt für Radtouren in die Umgebung.",
    },
    {
      question: "Gibt es Supermärkte in der Nähe?",
      answer: "Ja, im Stadtzentrum und in der Nähe unserer Standorte finden Sie verschiedene Einkaufsmöglichkeiten.",
    },
    {
      question: "Wie ist die Anbindung an die Autobahn?",
      answer: "Die A14 ist in wenigen Minuten erreichbar, was eine schnelle Anreise und flexible Mobilität ermöglicht.",
    },
  ],
};

export default function DelitzschPage() {
  return (
    <>
      <Navbar />
      <CityPageTemplate data={delitzschData} />
      <Footer />
    </>
  );
}
