import { site } from "@/data/site";

export function fullAddress(): string {
  const a = site.address;
  return `${a.line1}, ${a.line2}, ${a.region}, ${a.postcode}, ${a.country}`;
}

/**
 * Ballagan Farm, Gartocharn (postcode G83 8SB), geocoded via OpenStreetMap
 * Nominatim, for postcode-centroid accuracy, which is what the embed below needs.
 */
export const FARM_COORDS = { lat: 56.0512389, lon: -4.5104331 };

/**
 * OpenStreetMap's embed: no API key, no billing, and it just works in an
 * iframe. Google's keyless "maps.google.com/maps?...&output=embed" trick no
 * longer reliably embeds (Google now serves it through the Maps Embed API
 * infrastructure, which expects a key even when the response looks anonymous).
 * The "Directions" buttons below still hand off to Google/Apple Maps directly.
 */
export function mapEmbedUrl(): string {
  const { lat, lon } = FARM_COORDS;
  const dLon = 0.025;
  const dLat = 0.013;
  const bbox = [lon - dLon, lat - dLat, lon + dLon, lat + dLat].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
}

export function osmViewUrl(): string {
  const { lat, lon } = FARM_COORDS;
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=14/${lat}/${lon}`;
}

export function googleMapsDirectionsUrl(destination: string = fullAddress()): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Apple Maps opens the native app on iOS/macOS and falls back to the web on other platforms. */
export function appleMapsDirectionsUrl(destination: string = fullAddress()): string {
  return `https://maps.apple.com/?daddr=${encodeURIComponent(destination)}&dirflg=d`;
}

export function appleMapsSearchUrl(query: string): string {
  return `https://maps.apple.com/?q=${encodeURIComponent(query)}`;
}
