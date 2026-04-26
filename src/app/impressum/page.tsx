import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Impressum | Move-in2Stay Management UG",
  description: "Impressum der Move-in2Stay Management UG - Ihr Anbieter für möblierte Apartments und Monteurzimmer in Mitteldeutschland.",
};

export default function ImpressumPage() {
  return (
    <>
      <Navbar />
      <main className="py-16 bg-white">
        <div className="container-custom section-padding max-w-3xl">
          <h1 className="text-4xl font-bold text-navy mb-8">Impressum</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy mb-4">Angaben gemäß § 5 TMG</h2>
            <p className="text-gray-700 mb-4">
              <strong>Move-Inn2Stay Management UG</strong> (haftungsbeschränkt)<br />
              Dübener Straße 25d<br />
              04509 Krostitz<br />
              Deutschland
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Vertreten durch:</strong><br />
              Stefanie Ressel (Geschäftsführerin)
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Registergericht:</strong><br />
              Amtsgericht Leipzig<br />
              <strong>HRB 43889</strong> (eingetragen seit 22.08.2024)
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Stammkapital:</strong><br />
              2.500,00 EUR
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy mb-4">Kontakt</h2>
            <p className="text-gray-700 mb-4">
              <strong>Telefon:</strong><br />
              +49 173 687 2502<br />
              +49 172 452 9735<br />
            </p>
            <p className="text-gray-700 mb-4">
              <strong>E-Mail (Buchungen & Anfragen):</strong><br />
              info@move-in2stay.com
            </p>
            <p className="text-gray-700 mb-4">
              <strong>E-Mail (Investment):</strong><br />
              invest@move-in2stay.com
            </p>
            <p className="text-gray-700">
              <strong>Web:</strong><br />
              www.move-in2stay.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy mb-4">USt-IdNr. / Steuernummer</h2>
            <p className="text-gray-700">
              <strong>USt-IdNr.:</strong> [aus Google Drive Ordner "UG" – bitte ergänzen]<br />
              <strong>Steuernummer:</strong> [aus Google Drive Ordner "UG" – bitte ergänzen]
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Steuerliche Angaben können im Google Drive Ordner "UG" eingesehen werden.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy mb-4">Verbraucherstreitbeilegung</h2>
            <p className="text-gray-700">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:<br />
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
            <p className="text-gray-700 mt-4">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
