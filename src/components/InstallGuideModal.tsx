import React, { useState } from 'react';
import {
  Download,
  X,
  Smartphone,
  QrCode,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Share2,
} from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
  deferredPrompt?: any;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  appUrl,
  deferredPrompt,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        onClose();
      }
    }
  };

  // QR Code URL using quickchart QR API for instant scanning
  const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(
    appUrl
  )}&size=200&dark=00e5ff&light=0a0e17`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#101726] border border-cyan-500/40 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 py-3 bg-[#0d1322] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white shadow-sm">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Install on Android Phone</h3>
              <p className="text-[10px] text-slate-400">PWA Native Standalone App</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3.5 text-xs">
          {/* Quick 1-Tap PWA Install Button if browser supports it */}
          {deferredPrompt && (
            <button
              onClick={handleNativeInstall}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Tap to Install on this Device</span>
            </button>
          )}

          {/* QR Code to scan with phone camera */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-3 flex flex-col items-center text-center">
            <span className="text-[11px] font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scan with your Android Camera:</span>
            </span>
            <div className="p-2 bg-[#0a0e17] rounded-xl border border-slate-800 shadow-inner">
              <img
                src={qrCodeUrl}
                alt="Scan to open on phone"
                className="w-36 h-36 rounded-lg object-contain"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-2">
              Opens the app instantly in Chrome on your phone
            </span>
          </div>

          {/* Direct Shareable Link */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-medium">Or open this link on your phone:</span>
            <div className="flex items-center gap-1.5 bg-[#080c14] border border-slate-800 rounded-xl px-2.5 py-1.5">
              <span className="text-[11px] font-mono text-cyan-300 truncate flex-1">
                {appUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Copy link"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* 3 Step Android Chrome Instructions */}
          <div className="bg-[#080c14] border border-slate-800/80 rounded-xl p-3 space-y-2">
            <span className="font-bold text-white text-[11px] block">
              3 Steps to Install on Android:
            </span>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Open the link in <strong>Google Chrome</strong> on your phone.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Tap the <strong>three dots (⋮)</strong> menu at the top-right of Chrome.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                </span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>It will install as a native icon with full-screen view &amp; push alerts!</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#0d1322] border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
