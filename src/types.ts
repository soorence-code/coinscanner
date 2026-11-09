export type ActionableStatus = 'ACTIONABLE_WATCH' | 'OBSERVE_ONLY' | 'REJECTED_NO_TRADE';
export type RiskRating = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME / AVOID';
export type ReportStatus = 'QUALIFYING_CANDIDATES_FOUND' | 'NO_VERIFIED_MATCHES' | 'INCOMPLETE_RESEARCH' | 'UNAVAILABLE_SOCIAL_DATA';
export type TradeVerdict = 'VIABLE' | 'UNFEASIBLE_GAS' | 'HIGH_SLIPPAGE' | 'HONEYPOT_RISK' | 'NO_DEX_LIQUIDITY';

export interface TradeFeasibility {
  viable: boolean;
  verdict: TradeVerdict;
  estimatedGasCostUsd: number;
  estimatedDEXFeeUsd: number;
  estimatedSlippagePercent: number;
  totalRoundtripFeesUsd: number;
  netCapitalRemainingUsd: number;
  breakEvenGainPercent: number;
  rationale: string;
}

export interface WalletCompatibility {
  trustWallet: boolean;
  metaMask: boolean;
  earliestAccessWindow: string;
  networkRpcNote: string;
}

export interface DexPoolInfo {
  exists: boolean;
  tradable: boolean;
  liquidityUsd?: number;
  dexName?: string;
  pairAddress?: string;
}

export interface Tokenomics {
  marketCapOrFdv?: string;
  buyTaxPercent: number;
  sellTaxPercent: number;
  transferRestrictions?: string;
}

export interface SocialAssessment {
  sentiment: 'Organic & Growing' | 'Mixed / Moderate' | 'High Bot / Shill Risk' | 'Low / Inactive';
  observableEvidence: string;
  hypeVsOrganicNote: string;
  rumorStatus: 'CONFIRMED' | 'UNCONFIRMED_RUMOR' | 'COMMUNITY_SPECULATION';
}

export interface StrategyPlan {
  entryWindow: string;
  exitWindow: string;
  maxAllocation: string;
  cautiousObservationSteps: string[];
  riskWarnings: string[];
}

export interface SourceLink {
  title: string;
  url: string;
}

export interface PriceAlert {
  id: string;
  candidateId: string;
  tokenName: string;
  ticker: string;
  condition: 'RISE_ABOVE' | 'DROP_BELOW';
  thresholdPrice: number;
  initialPrice: number;
  createdAt: string;
  createdAtWAT: string;
  status: 'ACTIVE' | 'TRIGGERED' | 'DISMISSED';
  triggeredAt?: string;
  triggeredPrice?: number;
}

export interface TokenCandidate {
  id: string;
  name: string;
  ticker: string;
  network: string;
  contractAddress: string;
  contractVerifiedSource: string;
  listingVenue: string;
  listingType: 'CEX Listing' | 'DEX Launch' | 'Launchpad to CEX' | 'Unconfirmed Rumor';
  listingDateUTC: string;
  listingDateWAT: string;
  timeRemainingMinutes: number;
  currentPriceUsd?: number;
  walletCompatibility: WalletCompatibility;
  dexPool: DexPoolInfo;
  tokenomics: Tokenomics;
  tradeFeasibility10Usd: TradeFeasibility;
  socialAssessment: SocialAssessment;
  strategyPlan: StrategyPlan;
  riskRating: RiskRating;
  riskFlags: string[];
  sourceLinks: SourceLink[];
  passesAllChecks: boolean;
  actionableStatus: ActionableStatus;
}

export interface RejectedRumor {
  name: string;
  claim: string;
  reason: string;
}

export interface DailyReport {
  reportId: string;
  runDate: string;
  runTimeWAT: string;
  status: ReportStatus;
  summary: string;
  conclusion: 'TRADE_WATCH_ACTIVE' | 'NO_TRADE_RECOMMENDED';
  noTradeReason?: string;
  candidates: TokenCandidate[];
  rejectedRumors: RejectedRumor[];
  marketOverview7Days: string;
  sourcesSearched: string[];
  disclaimer: string;
}

export interface ServerStatus {
  status: string;
  currentUTC: string;
  currentWAT: string;
  timezone: string;
  hasGeminiKey: boolean;
  maxTradeCap: string;
}
