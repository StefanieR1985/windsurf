"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from "lucide-react";

const footerLinks = {
  unterkuenfte: [
    { href: "/standorte/leipzig", label: "Monteurzimmer Leipzig" },
    { href: "/standorte/halle", label: "Monteurzimmer Halle" },
    { href: "/standorte/merseburg", label: "Monteurzimmer Merseburg" },
    { href: "/standorte/delitzsch", label: "Monteurzimmer Delitzsch" },
    { href: "/standorte/bitterfeld", label: "Monteurzimmer Bitterfeld" },
  ],
  unternehmen: [
    { href: "/ueber-uns", label: "Über uns" },
    { href: "/investieren", label: "Investment-Wohnungen" },
    { href: "/unterkuenfte", label: "Alle Monteurzimmer" },
    { href: "/kontakt", label: "Kontakt" },
  ],
  rechtliches: [
    { href: "/impressum", label: "Impressum" },
    { href: "/datenschutz", label: "Datenschutz" },
    { href: "/agb", label: "AGB" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-custom section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Kontakt */}
          <div className="lg:col-span-1">
            <Image
              src="/logo/logo.png"
              alt="Move-in2Stay Logo"
              width={200}
              height={60}
              className="h-14 w-auto mb-6 brightness-0 invert"
            />
            <div className="space-y-3 text-gray-300">
              <p className="text-gray-400 text-sm mt-4 max-w-xs">
                29 Monteurzimmer mit Einzelbetten in Leipzig, Halle, Merseburg. 
                Managed Assets & Investment-Wohnungen mit steueroptimierter Möblierung.
              </p>
              <p className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 text-accent" />
                <span>Grimmaische Straße 25<br />04109 Leipzig</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={18} className="text-accent" />
                <a href="tel:+491234567890" className="hover:text-white">+49 123 456 7890</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={18} className="text-accent" />
                <a href="mailto:info@move-in2stay.com" className="hover:text-white">info@move-in2stay.com</a>
              </p>
              <p className="flex items-start gap-2">
                <Clock size={18} className="mt-1 text-accent" />
                <span>Mo-Fr: 8:00 - 18:00 Uhr<br />Sa-So: 9:00 - 17:00 Uhr</span>
              </p>
            </div>
          </div>

          {/* Standorte */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-accent">Unsere Standorte</h4>
            <ul className="space-y-3">
              {footerLinks.unterkuenfte.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Unternehmen */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-accent">Unternehmen</h4>
            <ul className="space-y-3">
              {footerLinks.unternehmen.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-accent">Rechtliches</h4>
            <ul className="space-y-3 mb-8">
              {footerLinks.rechtliches.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-lg font-semibold mb-4 text-accent">Folge uns</h4>
            <div className="space-y-3">
              <a 
                href="https://www.facebook.com/Moveinn2stay/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-accent transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook /Moveinn2stay</span>
              </a>
              <a 
                href="https://www.instagram.com/steffi_move_in2stay/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-accent transition-colors"
              >
                <Instagram size={20} />
                <span>@steffi_move_in2stay</span>
              </a>
              <a 
                href="https://www.instagram.com/moveinn2stay/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-accent transition-colors"
              >
                <Instagram size={20} />
                <span>@moveinn2stay</span>
              </a>
              <a 
                href="https://www.youtube.com/@MoveINN2stay/videos" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-accent transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube @MoveINN2stay</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/stefanie-ressel-7b7439101/?locale=de" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-accent transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn Stefanie Ressel</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Move-in2Stay. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
