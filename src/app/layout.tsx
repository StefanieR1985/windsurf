import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Move-in2Stay | Monteurzimmer & möblierte Apartments Leipzig Halle",
  description: "29 professionelle Monteurzimmer mit garantierten EINZELBETTEN in Leipzig, Halle, Merseburg, Delitzsch, Bitterfeld. Auch Investment-Wohnungen mit Management-Service. Willkommen, um zu bleiben!",
  keywords: "Monteurzimmer Leipzig, Monteurzimmer Halle, Monteurunterkunft, Einzelbetten Monteur, möblierte Wohnung Investment, Serviced Apartment, Monteurwohnung, Firmenunterkunft, Business Apartment, möbliertes Apartment Leipzig, Monteurzimmer mit Küche",
  openGraph: {
    title: "Move-in2Stay | Monteurzimmer mit Einzelbetten in Mitteldeutschland",
    description: "29 professionelle Monteurzimmer mit garantierten Einzelbetten. Flexible Buchung, kontaktloser Check-in, voll ausgestattete Küchen. Auch Investment-Wohnungen verfügbar.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
