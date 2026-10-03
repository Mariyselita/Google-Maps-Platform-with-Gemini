/**
 * Block Explorer - Geospatial Exploration App
 * Type Definitions
 */

export interface GeocodeV4AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
  languageCode?: string;
}

export interface GeocodeV4Location {
  latitude: number;
  longitude: number;
}

export interface GeocodeV4Viewport {
  low: GeocodeV4Location;
  high: GeocodeV4Location;
}

export interface GeocodeV4Result {
  place?: string;
  placeId?: string;
  location: GeocodeV4Location;
  granularity?: string;
  viewport?: GeocodeV4Viewport;
  bounds?: GeocodeV4Viewport;
  formattedAddress: string;
  addressComponents?: GeocodeV4AddressComponent[];
  types?: string[];
}

export interface GeocodeV4Response {
  results?: GeocodeV4Result[];
  error?: {
    code: number;
    message: string;
    status: string;
    details?: unknown[];
  };
}

export interface PresetLocation {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  flag: string;
  tag: string;
  defaultCoords: {
    lat: number;
    lng: number;
  };
}

export interface GeocodeErrorDetails {
  title: string;
  message: string;
  statusCode?: number;
  requestUrl: string;
  rawPayload?: unknown;
  troubleshootingTips: string[];
  timestamp: string;
}

export type QuizCategory = 'Local cuisine' | 'Art and culture' | 'Local history';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizData {
  location: string;
  category: QuizCategory;
  questions: QuizQuestion[];
}

export interface QuizSubmission {
  score: number;
  total: number;
  userAnswers: number[];
}

