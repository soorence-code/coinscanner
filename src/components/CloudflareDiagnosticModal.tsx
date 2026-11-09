import React from 'react';
import { Cloud, AlertTriangle, Key, ExternalLink, X, CheckCircle2, RefreshCw } from 'lucide-react';

interface CloudflareDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage?: string;
  onRunFallbackScan: () => void;
}

export const CloudflareDiagnosticModal: React.FC<CloudflareDiagnosticModalProps> = ({
  isOpen,
  onClose,
  errorMessage,
  onRunFallbackScan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#101726] border border-amber-500/50 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 py-3 bg-[#0d1322] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-sm">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Cloudflare Deployment Notice</h3>
              <p className="text-[10px] text-amber-300">Why scanning stopped &amp; how to fix it</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3.5 text-xs text-slate-300">
          <div className="p-3 bg-amber-950/30 border border-amber-800/60 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Why It Stopped Scanning on Cloudflare:</span>
            </div>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              Cloudflare Pages hosts static frontend files by default and does <strong>not</strong> run a Node.js Express server (`server.ts`). When you tap &quot;Run Scan&quot;, calls to `/api/scan` fail because the server backend isn&apos;t running or your `GEMINI_API_KEY` isn&apos;t configured in Cloudflare.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-white block text-[11px]">
              How to Fix It on Cloudflare in 2 Steps:
            </span>

            {/* Step 1 */}
            <div className="p-2.5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-cyan-300 text-[11px]">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. Add GEMINI_API_KEY to Cloudflare Pages</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                Go to <strong>Cloudflare Dashboard &gt; Workers &amp; Pages &gt; Your Project &gt; Settings &gt; Environment variables</strong>. Click <strong>Add variable</strong>, name it <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">GEMINI_API_KEY</code>, paste your Gemini API Key, and save.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-2.5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-300 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. Push the newly added /functions directory</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                We have just added a Cloudflare Pages Functions handler (<code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">/functions/api/[[route]].ts</code>) to your project. Push this commit to your GitHub repository and Cloudflare will automatically deploy the API functions!
              </p>
            </div>
          </div>

          {/* Fallback Option */}
          <div className="p-2.5 bg-[#080c14] border border-slate-800/80 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-200 block text-[11px]">
                Run Instant Intelligence Scan
              </span>
              <span className="text-[10px] text-slate-400">
                Refresh upcoming launch candidates &amp; Nigerian WAT clock now
              </span>
            </div>
            <button
              onClick={() => {
                onRunFallbackScan();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 flex items-center gap-1 shrink-0 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Scan Now</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#0d1322] border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
