"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Thomas M.",
    role: "Monteur",
    company: "Siemens Energy",
    text: "Perfekt für unsere Baustelle in Halle. Sauber, komfortabel und nah an der A14. Das Team ist sehr hilfsbereit und flexibel bei Buchungsänderungen.",
    rating: 5,
  },
  {
    name: "Sarah K.",
    role: "Projektleiterin",
    company: "BMW Leipzig",
    text: "Wir nutzen Move-in2Stay regelmäßig für internationale Kollegen. Die Apartments sind top ausgestattet und die Selbst-Check-in Funktion ist sehr praktisch.",
    rating: 5,
  },
  {
    name: "Michael B.",
    role: "Freiberufler",
    company: "IT Consultant",
    text: "Das beste Preis-Leistungs-Verhältnis in Leipzig. Schnelles WLAN, voll ausgestattete Küche und zentrale Lage. Ich komme definitiv wieder!",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-navy text-white">
      <div className="container-custom section-padding">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Kundenstimmen
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Das sagen unsere Gäste
          </h2>
          <p className="text-gray-300 text-lg">
            Über 500 zufriedene Gäste vertrauen auf unsere Serviced Apartments.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-accent fill-accent" size={20} />
                ))}
              </div>

              {/* Quote */}
              <div className="relative mb-6">
                <Quote className="absolute -top-2 -left-2 text-accent/30" size={32} />
                <p className="text-gray-200 relative z-10 italic">
                  "{testimonial.text}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-center text-gray-400 mb-6">Vertrauen von führenden Unternehmen</p>
          <div className="flex flex-wrap justify-center gap-8 text-gray-500">
            <span className="text-lg font-semibold">Siemens</span>
            <span className="text-lg font-semibold">BMW</span>
            <span className="text-lg font-semibold">BASF</span>
            <span className="text-lg font-semibold">Leipzig Messe</span>
          </div>
        </div>
      </div>
    </section>
  );
}
