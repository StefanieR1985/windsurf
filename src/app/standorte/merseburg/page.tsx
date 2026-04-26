import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityPageTemplate from "@/components/CityPageTemplate";

export const metadata: Metadata = {
  title: "Monteurzimmer & Studentenunterkünfte Merseburg | 4 Nächte Mindestmiete",
  description: "Monteurzimmer Merseburg mit Einzelbetten-Garantie. Mindestmietdauer 4 Nächte, langfristige Miete willkommen. Auch für Studenten. 4 Apartments direkt am Chemiepark Merseburg.",
  keywords: "Monteurzimmer Merseburg, Studentenunterkunft Merseburg, Monteurwohnung Merseburg, möbliertes Apartment Merseburg, 4 Nächte Mindestmiete, Chemiepark Merseburg",
  openGraph: {
    title: "Monteurzimmer & Studentenunterkünfte Merseburg | Move-in2Stay",
    description: "Mindestmietdauer 4 Nächte – Monteure & Studenten willkommen. Einzelbetten-Garantie in Merseburg.",
    type: "website",
  },
};

const merseburgData = {
  city: "Merseburg",
  population: "35.000",
  description: "Merseburg: Spezialisierte Monteurzimmer & Studentenunterkünfte am Chemiepark. Mindestmietdauer 4 Nächte, langfristige Miete willkommen. Fußläufig zum Chemiepark, ideal für Projektteams und Studenten der Hochschule. 4 Apartments mit Einzelbetten.",
  apartments: 4,
  priceFrom: 20,
  highlights: [
    {
      title: "Chemiepark direkt vor Ort",
      description: "Fußläufige Entfernung zum Chemiepark Merseburg.",
    },
    {
      title: "Historischer Dom",
      description: "Weltberühmte Merseburger Zaubersprüche und Kultur.",
    },
    {
      title: "Industriepark Merseburg",
      description: "Nahegelegene Industriebetriebe und Logistik.",
    },
    {
      title: "Uni Merseburg",
      description: "Ideal für wissenschaftliche Mitarbeiter und Gäste.",
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
    { name: "AP8-1", area: "Am Paradies", distance: "Zentrum" },
    { name: "AP8-3", area: "Am Paradies", distance: "Zentrum" },
    { name: "NDS2-R", area: "Neue Deichstraße", distance: "Nähe Bahnhof" },
    { name: "ERS9-E", area: "Ernst-Reuter-Straße", distance: "Nähe Dom" },
  ],
  nearbyCities: [
    { name: "Halle (Saale)", distance: "20 km", url: "/standorte/halle" },
    { name: "Leipzig", distance: "45 km", url: "/standorte/leipzig" },
    { name: "Bitterfeld", distance: "50 km", url: "/standorte/bitterfeld" },
  ],
  faqs: [
    {
      question: "Wie nah ist der Chemiepark?",
      answer: "Unsere Standorte in Merseburg sind maximal 10 Minuten vom Chemiepark entfernt – teilweise sogar fußläufig.",
    },
    {
      question: "Gibt es Einkaufsmöglichkeiten?",
      answer: "Ja, Merseburg bietet verschiedene Supermärkte und Geschäfte im Stadtzentrum, fußläufig von unseren Apartments erreichbar.",
    },
    {
      question: "Ist Merseburg für längere Aufenthalte geeignet?",
      answer: "Ja, Merseburg ist eine ruhige Stadt mit allen notwendigen Einrichtungen für längere Projektaufenthalte.",
    },
    {
      question: "Kann ich mit dem Zug anreisen?",
      answer: "Ja, Merseburg hat einen Bahnhof mit regelmäßigen Verbindungen nach Halle und Leipzig. Vom Bahnhof sind unsere Apartments gut erreichbar.",
    },
  ],
};

export default function MerseburgPage() {
  return (
    <>
      <Navbar />
      <CityPageTemplate data={merseburgData} />
      <Footer />
    </>
  );
}
