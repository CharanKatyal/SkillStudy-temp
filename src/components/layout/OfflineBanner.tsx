import React from 'react';
import { HardDrive, WifiOff, ShieldCheck } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  return (
    <div className="offline-banner bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/90 border-b border-emerald-800/40 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between shadow-inner">
      <div className="flex items-center gap-2 max-w-5xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-200">Offline Mode</span>
          <span className="text-emerald-400/80 hidden sm:inline">— Your data is stored locally on this device.</span>
        </div>
        <div className="flex items-center gap-3 text-emerald-400/70 text-[11px]">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5" />
            <span>IndexedDB Active</span>
          </span>
          <span className="hidden md:flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Cloud &amp; Private</span>
          </span>
        </div>
      </div>
    </div>
  );
};
