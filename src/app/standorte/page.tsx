import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Alle Standorte | Move-in2Stay",
  description: "Unsere 5 Standorte in Mitteldeutschland: Leipzig, Halle (Saale), Merseburg, Delitzsch und Bitterfeld-Wolfen. Finden Sie Ihr perfektes Monteurzimmer.",
};

const allLocations = [
  {
    city: "Leipzig",
    href: "/standorte/leipzig",
    apartments: 8,
    description: "Kulturmetropole mit historischem Charme und moderner Dynamik.",
    tags: ["Nähe Messe", "Zentrum 10 Min", "Hauptbahnhof"],
  },
  {
    city: "Halle (Saale)",
    href: "/standorte/halle",
    apartments: 12,
    description: "Universitätsstadt mit Handelstradition und Chemiepark.",
    tags: ["Campus-Nähe", "Chemiepark", "Saale-Ufer"],
  },
  {
    city: "Merseburg",
    href: "/standorte/merseburg",
    apartments: 4,
    description: "Kompakte Stadt mit Chemiepark und historischem Dom.",
    tags: ["Chemiepark", "Dom", "Uni"],
  },
  {
    city: "Delitzsch",
    href: "/standorte/delitzsch",
    apartments: 4,
    description: "Barocke Stadtperle zwischen Leipzig und Halle.",
    tags: ["Barock", "A14", "Schloss"],
  },
  {
    city: "Bitterfeld-Wolfen",
    href: "/standorte/bitterfeld",
    apartments: 5,
    description: "Aufstrebender Wirtschaftsstandort an A9/A14.",
    tags: ["A9/A14", "Goitzsche", "Industrie"],
  },
];

export default function LocationsOverviewPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy to-primary py-20">
          <div className="container-custom section-padding text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Unsere Standorte
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              5 Standorte • 30+ Apartments • Mitteldeutschland
            </p>
          </div>
        </section>

        {/* Locations Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom section-padding">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allLocations.map((location) => (
                <Link
                  key={location.city}
                  href={location.href}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Building2 className="text-primary" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-navy">{location.city}</h2>
                      <p className="text-sm text-gray-500">{location.apartments} Apartments</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{location.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {location.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-primary font-semibold">
                    <span>Mehr erfahren</span>
                    <ArrowRight className="ml-2" size={18} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section Placeholder */}
        <section className="py-16 bg-white">
          <div className="container-custom section-padding text-center">
            <h2 className="text-3xl font-bold text-navy mb-4">Region Mitteldeutschland</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Alle unsere Standorte sind optimal vernetzt durch die A9, A14 und A38. 
              Ob Leipzig, Halle, Merseburg, Delitzsch oder Bitterfeld – wir sind da, wo Sie arbeiten.
            </p>
            <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center max-w-4xl mx-auto">
              <div className="text-center text-gray-400">
                <MapPin size={48} className="mx-auto mb-4" />
                <p>Karte wird geladen...</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
