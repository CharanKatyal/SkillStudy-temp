import { describe, it, expect } from 'vitest';
import { backupService } from '../services/backupService';

describe('SkillForge Backup Service (100% Offline JSON)', () => {
  it('should reject invalid or corrupted backup JSON', async () => {
    const invalidJson = '{"corrupted": true}';
    const res = await backupService.restoreFromBackupJson(invalidJson);
    expect(res.success).toBe(false);
    expect(res.message).toContain('Invalid');
  });

  it('should validate and restore valid SkillForge backup format', async () => {
    const validBackup = JSON.stringify({
      version: 1,
      app: 'SkillForge',
      exportedAt: new Date().toISOString(),
      profile: {
        displayName: 'Test Scholar',
        bio: 'Learning web tech offline',
        gradeLevel: '10th Grade',
        avatarIcon: 'GraduationCap',
        joinedAt: new Date().toISOString()
      },
      settings: {
        theme: 'dark',
        editor: { fontSize: 14, tabSize: 2, lineNumbers: true, wordWrap: true },
        accessibility: { highContrast: false, reducedMotion: false, dyslexicFont: false }
      },
      progress: {
        completedLessons: {},
        completedChallenges: {},
        lessonNotes: {},
        streak: { current: 1, longest: 1, lastActiveDate: '' },
        stats: { lessonsCompleted: 0, challengesCompleted: 0, practiceQuizzesTaken: 0, practiceAccuracy: 100, projectsCompleted: 0, codingTimeMinutes: 0 }
      },
      ideProjects: [],
      managedProjects: [],
      plannerTasks: [],
      portfolio: {
        customTitle: 'Portfolio',
        bio: 'Bio',
        skills: [],
        featuredProjectIds: [],
        featuredIdeProjectIds: [],
        showAchievements: true,
        showStats: true,
        socialLinks: {}
      },
      achievements: [],
      practiceAttempts: []
    });

    const res = await backupService.restoreFromBackupJson(validBackup);
    expect(res.success).toBe(true);
  });
});
