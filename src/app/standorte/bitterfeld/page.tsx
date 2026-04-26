import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityPageTemplate from "@/components/CityPageTemplate";

export const metadata: Metadata = {
  title: "Monteurzimmer & Studentenunterkünfte Bitterfeld-Wolfen | 4 Nächte Mindestmiete",
  description: "Monteurzimmer Bitterfeld-Wolfen mit Einzelbetten-Garantie. Mindestmietdauer 4 Nächte, langfristige Miete willkommen. Auch für Studenten. 5 Apartments am Chemiepark, Flughafen LEJ, A9/A14.",
  keywords: "Monteurzimmer Bitterfeld, Studentenunterkunft Bitterfeld, Monteurwohnung Bitterfeld-Wolfen, möbliertes Apartment Bitterfeld, 4 Nächte Mindestmiete, Chemiepark Bitterfeld",
  openGraph: {
    title: "Monteurzimmer & Studentenunterkünfte Bitterfeld-Wolfen | Move-in2Stay",
    description: "Mindestmietdauer 4 Nächte – Monteure & Studenten willkommen. Einzelbetten-Garantie in Bitterfeld-Wolfen.",
    type: "website",
  },
};

const bitterfeldData = {
  city: "Bitterfeld-Wolfen",
  population: "40.000",
  description: "Bitterfeld-Wolfen: Monteurzimmer & Studentenunterkünfte am Chemiepark. Mindestmietdauer 4 Nächte, langfristige Miete willkommen. Direkt an A9/A14, Flughafen LEJ. 5 All-inclusive Apartments ab 490€/Monat mit Einzelbetten.",
  apartments: 5,
  priceFrom: 23,
  highlights: [
    {
      title: "Autobahnkreuz A9/A14",
      description: "Perfekte Verkehrsanbindung in alle Richtungen.",
    },
    {
      title: "Industriegebiet",
      description: "Nahegelegene Gewerbegebiete und Logistik.",
    },
    {
      title: "Goitzsche",
      description: "Europas größte künstliche Wasserlandschaft für die Freizeit.",
    },
    {
      title: "Ressel Mansion",
      description: "Premium-Unterkunft für höchste Ansprüche.",
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
    { name: "HZ1", area: "Hallesche Straße", distance: "Nähe Zentrum" },
    { name: "Sorge12-EG", area: "An der Sorge", distance: "Ressel Mansion" },
    { name: "Sorge12-DG", area: "An der Sorge", distance: "Ressel Mansion" },
  ],
  nearbyCities: [
    { name: "Leipzig", distance: "40 km", url: "/standorte/leipzig" },
    { name: "Halle (Saale)", distance: "35 km", url: "/standorte/halle" },
    { name: "Merseburg", distance: "50 km", url: "/standorte/merseburg" },
  ],
  faqs: [
    {
      question: "Wie ist die Verkehrsanbindung?",
      answer: "Bitterfeld liegt direkt an der A9 und A14. Leipzig erreichen Sie in 30 Minuten, Halle in 25 Minuten – ideal für Monteure, die mobil sein müssen.",
    },
    {
      question: "Was ist die Goitzsche?",
      answer: "Die Goitzsche ist Europas größte künstliche Wasserlandschaft mit Seen, Wäldern und Radwegen – perfekt für Entspannung nach der Arbeit.",
    },
    {
      question: "Gibt es Premium-Unterkünfte?",
      answer: "Ja, die Ressel Mansion in Bitterfeld bietet gehobene Ausstattung für anspruchsvolle Gäste und längere Aufenthalte.",
    },
    {
      question: "Sind die Apartments auch für Familien geeignet?",
      answer: "Ja, insbesondere die größeren Apartments eignen sich auch für Familien oder kleine Teams, die gemeinsam unterkommen möchten.",
    },
  ],
};

export default function BitterfeldPage() {
  return (
    <>
      <Navbar />
      <CityPageTemplate data={bitterfeldData} />
      <Footer />
    </>
  );
}
