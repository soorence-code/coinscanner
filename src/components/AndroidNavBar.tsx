import React from 'react';
import { Radar, Calculator, ShieldAlert, BookOpen, History } from 'lucide-react';

export type TabType = 'watchlist' | 'simulator' | 'rumors' | 'guide' | 'history';

interface AndroidNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  actionableCount: number;
  rejectedCount: number;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  activeTab,
  onTabChange,
  actionableCount,
  rejectedCount,
}) => {
  const tabs = [
    {
      id: 'watchlist' as TabType,
      label: 'Watchlist',
      icon: Radar,
      badge: actionableCount > 0 ? actionableCount : undefined,
      badgeColor: 'bg-emerald-500 text-slate-950 font-bold',
    },
    {
      id: 'simulator' as TabType,
      label: '$10 Calc',
      icon: Calculator,
    },
    {
      id: 'rumors' as TabType,
      label: 'Blacklist',
      icon: ShieldAlert,
      badge: rejectedCount > 0 ? rejectedCount : undefined,
      badgeColor: 'bg-rose-500 text-white font-bold',
    },
    {
      id: 'guide' as TabType,
      label: 'Academy',
      icon: BookOpen,
    },
    {
      id: 'history' as TabType,
      label: 'Reports',
      icon: History,
    },
  ];

  return (
    <div className="w-full bg-[#0b0f19] border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 ${
              isActive
                ? 'text-cyan-400 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-full relative transition-all ${
                isActive ? 'bg-cyan-500/20 text-cyan-300' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.badge !== undefined && (
                <span
                  className={`absolute -top-1 -right-2 text-[10px] min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full leading-none ${tab.badgeColor}`}
                >
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
