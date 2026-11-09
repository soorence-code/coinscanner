import React from 'react';
import { History, Calendar, CheckCircle2, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { DailyReport } from '../types';

interface ReportHistoryProps {
  reports: DailyReport[];
  selectedReportId: string;
  onSelectReport: (report: DailyReport) => void;
}

export const ReportHistory: React.FC<ReportHistoryProps> = ({
  reports,
  selectedReportId,
  onSelectReport,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'QUALIFYING_CANDIDATES_FOUND':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            Candidates Found
          </span>
        );
      case 'NO_VERIFIED_MATCHES':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
            No Verified Matches
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Incomplete Research
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <History className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">
            Daily Research Logs &amp; Audit Archive
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Every scheduled run delivers an official report even when no tokens pass checks, distinguishing verified matches from incomplete or high-risk market conditions.
        </p>
      </div>

      {/* Reports List */}
      <div className="space-y-2.5">
        {reports.map((report) => {
          const isSelected = report.reportId === selectedReportId;
          const actionableCount = report.candidates.filter(
            (c) => c.actionableStatus === 'ACTIONABLE_WATCH'
          ).length;

          return (
            <div
              key={report.reportId}
              onClick={() => onSelectReport(report)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-500/10'
                  : 'bg-[#101726] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-bold text-white">{report.runDate}</span>
                    <span className="text-[10px] text-amber-300 font-mono">
                      {report.runTimeWAT}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                    ID: {report.reportId}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(report.status)}
                  <span className="text-[10px] text-slate-400 font-medium">
                    {actionableCount} Actionable / {report.candidates.length} Scanned
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-snug">
                {report.summary}
              </p>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span
                  className={`font-semibold ${
                    report.conclusion === 'TRADE_WATCH_ACTIVE'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  Conclusion: {report.conclusion.replace('_', ' ')}
                </span>
                <span className="text-cyan-400 flex items-center gap-1 font-medium">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
