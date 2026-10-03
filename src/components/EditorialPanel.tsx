import React from 'react';
import {
  AlertTriangle,
  Compass,
  History,
  Layers,
  Loader2,
  MapPin,
  RotateCcw,
  Search,
  Sliders,
  Wrench,
  X,
} from 'lucide-react';
import { GeocodeErrorDetails, GeocodeV4Result, PresetLocation } from '../types';
import { LocationDetails } from './LocationDetails';
import { PresetButtons } from './PresetButtons';

interface EditorialPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSubmitSearch: (e?: React.FormEvent) => void;
  isLoading: boolean;
  selectedLocation: GeocodeV4Result | null;
  activePresetId: string | null;
  onSelectPreset: (preset: PresetLocation) => void;
  error: GeocodeErrorDetails | null;
  onClearError: () => void;
  onOpenTroubleshooting: () => void;
  recentSearches: string[];
  onSelectRecentSearch: (query: string) => void;
  onClearRecentSearches: () => void;
  onFocusLocation: () => void;
  onZoomLevel: (zoom: number) => void;
}

export const EditorialPanel: React.FC<EditorialPanelProps> = ({
  searchQuery,
  setSearchQuery,
  onSubmitSearch,
  isLoading,
  selectedLocation,
  activePresetId,
  onSelectPreset,
  error,
  onClearError,
  onOpenTroubleshooting,
  recentSearches,
  onSelectRecentSearch,
  onClearRecentSearches,
  onFocusLocation,
  onZoomLevel,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800/80 text-slate-100 overflow-hidden select-none">
      {/* Top Branding Header */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Block Explorer
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                Geospatial Cartography & Urban Blocks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenTroubleshooting}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                error
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30 animate-pulse'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="API Diagnostics & Troubleshooting"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-medium">Diagnostics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Search Bar */}
        <div className="space-y-2">
          <label
            htmlFor="location-search"
            className="text-xs font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-sky-400" />
            Geocoding V4 Search
          </label>

          <form onSubmit={onSubmitSearch} className="relative flex items-center">
            <div className="relative w-full">
              <input
                id="location-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, district, or neighborhood..."
                disabled={isLoading}
                className="w-full pl-9 pr-20 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-inner"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 top-2.5 p-1 text-slate-400 hover:text-slate-200 rounded-md transition-colors"
                  title="Clear input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-semibold text-xs rounded-lg transition-all flex items-center justify-center shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
              ) : (
                'Find'
              )}
            </button>
          </form>

          {/* Recent Searches (if any) */}
          {recentSearches.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <History className="w-3 h-3" />
                  Recent Queries
                </span>
                <button
                  onClick={onClearRecentSearches}
                  className="hover:text-slate-400 transition-colors text-[10px]"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.slice(0, 4).map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectRecentSearch(query)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-sky-300 transition-colors flex items-center gap-1"
                  >
                    <span>{query}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Prominent Error Banner / Troubleshoot Mechanism */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error.title}</span>
              </div>
              <button
                onClick={onClearError}
                className="text-rose-400 hover:text-rose-200 p-0.5 rounded hover:bg-rose-900/50 transition-colors"
                title="Dismiss error"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-rose-200/90 leading-relaxed">{error.message}</p>

            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                onClick={onOpenTroubleshooting}
                className="inline-flex items-center gap-1.5 font-semibold text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                Open Troubleshooting Guide
              </button>
              {error.statusCode && (
                <span className="font-mono text-[10px] text-rose-400">
                  HTTP {error.statusCode}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 5 Preset Buttons Section */}
        <PresetButtons
          activePresetId={activePresetId}
          onSelectPreset={onSelectPreset}
          isLoading={isLoading}
        />

        {/* Geocoded Location Information Card */}
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Cartographic Output
          </label>
          <LocationDetails
            location={selectedLocation}
            onFocusLocation={onFocusLocation}
            onZoomLevel={onZoomLevel}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Google Geocoding v4 REST</span>
        </div>
        <span className="font-mono text-slate-500">Block Explorer v1.0</span>
      </div>
    </div>
  );
};
