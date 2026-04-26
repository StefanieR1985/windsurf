"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Home } from "lucide-react";

const locations = [
  {
    city: "Leipzig",
    image: "/images/leipzig.jpg",
    description: "Monteurzimmer für Messe, Flughafen & Industrie. Direkte Anbindung BMW, Porsche, DHL.",
    apartments: 8,
    href: "/standorte/leipzig",
    highlights: ["Messe-Nähe", "Studenten", "Einzelbetten", "4+ Nächte"],
  },
  {
    city: "Halle (Saale)",
    image: "/images/halle.jpg",
    description: "Professionelle Unterkünfte für Projektteams. Nähe Uniklinikum, Industriegebiete.",
    apartments: 12,
    href: "/standorte/halle",
    highlights: ["Uniklinikum", "Studenten", "Einzelbetten", "Langzeit"],
  },
  {
    city: "Merseburg",
    image: "/images/merseburg.jpg",
    description: "Spezialisiert auf Chemiepark-Monteure. Kurze Wege, erholsamer Schlaf.",
    apartments: 4,
    href: "/standorte/merseburg",
    highlights: ["Chemiepark", "Studenten", "Einzelbetten", "Langzeit"],
  },
  {
    city: "Delitzsch",
    image: "/images/delitzsch.jpg",
    description: "Zentral zwischen Leipzig-Halle. Idealer Stützpunkt für regionale Projekte.",
    apartments: 3,
    href: "/standorte/delitzsch",
    highlights: ["A14-Nähe", "Studenten", "Einzelbetten", "4+ Nächte"],
  },
  {
    city: "Bitterfeld-Wolfen",
    image: "/images/bitterfeld.jpg",
    description: "Am Chemiepark und Flughafen LEJ. All-inclusive Monteurunterkünfte ab 490€/Monat.",
    apartments: 5,
    href: "/standorte/bitterfeld",
    highlights: ["Chemiepark", "Studenten", "Einzelbetten", "4+ Nächte"],
  },
];

export default function Locations() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom section-padding">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            5 Standorte in Mitteldeutschland
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4">
            Finden Sie Ihr perfektes StayINN
          </h2>
          <p className="text-gray-600 text-lg">
            Mindestmietdauer 4 Nächte – perfekt für Monteure, Studenten und langfristige 
            Aufenthalte. Strategisch an Industriestandorten: Chemiepark Bitterfeld, 
            BMW/Porsche Leipzig, Uniklinikum Halle.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location) => (
            <Link
              key={location.city}
              href={location.href}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <div className="absolute inset-0 bg-navy/10 group-hover:bg-navy/0 transition-colors" />
                <MapPin size={48} className="text-navy/30" />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                  <Home size={16} className="text-primary" />
                  <span className="text-sm font-semibold text-navy">{location.apartments} Apartments</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-navy mb-2 flex items-center gap-2">
                  <MapPin size={20} className="text-accent" />
                  {location.city}
                </h3>
                <p className="text-gray-600 mb-4">{location.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {location.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                  <span>Mehr erfahren</span>
                  <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-accent to-accent-light rounded-2xl p-8 flex flex-col justify-center items-center text-center text-navy">
            <h3 className="text-2xl font-bold mb-4">Nicht das Richtige dabei?</h3>
            <p className="mb-6">
              Wir helfen Ihnen gerne bei der Suche nach der passenden Unterkunft.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors"
            >
              Kontakt aufnehmen
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
