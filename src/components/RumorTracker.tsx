import React from 'react';
import { ShieldAlert, AlertTriangle, ExternalLink, ShieldCheck, XCircle } from 'lucide-react';
import { RejectedRumor } from '../types';

interface RumorTrackerProps {
  rejectedRumors: RejectedRumor[];
}

export const RumorTracker: React.FC<RumorTrackerProps> = ({ rejectedRumors }) => {
  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h2 className="text-base font-bold text-white">
            Unconfirmed Rumors &amp; Blacklist Filter
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The strict research engine continuously cross-references social chatter against official exchange newsrooms (Binance, Bybit, KuCoin, OKX, Gate.io). Unconfirmed listing claims are explicitly excluded from actionable status to protect your capital.
        </p>
      </div>

      {/* Safety Protocol Callout */}
      <div className="bg-amber-950/25 border border-amber-800/60 rounded-xl p-3.5 text-xs text-amber-200">
        <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-300">
          <AlertTriangle className="w-4 h-4" />
          <span>Why Rumors Are Disqualified:</span>
        </div>
        <p className="leading-relaxed text-amber-200/90 text-[11px]">
          Fake listing announcements and doctored screenshots are common tactics used by predatory developers to lure buyers into decentralized pools before pulling liquidity or dumping unlocked tokens.
        </p>
      </div>

      {/* List of Rejected Rumors */}
      <div className="space-y-3">
        {rejectedRumors.length === 0 ? (
          <div className="bg-[#101726] border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
            No active blacklisted rumors recorded in today&apos;s scan.
          </div>
        ) : (
          rejectedRumors.map((rumor, idx) => (
            <div
              key={idx}
              className="bg-[#101726] border border-rose-900/40 rounded-xl p-3.5 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="text-sm font-bold text-white">{rumor.name}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                  REJECTED RUMOR
                </span>
              </div>

              <div className="bg-[#0b0f19] border border-slate-800/80 rounded-lg p-2.5 text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Unverified Claim:
                </span>
                <span className="text-slate-200 font-medium">{rumor.claim}</span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed bg-rose-950/20 border border-rose-900/30 rounded-lg p-2.5">
                <span className="text-rose-400 font-semibold block text-[10px] uppercase">
                  Audit Rejection Reason:
                </span>
                <span className="text-rose-200/90">{rumor.reason}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Verification Sources */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-3.5 text-xs text-slate-400">
        <span className="font-semibold text-slate-200 block mb-1.5 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Authoritative Sources Required for Listing Confirmation:
        </span>
        <ul className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Binance Newsroom &amp; Support Portal
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            KuCoin Official Announcement Hub
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Bybit Listing Announcements
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Gate.io Listing Schedule
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            OKX Official Announcements
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            BaseScan / Etherscan Verified Contracts
          </li>
        </ul>
      </div>
    </div>
  );
};
