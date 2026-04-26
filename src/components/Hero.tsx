"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Building2, Users, MapPin, Calendar, ExternalLink } from "lucide-react";

const features = [
  "Garantierte EINZELBETTEN (keine Doppelbelegung)",
  "Voll ausgestattete Küchen zur Selbstversorgung",
  "Kontaktloser Check-in & Highspeed WLAN",
  "Mindestmietdauer 4 Nächte – gerne langfristig",
];

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-navy via-navy-light to-primary min-h-[90vh] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom section-padding relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Building2 size={16} className="text-accent" />
              <span className="text-sm font-medium">29 Monteurzimmer • 4 Nächte Mindestmiete • Studenten willkommen</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ihr <span className="text-accent">Zuhause</span> auf Zeit in Mitteldeutschland
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
              Professionelle Monteurzimmer mit Einzelbetten für Industrie, Handwerk, Studenten & Projektteams. 
              Mindestmietdauer 4 Nächte, langfristig willkommen. 29 Apartments in Leipzig, Halle (Saale), Bitterfeld.
              Auch: Investment-Wohnungen mit lückenlosem Management-Service.
            </p>

            <ul className="space-y-3 mb-10">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="text-accent flex-shrink-0" size={20} />
                  <span className="text-gray-200">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/unterkuenfte"
                className="inline-flex items-center justify-center gap-2 bg-accent text-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-light transition-colors"
              >
                Unterkünfte ansehen
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/standorte"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                <MapPin size={20} />
                Standorte erkunden
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
              <div>
                <p className="text-3xl font-bold text-accent">30+</p>
                <p className="text-gray-300 text-sm">Apartments</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">5</p>
                <p className="text-gray-300 text-sm">Standorte</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">500+</p>
                <p className="text-gray-300 text-sm">Zufriedene Gäste</p>
              </div>
            </div>
          </div>

          {/* Image/Visual - Apartment Preview */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-2xl p-6 shadow-2xl">
                {/* Apartment Photo */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden mb-6 group">
                  {/* Placeholder for real apartment photo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Building2 size={64} className="text-primary/40 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm">Möbliertes Apartment</p>
                    </div>
                  </div>
                  
                  {/* "Bookable" Badge */}
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                    <Calendar size={16} />
                    Online buchbar
                  </div>
                  
                  {/* Price hint */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-navy px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-xs text-gray-500">ab</p>
                    <p className="text-xl font-bold text-primary">35 € <span className="text-sm font-normal text-gray-600">/Nacht</span></p>
                  </div>
                </div>

                {/* Quick booking CTA */}
                <a
                  href="https://stayinn-leipzig.lodgify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-primary text-white text-center py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors mb-4 flex items-center justify-center gap-2"
                >
                  <Calendar size={18} />
                  Verfügbarkeit prüfen & buchen
                  <ExternalLink size={16} />
                </a>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy">Zentrale Lage</p>
                      <p className="text-sm text-gray-500">Nähe Autobahnen & Stadtzentrum</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <Users size={18} className="text-accent-dark" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy">2-6 Personen</p>
                      <p className="text-sm text-gray-500">Flexible Gruppengrößen</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
