import React from 'react';
import { Menu, Flame, Code2, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { activeNav, setActiveNav } = useApp();
  const { profile, progress, settings, updateSettings } = useData();

  const titles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview of your learning progress and projects' },
    academics: { title: 'Academic Studies', subtitle: 'Structured mathematics, science, and english curricula' },
    skills: { title: 'Practical Skills', subtitle: 'Modern web development, programming, tools, and UI/UX design' },
    learn: { title: 'Learning Paths', subtitle: 'Interactive step-by-step master roadmaps' },
    practice: { title: 'Practice Hub', subtitle: 'Quizzes, conceptual assessments, and coding challenges' },
    ide: { title: 'Code Studio', subtitle: 'Multi-language editor with live browser runtime & console' },
    projects: { title: 'Projects', subtitle: 'Milestone management, task checklists, and workspace links' },
    planner: { title: 'Study Planner', subtitle: 'Interactive timetable and scheduled study tasks' },
    portfolio: { title: 'Student Portfolio', subtitle: 'Exportable showcase of verified skills and projects' },
    achievements: { title: 'Achievements', subtitle: 'Unlock badges and celebrate learning milestones' },
    settings: { title: 'Settings', subtitle: 'Profile preferences, editor styles, and local data backup' }
  };

  const currentInfo = titles[activeNav] || { title: 'Skudium', subtitle: 'Student Learning & Code Platform' };

  const toggleTheme = () => {
    if (!settings) return;
    const isDark = document.documentElement.classList.contains('dark');
    const nextTheme = isDark ? 'light' : 'dark';
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    updateSettings({ ...settings, theme: nextTheme });
  };

  return (
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
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {profile?.displayName ? profile.displayName[0].toUpperCase() : 'S'}
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden xl:inline max-w-[120px] truncate">
            {profile?.displayName || 'Student'}
          </span>
        </div>
      </div>
    </header>
  );
};
