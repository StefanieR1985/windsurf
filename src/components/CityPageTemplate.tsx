"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Check, Phone, Mail, Users, Euro, Clock, BedDouble, Car, Wifi } from "lucide-react";

interface CityData {
  city: string;
  population?: string;
  description: string;
  apartments: number;
  priceFrom: number;
  highlights: {
    title: string;
    description: string;
  }[];
  equipment: string[];
  locations: {
    name: string;
    area: string;
    distance: string;
  }[];
  nearbyCities?: {
    name: string;
    distance: string;
    url: string;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export default function CityPageTemplate({ data }: { data: CityData }) {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy-light to-primary py-20 lg:py-28">
        <div className="container-custom section-padding">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/standorte" className="hover:text-white">Standorte</Link>
              <span>/</span>
              <span className="text-white">{data.city}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Monteurzimmer & Studentenunterkünfte {data.city}
              <span className="block text-2xl md:text-3xl font-normal text-accent mt-2">
                Mindestmietdauer 4 Nächte – langfristig willkommen
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
              {data.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/buchung"
                className="inline-flex items-center justify-center gap-2 bg-accent text-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-light transition-colors"
              >
                Jetzt buchen
                <ArrowRight size={20} />
              </Link>
              <a
                href="tel:+491234567890"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                <Phone size={20} />
                Anrufen
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20 max-w-lg">
              <div className="text-center">
                <BedDouble className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{data.apartments}</p>
                <p className="text-gray-300 text-sm">Apartments</p>
              </div>
              <div className="text-center">
                <Euro className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{data.priceFrom}€</p>
                <p className="text-gray-300 text-sm">pro Nacht</p>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-gray-300 text-sm">Check-in</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-white">
        <div className="container-custom section-padding">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-12 text-center">
            Warum Move-in2Stay in {data.city}?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {data.highlights.map((highlight, index) => (
              <div key={index} className="flex gap-4 p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Check className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy mb-2">{highlight.title}</h3>
                  <p className="text-gray-600">{highlight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Ausstattung
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                So wohnen Sie bei uns in {data.city}
              </h2>
              <p className="text-gray-600 mb-8">
                Mindestmietdauer 4 Nächte – ideal für Monteure, Studenten und langfristige Projektaufenthalte. 
                Alle Apartments komplett möbliert mit garantierten Einzelbetten.
              </p>

              <ul className="grid sm:grid-cols-2 gap-4">
                {data.equipment.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="text-accent flex-shrink-0" size={20} />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 p-6 rounded-xl text-center">
                <BedDouble className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="font-semibold text-navy">Einzelbetten</p>
                <p className="text-sm text-gray-500">Garantiert, keine Doppelbelegung</p>
              </div>
              <div className="bg-accent/10 p-6 rounded-xl text-center">
                <Clock className="w-10 h-10 text-accent-dark mx-auto mb-3" />
                <p className="font-semibold text-navy">4 Nächte Mindestmiete</p>
                <p className="text-sm text-gray-500">Langfristige Miete willkommen</p>
              </div>
              <div className="bg-accent/10 p-6 rounded-xl text-center">
                <Car className="w-10 h-10 text-accent-dark mx-auto mb-3" />
                <p className="font-semibold text-navy">Parkplätze</p>
                <p className="text-sm text-gray-500">Kostenlos am Haus</p>
              </div>
              <div className="bg-primary/5 p-6 rounded-xl text-center">
                <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="font-semibold text-navy">Für Monteure & Studenten</p>
                <p className="text-sm text-gray-500">2-6 Personen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-16 bg-white">
        <div className="container-custom section-padding">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-12 text-center">
            Unsere Standorte in {data.city}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {data.locations.map((location, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border-l-4 border-primary">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="text-accent" size={20} />
                  <h3 className="text-xl font-bold text-navy">{location.name}</h3>
                </div>
                <p className="text-gray-600 mb-2">{location.area}</p>
                <p className="text-sm text-primary font-medium">{location.distance}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Cities */}
      {data.nearbyCities && data.nearbyCities.length > 0 && (
        <section className="py-16 bg-navy text-white">
          <div className="container-custom section-padding">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Entdecken Sie Unterkünfte in der Nähe
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.nearbyCities.map((city, index) => (
                <Link
                  key={index}
                  href={city.url}
                  className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{city.name}</h3>
                    <ArrowRight className="text-accent group-hover:translate-x-1 transition-transform" size={24} />
                  </div>
                  <p className="text-gray-300">{city.distance} entfernt</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {data.faqs && data.faqs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom section-padding">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-12 text-center">
              Häufig gestellte Fragen
            </h2>

            <div className="max-w-3xl mx-auto space-y-4">
              {data.faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-navy mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-light">
        <div className="container-custom section-padding text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Bereit für Ihr StayINN in {data.city}?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Kontaktieren Sie uns noch heute für ein unverbindliches Angebot oder 
            buchen Sie direkt online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/buchung"
              className="inline-flex items-center justify-center gap-2 bg-accent text-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-light transition-colors"
            >
              Jetzt buchen
              <ArrowRight size={20} />
            </Link>
            <a
              href="mailto:info@move-in2stay.com"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              <Mail size={20} />
              Anfrage senden
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
