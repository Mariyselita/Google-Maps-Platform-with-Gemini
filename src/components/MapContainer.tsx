import React, { useCallback, useEffect, useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  Map,
  MapCameraChangedEvent,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  Compass,
  Layers,
  MapPin,
  Maximize2,
  Navigation,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { GeocodeV4Result } from '../types';
import { LocalInsightsBanner } from './LocalInsightsBanner';

interface MapContainerProps {
  location: GeocodeV4Result | null;
  onMapReady?: () => void;
  targetZoom?: number | null;
  insightsLocationName: string;
  insightsHtml: string | null;
  isInsightsLoading: boolean;
  insightsError: string | null;
  onRefreshInsights: () => void;
  onStartQuiz?: () => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  location,
  targetZoom,
  insightsLocationName,
  insightsHtml,
  isInsightsLoading,
  insightsError,
  onRefreshInsights,
  onStartQuiz,
}) => {
  const map = useMap();
  const [mapTypeId, setMapTypeId] = useState<google.maps.MapTypeId | 'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);
  const [cameraCenter, setCameraCenter] = useState<{ lat: number; lng: number }>({
    lat: -34.6037,
    lng: -58.3821,
  });
  const [cameraZoom, setCameraZoom] = useState<number>(13);

  // Pan to location when it changes
  useEffect(() => {
    if (!map || !location) return;

    const { latitude, longitude } = location.location;
    const target = { lat: latitude, lng: longitude };

    if (location.viewport) {
      // Fit to bounding viewport if available
      try {
        const bounds = new google.maps.LatLngBounds(
          { lat: location.viewport.low.latitude, lng: location.viewport.low.longitude },
          { lat: location.viewport.high.latitude, lng: location.viewport.high.longitude }
        );
        map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });
      } catch {
        map.panTo(target);
        map.setZoom(14);
      }
    } else {
      map.panTo(target);
      map.setZoom(14);
    }

    setCameraCenter(target);
    setInfoWindowOpen(true);
  }, [map, location]);

  // Handle manual targetZoom prop changes
  useEffect(() => {
    if (!map || targetZoom == null) return;
    map.setZoom(targetZoom);
    if (location) {
      map.panTo({
        lat: location.location.latitude,
        lng: location.location.longitude,
      });
    }
  }, [map, targetZoom, location]);

  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => {
    setCameraCenter({
      lat: ev.detail.center.lat,
      lng: ev.detail.center.lng,
    });
    setCameraZoom(Math.round(ev.detail.zoom));
  }, []);

  const handleRecenter = () => {
    if (!map || !location) return;
    map.panTo({
      lat: location.location.latitude,
      lng: location.location.longitude,
    });
    map.setZoom(14);
  };

  const handleZoomIn = () => {
    if (!map) return;
    const current = map.getZoom() || 13;
    map.setZoom(current + 1);
  };

  const handleZoomOut = () => {
    if (!map) return;
    const current = map.getZoom() || 13;
    map.setZoom(current - 1);
  };

  const markerPosition = location
    ? {
        lat: location.location.latitude,
        lng: location.location.longitude,
      }
    : cameraCenter;

  return (
    <div className="relative w-full h-full min-h-[420px] bg-slate-950 overflow-hidden select-none">
      <Map
        mapId="DEMO_MAP_ID"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        defaultCenter={cameraCenter}
        defaultZoom={cameraZoom}
        mapTypeId={mapTypeId}
        gestureHandling="greedy"
        disableDefaultUI={true}
        onCameraChanged={handleCameraChange}
        className="w-full h-full"
      >
        {location && (
          <AdvancedMarker
            position={markerPosition}
            title={location.formattedAddress}
            onClick={() => setInfoWindowOpen(true)}
          >
            {/* Custom Modern Marker Pin with Pulse Animation */}
            <div className="relative flex items-center justify-center cursor-pointer group">
              {/* Outer Pulse Rings */}
              <div className="absolute w-12 h-12 -inset-1 rounded-full bg-sky-500/20 animate-ping pointer-events-none" />
              <div className="absolute w-8 h-8 rounded-full bg-sky-500/30 animate-pulse pointer-events-none" />

              {/* Pin Center Marker */}
              <div className="relative z-10 w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-500 border-2 border-white shadow-xl shadow-sky-500/40 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-150">
                <MapPin className="w-4 h-4 fill-white" />
              </div>

              {/* Pointer Triangle */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-indigo-600 rotate-45 border-r border-b border-white" />
            </div>

            {infoWindowOpen && (
              <InfoWindow
                position={markerPosition}
                onCloseClick={() => setInfoWindowOpen(false)}
                headerContent={
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 pr-2">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
                    <span className="truncate max-w-[200px]">
                      {location.addressComponents?.[0]?.longText || 'Geocoded Target'}
                    </span>
                  </div>
                }
              >
                <div className="p-1 space-y-2 text-xs text-slate-700 max-w-[260px]">
                  <p className="font-medium text-slate-800 leading-snug">
                    {location.formattedAddress}
                  </p>

                  <div className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {location.location.latitude.toFixed(5)}, {location.location.longitude.toFixed(5)}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-semibold text-[10px]">
                      {location.granularity || 'APPROXIMATE'}
                    </span>
                    <button
                      onClick={() => {
                        if (map) {
                          map.panTo(markerPosition);
                          map.setZoom(16);
                        }
                      }}
                      className="text-sky-600 hover:text-sky-800 font-medium underline"
                    >
                      Zoom In (16x)
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </AdvancedMarker>
        )}
      </Map>

      {/* Floating Map Controls & Overlays */}

      {/* Top Left: Active Location Badge with Recenter Action */}
      {location && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 max-w-[calc(100%-120px)] sm:max-w-md">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 text-xs text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            <span className="font-semibold text-slate-100 truncate">
              {location.formattedAddress}
            </span>
            <button
              onClick={handleRecenter}
              className="p-1 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-md transition-colors shrink-0 ml-1"
              title="Pan camera to marker"
            >
              <Navigation className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Right: Map Type Switcher */}
      <div className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-lg p-1 flex items-center gap-1">
        {(
          [
            { id: 'roadmap', label: 'Map' },
            { id: 'satellite', label: 'Sat' },
            { id: 'terrain', label: 'Terrain' },
          ] as const
        ).map((type) => (
          <button
            key={type.id}
            onClick={() => setMapTypeId(type.id)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              mapTypeId === type.id
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Bottom Right: Zoom & Center Controls */}
      <div className="absolute bottom-6 right-4 z-10 flex flex-col gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-lg p-1 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-800 mx-1" />
          <button
            onClick={handleZoomOut}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {location && (
          <button
            onClick={handleRecenter}
            className="p-2.5 bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 border border-slate-700/80 text-sky-400 hover:text-sky-300 rounded-xl shadow-lg transition-colors flex items-center justify-center"
            title="Recenter to active location"
          >
            <Navigation className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bottom Left: Coordinates & Zoom HUD */}
      <div className="absolute top-4 left-auto right-48 z-10 hidden xl:flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-lg text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span>
            {cameraCenter.lat >= 0 ? `${cameraCenter.lat.toFixed(4)}°N` : `${Math.abs(cameraCenter.lat).toFixed(4)}°S`},{' '}
            {cameraCenter.lng >= 0 ? `${cameraCenter.lng.toFixed(4)}°E` : `${Math.abs(cameraCenter.lng).toFixed(4)}°W`}
          </span>
        </div>
        <div className="w-px h-3 bg-slate-700" />
        <div>
          <span>Zoom: </span>
          <span className="text-slate-200 font-semibold">{cameraZoom}x</span>
        </div>
      </div>

      {/* Local Insights Banner on Bottom Portion of Map Screen */}
      <LocalInsightsBanner
        locationName={insightsLocationName}
        insightsHtml={insightsHtml}
        isLoading={isInsightsLoading}
        error={insightsError}
        onRefresh={onRefreshInsights}
        onStartQuiz={onStartQuiz}
      />
    </div>
  );
};
