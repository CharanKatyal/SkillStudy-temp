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
  Briefcase,
  Trophy,
  Settings,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NavSection } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

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
  const { isParent } = useAuth();

  const navItems: { id: NavSection | 'parent'; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Sparkles },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: CheckCircle2 },
    { id: 'ide', label: 'IDE / Code', icon: Code2 },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'planner', label: 'Planner', icon: CalendarCheck },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    ...(isParent ? [{ id: 'parent' as const, label: 'Parent Portal', icon: Heart }] : []),
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
            onClick={() => setActiveNav('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-brand-900/30 shrink-0">
              <span className="font-extrabold text-lg tracking-tight">SS</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-base text-slate-100 tracking-tight leading-tight">
                  StillSkudy
                </span>
                <span className="text-[10px] text-emerald-400 font-medium tracking-wide uppercase">
                  Offline &amp; Cloud PWA
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id as NavSection);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition group relative ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-400 font-semibold border border-brand-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition ${
                    isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {isActive && (
                  <span className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-brand-400 shadow-sm shadow-brand-400/50" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Local Storage / Cloud Indicator Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            {!collapsed && (
              <div className="truncate">
                <p className="text-[11px] font-semibold text-slate-200">Local Device Active</p>
                <p className="text-[10px] text-slate-500">IndexedDB Engine</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
