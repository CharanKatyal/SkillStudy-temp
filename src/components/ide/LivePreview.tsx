import React, { useState } from 'react';
import {
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useIDE } from '../../context/IDEContext';

export const LivePreview: React.FC = () => {
  const { previewUrl, runProject, isRunning } = useIDE();
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  };

  const handleOpenWindow = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank', 'width=800,height=600');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
      {/* Preview Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60 select-none">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
            Live Preview
          </span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 px-1.5 py-0.5 rounded font-semibold">
            <ShieldCheck className="w-3 h-3" />
            <span>Sandboxed</span>
          </span>
        </div>

        {/* Viewport controls & actions */}
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1 rounded transition ${
                viewportMode === 'desktop' ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-400'
              }`}
              title="Desktop view"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-1 rounded transition ${
                viewportMode === 'tablet' ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-400'
              }`}
              title="Tablet view"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1 rounded transition ${
                viewportMode === 'mobile' ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-400'
              }`}
              title="Mobile view"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={runProject}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Reload Preview"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenWindow}
            disabled={!previewUrl}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
            title="Open in pop-up window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-2 overflow-hidden">
        {previewUrl ? (
          <div
            className={`h-full ${viewportWidths[viewportMode]} transition-all duration-300 bg-white rounded-lg shadow-xl overflow-hidden border border-slate-300 dark:border-slate-800`}
          >
            <iframe
              src={previewUrl}
              title="Skudium Sandboxed Preview"
              sandbox="allow-scripts"
              className="w-full h-full border-0 bg-white"
            />
          </div>
        ) : (
          <div className="text-center text-slate-400 text-xs space-y-2">
            <p>Sandbox not active.</p>
            <button
              onClick={runProject}
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-semibold"
            >
              Click Run to Render
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
