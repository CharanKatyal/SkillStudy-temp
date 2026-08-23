import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { IDEProvider } from './context/IDEContext';
import { AIProvider } from './context/AIContext';
import { AppLayout } from './components/layout/AppLayout';

import { DashboardView } from './components/dashboard/DashboardView';
import { AcademicsView } from './components/academics/AcademicsView';
import { SkillsView } from './components/skills/SkillsView';
import { LearnView } from './components/learn/LearnView';
import { PracticeView } from './components/practice/PracticeView';
import { IDEView } from './components/ide/IDEView';
import { ProjectsView } from './components/projects/ProjectsView';
import { PlannerView } from './components/planner/PlannerView';
import { PortfolioView } from './components/portfolio/PortfolioView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { SettingsView } from './components/settings/SettingsView';

import { OnboardingView } from './components/auth/OnboardingView';

const MainViewRouter: React.FC = () => {
  const { activeNav } = useApp();

  switch (activeNav) {
    case 'dashboard':
      return <DashboardView />;
    case 'academics':
      return <AcademicsView />;
    case 'skills':
      return <SkillsView />;
    case 'learn':
      return <LearnView />;
    case 'practice':
      return <PracticeView />;
    case 'ide':
      return <IDEView />;
    case 'projects':
      return <ProjectsView />;
    case 'planner':
      return <PlannerView />;
    case 'portfolio':
      return <PortfolioView />;
    case 'achievements':
      return <AchievementsView />;
    case 'settings':
      return <SettingsView />;
    default:
      return <DashboardView />;
  }
};

const MainAppContent: React.FC = () => {
  const { loading, profile } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors">
        <div className="flex flex-col items-center space-y-6 animate-fadeIn">
          {/* Animated Glowing Brand Icon */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500/30 via-cyan-500/20 to-blue-600/30 animate-ping opacity-60 pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-blue-600 p-0.5 shadow-2xl relative z-10 animate-pulse">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Skudium Studio
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide ml-1">
                Checking local storage...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <OnboardingView />;
  }

  return (
    <AppLayout>
      <MainViewRouter />
    </AppLayout>
  );
};

export function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <DataProvider>
          <IDEProvider>
            <AIProvider>
              <MainAppContent />
            </AIProvider>
          </IDEProvider>
        </DataProvider>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
