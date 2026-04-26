// Lodgify API Client
const LODGIFY_API_KEY = process.env.LODGIFY_API_KEY || 'kD7VbIqP10oG8hwNWXg6AvXHmVEXwKgIRIImVTOB7sierM/TuPKvwgDgrmH3ZomE';

export interface LodgifyProperty {
  id: number;
  name: string;
  internalCode?: string;
  city?: string;
  area?: string;
  image_url?: string;
  thumbnail_url?: string;
  max_people: number;
  bedrooms?: number;
  bathrooms?: number;
  description?: string;
  url_slug?: string;
  booking_url?: string;
  address?: {
    city?: string;
    country?: string;
  };
}

// Lodgify Website URL
const LODGIFY_WEBSITE_URL = 'https://stayinn-leipzig.lodgify.com';

// Property ID Mapping
export const PROPERTY_MAPPING: Record<string, { id: number; city: string; area: string; code: string }> = {
  'HALLE_SS15_EL': { id: 673391, city: 'Halle', area: 'Schlosserstraße', code: 'SS15-EL' },
  'SS15_1R': { id: 673395, city: 'Halle', area: 'Schlosserstraße', code: 'SS15-1R' },
  'SS15_2L': { id: 673412, city: 'Halle', area: 'Schlosserstraße', code: 'SS15-2L' },
  'SS15_2R': { id: 696307, city: 'Halle', area: 'Schlosserstraße', code: 'SS15-2R' },
  'SS15_3R': { id: 673413, city: 'Halle', area: 'Schlosserstraße', code: 'SS15-3R' },
  'SS15_3L': { id: 673414, city: 'Halle', area: 'Schlosserstraße', code: 'SS15-3L' },
  'SS15_ER': { id: 673426, city: 'Halle', area: 'Schlosserstraße', code: 'SS15-ER' },
  'HALLE_MS1_4': { id: 673424, city: 'Halle', area: 'Marienstraße', code: 'MS1-4' },
  'MS1_E': { id: 673422, city: 'Halle', area: 'Marienstraße', code: 'MS1-E' },
  'MS2_1': { id: 673421, city: 'Halle', area: 'Marienstraße', code: 'MS2-1' },
  'MS2_2': { id: 673416, city: 'Halle', area: 'Marienstraße', code: 'MS2-2' },
  'MS3_4L': { id: 673415, city: 'Halle', area: 'Marienstraße', code: 'MS3-4L' },
  'MS3_4R': { id: 673420, city: 'Halle', area: 'Marienstraße', code: 'MS3-4R' },
  'DELITZSCH_NS3_DG': { id: 673407, city: 'Delitzsch', area: 'Neue Straße', code: 'NS3-DG' },
  'NS3_1': { id: 673408, city: 'Delitzsch', area: 'Neue Straße', code: 'NS3-1' },
  'NS3_ER': { id: 673417, city: 'Delitzsch', area: 'Neue Straße', code: 'NS3-ER' },
  'NS3_EL': { id: 673418, city: 'Delitzsch', area: 'Neue Straße', code: 'NS3-EL' },
  'HZ1': { id: 673428, city: 'Bitterfeld', area: 'Hallesche Straße', code: 'HZ1' },
  'LEIPZIG_BLS13': { id: 673405, city: 'Leipzig', area: 'Böhlitz-Ehrenberg', code: 'BLS13' },
  'GS199_E': { id: 673409, city: 'Leipzig', area: 'Georg-Schumann-Straße', code: 'GS199-E' },
  'GS199_1': { id: 673410, city: 'Leipzig', area: 'Georg-Schumann-Straße', code: 'GS199-1' },
  'LZS20': { id: 696308, city: 'Leipzig', area: 'Lützner Straße', code: 'LZS20' },
  'MERSEBURG_AP8_1': { id: 673396, city: 'Merseburg', area: 'Am Paradies', code: 'AP8-1' },
  'AP8_3': { id: 673397, city: 'Merseburg', area: 'Am Paradies', code: 'AP8-3' },
  'NDS2_R': { id: 696309, city: 'Merseburg', area: 'Neue Deichstraße', code: 'NDS2-R' },
  'RESSEL_MANSION': { id: 790436, city: 'Bitterfeld', area: 'An der Sorge', code: 'Ressel Mansion' },
};

export async function getProperties(): Promise<LodgifyProperty[]> {
  try {
    const response = await fetch('https://api.lodgify.com/v2/properties', {
      headers: {
        'X-ApiKey': LODGIFY_API_KEY,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Lodgify API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle different response structures
    const properties = Array.isArray(data) ? data : data.items || data.results || data.properties || [];

    // Enhance properties with our mapping and URLs
    return properties.map((prop: any) => {
      const mappingEntry = Object.entries(PROPERTY_MAPPING).find(
        ([, value]) => value.id === prop.id
      );

      // Create URL slug from name
      const urlSlug = prop.name
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `property-${prop.id}`;

      const propertyUrl = `${LODGIFY_WEBSITE_URL}/de/immobilien/${prop.id}/${urlSlug}`;

      if (mappingEntry) {
        const [, mappedData] = mappingEntry;
        return {
          ...prop,
          internalCode: mappedData.code,
          city: mappedData.city,
          area: mappedData.area,
          url_slug: urlSlug,
          booking_url: propertyUrl,
        };
      }

      return {
        ...prop,
        url_slug: urlSlug,
        booking_url: propertyUrl,
      };
    });
  } catch (error) {
    console.error('Failed to fetch Lodgify properties:', error);
    return [];
  }
}
