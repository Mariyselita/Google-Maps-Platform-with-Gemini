import React from 'react';
import { Compass, MapPin, Sparkles } from 'lucide-react';
import { PRESET_LOCATIONS } from '../data/presets';
import { PresetLocation } from '../types';

interface PresetButtonsProps {
  activePresetId: string | null;
  onSelectPreset: (preset: PresetLocation) => void;
  isLoading: boolean;
}

export const PresetButtons: React.FC<PresetButtonsProps> = ({
  activePresetId,
  onSelectPreset,
  isLoading,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Featured Presets
        </label>
        <span className="text-[11px] text-slate-500 font-mono">5 Curated Cities</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-2">
        {PRESET_LOCATIONS.map((preset) => {
          const isSelected = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              disabled={isLoading}
              className={`group relative text-left p-3 rounded-xl border transition-all duration-150 flex items-center justify-between ${
                isSelected
                  ? 'bg-sky-500/10 border-sky-500/50 text-sky-100 shadow-sm shadow-sky-500/10 ring-1 ring-sky-500/30'
                  : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60 hover:border-slate-600 text-slate-200'
              } ${isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl shrink-0 select-none" role="img" aria-label={preset.country}>
                  {preset.flag}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate group-hover:text-sky-300 transition-colors">
                      {preset.name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        isSelected
                          ? 'bg-sky-400/20 text-sky-300'
                          : 'bg-slate-700/60 text-slate-400'
                      }`}
                    >
                      {preset.country}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-[240px] xl:max-w-[280px]">
                    {preset.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                  }`}
                >
                  {isSelected ? (
                    <MapPin className="w-3.5 h-3.5" />
                  ) : (
                    <Compass className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
