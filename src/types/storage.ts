import {
  UserProfile,
  UserSettings,
  UserProgressState,
  IdeProject,
  ManagedProject,
  PlannerTask,
  PortfolioData,
  Achievement,
  PracticeAttempt
} from './index';

export interface SkillForgeBackup {
  version: string | number;
  exportedAt: string;
  app: 'SkillForge' | 'StillSkudy';
  profile: UserProfile;
  settings: UserSettings;
  progress: UserProgressState;
  ideProjects: IdeProject[];
  managedProjects: ManagedProject[];
  plannerTasks: PlannerTask[];
  portfolio: PortfolioData;
  achievements: Achievement[];
  practiceAttempts: PracticeAttempt[];
}

export type StillSkudyBackup = SkillForgeBackup;

export type StoreName =
  | 'profile'
  | 'settings'
  | 'progress'
  | 'ide_projects'
  | 'managed_projects'
  | 'planner_tasks'
  | 'portfolio'
  | 'achievements'
  | 'practice_attempts';
