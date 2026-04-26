"use client";

import { Wifi, Car, Tv, Utensils, WashingMachine, Check, BedDouble, Coffee } from "lucide-react";

const features = [
  {
    icon: BedDouble,
    title: "Einzelbetten",
    description: "Garantierte Einzelbetten – kein Doppelzimmer, keine Couch",
  },
  {
    icon: Check,
    title: "4 Nächte Mindestmiete",
    description: "Kurzaufenthalte ab 4 Nächten, langfristige Miete willkommen",
  },
  {
    icon: Wifi,
    title: "Kostenloses WLAN",
    description: "Schnelles Internet in allen Apartments",
  },
  {
    icon: Tv,
    title: "Smart-TV",
    description: "Moderne Fernseher mit Streaming",
  },
  {
    icon: WashingMachine,
    title: "Waschmaschine",
    description: "Private Waschmaschine zur freien Nutzung",
  },
  {
    icon: Utensils,
    title: "Voll ausgestattete Küche",
    description: "Kühlschrank, Herd, Mikrowelle, Kaffeemaschine",
  },
  {
    icon: Car,
    title: "Kostenlose Parkplätze",
    description: "Direkt am Haus verfügbar",
  },
  {
    icon: Coffee,
    title: "Kaffeemaschine",
    description: "Für den perfekten Start in den Tag",
  },
  {
    icon: Check,
    title: "Balkon (teilweise)",
    description: "Entspannen im Freien",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom section-padding">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Ausstattung
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4">
            Alles, was Sie brauchen
          </h2>
          <p className="text-gray-600 text-lg">
            Mindestmietdauer 4 Nächte – ideal für Monteure, Studenten und langfristige Projektaufenthalte. 
            Alle Apartments komplett ausgestattet.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
