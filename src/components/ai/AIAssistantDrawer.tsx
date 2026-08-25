import React, { useState } from 'react';
import { Bot, Sparkles, X } from 'lucide-react';
import { Modal } from '../common/Modal';

export const AIAssistantDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Robot Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-emerald-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center border border-white/20 shadow-brand-900/40"
        title="AI Assistant"
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Coming Soon Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="AI Assistant"
        maxWidth="sm"
      >
        <div className="flex flex-col items-center justify-center text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500/20 via-indigo-500/20 to-emerald-500/20 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-inner">
            <Bot className="w-9 h-9 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Coming Soon..
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              On-device AI assistant is currently under development.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95"
            >
              Got it
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
