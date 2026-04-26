import type { Metadata } from "next";
import Link from "next/link";
import { Users, Wifi, Car, BedDouble, ArrowRight, ExternalLink, Home, Search, Paintbrush, Key, CheckCircle, Building2, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LodgifyPropertiesLoader from "@/components/LodgifyPropertiesLoader";

export const metadata: Metadata = {
  title: "Monteurzimmer & Studentenunterkünfte | 4 Nächte Mindestmiete",
  description: "29 möblierte Monteurzimmer und Studentenunterkünfte in Leipzig, Halle (Saale), Bitterfeld. Mindestmietdauer 4 Nächte, langfristige Miete willkommen. Einzelbetten-Garantie.",
};


const equipment = [
  { icon: BedDouble, label: "Einzelbetten garantiert" },
  { icon: Wifi, label: "Kostenloses WLAN" },
  { icon: Car, label: "Parkplätze" },
  { icon: Users, label: "Mindestmiete 4 Nächte" },
];

const propertyServiceSteps = [
  {
    icon: Search,
    title: "Wohnungssuche",
    description: "Wir finden die passende Wohnung in Ihrer Wunschregion – ob Kauf oder Miete."
  },
  {
    icon: Paintbrush,
    title: "Komplettmöblierung",
    description: "Professionelle Möblierung nach Monteurzimmer-Standard mit Einzelbetten."
  },
  {
    icon: Key,
    title: "Bereit für Gäste",
    description: "Übergabe mit digitalem Check-in, Gästemappe und vollständiger Ausstattung."
  }
];

export default function UnterkuenftePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero with Visual */}
        <section className="relative bg-gradient-to-br from-navy via-navy-light to-primary py-20 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-64 h-64 bg-accent rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
          </div>
          
          <div className="container-custom section-padding relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="text-white">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <Building2 size={18} className="text-accent" />
                  <span className="text-sm font-medium">29 möblierte Apartments</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Ihr <span className="text-accent">Zuhause</span> auf Zeit
                </h1>
                <p className="text-xl text-gray-200 mb-6 max-w-xl">
                  Professionelle Monteurzimmer und Studentenunterkünfte in Leipzig, Halle (Saale) & Bitterfeld. 
                  Mit Einzelbetten-Garantie und 4 Nächte Mindestmiete.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {["Leipzig", "Halle", "Merseburg", "Delitzsch", "Bitterfeld"].map((city) => (
                    <span key={city} className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-sm">
                      <MapPin size={14} className="text-accent" />
                      {city}
                    </span>
                  ))}
                </div>

                <a
                  href="https://stayinn-leipzig.lodgify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent text-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-light transition-colors"
                >
                  <BedDouble size={24} />
                  Verfügbarkeit prüfen
                  <ExternalLink size={20} />
                </a>
              </div>

              {/* Visual Element */}
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-accent/20 rounded-3xl blur-2xl" />
                  <div className="relative bg-white rounded-2xl p-4 shadow-2xl">
                    {/* Main apartment image placeholder */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Home size={80} className="text-primary/30 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg font-medium">Möbliertes Apartment</p>
                          <p className="text-gray-400 text-sm mt-2">Einzelbetten • Küche • WLAN</p>
                        </div>
                      </div>
                      {/* Badge */}
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Sofort beziehbar
                      </div>
                    </div>
                    
                    {/* Thumbnail row */}
                    <div className="grid grid-cols-3 gap-2">
                      {["Schlafzimmer", "Küche", "Bad"].map((room, i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500 text-center">{room}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Property Finding Service - NEW */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container-custom section-padding">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Visual */}
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute -inset-4 bg-accent/10 rounded-3xl blur-2xl" />
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Home size={32} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-navy">Ressel Mansion</h3>
                        <p className="text-gray-500">Beispiel: An der Sorge 12, Bitterfeld</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {propertyServiceSteps.map((step, index) => (
                        <div key={step.title} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <step.icon size={20} className="text-accent-dark" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </span>
                              <h4 className="font-bold text-navy">{step.title}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2">
                <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Für Eigentümer & Investoren
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                  Sie haben eine Wohnung – wir machen sie <span className="text-accent">buchbar</span>
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  Sie besitzen oder mieten eine Wohnung in Leipzig, Halle oder Bitterfeld? 
                  Wir übernehmen die komplette Möblierung und den professionellen Betrieb als 
                  Monteurzimmer – Sie erhalten passive Rendite.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Wohnungssuche (bei Bedarf) – Kauf oder Langzeitmiete",
                    "Komplettmöblierung nach Monteurstandard (Einzelbetten!)",
                    "Digitales Gästemanagement & 24/7 Check-in",
                    "Professionelle Fotos & Lodgify-Einrichtung",
                    "Steady Cashflow – wir vermieten, Sie verdienen"
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/investieren"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                  >
                    Mehr erfahren
                    <ArrowRight size={20} />
                  </Link>
                  <a
                    href="mailto:invest@move-in2stay.com"
                    className="inline-flex items-center justify-center gap-2 bg-white text-navy px-8 py-4 rounded-lg font-bold hover:bg-gray-50 transition-colors border-2 border-navy"
                  >
                    Wohnung anbieten
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Equipment */}
        <section className="py-12 bg-gray-50 border-b">
          <div className="container-custom section-padding">
            <div className="flex flex-wrap justify-center gap-8">
              {equipment.map((item) => (
                <div key={item.label} className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm">
                  <item.icon className="text-primary" size={24} />
                  <span className="font-medium text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Lodgify Properties */}
        <section className="py-16 bg-white">
          <div className="container-custom section-padding">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-navy">Verfügbare Unterkünfte</h2>
              <span className="text-sm text-gray-500">Live aus Lodgify</span>
            </div>
            <LodgifyPropertiesLoader />
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-accent/10">
          <div className="container-custom section-padding text-center">
            <h2 className="text-3xl font-bold text-navy mb-4">
              Gefunden, was Sie suchen?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Mindestmietdauer 4 Nächte – ideal für Monteure, Studenten und langfristige Aufenthalte. 
              Langfristige Miete besonders für Studenten in Halle (Saale), Leipzig & Bitterfeld willkommen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://stayinn-leipzig.lodgify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-accent text-navy px-8 py-4 rounded-lg font-bold hover:bg-accent-light transition-colors"
              >
                Online buchen
                <ExternalLink size={20} />
              </a>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                Anfragen
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
