import React, { useState } from 'react';
import { Cloud, CloudOff, RefreshCw, CheckCircle2, User, LogIn, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from './AuthModal';

export const SyncStatusIndicator: React.FC = () => {
  const { user, isAuthenticated, isParent, syncStatus, triggerManualSync, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          {/* Cloud Sync State Button */}
          <button
            onClick={triggerManualSync}
            disabled={syncStatus.isSyncing}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition ${
              syncStatus.isSyncing
                ? 'bg-slate-850 border-slate-700 text-sky-400'
                : syncStatus.syncError
                ? 'bg-amber-950/40 border-amber-800/40 text-amber-300 hover:bg-amber-950/60'
                : 'bg-slate-850 border-slate-700 text-emerald-400 hover:bg-slate-800'
            }`}
            title={
              syncStatus.lastSyncedAt
                ? `Last Synced: ${new Date(syncStatus.lastSyncedAt).toLocaleTimeString()}`
                : 'Sync local data with cloud'
            }
          >
            {syncStatus.isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
            ) : syncStatus.isOnline ? (
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <CloudOff className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="hidden sm:inline font-semibold text-[11px]">
              {syncStatus.isSyncing
                ? 'Syncing...'
                : syncStatus.isOnline
                ? 'Cloud Synced'
                : 'Offline'}
            </span>
          </button>

          {/* Account Role Badge */}
          {isParent ? (
            <span className="hidden md:flex items-center gap-1 text-[11px] font-bold text-purple-300 bg-purple-950/60 border border-purple-800/50 px-2 py-0.5 rounded-full">
              <Heart className="w-3 h-3" />
              <span>Parent Portal</span>
            </span>
          ) : null}
        </div>
      ) : (
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition"
        >
          <LogIn className="w-3.5 h-3.5 text-brand-400" />
          <span>Cloud / Parent Sync</span>
        </button>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};
