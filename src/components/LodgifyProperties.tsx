// Server Component - fetches Lodgify data at build time
import Image from "next/image";
import { MapPin, Users, BedDouble, Bath, ExternalLink } from "lucide-react";
import { getProperties, LodgifyProperty } from "@/lib/lodgify";

export default async function LodgifyProperties() {
  const properties = await getProperties();

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unterkünfte werden geladen...</p>
        <a
          href="https://stayinn-leipzig.lodgify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
        >
          Direkt auf Lodgify ansehen
          <ExternalLink size={16} />
        </a>
      </div>
    );
  }

  // Group properties by city
  const groupedProperties = properties.reduce((acc, prop) => {
    const city = prop.city || prop.address?.city || "Sonstige";
    if (!acc[city]) acc[city] = [];
    acc[city].push(prop);
    return acc;
  }, {} as Record<string, LodgifyProperty[]>);

  const cityOrder = ["Leipzig", "Halle", "Merseburg", "Delitzsch", "Bitterfeld"];

  return (
    <div className="space-y-12">
      {cityOrder.map((city) => {
        const cityProperties = groupedProperties[city];
        if (!cityProperties || cityProperties.length === 0) return null;

        return (
          <div key={city}>
            <h3 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
              <MapPin className="text-accent" size={24} />
              {city}
              <span className="text-sm font-normal text-gray-500">
                ({cityProperties.length} Apartments)
              </span>
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cityProperties.map((property) => (
                <a
                  key={property.id}
                  href={property.booking_url || `https://stayinn-leipzig.lodgify.com/de/alle-objekte`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
                    {property.image_url || property.thumbnail_url ? (
                      <Image
                        src={property.image_url || property.thumbnail_url!}
                        alt={property.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BedDouble className="text-primary/30" size={48} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-navy">
                      {property.internalCode || `#${property.id}`}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h4 className="font-bold text-navy mb-1 line-clamp-1">
                      {property.name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      {property.area || property.address?.city}
                    </p>

                    {/* Features */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users size={16} className="text-primary" />
                        <span>{property.max_people}</span>
                      </div>
                      {property.bedrooms !== undefined && (
                        <div className="flex items-center gap-1">
                          <BedDouble size={16} className="text-primary" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms !== undefined && (
                        <div className="flex items-center gap-1">
                          <Bath size={16} className="text-primary" />
                          <span>{property.bathrooms}</span>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                        Jetzt buchen
                        <ExternalLink size={14} />
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      ID: {property.internalCode || property.id}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        );
      })}

      {/* Direct Link */}
      <div className="text-center pt-8">
        <a
          href="https://stayinn-leipzig.lodgify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-accent text-navy px-8 py-4 rounded-lg font-bold hover:bg-accent-light transition-colors"
        >
          Alle Unterkünfte auf Lodgify ansehen
          <ExternalLink size={20} />
        </a>
      </div>
    </div>
  );
}
