import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  UserSettings,
  UserProgressState,
  IdeProject,
  ManagedProject,
  PlannerTask,
  PortfolioData,
  Achievement,
  PracticeAttempt,
  StudentSchedule
} from '../types';
import { storageService } from '../services/storageService';
import { achievementEngine } from '../services/achievementEngine';
import { scheduleService, ScheduleStatus } from '../services/scheduleService';
import { DEFAULT_STUDENT_SCHEDULE } from '../data/defaultSchedules';
import { useApp } from './AppContext';

interface DataContextType {
  loading: boolean;
  profile: UserProfile | null;
  settings: UserSettings | null;
  progress: UserProgressState | null;
  schedule: StudentSchedule | null;
  scheduleStatus: ScheduleStatus;
  ideProjects: IdeProject[];
  managedProjects: ManagedProject[];
  plannerTasks: PlannerTask[];
  portfolio: PortfolioData | null;
  achievements: Achievement[];
  practiceAttempts: PracticeAttempt[];
  refreshData: () => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  updateSettings: (settings: UserSettings) => Promise<void>;
  updateSchedule: (schedule: StudentSchedule) => Promise<void>;
  markLessonComplete: (lessonId: string) => Promise<void>;
  markChallengeComplete: (challengeId: string, code?: string) => Promise<void>;
  saveLessonNote: (lessonId: string, notes: string) => Promise<void>;
  saveIdeProject: (project: IdeProject) => Promise<void>;
  deleteIdeProject: (id: string) => Promise<void>;
  saveManagedProject: (project: ManagedProject) => Promise<void>;
  deleteManagedProject: (id: string) => Promise<void>;
  savePlannerTask: (task: PlannerTask) => Promise<void>;
  deletePlannerTask: (id: string) => Promise<void>;
  togglePlannerTask: (id: string) => Promise<void>;
  updatePortfolio: (portfolio: PortfolioData) => Promise<void>;
  recordPracticeAttempt: (attempt: PracticeAttempt) => Promise<void>;
  resetAllData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast, setUnlockedAchievementPopup } = useApp();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [progress, setProgress] = useState<UserProgressState | null>(null);
  const [schedule, setSchedule] = useState<StudentSchedule | null>(null);
  const [ideProjects, setIdeProjects] = useState<IdeProject[]>([]);
  const [managedProjects, setManagedProjects] = useState<ManagedProject[]>([]);
  const [plannerTasks, setPlannerTasks] = useState<PlannerTask[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [practiceAttempts, setPracticeAttempts] = useState<PracticeAttempt[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Real-time clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 15000); // refresh every 15s
    return () => clearInterval(timer);
  }, []);

  const scheduleStatus = scheduleService.getCurrentStatus(schedule || DEFAULT_STUDENT_SCHEDULE, currentTime);

  const checkAchievements = useCallback(async () => {
    const newlyUnlocked = await achievementEngine.evaluateAchievements();
    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach(ach => {
        addToast(`🏆 Achievement Unlocked: ${ach.title}!`, ach.description, 'achievement');
      });
      const updated = await storageService.getAchievements();
      setAchievements(updated);
    }
  }, [addToast]);

  const refreshData = useCallback(async () => {
    try {
      // 1. Load profile and settings first
      const [p, s, sched] = await Promise.all([
        storageService.getProfile(),
        storageService.getSettings(),
        storageService.getSchedule()
      ]);

      setProfile(p);
      setSettings(s);
      setSchedule(sched);

      // Immediately sync DOM theme
      const root = document.documentElement;
      if (s?.theme === 'light') {
        root.classList.remove('dark');
      } else if (s?.theme === 'dark') {
        root.classList.add('dark');
      } else {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isSystemDark) root.classList.add('dark');
        else root.classList.remove('dark');
      }

      if (!p) {
        // First-time visitor / no profile -> immediately unblock
        setLoading(false);
        return;
      }

      // 2. Load remaining stores in parallel for existing profile
      const [
        prog,
        ideProjs,
        manProjs,
        tasks,
        port,
        achs,
        attempts
      ] = await Promise.all([
        storageService.getProgress(),
        storageService.getIdeProjects(),
        storageService.getManagedProjects(),
        storageService.getPlannerTasks(),
        storageService.getPortfolio(),
        storageService.getAchievements(),
        storageService.getPracticeAttempts()
      ]);

      setProgress(prog);
      setIdeProjects(ideProjs);
      setManagedProjects(manProjs);
      setPlannerTasks(tasks);
      setPortfolio(port);
      setAchievements(achs);
      setPracticeAttempts(attempts);
    } catch (err) {
      console.error('Failed to load local offline data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Apply theme class to <html> element whenever settings change
  useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      if (settings.theme === 'dark') {
        root.classList.add('dark');
      } else if (settings.theme === 'light') {
        root.classList.remove('dark');
      } else {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isSystemDark) root.classList.add('dark');
        else root.classList.remove('dark');
      }
    }
  }, [settings]);

  const updateProfile = async (newProfile: UserProfile) => {
    await storageService.saveProfile(newProfile);
    setProfile(newProfile);
    if (!settings) {
      await refreshData();
    }
    addToast('Profile Updated', 'Your profile details have been saved locally.', 'success');
  };

  const updateSettings = async (newSettings: UserSettings) => {
    const root = document.documentElement;
    if (newSettings.theme === 'dark') {
      root.classList.add('dark');
    } else if (newSettings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSystemDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
    await storageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const updateSchedule = async (newSchedule: StudentSchedule) => {
    await storageService.saveSchedule(newSchedule);
    setSchedule(newSchedule);
    addToast('Timetable Updated ⏰', 'Your daily schedule has been synchronized.', 'success');
  };

  const markLessonComplete = async (lessonId: string) => {
    const updated = await storageService.markLessonComplete(lessonId);
    setProgress(updated);
    addToast('Lesson Completed! 🎓', 'Great job! Lesson marked as completed.', 'success');
    await checkAchievements();
  };

  const markChallengeComplete = async (challengeId: string, code?: string) => {
    const updated = await storageService.markChallengeComplete(challengeId, code);
    setProgress(updated);
    addToast('Challenge Solved! ⚡', 'Coding challenge successfully verified and completed.', 'success');
    await checkAchievements();
  };

  const saveLessonNote = async (lessonId: string, notes: string) => {
    await storageService.saveLessonNotes(lessonId, notes);
    const updated = await storageService.getProgress();
    setProgress(updated);
    addToast('Notes Saved', 'Your study notes are saved locally.', 'info');
  };

  const saveIdeProject = async (project: IdeProject) => {
    await storageService.saveIdeProject(project);
    const updated = await storageService.getIdeProjects();
    setIdeProjects(updated);
    await checkAchievements();
  };

  const deleteIdeProject = async (id: string) => {
    await storageService.deleteIdeProject(id);
    const updated = await storageService.getIdeProjects();
    setIdeProjects(updated);
    addToast('Project Removed', 'IDE project has been deleted.', 'info');
  };

  const saveManagedProject = async (project: ManagedProject) => {
    await storageService.saveManagedProject(project);
    const updated = await storageService.getManagedProjects();
    setManagedProjects(updated);
    addToast('Project Saved', `Project "${project.name}" has been updated.`, 'success');
    await checkAchievements();
  };

  const deleteManagedProject = async (id: string) => {
    await storageService.deleteManagedProject(id);
    const updated = await storageService.getManagedProjects();
    setManagedProjects(updated);
    addToast('Project Deleted', 'Project has been removed.', 'info');
  };

  const savePlannerTask = async (task: PlannerTask) => {
    await storageService.savePlannerTask(task);
    const updated = await storageService.getPlannerTasks();
    setPlannerTasks(updated);
    addToast('Planner Updated', `Task "${task.title}" saved.`, 'success');
    await checkAchievements();
  };

  const deletePlannerTask = async (id: string) => {
    await storageService.deletePlannerTask(id);
    const updated = await storageService.getPlannerTasks();
    setPlannerTasks(updated);
    addToast('Task Deleted', 'Planner task removed.', 'info');
  };

  const togglePlannerTask = async (id: string) => {
    const task = plannerTasks.find(t => t.id === id);
    if (!task) return;
    const updatedTask = { ...task, completed: !task.completed };
    await storageService.savePlannerTask(updatedTask);
    const updated = await storageService.getPlannerTasks();
    setPlannerTasks(updated);
    await checkAchievements();
  };

  const updatePortfolio = async (newPortfolio: PortfolioData) => {
    await storageService.savePortfolio(newPortfolio);
    setPortfolio(newPortfolio);
    addToast('Portfolio Saved', 'Your student portfolio has been updated.', 'success');
    await checkAchievements();
  };

  const recordPracticeAttempt = async (attempt: PracticeAttempt) => {
    await storageService.recordPracticeAttempt(attempt);
    const attempts = await storageService.getPracticeAttempts();
    setPracticeAttempts(attempts);
    const prog = await storageService.getProgress();
    setProgress(prog);
    await checkAchievements();
  };

  const resetAllData = async () => {
    await storageService.resetAllData();
    await refreshData();
    addToast('Data Reset', 'All local data has been reset to defaults.', 'warning');
  };

  return (
    <DataContext.Provider
      value={{
        loading,
        profile,
        settings,
        progress,
        schedule,
        scheduleStatus,
        ideProjects,
        managedProjects,
        plannerTasks,
        portfolio,
        achievements,
        practiceAttempts,
        refreshData,
        updateProfile,
        updateSettings,
        updateSchedule,
        markLessonComplete,
        markChallengeComplete,
        saveLessonNote,
        saveIdeProject,
        deleteIdeProject,
        saveManagedProject,
        deleteManagedProject,
        savePlannerTask,
        deletePlannerTask,
        togglePlannerTask,
        updatePortfolio,
        recordPracticeAttempt,
        resetAllData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
