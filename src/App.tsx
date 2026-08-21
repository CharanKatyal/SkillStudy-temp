import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DataProvider, useData } from './context/DataContext';
import { IDEProvider } from './context/IDEContext';
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

const MainViewRouter: React.FC = () => {
  const { activeNav } = useApp();
  const { loading } = useData();

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-semibold tracking-wide">
          Loading StillSkudy Offline Storage...
        </p>
      </div>
    );
  }

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

export function App() {
  return (
    <AppProvider>
      <DataProvider>
        <IDEProvider>
          <AppLayout>
            <MainViewRouter />
          </AppLayout>
        </IDEProvider>
      </DataProvider>
    </AppProvider>
  );
}

export default App;
