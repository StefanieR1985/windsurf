import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, Instagram, Linkedin, Youtube } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt | Move-in2Stay",
  description: "Kontaktieren Sie Move-in2Stay für Anfragen zu unseren möblierten Apartments und Monteurzimmern in Leipzig, Halle, Merseburg, Delitzsch und Bitterfeld.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy to-primary py-20">
          <div className="container-custom section-padding text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Kontakt
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Wir freuen uns auf Ihre Nachricht
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="container-custom section-padding">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-3xl font-bold text-navy mb-6">
                  So erreichen Sie uns
                </h2>
                <p className="text-gray-600 mb-8">
                  Haben Sie Fragen zu unseren Apartments, Verfügbarkeiten oder speziellen Wünschen? 
                  Kontaktieren Sie uns – wir antworten in der Regel innerhalb von 24 Stunden.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy">Telefon</h3>
                      <a href="tel:+491234567890" className="text-gray-600 hover:text-primary">
                        +49 123 456 7890
                      </a>
                      <p className="text-sm text-gray-500">Mo-Fr 8:00 - 18:00 Uhr</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy">E-Mail</h3>
                      <a href="mailto:info@move-in2stay.com" className="text-gray-600 hover:text-primary">
                        info@move-in2stay.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy">Adresse</h3>
                      <p className="text-gray-600">
                        Grimmaische Straße 25<br />
                        04109 Leipzig<br />
                        Deutschland
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Instagram className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy">Instagram</h3>
                      <div className="space-y-1">
                        <a 
                          href="https://www.instagram.com/steffi_move_in2stay/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-primary block"
                        >
                          @steffi_move_in2stay
                        </a>
                        <a 
                          href="https://www.instagram.com/moveinn2stay/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-primary block"
                        >
                          @moveinn2stay
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Linkedin className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy">LinkedIn</h3>
                      <a 
                        href="https://www.linkedin.com/in/stefanie-ressel-7b7439101/?locale=de" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary block"
                      >
                        Stefanie Ressel
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Youtube className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy">YouTube</h3>
                      <a 
                        href="https://www.youtube.com/@MoveINN2stay/videos" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary block"
                      >
                        @MoveINN2stay
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy">Servicezeiten</h3>
                      <p className="text-gray-600">
                        Montag - Freitag: 8:00 - 18:00 Uhr<br />
                        Samstag - Sonntag: 9:00 - 17:00 Uhr<br />
                        Check-in: 24/7 möglich
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-navy mb-6">
                  Nachricht senden
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
