import React, { useState } from 'react';
import { ShieldCheck, HardDrive, User, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from './AuthModal';

export const SyncStatusIndicator: React.FC = () => {
  const { user, isParent, triggerManualSync, syncStatus } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Offline Security Status Pill */}
        <button
          onClick={triggerManualSync}
          disabled={syncStatus.isSyncing}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/70 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/60 transition"
          title="100% Offline Mode: Click to verify local IndexedDB cache"
        >
          {syncStatus.isSyncing ? (
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className="hidden md:inline">100% Offline Mode</span>
          <span className="md:hidden">Offline</span>
        </button>

        {/* Local Storage Indicator */}
        <div
          className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs"
          title="Local IndexedDB storage active"
        >
          <HardDrive className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px] font-medium text-slate-400">IndexedDB</span>
        </div>

        {/* Profile Switcher Pill */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold transition ${
            isParent
              ? 'bg-rose-950/70 border-rose-800/70 text-rose-300 hover:bg-rose-900/60'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-750'
          }`}
          title="Switch between Local Student and Guardian / Parent View"
        >
          <User className="w-3 h-3 text-brand-400" />
          <span className="max-w-[100px] truncate">{user?.displayName || 'Student'}</span>
          {isParent && (
            <span className="text-[9px] bg-rose-500 text-white font-bold px-1 rounded">Guardian</span>
          )}
        </button>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
