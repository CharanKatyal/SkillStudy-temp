import React, { useState } from 'react';
import {
  Bot,
  X,
  Sparkles,
  Clock,
  ShieldCheck,
  Code2,
  BookOpen,
  Cpu
} from 'lucide-react';
import { useAI } from '../../context/AIContext';

export const AIAssistantDrawer: React.FC = () => {
  const { isDrawerOpen, setIsDrawerOpen } = useAI();
  const [activeTab, setActiveTab] = useState<'overview' | 'features'>('overview');

  if (!isDrawerOpen) {
    return (
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white shadow-2xl shadow-brand-900/50 hover:scale-105 active:scale-95 transition flex items-center gap-2 group border border-emerald-400/30"
        title="Skudium AI Assistant (Coming Soon...)"
      >
        <Bot className="w-5 h-5" />
        <span className="text-xs font-bold pr-1 hidden sm:inline">AI Assistant</span>
        <span className="text-[10px] bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider animate-pulse">
          Coming Soon
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-2xl shadow-2xl flex flex-col w-[90vw] sm:w-[420px] max-h-[560px] overflow-hidden transition-colors">
      {/* Drawer Header */}
      <div className="px-4 py-3.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Skudium AI Assistant</h3>
              <span className="text-[9px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/90 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700/60 uppercase flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                <span>Coming Soon</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">On-Device Intelligence Engine</p>
          </div>
        </div>

        <button
          onClick={() => setIsDrawerOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Coming Soon Notice Hero */}
      <div className="p-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-850 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          On-Device AI Assistant in Development
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          Skudium is engineered to run privately on your local hardware. An on-device WebLLM model is being prepared to provide personal tutoring directly inside your browser.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-850 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-1.5 rounded-lg transition ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Offline Architecture
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`py-1.5 rounded-lg transition ${
            activeTab === 'features'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Planned Features
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
        {activeTab === 'overview' ? (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-slate-900 dark:text-slate-200">Zero Cloud Data Transmission</h5>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Your questions, code files, and study notes will never be uploaded to external servers.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 flex items-start gap-3">
              <Cpu className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-slate-900 dark:text-slate-200">Hardware-Accelerated WebAssembly</h5>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  The forthcoming model executes directly on your device's browser sandbox via WebGPU and WebAssembly.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-slate-900 dark:text-slate-200">Full Platform Ready Now</h5>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  All learning, IDE studio, practice quizzes, projects, and portfolio tools are 100% functional right now!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 flex items-center gap-2.5">
              <Code2 className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-200">Local Syntax &amp; Logic Analysis</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Contextual feedback for HTML, CSS, JS &amp; Python.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-200">Socratic Hint Generator</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Step-by-step guidance without giving away quiz solutions.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-sky-500 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-200">Adaptive Revision Schedules</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Dynamic study timetables based on your quiz retention history.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[11px]">
        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>Status: Coming Soon</span>
        </span>
        <button
          onClick={() => setIsDrawerOpen(false)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
