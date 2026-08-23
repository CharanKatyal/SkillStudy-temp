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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Skudium Studio</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
            Checking local offline workspace...
          </p>
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
