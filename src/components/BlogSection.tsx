"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, Home } from "lucide-react";

const latestPosts = [
  {
    id: 1,
    title: "Der Markt der möblierten Wohnungen in Leipzig 2026",
    excerpt: "Leipzig boomt – aber wie sieht es wirklich aus mit möblierten Wohnungen? Ein Marktbericht zu Preisen, Nachfrage und Chancen.",
    category: "Markt",
    location: "Leipzig",
    date: "20. Januar 2026",
    slug: "markt-moeblierte-wohnungen-leipzig",
  },
  {
    id: 2,
    title: "🆕 Via Regia Leipzig: NEU zur Langzeitvermietung",
    excerpt: "Aktuell neu in der Vermietung: 8 exklusive Longstay-Apartments im Via Regia am Waldplatz 2a. 32–93 m² – sofort beziehbar!",
    category: "Projekte",
    location: "Leipzig",
    date: "15. Januar 2026",
    slug: "via-regia-neu-langzeitvermietung",
  },
  {
    id: 3,
    title: "Möblierte Vermietung: Vorteile und Nachteile",
    excerpt: "Flexibel, lukrativ, aber auch aufwendig? Wir analysieren die Vor- und Nachteile der möblierten Vermietung.",
    category: "Tipps",
    location: "Allgemein",
    date: "10. Januar 2026",
    slug: "vorteile-nachteile-moeblierte-vermietung",
  },
];

export default function BlogSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Blog & News
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Neues aus <span className="text-accent">Leipzig</span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-xl">
              Aktuelle Projekte, neue Wohnungen und Insights aus der Welt der Monteurzimmer 
              und Investment-Apartments.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
          >
            Alle Artikel ansehen
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group"
            >
              {/* Image Placeholder */}
              <div className="relative aspect-[16/10] bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Home size={48} className="text-primary/30" />
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-navy px-3 py-1 rounded-full text-xs font-bold">
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-accent" />
                    {post.location}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-navy mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                >
                  Weiterlesen
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-16 bg-gradient-to-r from-navy to-primary rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-accent mb-2">29</p>
              <p className="text-gray-300">Apartments verfügbar</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-accent mb-2">5</p>
              <p className="text-gray-300">Standorte in Mitteldeutschland</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-accent mb-2">4+</p>
              <p className="text-gray-300">Neue Projekte 2026</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
