import React from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Compass,
  Copy,
  Layers,
  MapPin,
  Navigation,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { GeocodeV4Result } from '../types';

interface LocationDetailsProps {
  location: GeocodeV4Result | null;
  onFocusLocation: () => void;
  onZoomLevel: (zoom: number) => void;
}

export const LocationDetails: React.FC<LocationDetailsProps> = ({
  location,
  onFocusLocation,
  onZoomLevel,
}) => {
  const [copiedCoords, setCopiedCoords] = React.useState(false);
  const [copiedAddress, setCopiedAddress] = React.useState(false);
  const [showRawJson, setShowRawJson] = React.useState(false);

  if (!location) {
    return (
      <div className="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 text-center space-y-2">
        <Compass className="w-8 h-8 mx-auto text-slate-500 animate-pulse" />
        <h3 className="text-sm font-medium text-slate-300">Awaiting Geospatial Target</h3>
        <p className="text-xs text-slate-400">
          Enter a location in the search bar or pick one of the 5 presets to inspect geocoded cartographic data.
        </p>
      </div>
    );
  }

  const { latitude, longitude } = location.location;
  const formattedCoords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(formattedCoords);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(location.formattedAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="space-y-3.5">
      {/* Card Container */}
      <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/70 shadow-sm space-y-3.5">
        {/* Header & Badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-400">
              <MapPin className="w-3.5 h-3.5" />
              Active Geocoded Target
            </div>
            <h3
              className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2 hover:text-sky-300 transition-colors cursor-pointer"
              onClick={handleCopyAddress}
              title="Click to copy formatted address"
            >
              {location.formattedAddress}
            </h3>
          </div>

          {location.granularity && (
            <span className="shrink-0 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-700/80 border border-slate-600 text-slate-300">
              {location.granularity}
            </span>
          )}
        </div>

        {/* Coordinates Box */}
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Latitude / Longitude
            </div>
            <div className="font-mono text-xs font-semibold text-emerald-400">
              {formattedCoords}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyCoords}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Copy coordinates"
            >
              {copiedCoords ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onFocusLocation}
              className="p-1.5 text-sky-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors"
              title="Pan map to coordinates"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Address Components Chips */}
        {location.addressComponents && location.addressComponents.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Hierarchy Breakdown
            </div>
            <div className="flex flex-wrap gap-1.5">
              {location.addressComponents.map((comp, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300"
                >
                  <span className="font-medium text-slate-200">{comp.longText}</span>
                  {comp.types?.[0] && (
                    <span className="text-[9px] text-slate-500 font-mono">
                      ({comp.types[0].replace(/_/g, ' ')})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Viewport Boundary Preview */}
        {location.viewport && (
          <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Bounds Viewport:</span>
            </div>
            <span className="text-slate-300">
              SW {location.viewport.low.latitude.toFixed(2)}, {location.viewport.low.longitude.toFixed(2)} → NE {location.viewport.high.latitude.toFixed(2)}, {location.viewport.high.longitude.toFixed(2)}
            </span>
          </div>
        )}

        {/* Quick Zoom Actions */}
        <div className="pt-2 border-t border-slate-700/50 grid grid-cols-3 gap-2">
          <button
            onClick={onFocusLocation}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            Recenter
          </button>
          <button
            onClick={() => onZoomLevel(16)}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
            Street (16)
          </button>
          <button
            onClick={() => onZoomLevel(12)}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5 text-amber-400" />
            Metro (12)
          </button>
        </div>

        {/* Raw JSON Toggle */}
        <div className="pt-1">
          <button
            onClick={() => setShowRawJson(!showRawJson)}
            className="flex items-center justify-between w-full text-[11px] font-mono text-slate-400 hover:text-slate-300 py-1 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-slate-500" />
              {showRawJson ? 'Hide Raw Geocoding V4 Payload' : 'View Raw Geocoding V4 Payload'}
            </span>
            {showRawJson ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showRawJson && (
            <pre className="mt-2 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-300 overflow-x-auto max-h-48 leading-snug">
              {JSON.stringify(location, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
