/**
 * Block Explorer - Geospatial Exploration App
 * Uses Google Maps Platform & Google Geocoding V4 REST API
 */

import React, { useCallback, useEffect, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Layers, Map as MapIcon, SlidersHorizontal } from 'lucide-react';
import { EditorialPanel } from './components/EditorialPanel';
import { MapContainer } from './components/MapContainer';
import { QuizModal } from './components/QuizModal';
import { TroubleshootingModal } from './components/TroubleshootingModal';
import { PRESET_LOCATIONS } from './data/presets';
import { geocodeAddressV4 } from './services/geocoding';
import { extractCityAndState, fetchLocalInsights } from './services/insights';
import { GeocodeErrorDetails, GeocodeV4Result, PresetLocation } from './types';

export default function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Core State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<GeocodeV4Result | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>('buenos-aires');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GeocodeErrorDetails | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Buenos Aires',
    'Shibuya',
    'Copacabana',
  ]);
  const [targetZoom, setTargetZoom] = useState<number | null>(null);
  const [isTroubleshootingOpen, setIsTroubleshootingOpen] = useState(false);

  // Local Insights AI State (gemini-3.8-flash)
  const [insightsLocationName, setInsightsLocationName] = useState<string>('');
  const [insightsHtml, setInsightsHtml] = useState<string | null>(null);
  const [isInsightsLoading, setIsInsightsLoading] = useState<boolean>(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);

  // Mobile View Switcher ('panel' | 'map')
  const [mobileTab, setMobileTab] = useState<'panel' | 'map'>('panel');

  // Trigger Gemini AI Local Insights
  const triggerInsights = useCallback(async (locationStr: string) => {
    if (!locationStr.trim()) return;
    setInsightsLocationName(locationStr);
    setIsInsightsLoading(true);
    setInsightsError(null);
    setInsightsHtml(null);

    const res = await fetchLocalInsights(locationStr);

    setIsInsightsLoading(false);
    if (res.success && res.html) {
      setInsightsHtml(res.html);
    } else {
      setInsightsError(res.error || 'Failed to retrieve local insights from Gemini AI.');
    }
  }, []);

  // Core Geocoding V4 execution
  const executeGeocode = useCallback(
    async (queryText: string, presetId: string | null = null) => {
      const trimmed = queryText.trim();
      if (!trimmed) return;

      setIsLoading(true);
      setError(null);

      const result = await geocodeAddressV4(trimmed, apiKey);

      setIsLoading(false);

      if (result.success && result.result) {
        setSelectedLocation(result.result);
        setActivePresetId(presetId);
        setSearchQuery(trimmed);

        // Update recent searches
        setRecentSearches((prev) => {
          const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
          return [trimmed, ...filtered].slice(0, 6);
        });

        // Trigger Gemini Tour Guide AI for City, State
        const cityState = extractCityAndState(result.result);
        triggerInsights(cityState);

        // On mobile, auto-switch to map view so the user immediately sees the panned map
        if (window.innerWidth < 1024) {
          setMobileTab('map');
        }
      } else if (result.error) {
        setError(result.error);
        if (presetId) {
          setActivePresetId(presetId);
        }
      }
    },
    [apiKey, triggerInsights]
  );

  // Initialize with Buenos Aires on first load
  useEffect(() => {
    executeGeocode('Buenos Aires', 'buenos-aires');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    executeGeocode(searchQuery, null);
  };

  const handleSelectPreset = (preset: PresetLocation) => {
    executeGeocode(preset.name, preset.id);
  };

  const handleSelectRecentSearch = (query: string) => {
    executeGeocode(query, null);
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  const handleFocusLocation = () => {
    setTargetZoom(14);
    if (window.innerWidth < 1024) {
      setMobileTab('map');
    }
  };

  const handleZoomLevel = (zoom: number) => {
    setTargetZoom(zoom);
    if (window.innerWidth < 1024) {
      setMobileTab('map');
    }
  };

  const handleRefreshInsights = () => {
    if (insightsLocationName) {
      triggerInsights(insightsLocationName);
    } else if (selectedLocation) {
      const cityState = extractCityAndState(selectedLocation);
      triggerInsights(cityState);
    }
  };

  const handleRetry = () => {
    if (searchQuery.trim()) {
      executeGeocode(searchQuery, activePresetId);
    } else {
      executeGeocode('Buenos Aires', 'buenos-aires');
    }
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div className="relative flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-slate-950 font-sans">
        {/* Left Side: 1/3-width Editorial Control Panel on desktop */}
        <div
          className={`h-full w-full lg:w-[420px] xl:w-[460px] 2xl:w-[490px] shrink-0 z-20 transition-transform duration-200 ${
            mobileTab === 'panel' ? 'block' : 'hidden lg:block'
          }`}
        >
          <EditorialPanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSubmitSearch={handleSearchSubmit}
            isLoading={isLoading}
            selectedLocation={selectedLocation}
            activePresetId={activePresetId}
            onSelectPreset={handleSelectPreset}
            error={error}
            onClearError={() => setError(null)}
            onOpenTroubleshooting={() => setIsTroubleshootingOpen(true)}
            recentSearches={recentSearches}
            onSelectRecentSearch={handleSelectRecentSearch}
            onClearRecentSearches={handleClearRecentSearches}
            onFocusLocation={handleFocusLocation}
            onZoomLevel={handleZoomLevel}
          />
        </div>

        {/* Right Side: 2/3-width Full-Height Map Container on desktop */}
        <div
          className={`h-full flex-1 relative z-10 ${
            mobileTab === 'map' ? 'block' : 'hidden lg:block'
          }`}
        >
          <MapContainer
            location={selectedLocation}
            targetZoom={targetZoom}
            insightsLocationName={insightsLocationName}
            insightsHtml={insightsHtml}
            isInsightsLoading={isInsightsLoading}
            insightsError={insightsError}
            onRefreshInsights={handleRefreshInsights}
            onStartQuiz={() => setIsQuizOpen(true)}
          />
        </div>

        {/* Mobile View Toggle Bar (visible only on small screens < 1024px) */}
        <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-full p-1 shadow-2xl flex items-center gap-1">
          <button
            onClick={() => setMobileTab('panel')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              mobileTab === 'panel'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Controls
          </button>
          <button
            onClick={() => setMobileTab('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              mobileTab === 'map'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            Map View
          </button>
        </div>

        {/* Local Knowledge Trivia Challenge Modal */}
        <QuizModal
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          locationName={insightsLocationName || 'this city'}
        />

        {/* Diagnostics & Troubleshooting Modal */}
        <TroubleshootingModal
          isOpen={isTroubleshootingOpen}
          onClose={() => setIsTroubleshootingOpen(false)}
          error={
            error || {
              title: 'API Status: Ready',
              message: selectedLocation
                ? `Active target "${selectedLocation.formattedAddress}" successfully resolved via Geocoding v4 REST API.`
                : 'Google Geocoding v4 REST endpoint is connected and responding.',
              statusCode: selectedLocation ? 200 : undefined,
              requestUrl: 'https://geocode.googleapis.com/v4/geocode/address/{addressQuery}',
              rawPayload: selectedLocation || undefined,
              troubleshootingTips: [
                'Ensure query terms are properly spelled',
                'Verify that Google Maps Geocoding API is enabled on your Cloud Project',
                'Check network connectivity or adblockers',
              ],
              timestamp: new Date().toLocaleTimeString(),
            }
          }
          onRetry={handleRetry}
        />
      </div>
    </APIProvider>
  );
}
