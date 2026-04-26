import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Datenschutz | Move-in2Stay",
  description: "Datenschutzerklärung von Move-in2Stay. Informationen zum Umgang mit Ihren personenbezogenen Daten.",
};

export default function DatenschutzPage() {
  return (
    <>
      <Navbar />
      <main className="py-16 bg-white">
        <div className="container-custom section-padding max-w-3xl">
          <h1 className="text-4xl font-bold text-navy mb-8">Datenschutzerklärung</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy mb-4">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-xl font-medium text-navy mb-2">Allgemeine Hinweise</h3>
            <p className="text-gray-700 mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, 
              wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert 
              werden können.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy mb-4">2. Verantwortlicher</h2>
            <p className="text-gray-700 mb-4">
              <strong>Move-in2Stay</strong><br />
              Grimmaische Straße 25<br />
              04109 Leipzig<br />
              Deutschland<br /><br />
              Telefon: +49 123 456 7890<br />
              E-Mail: info@move-in2stay.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy mb-4">3. Datenerfassung auf dieser Website</h2>
            <h3 className="text-xl font-medium text-navy mb-2">Kontaktformular</h3>
            <p className="text-gray-700 mb-4">
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular 
              inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall 
              von Anschlussfragen bei uns gespeichert.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy mb-4">4. Ihre Rechte</h2>
            <p className="text-gray-700 mb-4">
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, 
              deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder 
              Löschung dieser Daten.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy mb-4">5. SSL- bzw. TLS-Verschlüsselung</h2>
            <p className="text-gray-700">
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine 
              SSL- bzw. TLS-Verschlüsselung.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
