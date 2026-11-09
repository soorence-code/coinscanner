import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Clock } from 'lucide-react';

interface AndroidHeaderProps {
  watTime: string;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({ watTime }) => {
  const [localTime, setLocalTime] = useState<string>('12:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as Nigerian WAT time (UTC+1)
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setLocalTime(formatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#070b14] px-4 py-2 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800/80 select-none">
      <div className="flex items-center gap-1.5 font-medium">
        <Clock className="w-3.5 h-3.5 text-cyan-400" />
        <span>{localTime} WAT</span>
        <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">(Lagos / UTC+1)</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-800/60">
          5G
        </span>
        <Signal className="w-3.5 h-3.5 text-slate-300" />
        <Wifi className="w-3.5 h-3.5 text-slate-300" />
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span>98%</span>
          <Battery className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
