import React, { useState, useRef } from 'react';
import {
  Upload,
  UserPlus,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Power
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { backupService } from '../../services/backupService';
import { UserProfile } from '../../types';
import { AvatarSelector } from '../common/AvatarSelector';

export const OnboardingView: React.FC = () => {
  const { updateProfile, refreshData } = useData();
  const { addToast } = useApp();

  const [mode, setMode] = useState<'welcome' | 'create'>('welcome');
  const [displayName, setDisplayName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('10th Grade');
  const [avatarUrl, setAvatarUrl] = useState('avatar-scholar');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const gradeOptions = [
    '1st Grade',
    '2nd Grade',
    '3rd Grade',
    '4th Grade',
    '5th Grade',
    '6th Grade',
    '7th Grade',
    '8th Grade',
    '9th Grade',
    '10th Grade',
    '11th Grade',
    '12th Grade'
  ];

  const handlePowerOff = () => {
    try {
      window.open('', '_self', '');
      window.close();
    } catch {}
  };

  const handleImportClick = () => {
    setImportError(null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);

    try {
      const text = await file.text();
      const result = await backupService.restoreFromBackupJson(text);

      if (result.success) {
        addToast('Welcome Back! 🎉', 'Your profile and data were successfully restored.', 'success');
        await refreshData();
      } else {
        setImportError(result.message || 'Invalid backup JSON file.');
      }
    } catch (err: any) {
      setImportError('Failed to read or parse backup file.');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    const newProfile: UserProfile = {
      displayName: displayName.trim(),
      gradeLevel: gradeLevel.trim(),
      bio: '',
      avatarIcon: 'GraduationCap',
      avatarUrl: avatarUrl,
      joinedAt: new Date().toISOString()
    };

    await updateProfile(newProfile);
    addToast(`Welcome to Skudium, ${newProfile.displayName}! 🚀`, 'Your local offline workspace is ready.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 transition-colors relative">
      {/* Top Right Power Off Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={handlePowerOff}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 text-rose-500 hover:text-white hover:bg-rose-600 border border-slate-200 dark:border-slate-800 shadow-md transition flex items-center gap-1.5 text-xs font-bold"
          title="Close / Exit Website"
        >
          <Power className="w-4 h-4" />
          <span className="hidden sm:inline">Close</span>
        </button>
      </div>

      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl animate-fadeIn my-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-blue-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              Skudium
            </h1>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wider uppercase">
              Learning Studio
            </p>
          </div>
        </div>

        {mode === 'welcome' ? (
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Get Started with Skudium
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                All learning modules, code studio, practice quizzes, and projects run 100% locally on your device.
              </p>
            </div>

            {importError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{importError}</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              {/* Option 1: Create New User */}
              <button
                onClick={() => setMode('create')}
                className="w-full p-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md transition flex items-center justify-between group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div>Create New User</div>
                    <div className="text-[11px] text-brand-100 font-normal">Choose avatar, name &amp; grade</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition shrink-0" />
              </button>

              {/* Option 2: Import from JSON */}
              <button
                onClick={handleImportClick}
                disabled={isImporting}
                className="w-full p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-sm transition flex items-center justify-between group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
                    <Upload className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div className="text-left">
                    <div>{isImporting ? 'Restoring Data...' : 'Import from JSON file'}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Restore from a previous backup file</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition text-slate-400 shrink-0" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>

            <div className="pt-2 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero server upload • 100% Private Offline Storage</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setMode('welcome')}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Create Student Profile
              </h2>
            </div>

            {/* Avatar & Illustration Selector */}
            <AvatarSelector
              selectedAvatarUrl={avatarUrl}
              displayName={displayName}
              onSelectAvatar={setAvatarUrl}
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Display Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Class / Grade Level <span className="text-rose-500">*</span>
              </label>
              <select
                value={gradeLevel}
                onChange={e => setGradeLevel(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500 transition cursor-pointer"
              >
                {gradeOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Learning</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
