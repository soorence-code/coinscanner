import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  TrendingUp,
  TrendingDown,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { TokenCandidate, PriceAlert } from '../types';
import {
  requestPushPermission,
  sendPushNotification,
  addPriceAlert,
} from '../services/notificationService';

interface SetPriceAlertModalProps {
  candidate: TokenCandidate;
  existingAlert?: PriceAlert;
  isOpen: boolean;
  onClose: () => void;
  onAlertSaved: (alert: PriceAlert) => void;
}

export const SetPriceAlertModal: React.FC<SetPriceAlertModalProps> = ({
  candidate,
  existingAlert,
  isOpen,
  onClose,
  onAlertSaved,
}) => {
  const currentPrice = candidate.currentPriceUsd || 0.42;
  const [condition, setCondition] = useState<'RISE_ABOVE' | 'DROP_BELOW'>(
    existingAlert ? existingAlert.condition : 'RISE_ABOVE'
  );
  const [targetPrice, setTargetPrice] = useState<number>(
    existingAlert ? existingAlert.thresholdPrice : Number((currentPrice * 1.25).toFixed(4))
  );
  const [permissionStatus, setPermissionStatus] = useState<string>('default');
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestPushPermission();
    setPermissionStatus(res);
  };

  const handleTestAlert = () => {
    sendPushNotification(
      `🚨 TEST ALERT: ${candidate.ticker}`,
      `TokenRadar test alert fired! Notifications are configured and active for ${candidate.name}.`,
      candidate.ticker
    );
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 3000);
  };

  const handleApplyPreset = (percent: number) => {
    const newPrice = Number((currentPrice * (1 + percent / 100)).toFixed(4));
    setTargetPrice(newPrice);
    if (percent >= 0) {
      setCondition('RISE_ABOVE');
    } else {
      setCondition('DROP_BELOW');
    }
  };

  const handleSave = () => {
    const now = new Date();
    const watFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Lagos',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const newAlert: PriceAlert = {
      id: existingAlert?.id || `alert-${candidate.id}-${Date.now()}`,
      candidateId: candidate.id,
      tokenName: candidate.name,
      ticker: candidate.ticker,
      condition,
      thresholdPrice: Number(targetPrice),
      initialPrice: currentPrice,
      createdAt: now.toISOString(),
      createdAtWAT: watFormatter.format(now) + ' WAT',
      status: 'ACTIVE',
    };

    addPriceAlert(newAlert);
    onAlertSaved(newAlert);
    onClose();
  };

  // Calculate simulated return on $10
  const priceChangePercent = ((targetPrice - currentPrice) / currentPrice) * 100;
  const simulatedPositionUsd = 10 * (targetPrice / currentPrice);
  const simulatedPnlUsd = simulatedPositionUsd - 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#101726] border border-slate-700/80 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 py-3 bg-[#0d1322] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Set Price Alert:</span>
                <span className="text-cyan-400 font-mono">${candidate.ticker}</span>
              </h3>
              <p className="text-[10px] text-slate-400">{candidate.name}</p>
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
        <div className="p-4 space-y-3.5 text-xs">
          {/* Current Reference Price */}
          <div className="p-2.5 bg-[#0b0f19] border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">
                Current Reference Price:
              </span>
              <span className="text-sm font-mono font-bold text-white">
                ${currentPrice >= 0.01 ? currentPrice.toFixed(4) : currentPrice.toFixed(6)} USD
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {candidate.network} Pool
            </span>
          </div>

          {/* Trigger Condition Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
              Trigger Condition:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCondition('RISE_ABOVE')}
                className={`py-2 px-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  condition === 'RISE_ABOVE'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-[#0b0f19] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-[11px] block text-white">Rises Above</span>
                  <span className="text-[9px] text-slate-400">Target pump (≥)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCondition('DROP_BELOW')}
                className={`py-2 px-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  condition === 'DROP_BELOW'
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-sm'
                    : 'bg-[#0b0f19] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <TrendingDown className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <span className="font-bold text-[11px] block text-white">Drops Below</span>
                  <span className="text-[9px] text-slate-400">Stop dip (≤)</span>
                </div>
              </button>
            </div>
          </div>

          {/* Target Price Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-300">
                Target Threshold ($ USD):
              </label>
              <span
                className={`text-[10px] font-mono font-bold ${
                  priceChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {priceChangePercent >= 0 ? `+${priceChangePercent.toFixed(1)}%` : `${priceChangePercent.toFixed(1)}%`}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">$</span>
              <input
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="w-full bg-[#0b0f19] border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Quick Presets:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
              <button
                type="button"
                onClick={() => handleApplyPreset(10)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono whitespace-nowrap"
              >
                +10%
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(25)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono whitespace-nowrap"
              >
                +25%
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(50)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono whitespace-nowrap"
              >
                +50%
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(100)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono whitespace-nowrap"
              >
                +100% (2x)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(-15)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 font-mono whitespace-nowrap"
              >
                -15%
              </button>
            </div>
          </div>

          {/* $10 Position Simulation */}
          <div className="p-2.5 bg-[#080c14] border border-slate-800/80 rounded-xl text-[11px]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>$10 Capital at Target:</span>
              <span className="font-mono font-bold text-white">
                ${simulatedPositionUsd.toFixed(2)} USD
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Net Estimated PnL:</span>
              <span
                className={`font-mono font-bold ${
                  simulatedPnlUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {simulatedPnlUsd >= 0
                  ? `+$${simulatedPnlUsd.toFixed(2)}`
                  : `-$${Math.abs(simulatedPnlUsd).toFixed(2)}`}
              </span>
            </div>
          </div>

          {/* Push Notification Permission & Testing */}
          <div className="p-2.5 bg-cyan-950/30 border border-cyan-800/40 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 flex items-center gap-1 font-medium">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Push Notification &amp; Chime:</span>
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  permissionStatus === 'granted'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}
              >
                {permissionStatus}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {permissionStatus !== 'granted' && (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="flex-1 py-1 px-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[10px] transition-colors"
                >
                  Enable Browser Push
                </button>
              )}

              <button
                type="button"
                onClick={handleTestAlert}
                className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[10px] border border-slate-700 transition-colors flex items-center justify-center gap-1"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>{testNotificationSent ? 'Sent!' : 'Test Push Sound'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#0d1322] border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/30 flex items-center gap-1"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Set Price Alert</span>
          </button>
        </div>
      </div>
    </div>
  );
};
