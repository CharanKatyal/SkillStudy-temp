import React, { useEffect, useState } from 'react';
import { Menu, Flame, Code2, Moon, Sun, Power, LogOut, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';
import { getAvatarDisplay } from '../../data/defaultAvatars';
import { Modal } from '../common/Modal';
import { PowerOffModal } from '../common/PowerOffModal';
import { TodayTimetableModal } from './TodayTimetableModal';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onPowerOff?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, onPowerOff }) => {
  const { activeNav, setActiveNav } = useApp();
  const { profile, progress, settings, updateSettings, scheduleStatus } = useData();
  const [isPowerOffModalOpen, setIsPowerOffModalOpen] = useState(false);
  const [isTodayScheduleOpen, setIsTodayScheduleOpen] = useState(false);

  const titles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview of your learning and schedule' },
    academics: { title: 'Academics', subtitle: 'Curriculum subjects and learning roadmaps' },
    skills: { title: 'Skills', subtitle: 'Programming and development tracks' },
    practice: { title: 'Practice Hub', subtitle: 'Quizzes and assessments' },
    ide: { title: 'Code Studio', subtitle: 'Offline code editor and live preview' },
    projects: { title: 'Projects', subtitle: 'Milestones and tasks' },
    planner: { title: 'Study Planner', subtitle: 'Timetable and daily tasks' },
    achievements: { title: 'Achievements', subtitle: 'Badges and portfolio transcript' },
    settings: { title: 'Settings', subtitle: 'Profile and preferences' }
  };

  const currentInfo = titles[activeNav] || { title: 'Skudium', subtitle: 'Student Workspace' };

  const avatarInfo = getAvatarDisplay(profile?.avatarUrl, profile?.displayName);

  const handlePowerOff = () => {
    if (onPowerOff) {
      onPowerOff();
    } else {
      setIsPowerOffModalOpen(true);
    }
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    const nextTheme: 'dark' | 'light' = isDark ? 'light' : 'dark';

    if (nextTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    const currentSettings = settings || {
      theme: nextTheme,
      editor: { fontSize: 14, tabSize: 2, lineNumbers: true, wordWrap: true },
      accessibility: { highContrast: false, reducedMotion: false, dyslexicFont: false }
    };

    updateSettings({ ...currentSettings, theme: nextTheme });
  };

  return (
    <>
      <header className="h-16 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {currentInfo.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real-time Schedule & Timetable Status Pill */}
          <button
            onClick={() => setIsTodayScheduleOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition shadow-sm ${
              scheduleStatus.isSchoolTime
                ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:border-sky-400'
                : scheduleStatus.statusType === 'break'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:border-emerald-400'
                : scheduleStatus.activeSlot
                ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-300 dark:border-brand-800 text-brand-700 dark:text-brand-300 hover:border-brand-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
            title="Click to view today's complete schedule"
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${
              scheduleStatus.isSchoolTime
                ? 'bg-sky-500 animate-pulse'
                : scheduleStatus.activeSlot
                ? 'bg-brand-500 animate-pulse'
                : 'bg-slate-400'
            }`} />
            <span className="truncate max-w-[130px] sm:max-w-[190px]">
              {scheduleStatus.isSchoolTime ? '🏫 School Hours' : scheduleStatus.title}
            </span>
            {scheduleStatus.formattedRemainingTime && (
              <span className="hidden md:inline text-[11px] opacity-80 font-normal">
                ({scheduleStatus.formattedRemainingTime})
              </span>
            )}
          </button>

          {/* Streak Counter */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-semibold"
            title={`${progress?.streak?.current || 1} Day Learning Streak`}
          >
            <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">{progress?.streak?.current || 1} day streak</span>
            <span className="sm:hidden">{progress?.streak?.current || 1}d</span>
          </div>

          {/* Quick IDE button */}
          <button
            onClick={() => setActiveNav('ide')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
          >
            <Code2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>IDE Studio</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 transition"
            title="Toggle Dark / Light Theme"
          >
            <Sun className="w-4 h-4 hidden dark:block text-amber-400" />
            <Moon className="w-4 h-4 block dark:hidden text-slate-700" />
          </button>

          {/* Profile Chip */}
          <div
            onClick={() => setActiveNav('settings')}
            className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold shadow-sm bg-brand-600 text-white shrink-0">
              {avatarInfo.type === 'custom' && avatarInfo.imageUrl ? (
                <img src={avatarInfo.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : avatarInfo.type === 'predefined' ? (
                <div className={`w-full h-full bg-gradient-to-tr ${avatarInfo.bgGradient} flex items-center justify-center text-sm`}>
                  {avatarInfo.emojiOrIcon}
                </div>
              ) : (
                <span>{avatarInfo.initial}</span>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden xl:inline max-w-[120px] truncate">
              {profile?.displayName || 'Student'}
            </span>
          </div>

          {/* Top Right Power Off Button */}
          <button
            type="button"
            onClick={handlePowerOff}
            className="p-2 rounded-xl text-rose-500 hover:text-white hover:bg-rose-600 dark:text-rose-400 dark:hover:text-white dark:hover:bg-rose-600 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 transition shadow-sm shrink-0"
            title="Power Off / Close Application"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Today's Timetable Modal */}
      <TodayTimetableModal
        isOpen={isTodayScheduleOpen}
        onClose={() => setIsTodayScheduleOpen(false)}
      />

      {/* Power Off Confirmation & Local Storage Save Modal (used if Header is standalone) */}
      {!onPowerOff && (
        <PowerOffModal
          isOpen={isPowerOffModalOpen}
          onClose={() => setIsPowerOffModalOpen(false)}
        />
      )}
    </>
  );
};
