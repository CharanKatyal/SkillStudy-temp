import React from 'react';
import { Menu, Flame, Code2, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';
import { SyncStatusIndicator } from '../sync/SyncStatusIndicator';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { activeNav, setActiveNav } = useApp();
  const { profile, progress, settings, updateSettings } = useData();

  const titles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Student Dashboard', subtitle: 'Overview of your learning journey and projects' },
    academics: { title: 'Academic Studies', subtitle: 'Structured mathematics, science, and english subjects' },
    skills: { title: 'Practical Skills', subtitle: 'Modern web development, coding, tools, and UI/UX design' },
    learn: { title: 'Learning Paths', subtitle: 'Step-by-step master roadmaps' },
    practice: { title: 'Practice Hub', subtitle: 'Quizzes, true/false, short answers, and code challenges' },
    ide: { title: 'Multi-Language Offline IDE', subtitle: 'HTML, CSS, JS, Python, C++, Java browser sandbox' },
    projects: { title: 'Project Management', subtitle: 'Milestones, tasks, and portfolio links' },
    foss: { title: 'Open Source (FOSS) Hub', subtitle: 'Contribute to beginner-friendly repositories & PRs' },
    mentors: { title: 'Mentorship Network', subtitle: '1-on-1 office hours and expert code reviews' },
    school: { title: 'School & Classroom LMS', subtitle: 'Assignments, due dates, and academic submissions' },
    opportunities: { title: 'Real-World Client Projects & Grants', subtitle: 'Build production apps & earn educational stipends' },
    planner: { title: 'Study Planner', subtitle: 'Manual calendar and schedule tasks' },
    portfolio: { title: 'Student Showcase Portfolio', subtitle: 'Exportable resume of your projects and skills' },
    achievements: { title: 'Achievements & Milestones', subtitle: 'Unlock badges through real offline progress' },
    parent: { title: 'Guardian & Parent Review', subtitle: 'Learning oversight, study hours, and academic reports' },
    settings: { title: 'Settings & Data Backup', subtitle: 'Theme, editor preferences, JSON backup and restore' }
  };

  const currentInfo = titles[activeNav] || { title: 'SkillForge', subtitle: '100% Offline Learning Platform' };

  const toggleTheme = () => {
    if (!settings) return;
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ ...settings, theme: nextTheme });
  };

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-100 leading-tight">
            {currentInfo.title}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Offline Status & Profile Indicator */}
        <SyncStatusIndicator />

        {/* Streak Counter */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-semibold"
          title={`${progress?.streak?.current || 1} Day Learning Streak`}
        >
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="hidden sm:inline">{progress?.streak?.current || 1}d streak</span>
          <span className="sm:hidden">{progress?.streak?.current || 1}d</span>
        </div>

        {/* Quick IDE button */}
        <button
          onClick={() => setActiveNav('ide')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition"
        >
          <Code2 className="w-4 h-4 text-brand-400" />
          <span>IDE</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          title="Toggle Theme"
        >
          {settings?.theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Profile Chip */}
        <div
          onClick={() => setActiveNav('settings')}
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
            {profile?.displayName ? profile.displayName[0].toUpperCase() : 'S'}
          </div>
          <span className="text-xs font-semibold text-slate-200 hidden xl:inline max-w-[120px] truncate">
            {profile?.displayName || 'Student'}
          </span>
        </div>
      </div>
    </header>
  );
};
