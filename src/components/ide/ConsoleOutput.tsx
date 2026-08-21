import React from 'react';
import { Terminal, Trash2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useIDE } from '../../context/IDEContext';

export const ConsoleOutput: React.FC = () => {
  const { consoleLogs, clearConsole } = useIDE();

  return (
    <div className="h-full flex flex-col bg-slate-950 border-t border-slate-800 font-mono text-xs">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/90 select-none">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal className="w-3.5 h-3.5 text-brand-400" />
          <span className="font-bold text-[11px] uppercase tracking-wider">Console / Output</span>
          <span className="text-[10px] text-slate-500">({consoleLogs.length} logs)</span>
        </div>

        <button
          onClick={clearConsole}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded hover:bg-slate-800 transition"
          title="Clear Console"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      {/* Logs Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 select-text">
        {consoleLogs.length === 0 ? (
          <div className="text-slate-600 text-xs py-2">
            &gt; Console is ready. Logs from your JavaScript code will appear here.
          </div>
        ) : (
          consoleLogs.map(log => {
            const styles = {
              log: 'text-slate-200',
              warn: 'text-amber-300 bg-amber-950/20 px-2 py-0.5 rounded',
              error: 'text-rose-400 bg-rose-950/20 px-2 py-0.5 rounded',
              info: 'text-sky-300'
            };

            const icons = {
              log: <span className="text-slate-600">&gt;</span>,
              warn: <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />,
              error: <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />,
              info: <Info className="w-3 h-3 text-sky-400 shrink-0" />
            };

            return (
              <div
                key={log.id}
                className={`flex items-start gap-2 text-xs leading-relaxed font-mono ${styles[log.type]}`}
              >
                <div className="mt-0.5">{icons[log.type]}</div>
                <span className="text-[10px] text-slate-600 select-none shrink-0">
                  [{log.timestamp}]
                </span>
                <span className="flex-1 whitespace-pre-wrap break-all">{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
