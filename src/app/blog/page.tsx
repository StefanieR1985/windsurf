import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Home, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog | Neues aus Leipzig & Mitteldeutschland | Move-in2Stay",
  description: "Aktuelle Projekte, neue Wohnungen und Insights aus der Monteurzimmer-Branche. Erfahren Sie mehr über unsere Expansion in Leipzig, Halle und Bitterfeld.",
  keywords: "Monteurzimmer Blog, Leipzig Projekte, Wohnungsbau, Mitteldeutschland, Investment Apartments",
};

const blogPosts = [
  {
    id: 1,
    title: "Der Markt der möblierten Wohnungen in Leipzig 2026",
    excerpt: "Leipzig boomt – aber wie sieht es wirklich aus mit möblierten Wohnungen? Ein Marktbericht zu Preisen, Nachfrage und Chancen für Investoren.",
    category: "Markt",
    location: "Leipzig",
    date: "20. Januar 2026",
    image: "/images/blog/leipzig-markt.jpg",
    slug: "markt-moeblierte-wohnungen-leipzig",
    featured: true,
  },
  {
    id: 2,
    title: "🆕 Via Regia Leipzig: NEU zur Langzeitvermietung",
    excerpt: "Aktuell neu in der Vermietung: 8 exklusive Longstay-Apartments im Via Regia am Waldplatz 2a. 32–93 m², Art-Deco-Design, Mindestmietdauer 1 Jahr – sofort beziehbar!",
    category: "Projekte",
    location: "Leipzig",
    date: "15. Januar 2026",
    image: "/images/blog/via-regia.jpg",
    slug: "via-regia-neu-langzeitvermietung",
    featured: false,
  },
  {
    id: 3,
    title: "Möblierte Vermietung: Vorteile und Nachteile im Überblick",
    excerpt: "Flexibel, lukrativ, aber auch aufwendig? Wir analysieren die Vor- und Nachteile der möblierten Vermietung aus Sicht von Vermietern und Mietern.",
    category: "Tipps",
    location: "Allgemein",
    date: "10. Januar 2026",
    image: "/images/blog/vor-nachteile.jpg",
    slug: "vorteile-nachteile-moeblierte-vermietung",
    featured: false,
  },
  {
    id: 4,
    title: "Steuerhack Immobilien: Restnutzungsdauer, AFA & Sanierungsgebiete",
    excerpt: "Wie Sie mit Restnutzungsdauer-Berechnung, AfA-Abschreibung und Sanierungsgebiet-Förderung Steuern sparen – ganz legal.",
    category: "Investment",
    location: "Mitteldeutschland",
    date: "5. Januar 2026",
    image: "/images/blog/steuerhack.jpg",
    slug: "steuerhack-immobilien-afa-sanierungsgebiete",
    featured: false,
  },
  {
    id: 5,
    title: "Optimale Ausstattung von Monteurswohnungen: Was wirklich zählt",
    excerpt: "Einzelbetten statt Etagenbetten, Smart-TV, schnelles WLAN – wir verraten, was Handwerker von einer Monteurwohnung erwarten und wo Sie sparen können.",
    category: "Tipps",
    location: "Allgemein",
    date: "28. Dezember 2025",
    image: "/images/blog/monteurswohnung-ausstattung.jpg",
    slug: "optimale-ausstattung-monteurswohnungen",
    featured: false,
  },
  {
    id: 6,
    title: "Probleme der Vermietung an Handwerker – Eine kleine Satire",
    excerpt: "Von der 5-Uhr-Anruferin bis zum 'Ich-übernachte-nur-2-Nächte'-Kunden, der 6 Monate bleibt: Ein humorvoller Blick auf die Realität.",
    category: "Satire",
    location: "Mitteldeutschland",
    date: "20. Dezember 2025",
    image: "/images/blog/handwerker-satire.jpg",
    slug: "probleme-vermietung-handwerker-satire",
    featured: false,
  },
];

const categories = ["Alle", "Markt", "Projekte", "Investment", "Tipps", "Satire"];

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-navy via-navy-light to-primary py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-64 h-64 bg-accent rounded-full blur-3xl" />
          </div>
          
          <div className="container-custom section-padding relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Insights & Updates
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Neues aus <span className="text-accent">Leipzig</span>
              </h1>
              <p className="text-xl text-gray-200">
                Aktuelle Projekte, neue Wohnungen und Einblicke aus der Welt der Monteurzimmer 
                und Investment-Apartments in Mitteldeutschland.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-gray-50 border-b">
          <div className="container-custom section-padding">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-6 py-2 bg-white rounded-full text-gray-700 font-medium hover:bg-primary hover:text-white transition-colors shadow-sm"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-16 bg-white">
            <div className="container-custom section-padding">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Image */}
                <div className="relative aspect-[16/10] bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Home size={80} className="text-primary/30" />
                  </div>
                  <div className="absolute top-4 left-4 bg-accent text-navy px-4 py-2 rounded-full text-sm font-bold">
                    Featured
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                      {featuredPost.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {featuredPost.date}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-navy mb-4">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-gray-600 text-lg mb-6">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-2 text-gray-500 mb-6">
                    <MapPin size={18} className="text-accent" />
                    <span>{featuredPost.location}</span>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                  >
                    Weiterlesen
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom section-padding">
            <h2 className="text-3xl font-bold text-navy mb-8">Weitere Artikel</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Home size={48} className="text-gray-300" />
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

                    <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                    >
                      Weiterlesen
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-navy text-white">
          <div className="container-custom section-padding text-center">
            <h2 className="text-3xl font-bold mb-4">
              Möchten Sie über Ihr Projekt berichten?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Haben Sie eine Wohnung, die wir vermarkten sollen? 
              Oder suchen Sie nach Investment-Möglichkeiten? Kontaktieren Sie uns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 bg-accent text-navy px-8 py-4 rounded-lg font-bold hover:bg-accent-light transition-colors"
              >
                Projekt vorstellen
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/investieren"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-colors border border-white/20"
              >
                Investment-Optionen
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
