import { GeocodeV4Result } from '../types';

export interface LocalInsightsResult {
  success: boolean;
  locationName: string;
  html?: string;
  error?: string;
}

/**
 * Extracts "City, State" (or appropriate urban hierarchy) from GeocodeV4Result
 */
export function extractCityAndState(result: GeocodeV4Result): string {
  const components = result.addressComponents || [];

  // Look for locality (City)
  const locality = components.find(
    (c) =>
      c.types.includes('locality') ||
      c.types.includes('sublocality_level_1') ||
      c.types.includes('sublocality') ||
      c.types.includes('postal_town')
  )?.longText;

  // Look for administrative_area_level_1 (State / Province)
  const state = components.find((c) =>
    c.types.includes('administrative_area_level_1')
  )?.longText;

  // Look for country
  const country = components.find((c) =>
    c.types.includes('country')
  )?.longText;

  if (locality && state) {
    // If state is not identical to locality, return "City, State"
    if (locality.toLowerCase() !== state.toLowerCase()) {
      return `${locality}, ${state}`;
    }
    // If city is a federal capital/state-city (like Buenos Aires), add country if available
    return country ? `${locality}, ${country}` : locality;
  }

  if (locality && country) {
    return `${locality}, ${country}`;
  }

  if (state && country) {
    return `${state}, ${country}`;
  }

  // Fallback: use first two parts of formatted address
  const parts = result.formattedAddress.split(',');
  if (parts.length >= 2) {
    return `${parts[0].trim()}, ${parts[1].trim()}`;
  }

  return result.formattedAddress;
}

/**
 * Calls server-side Gemini API endpoint /api/insights
 */
export async function fetchLocalInsights(
  locationName: string
): Promise<LocalInsightsResult> {
  const cleanName = locationName.trim();

  if (!cleanName) {
    return {
      success: false,
      locationName: '',
      error: 'Location name is required to fetch local insights.',
    };
  }

  try {
    const res = await fetch('/api/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location: cleanName }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        locationName: cleanName,
        error:
          data.error ||
          `Unable to generate insights (HTTP ${res.status}: ${res.statusText})`,
      };
    }

    return {
      success: true,
      locationName: cleanName,
      html: data.html,
    };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : 'Network error communicating with AI server.';
    return {
      success: false,
      locationName: cleanName,
      error: errorMsg,
    };
  }
}
