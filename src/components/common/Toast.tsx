import React from 'react';
import { CheckCircle, AlertCircle, Info, Trophy, X } from 'lucide-react';
import { ToastNotification } from '../../context/AppContext';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
          warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
          achievement: <Trophy className="w-5 h-5 text-amber-500 shrink-0 animate-bounce" />
        };

        const bgStyles = {
          success: 'border-emerald-200 dark:border-emerald-800 bg-white/95 dark:bg-slate-900/95',
          warning: 'border-amber-200 dark:border-amber-800 bg-white/95 dark:bg-slate-900/95',
          info: 'border-sky-200 dark:border-sky-800 bg-white/95 dark:bg-slate-900/95',
          achievement: 'border-amber-300 dark:border-amber-700 bg-amber-50/95 dark:bg-slate-900/95'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${bgStyles[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{toast.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
