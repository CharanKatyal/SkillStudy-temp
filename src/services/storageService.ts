import { db, STORES } from './db';
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
import { INITIAL_ACHIEVEMENTS } from '../data/defaultAchievements';
import { PROJECT_TEMPLATES } from '../data/projectTemplates';
import { DEFAULT_STUDENT_SCHEDULE } from '../data/defaultSchedules';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  editor: {
    fontSize: 14,
    tabSize: 2,
    lineNumbers: true,
    wordWrap: true
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    dyslexicFont: false
  }
};

const DEFAULT_PROGRESS: UserProgressState = {
  completedLessons: {},
  completedChallenges: {},
  lessonNotes: {},
  streak: {
    current: 1,
    longest: 1,
    lastActiveDate: new Date().toISOString().split('T')[0]
  },
  stats: {
    lessonsCompleted: 0,
    challengesCompleted: 0,
    practiceQuizzesTaken: 0,
    practiceAccuracy: 100,
    projectsCompleted: 0,
    codingTimeMinutes: 0
  }
};

const DEFAULT_PORTFOLIO: PortfolioData = {
  customTitle: 'Student Developer & Thinker',
  bio: 'Building responsive offline web applications and exploring computer science fundamentals with Skudium.',
  skills: [
    { name: 'HTML5 Semantic Markup', level: 'Intermediate' },
    { name: 'Modern CSS & Flexbox', level: 'Intermediate' },
    { name: 'JavaScript Logic & DOM', level: 'Beginner' },
    { name: 'Algebra & Equations', level: 'Intermediate' },
    { name: 'Git & Version Control', level: 'Beginner' }
  ],
  featuredProjectIds: [],
  featuredIdeProjectIds: ['hello-world-starter-project'],
  showAchievements: true,
  showStats: true,
  socialLinks: {
    github: '',
    website: '',
    email: ''
  }
};

export class StorageService {
  // --- Profile ---
  async getProfile(): Promise<UserProfile | null> {
    const data = await db.get<UserProfile>(STORES.PROFILE, 'current_user');
    return data || null;
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    await db.put(STORES.PROFILE, profile, 'current_user');
  }

  // --- Settings ---
  async getSettings(): Promise<UserSettings> {
    const data = await db.get<UserSettings>(STORES.SETTINGS, 'user_settings');
    if (!data) {
      await this.saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...data };
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    await db.put(STORES.SETTINGS, settings, 'user_settings');
  }

  // --- Progress ---
  async getProgress(): Promise<UserProgressState> {
    const data = await db.get<UserProgressState>(STORES.PROGRESS, 'user_progress');
    if (!data) {
      await this.saveProgress(DEFAULT_PROGRESS);
      return DEFAULT_PROGRESS;
    }
    return data;
  }

  async saveProgress(progress: UserProgressState): Promise<void> {
    await db.put(STORES.PROGRESS, progress, 'user_progress');
  }

  async markLessonComplete(lessonId: string): Promise<UserProgressState> {
    const current = await this.getProgress();
    const now = new Date().toISOString();
    const updated: UserProgressState = {
      ...current,
      completedLessons: {
        ...current.completedLessons,
        [lessonId]: { completedAt: now }
      },
      stats: {
        ...current.stats,
        lessonsCompleted: Object.keys(current.completedLessons).includes(lessonId)
          ? current.stats.lessonsCompleted
          : current.stats.lessonsCompleted + 1
      }
    };
    await this.saveProgress(updated);
    await this.updateStreak();
    return updated;
  }

  async markChallengeComplete(challengeId: string, code?: string): Promise<UserProgressState> {
    const current = await this.getProgress();
    const now = new Date().toISOString();
    const updated: UserProgressState = {
      ...current,
      completedChallenges: {
        ...current.completedChallenges,
        [challengeId]: { completedAt: now, code }
      },
      stats: {
        ...current.stats,
        challengesCompleted: Object.keys(current.completedChallenges).includes(challengeId)
          ? current.stats.challengesCompleted
          : current.stats.challengesCompleted + 1
      }
    };
    await this.saveProgress(updated);
    await this.updateStreak();
    return updated;
  }

