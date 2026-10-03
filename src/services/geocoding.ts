/**
 * Geocoding Service using Google Geocoding V4 REST API
 * Endpoint: https://geocode.googleapis.com/v4/geocode/address/{addressQuery}
 */

import { GeocodeErrorDetails, GeocodeV4Response, GeocodeV4Result } from '../types';

export interface GeocodeResultWrapper {
  success: boolean;
  result?: GeocodeV4Result;
  allResults?: GeocodeV4Result[];
  error?: GeocodeErrorDetails;
  requestUrl: string;
  statusCode?: number;
  rawResponse?: unknown;
}

export async function geocodeAddressV4(
  query: string,
  apiKey: string
): Promise<GeocodeResultWrapper> {
  const trimmed = query.trim();
  const timestamp = new Date().toLocaleTimeString();

  if (!trimmed) {
    return {
      success: false,
      requestUrl: '',
      error: {
        title: 'Empty Search Query',
        message: 'Please enter a location, city, landmark, or address to explore.',
        statusCode: 400,
        requestUrl: '',
        troubleshootingTips: [
          'Type a city name (e.g., "Buenos Aires", "Tokyo")',
          'Try a neighborhood (e.g., "Copacabana", "Shibuya")',
          'Or click any of the 5 curated presets above',
        ],
        timestamp,
      },
    };
  }

  if (!apiKey) {
    return {
      success: false,
      requestUrl: '',
      error: {
        title: 'Missing API Key',
        message: 'A Google Maps Platform API key is required to query the Geocoding V4 API.',
        statusCode: 401,
        requestUrl: '',
        troubleshootingTips: [
          'Ensure VITE_GOOGLE_MAPS_API_KEY is configured in your environment',
          'Check that the API key has the Geocoding API enabled in Google Cloud Console',
        ],
        timestamp,
      },
    };
  }

  const endpointBase = 'https://geocode.googleapis.com/v4/geocode/address';
  const requestUrl = `${endpointBase}/${encodeURIComponent(trimmed)}?key=${apiKey}`;
  const maskedUrl = `${endpointBase}/${encodeURIComponent(trimmed)}?key=${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`;

  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Goog-Maps-Solution-ID': 'gmp_mcp_codeassist_v1_aistudio',
      },
    });

    const statusCode = response.status;
    let data: GeocodeV4Response | null = null;
    try {
      data = await response.json();
    } catch {
      // Non-JSON response
    }

    if (!response.ok) {
      const tips: string[] = [];
      let customTitle = 'Geocoding Request Failed';
      let customMsg = `HTTP ${statusCode}: ${response.statusText || 'Error returned from Geocoding V4 API'}`;

      if (statusCode === 400) {
        customTitle = 'Invalid Request (HTTP 400)';
        customMsg = data?.error?.message || 'The Geocoding V4 request was improperly formatted.';
        tips.push('Verify query characters and avoid reserved URI symbols.');
        tips.push('Ensure the address query contains valid UTF-8 characters.');
      } else if (statusCode === 403) {
        customTitle = 'Authorization Error (HTTP 403)';
        customMsg = data?.error?.message || 'Access denied for the provided API key.';
        tips.push('Verify that "Geocoding API" is enabled in your Google Cloud Console.');
        tips.push('Check that your API key restrictions allow requests from this web domain.');
        tips.push('Verify billing is enabled on your Google Cloud project.');
      } else if (statusCode === 429) {
        customTitle = 'Rate Limit / Quota Exceeded (HTTP 429)';
        customMsg = data?.error?.message || 'Too many requests sent to the Geocoding API.';
        tips.push('Wait a moment before sending another request.');
        tips.push('Check your Google Cloud project quota limits for the Geocoding API.');
      } else {
        tips.push('Verify network connection to https://geocode.googleapis.com.');
        tips.push('Inspect the raw response payload below for detailed API error codes.');
      }

      return {
        success: false,
        statusCode,
        requestUrl: maskedUrl,
        rawResponse: data,
        error: {
          title: customTitle,
          message: customMsg,
          statusCode,
          requestUrl: maskedUrl,
          rawPayload: data,
          troubleshootingTips: tips,
          timestamp,
        },
      };
    }

    // Success response - verify results
    const results = data?.results;
    if (!results || results.length === 0) {
      return {
        success: false,
        statusCode,
        requestUrl: maskedUrl,
        rawResponse: data,
        error: {
          title: 'Location Not Found',
          message: `The Geocoding V4 API could not find any matching locations for "${trimmed}".`,
          statusCode: 200,
          requestUrl: maskedUrl,
          rawPayload: data,
          troubleshootingTips: [
            'Check for typographical or spelling errors in your search',
            'Try adding the broader city or country (e.g. "Soho, London" or "Shibuya, Tokyo")',
            'Try searching by landmark name or major intersection',
            'Select one of the 5 preset buttons for guaranteed verified locations',
          ],
          timestamp,
        },
      };
    }

    return {
      success: true,
      statusCode,
      result: results[0],
      allResults: results,
      requestUrl: maskedUrl,
      rawResponse: data,
    };
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return {
      success: false,
      requestUrl: maskedUrl,
      error: {
        title: 'Network / Connection Error',
        message: errorObj.message || 'Failed to communicate with the Google Geocoding V4 endpoint.',
        requestUrl: maskedUrl,
        troubleshootingTips: [
          'Verify your device has an active internet connection',
          'Check if an ad-blocker or browser security extension is blocking Google Maps endpoints',
          'Ensure the browser allows requests to https://geocode.googleapis.com',
        ],
        timestamp,
      },
    };
  }
}
