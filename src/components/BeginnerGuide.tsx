import React from 'react';
import { BookOpen, Shield, AlertTriangle, Wallet, Lock, Zap, HelpCircle } from 'lucide-react';

export const BeginnerGuide: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Academy Title */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">
            Beginner&apos;s Field Manual &amp; Safety Protocol
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Essential survival knowledge for navigating pre-listing decentralized markets with a cautious $10 capital limit.
        </p>
      </div>

      {/* Golden Rules of Security */}
      <div className="bg-rose-950/20 border border-rose-800/60 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
          <Lock className="w-4 h-4 text-rose-400" />
          <span>Non-Negotiable Wallet Safety Rules</span>
        </div>
        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-start gap-2 bg-[#0b0f19] p-2.5 rounded-xl border border-slate-800">
            <span className="text-rose-400 font-bold font-mono">1.</span>
            <span>
              <strong>Never connect your main wallet:</strong> If testing, use a burner wallet containing only your $10 trade funds and minimal gas. Never keep your life savings or long-term holdings in the same wallet.
            </span>
          </div>
          <div className="flex items-start gap-2 bg-[#0b0f19] p-2.5 rounded-xl border border-slate-800">
            <span className="text-rose-400 font-bold font-mono">2.</span>
            <span>
              <strong>Never share your Seed Phrase / Secret Recovery Phrase:</strong> No legitimate exchange, support staff, or decentralized pool will EVER ask for your 12 or 24 seed words.
            </span>
          </div>
          <div className="flex items-start gap-2 bg-[#0b0f19] p-2.5 rounded-xl border border-slate-800">
            <span className="text-rose-400 font-bold font-mono">3.</span>
            <span>
              <strong>Never approve unlimited contract allowances:</strong> If a decentralized app asks for infinite token spend permission, revoke it immediately via tools like revoke.cash.
            </span>
          </div>
        </div>
      </div>

      {/* Deconstructing the Strategy */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>The &quot;1-Hour Pre-Entry &amp; 3-5 Min Exit&quot; Strategy Reality Check</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The concept behind entering 1 hour before an exchange listing is observing whether early DEX buyers front-run the CEX announcement buzz, and exiting within 3–5 minutes once the centralized order book opens.
        </p>

        <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl space-y-2 text-xs text-amber-200">
          <div className="font-semibold text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Why This Strategy Fails for Most Beginners:</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-amber-100/90 pl-3 list-disc">
            <li>
              <strong>Sniper MEV Bots:</strong> Automated bots execute buy transactions milliseconds before humans and sandwich ordinary orders with punitive slippage.
            </li>
            <li>
              <strong>CEX Deposit Dumps:</strong> When a CEX opens deposits, early seed investors or presale buyers dump millions of tokens directly onto the DEX pool, crashing the price by 50% in seconds.
            </li>
            <li>
              <strong>Contract Honeypots:</strong> Malicious developers alter the smart contract code right before listing so only whitelist addresses can sell. Your $10 is locked forever.
            </li>
            <li>
              <strong>Gas Fee Traps:</strong> On Ethereum L1, two transactions (approve + swap) cost $20-$30, wiping out your $10 position 3 times over!
            </li>
          </ul>
        </div>
      </div>

      {/* Focus Networks: Solana & BNB Chain */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Why We Focus on Solana &amp; BNB Chain (Binance Finance)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Because your maximum trade limit is strictly $10, transaction gas is your greatest vulnerability. Solana and BNB Chain are the only two major ecosystems where micro-trades remain mathematically viable.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-gradient-to-tr from-purple-950/40 to-slate-900 border border-purple-800/40 rounded-xl space-y-1">
            <div className="flex items-center justify-between font-bold text-purple-300">
              <span>⚡ Solana Network</span>
              <span className="text-[10px] font-mono text-emerald-400">~$0.01 Gas</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Primary DEXes: <strong>Raydium</strong>, <strong>Meteora</strong>, and <strong>Orca</strong>.
            </p>
            <p className="text-[10px] text-slate-400">
              Wallet: Native in <strong>Trust Wallet</strong>. Sub-cent roundtrip fees mean you retain &gt;97% of your $10 capital even after DEX fees.
            </p>
          </div>

          <div className="p-3 bg-gradient-to-tr from-amber-950/40 to-slate-900 border border-amber-800/40 rounded-xl space-y-1">
            <div className="flex items-center justify-between font-bold text-amber-300">
              <span>🔶 BNB Chain (Binance)</span>
              <span className="text-[10px] font-mono text-amber-400">~$0.25 Gas</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Primary DEX: <strong>PancakeSwap V3</strong>.
            </p>
            <p className="text-[10px] text-slate-400">
              Wallet: Native in <strong>Trust Wallet</strong> &amp; <strong>MetaMask</strong> with BNB. Deep liquidity pools make slippage minimal for $10 orders.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Wallet & MetaMask Step-by-Step */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Wallet className="w-4 h-4 text-emerald-400" />
          <span>How to Safely Check Custom Tokens in Trust Wallet / MetaMask</span>
        </div>
        <div className="space-y-2 text-xs text-slate-300">
          <div className="p-2.5 bg-[#0b0f19] rounded-xl border border-slate-800">
            <span className="font-semibold text-cyan-400 block mb-0.5">
              Step 1: Verify the Official Contract / Mint Address
            </span>
            <p className="text-[11px] text-slate-400">
              For <strong>Solana</strong>, verify the mint on Solscan or Raydium. For <strong>BNB Chain</strong>, verify on BscScan. Never copy addresses from untrusted Telegram forward messages.
            </p>
          </div>
          <div className="p-2.5 bg-[#0b0f19] rounded-xl border border-slate-800">
            <span className="font-semibold text-cyan-400 block mb-0.5">
              Step 2: Add Custom Token in Trust Wallet
            </span>
            <p className="text-[11px] text-slate-400">
              Open Trust Wallet &gt; Tap Manage Crypto &gt; Tap &apos;+&apos; &gt; Select Network (Solana or BNB Smart Chain) &gt; Paste Verified Address.
            </p>
          </div>
          <div className="p-2.5 bg-[#0b0f19] rounded-xl border border-slate-800">
            <span className="font-semibold text-cyan-400 block mb-0.5">
              Step 3: Run Contract Through RugCheck (Solana) or TokenSniffer (BNB)
            </span>
            <p className="text-[11px] text-slate-400">
              Before observing, paste the contract address into RugCheck (for Solana SPL) or TokenSniffer (for BEP-20) to confirm 0% tax, no freeze authority, and locked liquidity.
            </p>
          </div>
        </div>
      </div>

      {/* Nigerian Time (WAT) Cheat Sheet */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4 text-xs">
        <span className="font-bold text-slate-200 block mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Timezone Reference (West Africa Time / UTC+1)
        </span>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 bg-[#0b0f19] rounded border border-slate-800">
            <span className="text-slate-400 block">10:00 UTC =</span>
            <span className="text-amber-300 font-bold font-mono">11:00 AM WAT (Lagos)</span>
          </div>
          <div className="p-2 bg-[#0b0f19] rounded border border-slate-800">
            <span className="text-slate-400 block">14:00 UTC =</span>
            <span className="text-amber-300 font-bold font-mono">03:00 PM WAT (Lagos)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
