import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, AlertCircle, CheckCircle2, XCircle, Info, Zap } from 'lucide-react';
import { TradeFeasibility } from '../types';

export const TradeSimulator: React.FC = () => {
  const [network, setNetwork] = useState('Base');
  const [buyTax, setBuyTax] = useState(0);
  const [sellTax, setSellTax] = useState(0);
  const [poolLiquidity, setPoolLiquidity] = useState(50000);
  const [dexPoolActive, setDexPoolActive] = useState(true);
  const [result, setResult] = useState<TradeFeasibility | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateFeasibility = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/simulate-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          network,
          buyTaxPercent: buyTax,
          sellTaxPercent: sellTax,
          dexPoolExists: dexPoolActive,
          dexTradable: dexPoolActive,
          poolLiquidityUsd: poolLiquidity,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Failed to calculate trade feasibility:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateFeasibility();
  }, [network, buyTax, sellTax, poolLiquidity, dexPoolActive]);

  const presetNetworks = [
    { name: 'Base', gas: '$0.03', desc: 'Ultra-low L2 fee, optimal for $10 test' },
    { name: 'Solana', gas: '$0.01', desc: 'Sub-cent gas fee, fast execution' },
    { name: 'BNB Chain', gas: '$0.35', desc: 'Low BSC gas, good PancakeSwap depth' },
    { name: 'Arbitrum', gas: '$0.08', desc: 'L2 rollup, reasonable for small trade' },
    { name: 'Ethereum Mainnet', gas: '$14.50', desc: 'FAIL: Gas eats >100% of $10 capital' },
  ];

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">
            $10 Position Economic Feasibility Calculator
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Because your maximum trade size is $10 USD, network gas and DEX slippage can silently destroy your position before trading even starts. Test how different chains and liquidity levels impact your capital.
        </p>
      </div>

      {/* Simulator Controls */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4 space-y-4">
        {/* Network Selection */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            1. Target Blockchain Network:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {presetNetworks.map((net) => {
              const isSelected = network === net.name;
              return (
                <button
                  key={net.name}
                  onClick={() => setNetwork(net.name)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-sm shadow-cyan-500/20'
                      : 'bg-[#0b0f19] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{net.name}</span>
                    <span className="text-[10px] font-mono text-cyan-400">{net.gas}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1 leading-tight">
                    {net.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Taxes */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Buy Tax (%): <span className="text-cyan-400 font-mono">{buyTax}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={buyTax}
              onChange={(e) => setBuyTax(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="text-[10px] text-slate-400">
              {buyTax > 10 ? '🚨 Dangerous Honeypot Tax' : '0% standard recommended'}
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Sell Tax (%): <span className="text-cyan-400 font-mono">{sellTax}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={sellTax}
              onChange={(e) => setSellTax(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="text-[10px] text-slate-400">
              {sellTax > 10 ? '🚨 Dangerous Honeypot Tax' : '0% standard recommended'}
            </span>
          </div>
        </div>

        {/* Pool Liquidity */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-300">
              DEX Pool Liquidity:
            </label>
            <span className="text-xs font-mono font-bold text-amber-300">
              ${poolLiquidity.toLocaleString()} USD
            </span>
          </div>
          <input
            type="range"
            min="5000"
            max="300000"
            step="5000"
            value={poolLiquidity}
            onChange={(e) => setPoolLiquidity(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>$5k (High Slippage)</span>
            <span>$50k (Moderate)</span>
            <span>$300k+ (Deep)</span>
          </div>
        </div>

        {/* DEX Pool Tradability */}
        <div className="flex items-center justify-between p-3 bg-[#0b0f19] border border-slate-800 rounded-xl">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">
              DEX Pool Active & Tradable
            </span>
            <span className="text-[10px] text-slate-400">
              Can trade directly on Trust Wallet / MetaMask before CEX opens
            </span>
          </div>
          <button
            onClick={() => setDexPoolActive(!dexPoolActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              dexPoolActive
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {dexPoolActive ? 'Active' : 'Not Created'}
          </button>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div
          className={`border rounded-2xl p-4 transition-all shadow-xl ${
            result.viable
              ? 'bg-emerald-950/20 border-emerald-800/60'
              : 'bg-rose-950/25 border-rose-800/60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {result.viable ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400" />
              )}
              <h3 className="text-sm font-bold text-white">
                Verdict:{' '}
                <span
                  className={
                    result.viable ? 'text-emerald-400' : 'text-rose-400'
                  }
                >
                  {result.verdict.replace('_', ' ')}
                </span>
              </h3>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                result.viable
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {result.viable ? 'EXECUTION VIABLE' : 'UNFEASIBLE FOR $10'}
            </span>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center p-3 bg-[#0b0f19] rounded-xl border border-slate-800/80 mb-3">
            <div>
              <span className="text-[10px] text-slate-400 block">Total Fees Lost</span>
              <span className="text-sm font-bold font-mono text-rose-400">
                -${result.totalRoundtripFeesUsd.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Net Capital Left</span>
              <span
                className={`text-sm font-bold font-mono ${
                  result.netCapitalRemainingUsd > 7
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                ${result.netCapitalRemainingUsd.toFixed(2)} / $10
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Slippage Impact</span>
              <span className="text-sm font-bold font-mono text-amber-300">
                {result.estimatedSlippagePercent}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Required Break-Even</span>
              <span className="text-sm font-bold font-mono text-cyan-300">
                +{result.breakEvenGainPercent}%
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {result.rationale}
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Rule of Thumb:</strong> Never attempt $10 micro-trades on Ethereum L1. Prefer Base, Solana, or BNB Chain where roundtrip gas is under $0.50.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
