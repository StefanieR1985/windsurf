"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Phone, MapPin } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/unterkuenfte", label: "Monteurzimmer" },
  { href: "/standorte", label: "Standorte" },
  { href: "/blog", label: "Blog" },
  { href: "/investieren", label: "Investieren" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container-custom section-padding">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 py-2">
            <Image
              src="/logo/logo.png"
              alt="Move-in2Stay Logo"
              width={240}
              height={70}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-navy hover:text-primary transition-colors font-medium tracking-wide text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+491234567890"
              className="flex items-center gap-2 text-navy hover:text-primary transition-colors"
            >
              <Phone size={18} />
              <span className="font-medium">Anrufen</span>
            </a>
            <Link
              href="/buchung"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Jetzt buchen
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-navy"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menü öffnen"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-navy hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/buchung"
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold text-center mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Jetzt buchen
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
