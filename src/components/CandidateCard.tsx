import React, { useState } from 'react';
import { TokenCandidate, PriceAlert } from '../types';
import {
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Wallet,
  Clock,
  Flame,
  ArrowUpRight,
  Droplets,
  DollarSign,
  TrendingUp,
  Info,
  Bell,
  BellRing,
  Zap,
  Trash2,
} from 'lucide-react';
import { SetPriceAlertModal } from './SetPriceAlertModal';

interface CandidateCardProps {
  candidate: TokenCandidate;
  activeAlert?: PriceAlert;
  onAlertSaved?: (alert: PriceAlert) => void;
  onAlertRemoved?: (alertId: string) => void;
  onSimulatePriceHit?: (alert: PriceAlert) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  activeAlert,
  onAlertSaved,
  onAlertRemoved,
  onSimulatePriceHit,
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const currentPrice = candidate.currentPriceUsd || 0.42;

  const copyContract = () => {
    if (candidate.contractAddress && candidate.contractAddress !== 'TBA / Unannounced') {
      navigator.clipboard.writeText(candidate.contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = () => {
    switch (candidate.actionableStatus) {
      case 'ACTIONABLE_WATCH':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Actionable Watch ($10 Viable)
          </span>
        );
      case 'OBSERVE_ONLY':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            Observe Only (Gas/Risk Barrier)
          </span>
        );
      case 'REJECTED_NO_TRADE':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Rejected / High Risk
          </span>
        );
    }
  };

  const getRiskColor = (rating: string) => {
    if (rating === 'LOW') return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
    if (rating === 'MEDIUM') return 'text-amber-400 bg-amber-950/60 border-amber-800';
    return 'text-rose-400 bg-rose-950/60 border-rose-800';
  };

  const feasibility = candidate.tradeFeasibility10Usd;

  const getNetworkBadge = (net: string) => {
    const n = (net || '').toLowerCase();
    if (n.includes('solana') || n.includes('sol')) {
      return (
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gradient-to-r from-purple-900/90 to-emerald-950 text-emerald-300 border border-purple-500/50 flex items-center gap-1 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Solana
        </span>
      );
    }
    if (n.includes('bnb') || n.includes('bsc') || n.includes('binance')) {
      return (
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/50 flex items-center gap-1 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          BNB Chain (Finance)
        </span>
      );
    }
    return (
      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
        {net}
      </span>
    );
  };

