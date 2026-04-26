import type { Metadata } from "next";
import Image from "next/image";
import { Building2, Users, MapPin, Award, Heart, Clock, Phone, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Über uns | Move-in2Stay - Von Arbitrage zu Managed Assets",
  description: "Wir sind Spezialisten für professionelle Monteurzimmer mit Einzelbetten. 29 Apartments in Leipzig, Halle, Merseburg. Jetzt auch: Verkauf möblierter Investment-Wohnungen mit Management-Service.",
};

const values = [
  {
    icon: Heart,
    title: "Respekt vor Privatsphäre",
    description: "Unser Markenversprechen: Garantierte Einzelbetten. Keine Doppelbelegung, keine Couch-Schläfer. Jeder Monteur verdient erholsamen Schlaf nach der Schicht.",
  },
  {
    icon: Award,
    title: "Professionelles Management",
    description: "29 Apartments mit einheitlichem Standard. Kontaktloser Check-in, digitale Gästemappe, 24/7 Erreichbarkeit. Wir betreiben, was wir verkaufen.",
  },
  {
    icon: Clock,
    title: "Flexibilität & Rendite",
    description: "Vermietung ab 1 Nacht. Oder: Kaufen Sie Ihre Investment-Wohnung mit unserem Management-Service. Steueroptimierte Möblierung auf Bestellung.",
  },
];

const whatsappNumbers = [
  { number: "01736872502", label: "WhatsApp 1" },
  { number: "01724529735", label: "WhatsApp 2" },
];

const stats = [
  { value: "29", label: "Monteurzimmer aktiv" },
  { value: "5", label: "Standorte Mitteldeutschland" },
  { value: "100%", label: "Einzelbetten-Garantie" },
  { value: "2018", label: "Erfahrung seit" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy to-primary py-20">
          <div className="container-custom section-padding text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Über Move-in2Stay
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Ihr zuverlässiger Partner für möblierte Apartments in Mitteldeutschland
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-white">
          <div className="container-custom section-padding">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Unsere Geschichte
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                  Von der Arbitrage zum Managed Asset
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>2018 starteten wir mit einer klaren Mission:</strong> Monteure und Projektteams 
                    in Mitteldeutschland verdienen mehr als anonyme Hotels oder beengte Doppelzimmer. 
                    Wir schufen 29 professionelle Monteurzimmer – mit dem Versprechen: <strong>garantierte Einzelbetten</strong>.
                  </p>
                  <p>
                    <strong>Der Wendepunkt 2024/2025:</strong> Der Markt veränderte sich. Neue Gesetze (Mietrecht II), 
                    das Zweckentfremdungsverbot in Leipzig und der Nachfrageeinbruch zwangen uns zur strategischen Neuausrichtung.
                  </p>
                  <p>
                    <strong>Unser neues Geschäftsmodell ab 2026:</strong> Wir verkaufen möblierte Wohnungen 
                    an Investoren – "mit Glocken" und auf Bestellung möbliert. Dazu bieten wir einen 
                    <strong> professionellen Management-Service</strong> an. Keine riskante Arbitrage mehr, 
                    sondern transparente Fees und steueroptimierte Konzepte.
                  </p>
                  <p className="font-semibold text-navy">
                    Unser Motto bleibt: „Willkommen, um zu bleiben" – ob als Gast oder Investor.
                  </p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl p-8">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                  <Building2 size={120} className="text-primary/50" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-navy text-white">
          <div className="container-custom section-padding">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.value}</p>
                  <p className="text-gray-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom section-padding">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Unsere Werte
              </h2>
              <p className="text-gray-600">
                Diese Prinzipien leiten unsere Arbeit jeden Tag
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value) => (
                <div key={value.title} className="bg-white rounded-xl p-8 shadow-lg text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team / Contact CTA */}
        <section className="py-16 bg-white">
          <div className="container-custom section-padding">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Lernen Sie uns kennen
              </h2>
              <p className="text-gray-600 mb-8">
                Haben Sie Fragen oder besondere Wünsche? Unser Team steht Ihnen gerne zur Verfügung.
              </p>
              
              {/* WhatsApp Numbers */}
              <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <MessageCircle className="text-green-500" size={32} />
                  <h3 className="text-2xl font-bold text-navy">WhatsApp direkt</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {whatsappNumbers.map((wa) => (
                    <a
                      key={wa.number}
                      href={`https://wa.me/${wa.number.replace(/^0/, '49')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle size={24} />
                      <span>+49 {wa.number.substring(1)}</span>
                    </a>
                  ))}
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  Schnelle Antwort via WhatsApp – auch für Kurzfristbuchungen
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+491234567890"
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                >
                  <Phone size={20} />
                  Anrufen
                </a>
                <a
                  href="mailto:info@move-in2stay.com"
                  className="inline-flex items-center gap-2 bg-white text-navy px-8 py-4 rounded-lg font-bold hover:bg-gray-50 transition-colors border-2 border-navy"
                >
                  E-Mail schreiben
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
