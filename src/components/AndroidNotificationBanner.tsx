import React from 'react';
import { Bell, X, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { PriceAlert } from '../types';

interface AndroidNotificationBannerProps {
  alert: PriceAlert | null;
  onDismiss: () => void;
  onViewCandidate?: (candidateId: string) => void;
}

export const AndroidNotificationBanner: React.FC<AndroidNotificationBannerProps> = ({
  alert,
  onDismiss,
  onViewCandidate,
}) => {
  if (!alert) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-full max-w-[390px] px-3 animate-in slide-in-from-top duration-300">
      <div className="bg-[#10192d] border border-cyan-500/60 rounded-2xl p-3.5 shadow-2xl shadow-cyan-950/80 backdrop-blur-md">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
                <span>TokenRadar Push Alert</span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-400 font-mono">{alert.triggeredAt || 'NOW WAT'}</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-0.5">
                {alert.tokenName} (${alert.ticker})
              </h4>
              <p className="text-xs text-emerald-400 font-mono font-semibold mt-0.5 flex items-center gap-1">
                {alert.condition === 'RISE_ABOVE' ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>
                  Threshold Met: ${alert.thresholdPrice.toFixed(4)} USD (Current: ${alert.triggeredPrice?.toFixed(4) || alert.thresholdPrice.toFixed(4)})
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">
            Observation Plan: Check DEX spreads before CEX open
          </span>
          <button
            onClick={() => {
              if (onViewCandidate) onViewCandidate(alert.candidateId);
              onDismiss();
            }}
            className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[10px] transition-colors"
          >
            Inspect Token
          </button>
        </div>
      </div>
    </div>
  );
};