  async saveLessonNotes(lessonId: string, notes: string): Promise<void> {
    const current = await this.getProgress();
    const updated: UserProgressState = {
      ...current,
      lessonNotes: {
        ...current.lessonNotes,
        [lessonId]: notes
      }
    };
    await this.saveProgress(updated);
  }

  async updateStreak(): Promise<void> {
    const current = await this.getProgress();
    const today = new Date().toISOString().split('T')[0];
    const last = current.streak.lastActiveDate;

    if (last === today) return; // Already active today

    const lastDate = new Date(last);
    const currentDate = new Date(today);
    const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

    let newCurrent = current.streak.current;
    if (diffDays === 1) {
      newCurrent += 1;
    } else if (diffDays > 1) {
      newCurrent = 1;
    }

    const newLongest = Math.max(current.streak.longest, newCurrent);

    const updated: UserProgressState = {
      ...current,
      streak: {
        current: newCurrent,
        longest: newLongest,
        lastActiveDate: today
      }
    };
    await this.saveProgress(updated);
  }

  // --- IDE Projects ---
  async getIdeProjects(): Promise<IdeProject[]> {
    let projects = await db.getAll<IdeProject>(STORES.IDE_PROJECTS);
    if (projects.length === 0) {
      // Seed default starter project
      const starterTemplate = PROJECT_TEMPLATES.find(t => t.id === 'hello-world') || PROJECT_TEMPLATES[0];
      const initialProject: IdeProject = {
        id: 'hello-world-starter-project',
        name: starterTemplate.name,
        description: starterTemplate.description,
        templateId: starterTemplate.id,
        files: starterTemplate.files,
        activeFileName: 'index.html',
        openTabs: ['index.html', 'style.css', 'script.js'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await db.put(STORES.IDE_PROJECTS, initialProject);
      projects = [initialProject];
    }
    return projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getIdeProject(id: string): Promise<IdeProject | null> {
    return db.get<IdeProject>(STORES.IDE_PROJECTS, id);
  }

  async saveIdeProject(project: IdeProject): Promise<void> {
    project.updatedAt = new Date().toISOString();
    await db.put(STORES.IDE_PROJECTS, project);
  }

  async deleteIdeProject(id: string): Promise<void> {
    await db.delete(STORES.IDE_PROJECTS, id);
  }

  // --- Managed Projects ---
  async getManagedProjects(): Promise<ManagedProject[]> {
    let projects = await db.getAll<ManagedProject>(STORES.MANAGED_PROJECTS);
    if (projects.length === 0) {
      const initialManaged: ManagedProject = {
        id: 'proj-sample-1',
        name: 'Interactive Calculator App',
        description: 'A responsive digital calculator with history display and keyboard input support.',
        skill: 'JavaScript',
        difficulty: 'Beginner',
        technologies: ['HTML5', 'CSS3', 'JavaScript'],
        status: 'in_progress',
        progress: 65,
        tasks: [
          { id: 't1', text: 'Design grid layout for buttons', completed: true },
          { id: 't2', text: 'Implement arithmetic evaluation engine', completed: true },
          { id: 't3', text: 'Add keyboard event listeners', completed: false },
          { id: 't4', text: 'Test edge cases with divide by zero', completed: false }
        ],
        milestones: [
          { id: 'm1', title: 'UI Layout Complete', completed: true },
          { id: 'm2', title: 'Core Logic Functional', completed: true },
          { id: 'm3', title: 'Polish & Portfolio Integration', completed: false }
        ],
        notes: 'Review how Function() or custom parsing evaluates arithmetic strings safely.',
        linkedIdeProjectId: 'hello-world-starter-project',
        inPortfolio: true,
        createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
        updatedAt: new Date().toISOString()
      };
      await db.put(STORES.MANAGED_PROJECTS, initialManaged);
      projects = [initialManaged];
    }
    return projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async saveManagedProject(project: ManagedProject): Promise<void> {
    project.updatedAt = new Date().toISOString();
    await db.put(STORES.MANAGED_PROJECTS, project);
  }

  async deleteManagedProject(id: string): Promise<void> {
    await db.delete(STORES.MANAGED_PROJECTS, id);
  }

  // --- Planner Tasks ---
  async getPlannerTasks(): Promise<PlannerTask[]> {
    let tasks = await db.getAll<PlannerTask>(STORES.PLANNER_TASKS);
    if (tasks.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      const initialTasks: PlannerTask[] = [
        {
          id: 'task-1',
          title: 'Complete JavaScript Variables Lesson',
          date: today,
          durationMinutes: 20,
          priority: 'high',
          category: 'Coding',
          completed: false,
          notes: 'Focus on understanding let vs const'
        },
        {
          id: 'task-2',
          title: 'Practice Mathematics Algebra Questions',
          date: today,
          durationMinutes: 25,
          priority: 'medium',
          category: 'Academic',
          completed: false
        },
        {
          id: 'task-3',
          title: 'Design Wireframe for Portfolio Website',
          date: today,
          durationMinutes: 30,
          priority: 'medium',
          category: 'Project',
          completed: false
        }
      ];
      for (const t of initialTasks) {
        await db.put(STORES.PLANNER_TASKS, t);
      }
      tasks = initialTasks;
    }
    return tasks;
  }

  async savePlannerTask(task: PlannerTask): Promise<void> {
    await db.put(STORES.PLANNER_TASKS, task);
  }

  async deletePlannerTask(id: string): Promise<void> {
    await db.delete(STORES.PLANNER_TASKS, id);
  }

  // --- Portfolio ---
  async getPortfolio(): Promise<PortfolioData> {
    const data = await db.get<PortfolioData>(STORES.PORTFOLIO, 'user_portfolio');
    if (!data) {
      await this.savePortfolio(DEFAULT_PORTFOLIO);
      return DEFAULT_PORTFOLIO;
    }
    return data;
  }

  async savePortfolio(portfolio: PortfolioData): Promise<void> {
    await db.put(STORES.PORTFOLIO, portfolio, 'user_portfolio');
  }

  // --- Achievements ---
  async getAchievements(): Promise<Achievement[]> {
    let list = await db.getAll<Achievement>(STORES.ACHIEVEMENTS);
    if (list.length === 0) {
      for (const a of INITIAL_ACHIEVEMENTS) {
        await db.put(STORES.ACHIEVEMENTS, a);
      }
      list = INITIAL_ACHIEVEMENTS;
    }
    return list;
  }

  async saveAchievement(achievement: Achievement): Promise<void> {
    await db.put(STORES.ACHIEVEMENTS, achievement);
  }

  // --- Practice Attempts ---
  async getPracticeAttempts(): Promise<PracticeAttempt[]> {
    return (await db.getAll<PracticeAttempt>(STORES.PRACTICE_ATTEMPTS)).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async recordPracticeAttempt(attempt: PracticeAttempt): Promise<void> {
    await db.put(STORES.PRACTICE_ATTEMPTS, attempt);
    const progress = await this.getProgress();
    const attempts = await this.getPracticeAttempts();
    const totalAccuracy = Math.round(
      attempts.reduce((sum, a) => sum + a.accuracy, 0) / attempts.length
    );
    const updated: UserProgressState = {
      ...progress,
      stats: {
        ...progress.stats,
        practiceQuizzesTaken: attempts.length,
        practiceAccuracy: totalAccuracy
      }
    };
    await this.saveProgress(updated);
  }

  // --- Student Timetable Schedule ---
  async getSchedule(): Promise<StudentSchedule> {
    try {
      const data = await db.get<StudentSchedule>(STORES.SCHEDULE, 'student_schedule');
      if (data) return data;
    } catch {}

    // Fallback or default
    return DEFAULT_STUDENT_SCHEDULE;
  }

  async saveSchedule(schedule: StudentSchedule): Promise<void> {
    try {
      await db.put(STORES.SCHEDULE, schedule, 'student_schedule');
    } catch {
      localStorage.setItem('skudium_schedule', JSON.stringify(schedule));
    }
  }

  // --- Reset All Data ---
  async resetAllData(): Promise<void> {
    await db.clearAll();
  }
}

export const storageService = new StorageService();