  return (
    <div className="bg-[#101726] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-200 shadow-lg shadow-black/20">
      {/* Header: Name, Ticker, Network & Status */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-white tracking-tight">
              {candidate.name}
            </h3>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
              ${candidate.ticker}
            </span>
            {getNetworkBadge(candidate.network)}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span>Venue:</span>
            <span className="text-slate-200 font-medium">{candidate.listingVenue}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{candidate.listingType}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {getStatusBadge()}
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getRiskColor(
              candidate.riskRating
            )}`}
          >
            Risk: {candidate.riskRating}
          </span>
        </div>
      </div>

      {/* Real-Time Price Reference & Push Alert Button */}
      <div className="flex items-center justify-between p-2.5 bg-[#080c14] border border-slate-800/90 rounded-xl mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Observed DEX Price:
            </span>
            <span className="text-sm font-mono font-bold text-white">
              ${currentPrice >= 0.01 ? currentPrice.toFixed(4) : currentPrice.toFixed(6)} USD
            </span>
          </div>
        </div>

        {/* Price Alert Action */}
        <div className="flex items-center gap-1.5">
          {activeAlert ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsAlertModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-700/80 hover:bg-cyan-900/60 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
                title="Edit active price alert threshold"
              >
                <BellRing className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                <span>
                  {activeAlert.condition === 'RISE_ABOVE' ? '≥' : '≤'} $
                  {activeAlert.thresholdPrice.toFixed(4)}
                </span>
              </button>

              {onSimulatePriceHit && (
                <button
                  onClick={() => onSimulatePriceHit(activeAlert)}
                  className="p-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800/80 transition-colors"
                  title="Simulate price threshold hit & trigger push alert now"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </button>
              )}

              {onAlertRemoved && (
                <button
                  onClick={() => onAlertRemoved(activeAlert.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                  title="Delete price alert"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-700 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm"
            >
              <Bell className="w-3.5 h-3.5 text-cyan-400" />
              <span>Set Alert</span>
            </button>
          )}
        </div>
      </div>

      {/* Listing Time & Nigerian WAT Highlight */}
      <div className="bg-[#0b0f19] border border-slate-800/90 rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Official Listing (WAT / Nigeria):
          </span>
          <span className="text-[11px] text-cyan-400 font-mono">
            {candidate.timeRemainingMinutes > 0
              ? `~${Math.floor(candidate.timeRemainingMinutes / 60)}h ${
                  candidate.timeRemainingMinutes % 60
                }m left`
              : 'Listing active / past'}
          </span>
        </div>
        <div className="text-sm font-bold text-amber-300 font-mono">
          {candidate.listingDateWAT}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          UTC: {new Date(candidate.listingDateUTC).toUTCString()}
        </div>
      </div>

      {/* Official Verified Contract */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400">Official Contract Address:</span>
          <span className="text-[10px] text-emerald-400 font-medium">
            Source: {candidate.contractVerifiedSource}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-[#080c14] border border-slate-800/80 rounded-lg px-2.5 py-1.5">
          <code className="text-xs font-mono text-slate-300 truncate flex-1">
            {candidate.contractAddress}
          </code>
          {candidate.contractAddress && candidate.contractAddress.startsWith('0x') && (
            <button
              onClick={copyContract}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Copy verified contract address"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Wallet Compatibility & Pre-listing Window */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="bg-[#0b0f19] border border-slate-800/70 rounded-xl p-2.5">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Wallet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Wallet Access</span>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                candidate.walletCompatibility.trustWallet
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Trust Wallet: {candidate.walletCompatibility.trustWallet ? 'Yes' : 'No'}
            </span>
            <span
              className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                candidate.walletCompatibility.metaMask
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              MetaMask: {candidate.walletCompatibility.metaMask ? 'Yes' : 'No'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            {candidate.walletCompatibility.earliestAccessWindow}
          </p>
        </div>

        <div className="bg-[#0b0f19] border border-slate-800/70 rounded-xl p-2.5">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>DEX Pool Status</span>
          </div>
          <div className="text-xs font-semibold text-slate-200">
            {candidate.dexPool.exists ? 'Pool Active & Tradable' : 'No DEX Pool Yet'}
          </div>
          <div className="text-[11px] text-cyan-300 font-mono mt-0.5">
            Liquidity: ${candidate.dexPool.liquidityUsd?.toLocaleString() || 'N/A'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Taxes: Buy {candidate.tokenomics.buyTaxPercent}% / Sell {candidate.tokenomics.sellTaxPercent}%
          </div>
        </div>
      </div>

      {/* $10 Position Feasibility Breakdown */}
      <div
        className={`rounded-xl p-3 mb-3 border ${
          feasibility.viable
            ? 'bg-emerald-950/20 border-emerald-800/50'
            : 'bg-rose-950/20 border-rose-800/50'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>$10 Position Economic Test</span>
          </div>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded ${
              feasibility.viable
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {feasibility.verdict.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center my-2 py-1.5 bg-[#0b0f19]/80 rounded-lg border border-slate-800/60">
          <div>
            <span className="text-[10px] text-slate-500 block">Roundtrip Gas</span>
            <span className="text-xs font-mono font-semibold text-slate-200">
              ${feasibility.estimatedGasCostUsd.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Slippage</span>
            <span className="text-xs font-mono font-semibold text-amber-300">
              {feasibility.estimatedSlippagePercent}%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Net Capital</span>
            <span
              className={`text-xs font-mono font-bold ${
                feasibility.netCapitalRemainingUsd > 7
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              ${feasibility.netCapitalRemainingUsd.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Break-Even</span>
            <span className="text-xs font-mono font-semibold text-cyan-300">
              +{feasibility.breakEvenGainPercent}%
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed">
          {feasibility.rationale}
        </p>
      </div>

      {/* Social Engagement Quality Audit */}
      <div className="bg-[#0b0f19] border border-slate-800/70 rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Social Quality Audit (Observable Evidence Only)
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
              candidate.socialAssessment.sentiment.includes('Organic')
                ? 'bg-emerald-950 text-emerald-300'
                : 'bg-rose-950 text-rose-300'
            }`}
          >
            {candidate.socialAssessment.sentiment}
          </span>
        </div>
        <p className="text-xs text-slate-300 mb-1 leading-snug">
          {candidate.socialAssessment.observableEvidence}
        </p>
        <p className="text-[11px] text-slate-400 italic">
          Organic vs Hype: {candidate.socialAssessment.hypeVsOrganicNote}
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          * Strictly audited from public channels. No private Telegram/Discord access claimed.
        </p>
      </div>

      {/* Cautious Entry/Exit Observation Strategy Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2 px-3 text-xs font-medium text-slate-300 hover:text-white bg-[#0b0f19] hover:bg-slate-800/80 rounded-xl border border-slate-800 flex items-center justify-between transition-colors"
      >
        <span className="flex items-center gap-1.5 text-cyan-400">
          <TrendingUp className="w-3.5 h-3.5" />
          Observation Strategy (1h Pre-Entry & 3-5m Post-Exit)
        </span>
        <span className="text-slate-400 text-[11px]">
          {expanded ? 'Hide Details' : 'View Execution Steps'}
        </span>
      </button>

      {expanded && (
        <div className="mt-2 p-3 bg-[#080c14] border border-slate-800 rounded-xl text-xs space-y-2.5 animate-in fade-in">
          <div>
            <div className="font-semibold text-cyan-300 mb-1">Timeline Strategy:</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Earliest Entry Window:</span>
                <span className="font-medium text-slate-200">
                  {candidate.strategyPlan.entryWindow}
                </span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Target Exit Window:</span>
                <span className="font-medium text-slate-200">
                  {candidate.strategyPlan.exitWindow}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="font-semibold text-slate-200 mb-1">Observation Checklist:</div>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              {candidate.strategyPlan.cautiousObservationSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-mono">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-2.5 bg-rose-950/30 border border-rose-900/50 rounded-lg">
            <div className="flex items-center gap-1 text-rose-300 font-semibold text-[11px] mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Mandatory Risk Warning (No Guaranteed Profits)</span>
            </div>
            <ul className="space-y-0.5 text-[10px] text-rose-200/80">
              {candidate.strategyPlan.riskWarnings.map((warn, idx) => (
                <li key={idx}>- {warn}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Sources & Official Links */}
      {candidate.sourceLinks && candidate.sourceLinks.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Official Announcement Sources:</span>
          <div className="flex items-center gap-2">
            {candidate.sourceLinks.map((src, idx) => (
              <a
                key={idx}
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-0.5"
              >
                <span>{src.title}</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Set Price Alert Modal */}
      <SetPriceAlertModal
        candidate={candidate}
        existingAlert={activeAlert}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onAlertSaved={(alert) => {
          if (onAlertSaved) onAlertSaved(alert);
        }}
      />
    </div>
  );
};
