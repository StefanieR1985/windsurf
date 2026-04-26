import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityPageTemplate from "@/components/CityPageTemplate";

export const metadata: Metadata = {
  title: "Monteurzimmer & Studentenunterkünfte Leipzig | 4 Nächte Mindestmiete",
  description: "Monteurzimmer Leipzig mit Einzelbetten-Garantie. Mindestmietdauer 4 Nächte, langfristige Miete willkommen. Auch für Studenten. 8 Apartments nahe Messe, BMW, Porsche, DHL.",
  keywords: "Monteurzimmer Leipzig, Studentenunterkunft Leipzig, Monteurwohnung Leipzig, möbliertes Apartment Leipzig, 4 Nächte Mindestmiete, Einzelbetten Leipzig",
  openGraph: {
    title: "Monteurzimmer & Studentenunterkünfte Leipzig | Move-in2Stay",
    description: "Mindestmietdauer 4 Nächte – Monteure & Studenten willkommen. Einzelbetten-Garantie in Leipzig.",
    type: "website",
  },
};

const leipzigData = {
  city: "Leipzig",
  population: "605.000",
  description: "Leipzig: Professionelle Monteurzimmer & Studentenunterkünfte mit Einzelbetten. Mindestmietdauer 4 Nächte, langfristige Miete willkommen. Ideal für Messebesucher, BMW/Porsche-Monteure und Studenten. 8 Apartments nahe Industriegebieten.",
  apartments: 8,
  priceFrom: 25,
  highlights: [
    {
      title: "Nähe Leipziger Messe",
      description: "Ideale Lage für Messebesucher und Aussteller. Direkte Anbindung an das Messegelände.",
    },
    {
      title: "Zentrum in 10 Minuten",
      description: "Schnell im Stadtzentrum mit historischer Altstadt, Restaurants und Shopping.",
    },
    {
      title: "Hauptbahnhof-Nähe",
      description: "Ausgezeichnete ÖPNV-Anbindung für reibungslose An- und Abreise.",
    },
    {
      title: "Industriegebiete",
      description: "Nah zu BMW, Porsche, DHL und weiteren Großunternehmen.",
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
    { name: "BLS13", area: "Böhlitz-Ehrenberg", distance: "Nähe Messe" },
    { name: "GS199", area: "Georg-Schumann-Straße", distance: "Nordwesten" },
    { name: "LZS20", area: "Lützner Straße", distance: "Westen" },
  ],
  nearbyCities: [
    { name: "Halle (Saale)", distance: "37 km", url: "/standorte/halle" },
    { name: "Merseburg", distance: "45 km", url: "/standorte/merseburg" },
    { name: "Delitzsch", distance: "25 km", url: "/standorte/delitzsch" },
  ],
  faqs: [
    {
      question: "Ab wie vielen Nächten kann ich buchen?",
      answer: "Unsere Monteurzimmer in Leipzig sind ab 1 Nacht buchbar. Für längere Aufenthalte ab 30 Nächte bieten wir attraktive Rabatte.",
    },
    {
      question: "Sind die Apartments auch für Gruppen geeignet?",
      answer: "Ja, wir haben Apartments für 2-6 Personen. Ideal für Monteurteams oder Gruppen von Geschäftsreisenden.",
    },
    {
      question: "Gibt es Parkmöglichkeiten?",
      answer: "Ja, alle unsere Standorte in Leipzig bieten kostenlose Parkplätze direkt am Haus.",
    },
    {
      question: "Wie funktioniert der Check-in?",
      answer: "Wir bieten einen bequemen Self Check-in mit Schlüsselsafe. Sie können also jederzeit anreisen, auch am Wochenende oder spät abends.",
    },
  ],
};

export default function LeipzigPage() {
  return (
    <>
      <Navbar />
      <CityPageTemplate data={leipzigData} />
      <Footer />
    </>
  );
}
