import { NextRequest, NextResponse } from 'next/server';

// Mock data for different amenity types
const mockAmenities = {
  police: [
    { name: 'Central Police Station', lat: 40.7128, lon: -74.0060, phone: '+1 (555) 123-4567' },
    { name: 'Downtown Police Precinct', lat: 40.7200, lon: -74.0050, phone: '+1 (555) 234-5678' },
    { name: 'Airport Police Unit', lat: 40.7600, lon: -74.0100, phone: '+1 (555) 345-6789' },
  ],
  hospital: [
    { name: 'Metropolitan Hospital', lat: 40.7150, lon: -74.0080, phone: '+1 (555) 456-7890' },
    { name: 'City Medical Center', lat: 40.7100, lon: -74.0120, phone: '+1 (555) 567-8901' },
    { name: 'Emergency Care Hospital', lat: 40.7180, lon: -74.0000, phone: '+1 (555) 678-9012' },
  ],
  fire_station: [
    { name: 'Fire Station #1', lat: 40.7140, lon: -74.0070, phone: '+1 (555) 789-0123' },
    { name: 'Fire Station #7', lat: 40.7160, lon: -74.0090, phone: '+1 (555) 890-1234' },
    { name: 'Fire Station #12', lat: 40.7120, lon: -74.0110, phone: '+1 (555) 901-2345' },
  ],
};

// Helper function to calculate distance (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Generate mock map HTML
function generateMapHtml(userLat: number, userLon: number, placeLat: number, placeLon: number): string {
  return `
    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: sans-serif;">
      <div style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">🗺️</div>
        <h3 style="margin: 0 0 5px 0;">Location Map</h3>
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Your location: (${userLat.toFixed(4)}, ${userLon.toFixed(4)})</p>
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Destination: (${placeLat.toFixed(4)}, ${placeLon.toFixed(4)})</p>
        <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">Interactive map would load here with Leaflet/Folium</p>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lat, lon, type = 'police', panic } = body;

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Location data is required' },
        { status: 400 }
      );
    }

    // Get mock amenities for the requested type
    const amenities = mockAmenities[type as keyof typeof mockAmenities] || mockAmenities.police;

    if (!amenities || amenities.length === 0) {
      return NextResponse.json(
        { error: `No ${type} locations found nearby` },
        { status: 404 }
      );
    }

    // Calculate distances and find nearest
    const withDistances = amenities.map((amenity) => ({
      ...amenity,
      distance: calculateDistance(lat, lon, amenity.lat, amenity.lon),
    }));

    const nearest = withDistances.reduce((prev, current) =>
      prev.distance < current.distance ? prev : current
    );

    // Generate map HTML
    const mapHtml = generateMapHtml(lat, lon, nearest.lat, nearest.lon);

    return NextResponse.json({
      name: nearest.name,
      distance: nearest.distance.toFixed(2),
      phone: nearest.phone,
      phone_uri: `tel:${nearest.phone.replace(/\D/g, '')}`,
      lat: nearest.lat,
      lon: nearest.lon,
      map_html: mapHtml,
    });
  } catch (error) {
    console.error('Error finding nearest amenity:', error);
    return NextResponse.json(
      { error: 'Failed to find nearest location' },
      { status: 500 }
    );
  }
}
