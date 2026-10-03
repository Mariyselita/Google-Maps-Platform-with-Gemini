import React, { useState } from 'react';
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Compass,
  Loader2,
  RefreshCw,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';

interface LocalInsightsBannerProps {
  locationName: string;
  insightsHtml: string | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onClose?: () => void;
  onStartQuiz?: () => void;
}

export const LocalInsightsBanner: React.FC<LocalInsightsBannerProps> = ({
  locationName,
  insightsHtml,
  isLoading,
  error,
  onRefresh,
  onClose,
  onStartQuiz,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // If no location has been targeted yet, don't show the banner
  if (!locationName && !isLoading && !insightsHtml && !error) {
    return null;
  }

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-2rem)] sm:w-[92%] max-w-2xl select-none transition-all duration-300">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10">
        {/* Banner Top Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-sky-500/20">
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <h3 className="text-xs font-bold tracking-tight text-white uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                Local Insights
              </h3>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="text-xs font-medium text-sky-300 truncate bg-sky-950/60 border border-sky-800/50 px-2 py-0.5 rounded-full">
                {locationName || 'Current Location'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Subtle Loading Spinner Indicator in Header */}
            {isLoading && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-sky-500/10 text-sky-400 text-[11px] font-medium border border-sky-500/20 mr-1 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="hidden md:inline">AI thinking...</span>
              </div>
            )}

            {!isLoading && (
              <button
                onClick={onRefresh}
                className="p-1.5 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors"
                title="Regenerate fun facts"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title={isCollapsed ? 'Expand insights' : 'Collapse insights'}
            >
              {isCollapsed ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Content Area */}
        {!isCollapsed && (
          <div className="p-4 sm:p-5 max-h-[40vh] sm:max-h-[30vh] overflow-y-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="py-3 flex flex-col items-center justify-center space-y-3 text-center">
                <div className="flex items-center gap-2 text-sky-400 font-medium text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                  <span>Gathering unusual & engaging fun facts with Gemini AI...</span>
                </div>
                <div className="w-full space-y-2 max-w-md opacity-60">
                  <div className="h-2.5 bg-slate-800 rounded-full animate-pulse" />
                  <div className="h-2.5 bg-slate-800 rounded-full animate-pulse w-5/6 mx-auto" />
                  <div className="h-2.5 bg-slate-800 rounded-full animate-pulse w-4/6 mx-auto" />
                </div>
              </div>
            )}

            {/* Error Notification State */}
            {!isLoading && error && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start gap-3 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="font-semibold text-rose-300">
                    AI Tour Guide Temporarily Unavailable
                  </div>
                  <p className="text-rose-200/90 leading-relaxed text-[11px]">{error}</p>
                </div>
                <button
                  onClick={onRefresh}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg border border-rose-700/60 transition-colors shrink-0"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Injected HTML List (Fun Facts) */}
            {!isLoading && !error && insightsHtml && (
              <>
                <div
                  className="insights-html-content text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2 select-text font-normal"
                  dangerouslySetInnerHTML={{ __html: insightsHtml }}
                />

                {onStartQuiz && (
                  <div className="pt-3.5 mt-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-400 text-center sm:text-left">
                      Think you know <span className="text-sky-300 font-medium">{locationName}</span>? Challenge yourself with 3 trivia questions.
                    </div>
                    <button
                      onClick={onStartQuiz}
                      className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-150 transform hover:scale-[1.02] cursor-pointer"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      Test your local knowledge
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
