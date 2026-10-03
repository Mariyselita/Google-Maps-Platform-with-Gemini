import React from 'react';
import { AlertCircle, CheckCircle2, Copy, ExternalLink, HelpCircle, RefreshCw, Terminal, X } from 'lucide-react';
import { GeocodeErrorDetails } from '../types';

interface TroubleshootingModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: GeocodeErrorDetails | null;
  onRetry?: () => void;
}

export const TroubleshootingModal: React.FC<TroubleshootingModalProps> = ({
  isOpen,
  onClose,
  error,
  onRetry,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !error) return null;

  const handleCopyDiagnostics = () => {
    const payload = JSON.stringify(
      {
        title: error.title,
        message: error.message,
        statusCode: error.statusCode,
        requestUrl: error.requestUrl,
        timestamp: error.timestamp,
        tips: error.troubleshootingTips,
        rawPayload: error.rawPayload,
      },
      null,
      2
    );
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                API Diagnostics & Troubleshooting
                {error.statusCode && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-rose-950/70 border border-rose-800 text-rose-300">
                    HTTP {error.statusCode}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">Google Geocoding V4 REST Endpoint Inspector</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Close diagnostics"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
          {/* Main Error Callout */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-200 space-y-1">
            <div className="font-medium text-rose-300">{error.title}</div>
            <div className="text-xs text-rose-200/90 leading-relaxed">{error.message}</div>
          </div>

          {/* Actionable Remedies Checklist */}
          {error.troubleshootingTips && error.troubleshootingTips.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <HelpCircle className="w-4 h-4 text-sky-400" />
                Recommended Troubleshooting Actions
              </div>
              <ul className="grid gap-2 text-xs text-slate-300">
                {error.troubleshootingTips.map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Request Technical Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <Terminal className="w-4 h-4 text-amber-400" />
                Request Metadata
              </div>
              <span className="text-[11px] font-mono text-slate-500">Logged at {error.timestamp}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-2 text-slate-300 overflow-x-auto">
              <div>
                <span className="text-slate-500">Method: </span>
                <span className="text-emerald-400 font-semibold">GET</span>
              </div>
              <div>
                <span className="text-slate-500">Endpoint: </span>
                <span className="text-sky-300 break-all">{error.requestUrl || 'https://geocode.googleapis.com/v4/geocode/address/...'}</span>
              </div>
              <div>
                <span className="text-slate-500">Header: </span>
                <span className="text-amber-300">X-Goog-Maps-Solution-ID: gmp_mcp_codeassist_v1_aistudio</span>
              </div>
            </div>
          </div>

          {/* Raw API Response (if available) */}
          {error.rawPayload !== undefined && (
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Raw Response Payload
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48 leading-snug">
                {JSON.stringify(error.rawPayload, null, 2)}
              </pre>
            </div>
          )}

          {/* External Docs Link */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Google Maps Geocoding v4 Docs</span>
            <a
              href="https://developers.google.com/maps/documentation/geocoding?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors"
            >
              Official Documentation
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/90">
          <button
            onClick={handleCopyDiagnostics}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Copied JSON
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Diagnostics
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {onRetry && (
              <button
                onClick={() => {
                  onClose();
                  onRetry();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Request
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
