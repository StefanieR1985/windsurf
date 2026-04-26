import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, Home, Maximize, Euro, BedDouble, CheckCircle2, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Via Regia Leipzig | 8 Longstay-Apartments zur Vermietung",
  description: "Exklusive möblierte Apartments im Via Regia am Waldplatz 2a, Leipzig. 32-93 m², Art-Deco-Design, ab 1.020€/Monat. Mindestmietdauer 1 Jahr.",
  keywords: "Via Regia Leipzig, Longstay Apartments, möblierte Wohnung Leipzig, Waldstraßenviertel, Monteurzimmer Leipzig",
};

// Wohnungs-Exposés basierend auf Excel-Daten
const apartments = [
  {
    id: "VR-27",
    name: "Wohnung 27",
    floor: "4. OG",
    size: 36.98,
    coldRent: 1020.00,
    warmRent: 1180.00,
    features: ["Einzelbett", "Smart-TV", "Küche", "Bad"],
    available: true,
    highlight: "Kompakt & effizient",
  },
  {
    id: "VR-28",
    name: "Wohnung 28",
    floor: "4. OG",
    size: 42.61,
    coldRent: 1160.00,
    warmRent: 1355.99,
    features: ["Einzelbett", "Balkon", "Smart-TV", "Küche", "Bad"],
    available: true,
    highlight: "Mit Balkon",
  },
  {
    id: "VR-DUPLEX",
    name: "Duplex-Wohnung",
    floor: "EG-1.OG",
    size: 120.00,
    coldRent: 1520.00,
    warmRent: 1650.00,
    features: ["2 Schlafzimmer", "Großes Wohnzimmer", "Terrasse", "Gäste-WC", "Vollausstattung"],
    available: true,
    highlight: "Premium",
  },
];

const buildingFeatures = [
  "Markantes Eckgebäude am Waldplatz",
  "Goldene Wandpaneele & Art-Deco-Design",
  "Verglaste Vorsprünge mit Sitzgelegenheiten",
  "Naturstein-Treppenhaus",
  "Hotelteppiche in den Fluren",
  "Modernes Lichtdesign",
  "Digitales Check-in",
  "Aufzug",
];

export default function ViaRegiaPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-navy via-navy-light to-primary py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-64 h-64 bg-accent rounded-full blur-3xl" />
          </div>
          
          <div className="container-custom section-padding relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block bg-accent text-navy px-6 py-3 rounded-full text-lg font-bold mb-6 animate-pulse">
                🆕 NEU IN DER VERMIETUNG
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Via Regia <span className="text-accent">Leipzig</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8">
                8 exklusive Longstay-Apartments am Waldplatz 2a
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                  32–93 m²
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                  Art-Deco-Design
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                  Ab 1.020 €/Monat
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                  Mindestens 1 Jahr
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Gebäude-Info */}
        <section className="py-16 bg-white">
          <div className="container-custom section-padding">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Bild-Platzhalter */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Home size={80} className="text-primary/30" />
                </div>
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full shadow-lg">
                  <span className="font-bold text-navy">Waldplatz 2a</span>
                </div>
              </div>

              {/* Info */}
              <div>
                <h2 className="text-3xl font-bold text-navy mb-4">
                  Exklusives Wohnen im <span className="text-accent">Waldstraßenviertel</span>
                </h2>
                <p className="text-gray-600 mb-6">
                  Das Via Regia ist ein markantes Eckgebäude am Leipziger Waldplatz. 
                  Die Neubauimmobilie besticht durch goldene Wandpaneele, verglaste Vorsprünge 
                  mit Sitzgelegenheiten und ein aufwendig gestaltetes Entree mit Naturstein-Treppenhaus.
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {buildingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wohnungs-Exposés */}
        <section className="py-20 bg-gray-50" id="wohnungen">
          <div className="container-custom section-padding">
            <div className="text-center mb-12">
              <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Verfügbare Wohnungen
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Wohnungs-<span className="text-accent">Exposés</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Alle Apartments sind voll möbliert mit Einzelbetten, Smart-TV, 
                voll ausgestatteter Küche und hochwertigem Bad.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {apartments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                >
                  {/* Header */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <Home size={48} className="text-primary/30" />
                    {apt.highlight && (
                      <div className="absolute top-4 right-4 bg-accent text-navy px-3 py-1 rounded-full text-xs font-bold">
                        {apt.highlight}
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full shadow-sm">
                      <span className="text-sm font-bold text-navy">{apt.floor}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{apt.id}</span>
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-4">{apt.name}</h3>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Maximize size={20} className="text-primary" />
                        <span className="text-sm"><strong>{apt.size}</strong> m²</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BedDouble size={20} className="text-primary" />
                        <span className="text-sm">{apt.features[0]}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {apt.features.slice(1).map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="border-t pt-4 mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">Kaltmiete:</span>
                        <span className="font-semibold">{apt.coldRent.toLocaleString('de-DE')} €</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold text-navy">
                        <span>Warmmiete:</span>
                        <span className="text-primary">{apt.warmRent.toLocaleString('de-DE')} €</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href="/kontakt"
                      className="block w-full text-center bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                    >
                      Anfragen
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-navy text-white">
          <div className="container-custom section-padding">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-accent mb-2">8</p>
                <p className="text-gray-300">Apartments verfügbar</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent mb-2">32-93</p>
                <p className="text-gray-300">m² Wohnfläche</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent mb-2">1 Jahr</p>
                <p className="text-gray-300">Mindestmietdauer</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white">
          <div className="container-custom section-padding text-center">
            <h2 className="text-3xl font-bold text-navy mb-4">
              Interesse an einer Wohnung?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Kontaktieren Sie uns für weitere Informationen oder eine Besichtigung. 
              Wir freuen uns auf Ihre Anfrage!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                Jetzt anfragen
                <ArrowRight size={20} />
              </Link>
              <Link
                href="https://viaregia-leipzig.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Offizielle Website
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
