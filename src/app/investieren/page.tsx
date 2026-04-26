import type { Metadata } from "next";
import { TrendingUp, Shield, Clock, Wallet, CheckCircle, Home, Percent, Upload, MapPin, BedDouble, Euro, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Investment-Wohnungen kaufen | Managed Assets Leipzig Halle",
  description: "Kaufen Sie möblierte Investment-Wohnungen in Leipzig & Halle. Steueroptimiert, auf Bestellung möbliert, mit professionellem Management-Service. Keine Arbitrage-Risiken.",
  keywords: "Investment Wohnung Leipzig, möblierte Wohnung kaufen, Rendite Immobilie, Managed Asset, Monteurzimmer Investment, steueroptimierte Möblierung",
};

const benefits = [
  {
    icon: Shield,
    title: "Rechtssicher ab 2026",
    description: "Keine riskante Arbitrage mehr. Stattdessen: Transparente Management-Fees. BGH-konform nach Mietrecht II.",
  },
  {
    icon: Wallet,
    title: "Steueroptimierte Möblierung",
    description: "Möblierung separat ausgewiesen. AfA über 10 Jahre (oder schneller nach Hamburger Modell). Senkt Ihre Grunderwerbsteuer.",
  },
  {
    icon: TrendingUp,
    title: "Sofort-Rendite",
    description: "Integriert in unser Netzwerk von 29 Apartments. Wir vermitteln Mieter – Sie erhalten ab Tag 1 Cashflow.",
  },
  {
    icon: Clock,
    title: "Löffelfertig auf Bestellung",
    description: "Wählen Sie Ihr Design-Paket: Business Pro, Urban Loft oder Family Comfort. Fertig möbliert am Einzugstag.",
  },
];

const process = [
  {
    step: "1",
    title: "Beratung & Auswahl",
    desc: "Wir zeigen Ihnen passende Objekte in Leipzig, Halle oder Bitterfeld. Mit Rentabilitätskalkulation.",
  },
  {
    step: "2",
    title: "Möblierungs-Paket",
    desc: "Wählen Sie aus 3 Design-Linien. Wir möblieren auf Bestellung – steueroptimiert und nach Ihren Vorgaben.",
  },
  {
    step: "3",
    title: "Management-Vertrag",
    desc: "Wir übernehmen Vermarktung, Check-in, Reinigung, Instandhaltung. Sie erhalten monatliche Reports.",
  },
  {
    step: "4",
    title: "Rendite",
    desc: "Profis aus Industrie & Handwerk buchen langfristig. Sie erhalten stabile Mieteinnahmen ohne Aufwand.",
  },
];

const highlights = [
  "Keine Leerstandsrisiken durch bestehendes Firmennetzwerk",
  "Transparente Management-Fee (15-20% der Miete)",
  "Digitale Gästemappe & kontaktloser Check-in inklusive",
  "5% degressive AfA im ersten Jahr bei Neubau/Sanierung",
  "Möbel-AfA: Schnelle Abschreibung möglich",
  "BGH-konform: Keine Arbitrage, sondern Dienstleistung",
];

// Beispiel-Wohnungen zum Verkauf (kann durch CMS/Upload ersetzt werden)
const propertiesForSale = [
  {
    id: 1,
    title: "Sanierter Altbau in Halle (Saale)",
    location: "Halle (Saale), Marienstraße",
    price: "145.000 €",
    size: "68 m²",
    rooms: "3 Zimmer",
    yield: "5.8%",
    status: "Verfügbar",
    features: ["Kernsaniert 2024", "Balkon", "Parkplatz", "Möblierungs-Ready"],
    image: "/images/property-1.jpg",
  },
  {
    id: 2,
    title: "Neubau-Apartment Leipzig-Zentrum",
    location: "Leipzig, Böhlitz-Ehrenberg",
    price: "185.000 €",
    size: "52 m²",
    rooms: "2 Zimmer",
    yield: "4.9%",
    status: "Reserviert",
    features: ["Erstbezug", "EBK", "Aufzug", "Design-Paket wählbar"],
    image: "/images/property-2.jpg",
  },
  {
    id: 3,
    title: "Rendite-Dreikammer Bitterfeld",
    location: "Bitterfeld-Wolfen, An der Sorge",
    price: "125.000 €",
    size: "75 m²",
    rooms: "3 Zimmer",
    yield: "6.2%",
    status: "Verfügbar",
    features: ["Ressel Mansion", "3 Separate Zimmer", "Monteur-Optimal", "Cashflow ab Tag 1"],
    image: "/images/property-3.jpg",
  },
  {
    id: 4,
    title: "Studenten-Mehrfamilienhaus Merseburg",
    location: "Merseburg, Am Paradies",
    price: "280.000 €",
    size: "145 m²",
    rooms: "5 Zimmer / 2 Wohnungen",
    yield: "6.5%",
    status: "In Verhandlung",
    features: ["2 Apartments", "Nähe Hochschule", "Optimal für Studenten", "Langfristige Mieter"],
    image: "/images/property-4.jpg",
  },
];

