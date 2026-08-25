import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Code2,
  FolderKanban,
  CalendarCheck,
  Award,
  Trophy,
  Settings,
  ChevronLeft,
  ChevronRight,
  Power
} from 'lucide-react';
import { NavSection } from '../../types';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const { activeNav, setActiveNav } = useApp();

  const navItems: { id: NavSection; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Sparkles },
    { id: 'practice', label: 'Practice', icon: CheckCircle2 },
    { id: 'ide', label: 'IDE Studio', icon: Code2 },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'planner', label: 'Planner', icon: CalendarCheck },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header with Vector Icon */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
            onClick={() => setActiveNav('dashboard')}
          >
            {/* Custom Skudium Vector Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-blue-600 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>

            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                  Skudium
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wider uppercase">
                  Learning Studio
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-xs transition group relative ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {isActive && (
                  <span className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-brand-500 shadow-sm shadow-brand-500/50" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Sidebar Power Action */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => {
              try {
                window.open('', '_self', '');
                window.close();
              } catch {}
            }}
            className={`w-full flex items-center ${
              collapsed ? 'justify-center' : 'justify-start'
            } gap-3 px-3 py-2.5 rounded-xl font-bold text-xs text-rose-500 hover:text-white hover:bg-rose-600 bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-850 transition`}
            title="Power Off / Exit"
          >
            <Power className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Power Off</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
