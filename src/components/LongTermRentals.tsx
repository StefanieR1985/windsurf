"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Home, Clock, CheckCircle2, BedDouble } from "lucide-react";

const longTermProperties = [
  {
    id: 1,
    name: "Via Regia Leipzig",
    address: "Waldplatz 2a, Waldstraßenviertel",
    description: "8 exklusive Longstay-Apartments im Via Regia – einem markanten Eckgebäude am Leipziger Waldplatz. Goldene Wandpaneele, verglaste Vorsprünge mit Sitzgelegenheiten, Naturstein-Treppenhaus und Hotelteppiche in Art-Deco-Optik. Wohnungsgrößen: 32–93 m².",
    apartments: 8,
    minStay: "min. 1 Jahr",
    features: [
      "Voll möbliert mit Einzelbetten",
      "Smart-TV & schnelles WLAN",
      "Naturstein-Treppenhaus",
      "Digitales Check-in",
      "Art-Deco-Design",
      "32–93 m² Wohnfläche",
    ],
    href: "/via-regia",
    badge: "🆕 NEU IN DER VERMIETUNG",
  },
];

export default function LongTermRentals() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom section-padding">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 animate-pulse">
            🆕 NEU IN DER VERMIETUNG – Langfristig buchbar!
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4">
            Via Regia <span className="text-accent">Leipzig</span>
          </h2>
          <p className="text-gray-600 text-lg">
            <strong>Aktuell neu zur Langzeitvermietung!</strong> 8 exklusive Apartments im Leipziger Waldstraßenviertel.
            <span className="text-primary font-bold">Mindestmietdauer: 1 Jahr</span> – sofort beziehbar für Monteure und Geschäftsreisende.
          </p>
        </div>

        {/* Property Cards */}
        <div className="max-w-4xl mx-auto">
          {longTermProperties.map((property) => (
            <div
              key={property.id}
              className="bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden shadow-xl border border-gray-100"
            >
              <div className="grid md:grid-cols-2">
                {/* Image Section */}
                <div className="relative aspect-[4/3] md:aspect-auto bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                      <Home size={48} className="text-primary" />
                    </div>
                    <p className="text-navy font-semibold">Via Regia Leipzig</p>
                    <p className="text-gray-600 text-sm">Waldplatz 2a · Waldstraßenviertel</p>
                  </div>
                  {property.badge && (
                    <div className="absolute top-4 left-4 bg-accent text-navy px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {property.badge}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-2 text-primary mb-3">
                    <MapPin size={20} />
                    <span className="font-medium">{property.address}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-navy mb-4">{property.name}</h3>
                  <p className="text-gray-600 mb-6">{property.description}</p>

                  {/* Key Stats */}
                  <div className="flex gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BedDouble size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-navy">{property.apartments}</p>
                        <p className="text-xs text-gray-500">Apartments</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                        <Clock size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-navy">{property.minStay}</p>
                        <p className="text-xs text-gray-500">Mindestmiete</p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-8">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/via-regia"
                      className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                    >
                      Alle Exposés ansehen
                      <ArrowRight size={18} />
                    </Link>
                    <Link
                      href="/kontakt"
                      className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Anfrage senden
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-12 bg-navy rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-accent mb-2">8</p>
              <p className="text-gray-300">Apartments verfügbar</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-accent mb-2">ab 490€</p>
              <p className="text-gray-300">pro Monat inkl. Nebenkosten</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-accent mb-2">24/7</p>
              <p className="text-gray-300">Digitaler Check-in</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
