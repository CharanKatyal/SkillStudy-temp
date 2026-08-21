import React, { useState } from 'react';
import {
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
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
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800">
      {/* Preview Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-850/60 select-none">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">
            Live Preview
          </span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
            <ShieldCheck className="w-3 h-3" />
            <span>Sandboxed</span>
          </span>
        </div>

        {/* Viewport controls & actions */}
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1 rounded ${
                viewportMode === 'desktop' ? 'bg-slate-800 text-brand-400' : 'text-slate-400'
              }`}
              title="Desktop view"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-1 rounded ${
                viewportMode === 'tablet' ? 'bg-slate-800 text-brand-400' : 'text-slate-400'
              }`}
              title="Tablet view"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1 rounded ${
                viewportMode === 'mobile' ? 'bg-slate-800 text-brand-400' : 'text-slate-400'
              }`}
              title="Mobile view"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={runProject}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="Reload Preview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleOpenWindow}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="Open in Popup"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sandboxed iframe container */}
      <div className="flex-1 bg-slate-950 flex items-center justify-center p-2 overflow-auto">
        {isRunning && previewUrl ? (
          <div
            className={`h-full bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-200 ${viewportWidths[viewportMode]}`}
          >
            <iframe
              src={previewUrl}
              title="StillSkudy Sandboxed Preview"
              sandbox="allow-scripts"
              className="w-full h-full border-0 bg-white"
            />
          </div>
        ) : (
          <div className="text-center text-slate-500 text-xs">
            Preview is paused. Click <strong>Run</strong> to render.
          </div>
        )}
      </div>
    </div>
  );
};
