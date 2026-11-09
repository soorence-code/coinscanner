import React, { useState, useEffect } from 'react';
import {
  Radar,
  RefreshCw,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Smartphone,
  Maximize2,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Search,
  Bell,
  BellRing,
  Download,
} from 'lucide-react';
import { AndroidHeader } from './components/AndroidHeader';
import { AndroidNavBar, TabType } from './components/AndroidNavBar';
import { CandidateCard } from './components/CandidateCard';
import { TradeSimulator } from './components/TradeSimulator';
import { RumorTracker } from './components/RumorTracker';
import { BeginnerGuide } from './components/BeginnerGuide';
import { ReportHistory } from './components/ReportHistory';
import { AndroidNotificationBanner } from './components/AndroidNotificationBanner';
import { InstallGuideModal } from './components/InstallGuideModal';
import { CloudflareDiagnosticModal } from './components/CloudflareDiagnosticModal';
import { DailyReport, TokenCandidate, ServerStatus, PriceAlert } from './types';
import {
  loadAlerts,
  removePriceAlert,
  markAlertTriggered,
  sendPushNotification,
} from './services/notificationService';
import { generateRefreshedClientReport } from './services/curatedData';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('watchlist');
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [report, setReport] = useState<DailyReport | null>(null);
  const [reportsList, setReportsList] = useState<DailyReport[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  type FilterType = 'ALL' | 'SOLANA' | 'BNB' | 'ACTIONABLE' | 'ALERTS';
  const [filterActionable, setFilterActionable] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [triggeredBannerAlert, setTriggeredBannerAlert] = useState<PriceAlert | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isCloudflareModalOpen, setIsCloudflareModalOpen] = useState(false);
  const [cloudflareErrorMsg, setCloudflareErrorMsg] = useState('');

  // Capture PWA install prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Fetch initial report, alerts, and server status
  const fetchData = async () => {
    try {
      const [todayRes, listRes, statusRes] = await Promise.all([
        fetch('/api/reports/today').catch(() => null),
        fetch('/api/reports').catch(() => null),
        fetch('/api/status').catch(() => null),
      ]);

      let hasLoadedToday = false;
      if (todayRes && todayRes.ok) {
        const contentType = todayRes.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const todayData = await todayRes.json();
          if (todayData.report) {
            setReport(todayData.report);
            hasLoadedToday = true;
          }
        }
      }

      if (listRes && listRes.ok) {
        const contentType = listRes.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const listData = await listRes.json();
          if (listData.reports) setReportsList(listData.reports);
        }
      }

      if (statusRes && statusRes.ok) {
        const contentType = statusRes.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const statusData = await statusRes.json();
          if (statusData) setServerStatus(statusData);
        }
      }

      if (!hasLoadedToday) {
        const fallback = generateRefreshedClientReport();
        setReport(fallback);
        setReportsList([fallback]);
      }

      setAlerts(loadAlerts());
    } catch (err) {
      console.warn('Backend API unreachable, using client intelligence fallback:', err);
      const fallback = generateRefreshedClientReport();
      setReport(fallback);
      setReportsList([fallback]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Run client-side intelligence report refresh
  const runFallbackScan = () => {
    const refreshed = generateRefreshedClientReport();
    setReport(refreshed);
    setReportsList((prev) => [refreshed, ...prev.filter((r) => r.reportId !== refreshed.reportId)]);
    setScanMessage('7-Day research intelligence updated!');
    setTimeout(() => setScanMessage(''), 3000);
  };

  // Periodic price movement and active alert monitor
  useEffect(() => {
    const interval = setInterval(() => {
      const currentAlerts = loadAlerts();
      const activeAlerts = currentAlerts.filter((a) => a.status === 'ACTIVE');
      if (activeAlerts.length === 0 || !report || !report.candidates) return;

      // Check if any candidate price hits an alert threshold
      activeAlerts.forEach((alert) => {
        const candidate = report.candidates.find((c) => c.id === alert.candidateId);
        if (!candidate || !candidate.currentPriceUsd) return;

        let shouldTrigger = false;
        if (alert.condition === 'RISE_ABOVE' && candidate.currentPriceUsd >= alert.thresholdPrice) {
          shouldTrigger = true;
        } else if (alert.condition === 'DROP_BELOW' && candidate.currentPriceUsd <= alert.thresholdPrice) {
          shouldTrigger = true;
        }

        if (shouldTrigger) {
          const conditionLabel = alert.condition === 'RISE_ABOVE' ? 'risen above' : 'dropped below';
          sendPushNotification(
            `🚨 Price Alert: ${alert.ticker} hit $${alert.thresholdPrice.toFixed(4)}!`,
            `${alert.tokenName} has ${conditionLabel} your threshold of $${alert.thresholdPrice.toFixed(4)} USD.`,
            alert.ticker
          );
          const updated = markAlertTriggered(alert.id, candidate.currentPriceUsd);
          setAlerts(updated);
          const triggeredObj = updated.find((a) => a.id === alert.id);
          if (triggeredObj) setTriggeredBannerAlert(triggeredObj);
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [report]);

  // Simulate price threshold hit on demand for immediate testing
  const handleSimulatePriceHit = (alert: PriceAlert) => {
    const hitPrice =
      alert.condition === 'RISE_ABOVE'
        ? Number((alert.thresholdPrice * 1.015).toFixed(4))
        : Number((alert.thresholdPrice * 0.985).toFixed(4));

    // Update candidate's current price in state
    if (report) {
      const updatedCandidates = report.candidates.map((c) => {
        if (c.id === alert.candidateId) {
          return { ...c, currentPriceUsd: hitPrice };
        }
        return c;
      });
      setReport({ ...report, candidates: updatedCandidates });
    }

    const conditionLabel = alert.condition === 'RISE_ABOVE' ? 'risen above' : 'dropped below';
    sendPushNotification(
      `🚨 Push Alert: ${alert.ticker} hit target $${alert.thresholdPrice.toFixed(4)}!`,
      `Threshold met: ${alert.tokenName} observed at $${hitPrice.toFixed(4)} USD (Target: $${alert.thresholdPrice.toFixed(4)}).`,
      alert.ticker
    );

    const updatedAlerts = markAlertTriggered(alert.id, hitPrice);
    setAlerts(updatedAlerts);

    const triggeredObj = updatedAlerts.find((a) => a.id === alert.id);
    if (triggeredObj) {
      setTriggeredBannerAlert(triggeredObj);
    }
  };

  // Trigger Gemini research scan with Google Search grounding
  const triggerDailyScan = async () => {
    setScanning(true);
    setScanMessage('Auditing CEX announcements, DEX pools & social sentiment...');
    try {
      const res = await fetch('/api/scan', { method: 'POST' });
      const contentType = res.headers.get('content-type') || '';

      if (!res.ok || !contentType.includes('application/json')) {
        // Cloudflare Pages without functions deployed or 404
        setCloudflareErrorMsg('Backend endpoint /api/scan is not reachable on your host.');
        setIsCloudflareModalOpen(true);
        runFallbackScan();
        return;
      }

      const data = await res.json();
      if (data.missingKey) {
        setCloudflareErrorMsg(data.error);
        setIsCloudflareModalOpen(true);
        if (data.report) {
          setReport(data.report);
          setReportsList((prev) => [data.report, ...prev.filter((r) => r.reportId !== data.report.reportId)]);
        }
      } else if (data.report) {
        setReport(data.report);
        setReportsList((prev) => [data.report, ...prev.filter((r) => r.reportId !== data.report.reportId)]);
        setScanMessage('Research run completed!');
        setTimeout(() => setScanMessage(''), 3000);
      } else if (data.error) {
        setCloudflareErrorMsg(data.error);
        setIsCloudflareModalOpen(true);
        runFallbackScan();
      }
    } catch (err: any) {
      console.warn('Scan error, opening Cloudflare notice & running fallback:', err);
      setCloudflareErrorMsg('Network error connecting to /api/scan.');
      setIsCloudflareModalOpen(true);
      runFallbackScan();
    } finally {
      setScanning(false);
    }
  };

  // Filter candidates
  const activeAlertsList = alerts.filter((a) => a.status === 'ACTIVE');

  const filteredCandidates = (report?.candidates || []).filter((cand) => {
    if (filterActionable === 'SOLANA') {
      const net = (cand.network || '').toLowerCase();
      if (!net.includes('solana') && !net.includes('sol')) return false;
    }
    if (filterActionable === 'BNB') {
      const net = (cand.network || '').toLowerCase();
      if (!net.includes('bnb') && !net.includes('bsc') && !net.includes('binance')) return false;
    }
    if (filterActionable === 'ACTIONABLE') {
      if (cand.actionableStatus !== 'ACTIONABLE_WATCH') return false;
    }
    if (filterActionable === 'ALERTS') {
      const hasAlert = alerts.some((a) => a.candidateId === cand.id && a.status === 'ACTIVE');
      if (!hasAlert) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        cand.name.toLowerCase().includes(q) ||
        cand.ticker.toLowerCase().includes(q) ||
        cand.network.toLowerCase().includes(q) ||
        cand.listingVenue.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const solanaCount = (report?.candidates || []).filter((c) => {
    const net = (c.network || '').toLowerCase();
    return net.includes('solana') || net.includes('sol');
  }).length;

  const bnbCount = (report?.candidates || []).filter((c) => {
    const net = (c.network || '').toLowerCase();
    return net.includes('bnb') || net.includes('bsc') || net.includes('binance');
  }).length;

  const actionableCount = (report?.candidates || []).filter(
    (c) => c.actionableStatus === 'ACTIONABLE_WATCH'
  ).length;

  const rejectedCount = (report?.rejectedRumors || []).length;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-start py-0 md:py-6 px-0 md:px-4 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Android Heads-up Push Alert Banner */}
      <AndroidNotificationBanner
        alert={triggeredBannerAlert}
        onDismiss={() => setTriggeredBannerAlert(null)}
        onViewCandidate={(candId) => {
          setActiveTab('watchlist');
          setSearchQuery('');
          setFilterActionable('ALL');
        }}
      />

      {/* Top Floating View Switcher for Desktop */}
      <div className="hidden md:flex items-center justify-between w-full max-w-md lg:max-w-4xl mb-3 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-xs font-semibold text-slate-300">
            TokenRadar Android Intelligence OS
          </span>
          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-800/60">
            WAT Timezone Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-900/80 to-emerald-900/80 hover:from-cyan-800 hover:to-emerald-800 text-cyan-200 border border-cyan-700/60 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Install on Phone</span>
          </button>

          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#101726] hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors shadow-sm"
          >
            {isPhoneFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Full Screen View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Android Mockup Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container - Android Mockup or Full Screen */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          isPhoneFrame
            ? 'max-w-[430px] h-[100dvh] md:h-[860px] md:max-h-[92vh] md:rounded-[44px] md:border-[10px] md:border-slate-800/90 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] md:ring-1 md:ring-slate-700/60 relative overflow-hidden bg-[#0a0e17]'
            : 'max-w-4xl min-h-[92vh] rounded-2xl border border-slate-800 bg-[#0a0e17] overflow-hidden'
        }`}
      >
        {/* Android Top Physical Speaker & Camera Notch (in phone frame mode) */}
        {isPhoneFrame && (
          <div className="hidden md:flex justify-center items-center h-4 bg-[#070b14] relative z-20">
            <div className="w-16 h-1 bg-slate-700/80 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full ml-3 border border-slate-700/80"></div>
          </div>
        )}

        {/* Android Status Bar */}
        <AndroidHeader watTime={serverStatus?.currentWAT || '12:00 WAT'} />

        {/* App Bar / Navigation Header */}
        <div className="px-4 py-3 bg-[#0d1322] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Radar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-extrabold text-white tracking-tight">
                  TokenRadar
                </h1>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  WAT v2.4
                </span>
              </div>
              <p className="text-[10px] text-cyan-300 font-medium">
                Solana &amp; BNB Finance • 7-Day Launches • $10 Cap
              </p>
            </div>
          </div>

          {/* Action Buttons: Install & Scan */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-[#101726] hover:bg-slate-800 text-cyan-300 border border-slate-700 transition-colors shadow-sm"
              title="Install App on Android Phone"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Install</span>
            </button>

            <button
              onClick={triggerDailyScan}
              disabled={scanning}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                scanning
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-600/30'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
              <span>{scanning ? 'Scanning...' : 'Run Scan'}</span>
            </button>
          </div>
        </div>

        {/* Scan In-Progress Toast */}
        {scanMessage && (
          <div className="bg-cyan-950/90 border-b border-cyan-800/80 px-4 py-2 text-xs text-cyan-200 flex items-center gap-2 animate-in fade-in">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
            <span>{scanMessage}</span>
          </div>
        )}

        {/* Scrollable Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          {/* TAB 1: WATCHLIST */}
          {activeTab === 'watchlist' && (
            <div className="space-y-4">
              {/* Daily Report Status Banner */}
              {report && (
                <div
                  className={`rounded-2xl p-4 border transition-all ${
                    report.conclusion === 'TRADE_WATCH_ACTIVE'
                      ? 'bg-emerald-950/20 border-emerald-800/50'
                      : 'bg-amber-950/20 border-amber-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Daily Intelligence Brief
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                          {report.runDate}
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-300 font-mono mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>Run Timestamp: {report.runTimeWAT}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          report.conclusion === 'TRADE_WATCH_ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {report.conclusion.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed mb-2 font-medium">
                    {report.summary}
                  </p>

                  {report.noTradeReason && (
                    <div className="p-2.5 bg-[#0b0f19] rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Audit Verdict:</strong> {report.noTradeReason}
                      </span>
                    </div>
                  )}

                  {/* 7-Day Market Outlook */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 leading-snug">
                    <span className="font-semibold text-slate-300">7-Day Launch Horizon: </span>
                    {report.marketOverview7Days}
                  </div>
                </div>
              )}

              {/* Search & Filter Controls */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by token, ticker, or exchange..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#101726] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <button
                    onClick={() => setFilterActionable('ALL')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      filterActionable === 'ALL'
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-[#101726] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    All ({report?.candidates.length || 0})
                  </button>

                  <button
                    onClick={() => setFilterActionable('SOLANA')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      filterActionable === 'SOLANA'
                        ? 'bg-gradient-to-r from-purple-600 to-emerald-600 text-white shadow-sm'
                        : 'bg-[#101726] text-purple-300 hover:text-white border border-purple-800/60'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Solana ({solanaCount})</span>
                  </button>

                  <button
                    onClick={() => setFilterActionable('BNB')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      filterActionable === 'BNB'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-[#101726] text-amber-300 hover:text-white border border-amber-800/60'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>BNB Finance ({bnbCount})</span>
                  </button>

                  <button
                    onClick={() => setFilterActionable('ACTIONABLE')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                      filterActionable === 'ACTIONABLE'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[#101726] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>$10 Viable ({actionableCount})</span>
                  </button>

                  <button
                    onClick={() => setFilterActionable('ALERTS')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                      filterActionable === 'ALERTS'
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-[#101726] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <BellRing className="w-3 h-3 text-cyan-400" />
                    <span>Alerts ({activeAlertsList.length})</span>
                  </button>
                </div>
              </div>

              {/* Candidates List */}
              {loading ? (
                <div className="bg-[#101726] border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Loading verified launches &amp; listings...
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="bg-[#101726] border border-slate-800 rounded-2xl p-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    No Matching Candidates in Current Filter
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Either no tokens passed the strict verification and $10 fee criteria, or your search/filter returned zero matches. Check the Blacklist tab to view excluded rumors.
                  </p>
                  <button
                    onClick={() => {
                      setFilterActionable('ALL');
                      setSearchQuery('');
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 mt-2"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCandidates.map((candidate) => {
                    const candidateAlert = alerts.find(
                      (a) => a.candidateId === candidate.id && a.status === 'ACTIVE'
                    );
                    return (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        activeAlert={candidateAlert}
                        onAlertSaved={(newAlert) => {
                          setAlerts(loadAlerts());
                        }}
                        onAlertRemoved={(alertId) => {
                          const updated = removePriceAlert(alertId);
                          setAlerts(updated);
                        }}
                        onSimulatePriceHit={handleSimulatePriceHit}
                      />
                    );
                  })}
                </div>
              )}

              {/* Sources Audited */}
              {report?.sourcesSearched && report.sourcesSearched.length > 0 && (
                <div className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-3 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300 block mb-1">
                    Official Announcement Centers Audited in Run:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {report.sourcesSearched.map((src, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Disclaimer Banner */}
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-[11px] text-slate-400 leading-snug">
                <span className="font-bold text-slate-300 block mb-0.5">
                  Protective Protocol:
                </span>
                This watchlist is generated for observational market research with a strict $10 maximum trade model. Never connect wallets, enter seed phrases, or approve unknown smart contracts. Pre-listing DEX liquidity carries extreme volatility and dump risk.
              </div>
            </div>
          )}

          {/* TAB 2: $10 SIMULATOR */}
          {activeTab === 'simulator' && <TradeSimulator />}

          {/* TAB 3: BLACKLIST / RUMOR RADAR */}
          {activeTab === 'rumors' && (
            <RumorTracker rejectedRumors={report?.rejectedRumors || []} />
          )}

          {/* TAB 4: BEGINNER ACADEMY */}
          {activeTab === 'guide' && <BeginnerGuide />}

          {/* TAB 5: REPORT HISTORY */}
          {activeTab === 'history' && (
            <ReportHistory
              reports={reportsList}
              selectedReportId={report?.reportId || ''}
              onSelectReport={(selected) => {
                setReport(selected);
                setActiveTab('watchlist');
              }}
            />
          )}
        </div>

        {/* Android Bottom Navigation Bar */}
        <AndroidNavBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          actionableCount={actionableCount}
          rejectedCount={rejectedCount}
        />

        {/* Android Bottom Home Gesture Pill (in phone frame mode) */}
        {isPhoneFrame && (
          <div className="hidden md:flex justify-center items-center h-4 bg-[#0b0f19] select-none">
            <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Android PWA Install Guide Modal */}
      <InstallGuideModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        appUrl={
          typeof window !== 'undefined'
            ? window.location.href.split('?')[0]
            : 'https://ais-pre-4rzdn4k62aegfnzb2qddiq-53768250568.europe-west2.run.app'
        }
        deferredPrompt={deferredPrompt}
      />

      {/* Cloudflare Pages Diagnostic Notice Modal */}
      <CloudflareDiagnosticModal
        isOpen={isCloudflareModalOpen}
        onClose={() => setIsCloudflareModalOpen(false)}
        errorMessage={cloudflareErrorMsg}
        onRunFallbackScan={runFallbackScan}
      />
    </div>
  );
}
