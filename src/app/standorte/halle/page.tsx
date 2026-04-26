import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityPageTemplate from "@/components/CityPageTemplate";

export const metadata: Metadata = {
  title: "Monteurzimmer & Studentenunterkünfte Halle (Saale) | 4 Nächte Mindestmiete",
  description: "Monteurzimmer Halle (Saale) mit Einzelbetten-Garantie. Mindestmietdauer 4 Nächte, langfristige Miete willkommen. Auch für Studenten. 12 Apartments nahe Uniklinikum, Chemiepark, Universität.",
  keywords: "Monteurzimmer Halle Saale, Studentenunterkunft Halle, Monteurwohnung Halle, möbliertes Apartment Halle, 4 Nächte Mindestmiete, Uniklinikum Halle",
  openGraph: {
    title: "Monteurzimmer & Studentenunterkünfte Halle (Saale) | Move-in2Stay",
    description: "Mindestmietdauer 4 Nächte – Monteure & Studenten willkommen. Einzelbetten-Garantie in Halle.",
    type: "website",
  },
};

const halleData = {
  city: "Halle (Saale)",
  population: "240.000",
  description: "Halle (Saale): Professionelle Monteurzimmer & Studentenunterkünfte mit Einzelbetten. Mindestmietdauer 4 Nächte, langfristige Miete willkommen. Ideal für Uniklinikum-Mitarbeiter, Chemiepark-Monteure und Studenten. 12 Apartments in der Region.",
  apartments: 12,
  priceFrom: 22,
  highlights: [
    {
      title: "Nähe Chemiepark Halle",
      description: "Ideale Unterkünfte für Mitarbeiter und Geschäftspartner des Chemieparks.",
    },
    {
      title: "Universitäts-Nähe",
      description: "Perfekt für wissenschaftliche Gäste und Tagungsteilnehmer.",
    },
    {
      title: "Händel-Stadt",
      description: "Kulturelle Highlights für die Freizeit nach der Arbeit.",
    },
    {
      title: "Industriegebiet Süd",
      description: "Nah zu Automobilzulieferern und Logistikunternehmen.",
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
    { name: "SS15-EL", area: "Schlosserstraße", distance: "Nähe Innenstadt" },
    { name: "SS15-ER", area: "Schlosserstraße", distance: "Nähe Innenstadt" },
    { name: "SS15-1R", area: "Schlosserstraße", distance: "Nähe Innenstadt" },
    { name: "SS15-2L", area: "Schlosserstraße", distance: "Nähe Innenstadt" },
    { name: "SS15-2R", area: "Schlosserstraße", distance: "Nähe Innenstadt" },
    { name: "SS15-3L", area: "Schlosserstraße", distance: "Nähe Innenstadt" },
    { name: "SS15-3R", area: "Schlosserstraße", distance: "Nähe Innenstadt" },
    { name: "MS1-4", area: "Marienstraße", distance: "Nähe Uni" },
    { name: "MS1-E", area: "Marienstraße", distance: "Nähe Uni" },
    { name: "MS2-1", area: "Marienstraße", distance: "Nähe Uni" },
    { name: "MS2-2", area: "Marienstraße", distance: "Nähe Uni" },
    { name: "MS3-4L", area: "Marienstraße", distance: "Nähe Uni" },
  ],
  nearbyCities: [
    { name: "Leipzig", distance: "37 km", url: "/standorte/leipzig" },
    { name: "Merseburg", distance: "20 km", url: "/standorte/merseburg" },
    { name: "Delitzsch", distance: "52 km", url: "/standorte/delitzsch" },
  ],
  faqs: [
    {
      question: "Wie weit sind die Apartments vom Chemiepark entfernt?",
      answer: "Unsere Apartments in Halle sind 5-15 Minuten vom Chemiepark Halle entfernt. Je nach Standort erreichen Sie Ihre Arbeitsstelle schnell.",
    },
    {
      question: "Gibt es gute Restaurants in der Nähe?",
      answer: "Ja, Halle hat ein vielfältiges gastronomisches Angebot. Viele Restaurants sind fußläufig oder kurze Fahrten von unseren Standorten entfernt.",
    },
    {
      question: "Sind die Apartments familienfreundlich?",
      answer: "Ja, einige unserer Apartments eignen sich auch für Familien. Bitte teilen Sie uns bei der Buchung mit, wie viele Personen reisen.",
    },
    {
      question: "Kann ich wochenweise buchen?",
      answer: "Ja, wir bieten flexible Buchungszeiträume an. Ob für eine Nacht, eine Woche oder mehrere Monate – wir haben die passende Lösung.",
    },
  ],
};

export default function HallePage() {
  return (
    <>
      <Navbar />
      <CityPageTemplate data={halleData} />
      <Footer />
    </>
  );
}
