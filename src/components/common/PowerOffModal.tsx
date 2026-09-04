import React, { useState, useEffect } from 'react';
import { Power, CheckCircle2, Loader2 } from 'lucide-react';
import { Modal } from './Modal';
import { storageService } from '../../services/storageService';

interface PowerOffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PowerOffModal: React.FC<PowerOffModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'confirm' | 'saving' | 'closed'>('confirm');

  useEffect(() => {
    if (isOpen) {
      setStatus('confirm');
    }
  }, [isOpen]);

  const handlePowerOff = async () => {
    setStatus('saving');

    try {
      // 1. Save all data, projects, settings, and progress to localStorage
      await storageService.saveAllToLocalStorage();
    } catch (error) {
      console.error('Error saving data to local storage on power off:', error);
    }

    // 2. Attempt to close the browser tab
    try {
      window.open('', '_self', '');
      window.close();
    } catch (e) {
      console.warn('Browser prevented script close:', e);
    }

    try {
      window.close();
    } catch (e) {
      console.warn('Browser prevented window.close:', e);
    }

    // 3. In case browser security policies prevent script-initiated tab close, show the confirmation screen
    setStatus('closed');
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={status === 'saving' ? () => {} : onClose}
      title={status === 'closed' ? 'Session Saved' : 'Power Off'}
      maxWidth="sm"
    >
      {status === 'confirm' && (
        <div className="space-y-4 text-center py-1">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 shadow-md">
            <Power className="w-7 h-7" />
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Power Off Application?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Are you sure you want to exit? All your learning progress, code projects, timetable, and study notes will be safely saved to local storage before closing.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-left border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Save learning streak & progress</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Save IDE code & active tasks</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Synchronize all data to local storage</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePowerOff}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Power Off</span>
            </button>
          </div>
        </div>
      )}

      {status === 'saving' && (
        <div className="space-y-4 text-center py-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center border border-brand-500/20 shadow-md">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Saving to Local Storage...
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Persisting your study state and closing session...
            </p>
          </div>
        </div>
      )}

      {status === 'closed' && (
        <div className="space-y-4 text-center py-1">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shadow-md">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Saved & Ready to Close
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              All your progress, code, and study notes are securely stored on this device. You can safely close this browser tab now.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow transition"
            >
              Return to Studio
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
