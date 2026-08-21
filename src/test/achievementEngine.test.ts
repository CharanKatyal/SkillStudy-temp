import { describe, it, expect } from 'vitest';
import { achievementEngine } from '../services/achievementEngine';
import { storageService } from '../services/storageService';
import { INITIAL_ACHIEVEMENTS } from '../data/defaultAchievements';

describe('SkillForge Offline Achievement Engine', () => {
  it('should evaluate achievement criteria and unlock badges locally', async () => {
    for (const ach of INITIAL_ACHIEVEMENTS) {
      await storageService.saveAchievement(ach);
    }
    const progress = await storageService.getProgress();
    expect(progress).toBeDefined();

    const newlyUnlocked = await achievementEngine.evaluateAchievements();
    expect(Array.isArray(newlyUnlocked)).toBe(true);
  });
});
