import React, { useState, useRef } from 'react';
import {
  Upload,
  UserPlus,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Power,
  Clock,
  School,
  CheckCircle2,
  Calendar,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { backupService } from '../../services/backupService';
import { UserProfile, StudentSchedule } from '../../types';
import { AvatarSelector } from '../common/AvatarSelector';
import { TimetableBuilder } from '../planner/TimetableBuilder';
import { PowerOffModal } from '../common/PowerOffModal';
import { DEFAULT_STUDENT_SCHEDULE } from '../../data/defaultSchedules';

export const OnboardingView: React.FC = () => {
  const { updateProfile, updateSchedule, updateSettings, settings, refreshData } = useData();
  const { addToast } = useApp();

  const [step, setStep] = useState<'welcome' | 'profile' | 'timetable'>('welcome');
  const [displayName, setDisplayName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('10th Grade');
  const [avatarUrl, setAvatarUrl] = useState('avatar-scholar');
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light' | 'system'>(settings?.theme || 'dark');
  const [schedule, setSchedule] = useState<StudentSchedule>(DEFAULT_STUDENT_SCHEDULE);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [isPowerOffOpen, setIsPowerOffOpen] = useState(false);

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
    setIsPowerOffOpen(true);
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

  const handleThemeChange = (theme: 'dark' | 'light' | 'system') => {
    setSelectedTheme(theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }

    const currentSettings = settings || {
      theme,
      editor: { fontSize: 14, tabSize: 2, lineNumbers: true, wordWrap: true },
      accessibility: { highContrast: false, reducedMotion: false, dyslexicFont: false }
    };

    updateSettings({ ...currentSettings, theme });
  };

  const handleProfileNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setStep('timetable');
  };

  const handleLaunchOpenMode = async () => {
    if (!displayName.trim()) return;

    const newProfile: UserProfile = {
      displayName: displayName.trim(),
      gradeLevel: gradeLevel.trim(),
      bio: '',
      avatarIcon: 'GraduationCap',
      avatarUrl: avatarUrl,
      joinedAt: new Date().toISOString()
    };

    const openSchedule: StudentSchedule = {
      ...schedule,
      mode: 'open',
      hasCustomTimetable: false,
      lastUpdated: new Date().toISOString()
    };

    await updateSchedule(openSchedule);
    await updateProfile(newProfile);

    addToast(`Welcome to Skudium, ${newProfile.displayName}! 🚀`, 'Full Open (Free Learning) mode is active.', 'success');
  };

  const handleFinishOnboarding = async () => {
    if (!displayName.trim()) return;

    const newProfile: UserProfile = {
      displayName: displayName.trim(),
      gradeLevel: gradeLevel.trim(),
      bio: '',
      avatarIcon: 'GraduationCap',
      avatarUrl: avatarUrl,
      joinedAt: new Date().toISOString()
    };

    await updateSchedule(schedule);
    await updateProfile(newProfile);

    addToast(`Welcome to Skudium, ${newProfile.displayName}! 🚀`, 'Your personalized timetable and study workspace are active.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 transition-colors relative py-12">
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

      {step !== 'timetable' ? (
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl animate-fadeIn">
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

          {step === 'welcome' ? (
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Welcome to Skudium
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Create your profile to get started or restore existing data.
                </p>
              </div>

              {importError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{importError}</span>
                </div>
              )}

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('profile')}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-brand-600 hover:from-emerald-600 hover:to-brand-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl transition flex items-center justify-center gap-2 group"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create New Student Profile</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <div className="relative flex items-center justify-center py-2">
                  <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                  <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
                    or
                  </span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={handleImportClick}
                  disabled={isImporting}
                  className="w-full py-3 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>{isImporting ? 'Restoring Data...' : 'Import from JSON Backup'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Step 1: Profile & Avatar Setup */
            <form onSubmit={handleProfileNext} className="space-y-5">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('welcome')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  Step 1 of 2: Profile
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Student Profile Setup
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter your name, grade, avatar, and preferred theme.
                </p>
              </div>

              {/* Avatar Selector */}
              <AvatarSelector
                selectedAvatarUrl={avatarUrl}
                displayName={displayName}
                onSelectAvatar={setAvatarUrl}
              />

              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Display Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex, Maya, Jordan"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Class / Grade Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Class / Grade Level
                </label>
                <select
                  value={gradeLevel}
                  onChange={e => setGradeLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {gradeOptions.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Theme Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleThemeChange('dark')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition ${
                      selectedTheme === 'dark'
                        ? 'bg-emerald-50 dark:bg-slate-800 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThemeChange('light')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition ${
                      selectedTheme === 'light'
                        ? 'bg-emerald-50 dark:bg-slate-800 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThemeChange('system')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition ${
                      selectedTheme === 'system'
                        ? 'bg-emerald-50 dark:bg-slate-800 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>System</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={!displayName.trim()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-brand-600 hover:from-emerald-600 hover:to-brand-700 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl transition flex items-center justify-center gap-2 group"
                >
                  <span>Continue to Timetable Setup</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <button
                  type="button"
                  onClick={handleLaunchOpenMode}
                  disabled={!displayName.trim()}
                  className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-50 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Start with Full Open Mode (No Timetable)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Step 2: Full-Page Timetable Configuration */
        <div className="max-w-4xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl animate-fadeIn my-4 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('profile')}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                    Create Your Daily Timetable
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                    Step 2 of 2
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Set up your school hours, study blocks, and coding sessions. The website will synchronize with this schedule in real time.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinishOnboarding}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-brand-600 hover:from-emerald-600 hover:to-brand-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl transition flex items-center justify-center gap-2 shrink-0"
            >
              <span>Launch My Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Timetable Builder */}
          <TimetableBuilder
            schedule={schedule}
            onSaveSchedule={setSchedule}
            isStandalone
          />

          {/* Bottom Action */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep('profile')}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Profile Details</span>
            </button>

            <button
              type="button"
              onClick={handleFinishOnboarding}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-brand-600 hover:from-emerald-600 hover:to-brand-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Timetable &amp; Launch Skudium</span>
            </button>
          </div>
        </div>
      )}

      {/* Power Off Confirmation Modal */}
      <PowerOffModal
        isOpen={isPowerOffOpen}
        onClose={() => setIsPowerOffOpen(false)}
      />
    </div>
  );
};