export default function InvestmentPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy to-primary py-20">
          <div className="container-custom section-padding text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <TrendingUp size={16} className="text-accent" />
              <span className="text-sm font-medium text-white">Das neue Konzept 2026</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Investieren, um zu <span className="text-accent">bleiben</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Kaufen Sie möblierte Wohnungen in Leipzig & Halle – steueroptimiert, auf Bestellung möbliert, 
              mit professionellem Management. Keine Arbitrage-Risiken, sondern transparente Rendite.
            </p>
            <a
              href="mailto:invest@move-in2stay.com"
              className="inline-flex items-center gap-2 bg-accent text-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-light transition-colors"
            >
              Investoren-Exposé anfordern
            </a>
          </div>
        </section>

        {/* Why Section */}
        <section className="py-20 bg-white">
          <div className="container-custom section-padding">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Warum Managed Assets?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Das Ende der Arbitrage, der Anfang Ihrer Rendite
              </h2>
              <p className="text-gray-600 text-lg">
                2026 ändert sich das Mietrecht. Arbitrage (anmieten & teuer weitervermieten) wird rechtlich unmöglich. 
                Unser Managed-Asset-Modell ist die zukunftssichere Alternative.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="bg-gray-50 rounded-xl p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                    <benefit.icon className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom section-padding">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Ihr Weg zum Managed Asset
              </h2>
              <p className="text-gray-600">
                Vom Kauf bis zur ersten Miete – wir begleiten Sie in 4 Schritten
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {process.map((item) => (
                <div key={item.step} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-navy font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Available Properties */}
        <section className="py-20 bg-white">
          <div className="container-custom section-padding">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Aktuelle Angebote
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Investment-Wohnungen zum Verkauf
              </h2>
              <p className="text-gray-600 text-lg">
                Möblierte Rendite-Immobilien in Leipzig, Halle (Saale), Bitterfeld & Merseburg. 
                Mit Management-Garantie und sofortiger Cashflow-Option.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {propertiesForSale.map((property) => (
                <div key={property.id} className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  {/* Image Placeholder */}
                  <div className="relative h-56 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Home size={64} className="text-primary/30" />
                    <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold ${
                      property.status === "Verfügbar" 
                        ? "bg-green-500 text-white" 
                        : property.status === "Reserviert"
                        ? "bg-orange-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}>
                      {property.status}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-navy mb-2">{property.title}</h3>
                        <p className="text-gray-500 flex items-center gap-2">
                          <MapPin size={16} className="text-accent" />
                          {property.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{property.price}</p>
                        <p className="text-sm text-green-600 font-semibold">Rendite: {property.yield}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200 my-4">
                      <div className="text-center">
                        <BedDouble size={20} className="text-primary mx-auto mb-1" />
                        <p className="text-sm font-semibold text-navy">{property.rooms}</p>
                      </div>
                      <div className="text-center border-x border-gray-200">
                        <Euro size={20} className="text-primary mx-auto mb-1" />
                        <p className="text-sm font-semibold text-navy">{property.size}</p>
                      </div>
                      <div className="text-center">
                        <TrendingUp size={20} className="text-primary mx-auto mb-1" />
                        <p className="text-sm font-semibold text-green-600">{property.yield}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {property.features.map((feature) => (
                        <span key={feature} className="text-xs bg-white text-gray-700 px-3 py-1 rounded-full border border-gray-200">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <a
                      href={`mailto:invest@move-in2stay.com?subject=Interesse an ${property.title}`}
                      className="block w-full text-center bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                    >
                      Exposé anfordern
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload CTA */}
            <div className="mt-16 bg-accent/10 rounded-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                    Haben Sie eine Wohnung zum Verkauf?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Wir kaufen möblierte Investment-Wohnungen in Leipzig, Halle (Saale) und Umgebung. 
                    Nutzen Sie unseren Upload-Service oder kontaktieren Sie uns direkt.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="mailto:invest@move-in2stay.com?subject=Wohnung zum Verkauf"
                      className="inline-flex items-center justify-center gap-2 bg-accent text-navy px-6 py-3 rounded-lg font-bold hover:bg-accent-light transition-colors"
                    >
                      <Upload size={20} />
                      Immobilie anbieten
                    </a>
                    <a
                      href="tel:+491234567890"
                      className="inline-flex items-center justify-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors border-2 border-navy"
                    >
                      <FileText size={20} />
                      Exposé einreichen
                    </a>
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h4 className="font-bold text-navy mb-4">Wir suchen:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        1-4 Zimmer Wohnungen
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Leipzig, Halle, Bitterfeld
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Kernsaniert oder Neubau
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Rendite ab 5% möglich
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-20 bg-navy text-white">
          <div className="container-custom section-padding">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ihre Vorteile auf einen Blick
                </h2>
                <p className="text-gray-300 mb-8 text-lg">
                  Profitieren Sie von unserer Erfahrung mit 29 Apartments und 
                  unserem Netzwerk zu Industrieunternehmen in der Region.
                </p>
                <ul className="space-y-4">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="text-accent flex-shrink-0" size={24} />
                      <span className="text-gray-200">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center mb-6">
                  <Percent size={48} className="text-accent mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Steuerliche Optimierung</h3>
                </div>
                <div className="space-y-4 text-gray-300">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span>Separate Möblierung</span>
                    <span className="text-accent font-semibold">Niedrigere Grunderwerbsteuer</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span>Möbel-AfA</span>
                    <span className="text-accent font-semibold">Abschreibung 8-10 Jahre</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span>Degressive AfA (2026)</span>
                    <span className="text-accent font-semibold">5% im 1. Jahr</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Management-Fee</span>
                    <span className="text-accent font-semibold">15-20% (steuerlich absetzbar)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-accent/10">
          <div className="container-custom section-padding text-center">
            <Home size={64} className="text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Bereit für Ihr Managed Asset?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
              Fordern Sie unser Investoren-Exposé an. Wir zeigen Ihnen aktuelle 
              Objekte in Leipzig, Halle und Bitterfeld mit detaillierter Rentabilitätskalkulation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:invest@move-in2stay.com"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                Exposé anfordern
              </a>
              <a
                href="/unterkuenfte"
                className="inline-flex items-center justify-center gap-2 bg-white text-navy px-8 py-4 rounded-lg font-bold hover:bg-gray-50 transition-colors border-2 border-navy"
              >
                Referenz-Apartments ansehen
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
