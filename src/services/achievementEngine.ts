import confetti from 'canvas-confetti';
import { storageService } from './storageService';
import { Achievement } from '../types';

export class AchievementEngine {
  /**
   * Check all achievement criteria and unlock any newly earned badges.
   * Returns newly unlocked achievements.
   */
  async evaluateAchievements(): Promise<Achievement[]> {
    const [achievements, progress, projects, practiceAttempts, plannerTasks] = await Promise.all([
      storageService.getAchievements(),
      storageService.getProgress(),
      storageService.getManagedProjects(),
      storageService.getPracticeAttempts(),
      storageService.getPlannerTasks()
    ]);

    const completedLessonsCount = Object.keys(progress.completedLessons).length;
    const completedChallengesCount = Object.keys(progress.completedChallenges).length;
    const completedProjectsCount = projects.filter(p => p.status === 'completed').length;
    const portfolioProjectsCount = projects.filter(p => p.inPortfolio).length;
    const completedTasksCount = plannerTasks.filter(t => t.completed).length;
    const hasPerfectScore = practiceAttempts.some(a => a.accuracy === 100);
    const streakDays = progress.streak.current;

    const newlyUnlocked: Achievement[] = [];

    for (const ach of achievements) {
      let currentProgress = 0;
      let shouldUnlock = false;

      switch (ach.id) {
        case 'first_lesson':
          currentProgress = completedLessonsCount >= 1 ? 1 : 0;
          shouldUnlock = completedLessonsCount >= 1;
          break;
        case 'ten_lessons':
          currentProgress = Math.min(10, completedLessonsCount);
          shouldUnlock = completedLessonsCount >= 10;
          break;
        case 'first_practice':
          currentProgress = practiceAttempts.length >= 1 ? 1 : 0;
          shouldUnlock = practiceAttempts.length >= 1;
          break;
        case 'perfect_score':
          currentProgress = hasPerfectScore ? 1 : 0;
          shouldUnlock = hasPerfectScore;
          break;
        case 'first_challenge':
          currentProgress = completedChallengesCount >= 1 ? 1 : 0;
          shouldUnlock = completedChallengesCount >= 1;
          break;
        case 'five_challenges':
          currentProgress = Math.min(5, completedChallengesCount);
          shouldUnlock = completedChallengesCount >= 5;
          break;
        case 'first_project':
          currentProgress = projects.length >= 1 ? 1 : 0;
          shouldUnlock = projects.length >= 1;
          break;
        case 'first_completed_project':
          currentProgress = completedProjectsCount >= 1 ? 1 : 0;
          shouldUnlock = completedProjectsCount >= 1;
          break;
        case 'portfolio_creator':
          currentProgress = portfolioProjectsCount >= 1 ? 1 : 0;
          shouldUnlock = portfolioProjectsCount >= 1;
          break;
        case 'streak_3':
          currentProgress = Math.min(3, streakDays);
          shouldUnlock = streakDays >= 3;
          break;
        case 'streak_7':
          currentProgress = Math.min(7, streakDays);
          shouldUnlock = streakDays >= 7;
          break;
        case 'planner_master':
          currentProgress = Math.min(5, completedTasksCount);
          shouldUnlock = completedTasksCount >= 5;
          break;
      }

      const wasUnlocked = ach.unlocked;
      ach.progress = currentProgress;

      if (!wasUnlocked && shouldUnlock) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString();
        newlyUnlocked.push(ach);
        await storageService.saveAchievement(ach);
      } else if (ach.progress !== currentProgress) {
        await storageService.saveAchievement(ach);
      }
    }

    if (newlyUnlocked.length > 0) {
      this.triggerCelebration();
    }

    return newlyUnlocked;
  }

  triggerCelebration(): void {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if canvas-confetti is not available
    }
  }
}

export const achievementEngine = new AchievementEngine();
