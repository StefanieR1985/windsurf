import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Buchung | Move-in2Stay",
  description: "Buchen Sie Ihr Monteurzimmer oder möbliertes Apartment bei Move-in2Stay. Online-Buchung oder Anfrage direkt bei uns.",
};

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy to-primary py-20">
          <div className="container-custom section-padding text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Jetzt buchen
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Wählen Sie Ihre bevorzugte Buchungsmethode
            </p>
          </div>
        </section>

        {/* Booking Options */}
        <section className="py-16 bg-white">
          <div className="container-custom section-padding">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Lodgify Option */}
              <div className="bg-gray-50 rounded-2xl p-8 border-2 border-transparent hover:border-primary transition-colors">
                <h2 className="text-2xl font-bold text-navy mb-4">
                  Direkt online buchen
                </h2>
                <p className="text-gray-600 mb-6">
                  Buchen Sie direkt über unseren Partner Lodgify. Sofortige Verfügbarkeitsprüfung 
                  und Bestätigung.
                </p>
                <a
                  href="https://stayinn-leipzig.lodgify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent text-navy px-6 py-3 rounded-lg font-bold hover:bg-accent-light transition-colors"
                >
                  Zu Lodgify
                  <ExternalLink size={18} />
                </a>
              </div>

              {/* Contact Option */}
              <div className="bg-primary/5 rounded-2xl p-8 border-2 border-transparent hover:border-primary transition-colors">
                <h2 className="text-2xl font-bold text-navy mb-4">
                  Persönliche Anfrage
                </h2>
                <p className="text-gray-600 mb-6">
                  Für Langzeitbuchungen, Gruppenanfragen oder spezielle Wünsche kontaktieren 
                  Sie uns direkt.
                </p>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                >
                  Kontakt aufnehmen
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
