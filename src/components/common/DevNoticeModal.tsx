import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, ArrowRight, ShieldCheck, Check } from 'lucide-react';

const STORAGE_KEY = 'skudium_dev_notice_dismissed';

export const DevNoticeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(true);

  useEffect(() => {
    // Check if dismissed in sessionStorage or localStorage
    const dismissed = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // Small timeout to allow smooth entry animation after app initialization
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    if (dontShowAgain) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col transition-all transform scale-100 animate-scaleUp">
        
        {/* Header Hero Banner */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 p-6 text-white text-center overflow-hidden">
          {/* Subtle Background Glow Elements */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mb-3">
            <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">
            Platform Under Active Development
          </h2>
          <p className="text-xs text-indigo-100 mt-1 font-medium">
            Early Preview &amp; Offline Code Studio
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-slate-700 dark:text-slate-300">
          
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Work in Progress</span>
              This platform is currently under active development. You may encounter incomplete sections, mock content, or occasional bugs as new features are being built.
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span><strong>100% Offline &amp; Private:</strong> All your progress stays in your browser.</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span><strong>Auto-Saving:</strong> Timetables, code files, and projects auto-save locally.</span>
            </div>
          </div>

          {/* Don't show again toggle */}
          <div className="pt-2 flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
              />
              <span>Don't show this again during this session</span>
            </label>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-6 pb-6 pt-1">
          <button
            onClick={handleDismiss}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 transition active:scale-[0.99]"
          >
            <span>Got it, Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
