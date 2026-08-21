import { storageService } from './storageService';
import { ACADEMIC_SUBJECTS } from '../data/academicData';
import { SKILL_SUBJECTS } from '../data/skillData';
import { SmartTimetablePlan, SmartTimetableGeneratedTask } from '../types/ai';
import { PlannerTask } from '../types';

export class SmartTimetableService {
  /**
   * Automatically synthesizes a balanced, goal-oriented study plan
   */
  async generateSmartPlan(
    daysCount: number = 5,
    dailyMinutes: number = 60,
    focusAreas: string[] = ['Coding', 'Academic', 'Project', 'Revision']
  ): Promise<SmartTimetablePlan> {
    const [progress, projects] = await Promise.all([
      storageService.getProgress(),
      storageService.getManagedProjects()
    ]);

    const tasks: SmartTimetableGeneratedTask[] = [];
    const today = new Date();

    const allAcademicLessons = ACADEMIC_SUBJECTS.flatMap(s =>
      s.chapters.flatMap(c => c.topics.flatMap(t => t.lessons))
    );
    const allSkillLessons = SKILL_SUBJECTS.flatMap(s => s.lessons);
    const allChallenges = SKILL_SUBJECTS.flatMap(s => s.challenges);

    const pendingAcademics = allAcademicLessons.filter(l => !progress?.completedLessons?.[l.id]);
    const pendingSkills = allSkillLessons.filter(l => !progress?.completedLessons?.[l.id]);
    const pendingChallenges = allChallenges.filter(c => !progress?.completedChallenges?.[c.id]);
    const activeProject = projects.find(p => p.status === 'in_progress') || projects[0];

    for (let i = 0; i < daysCount; i++) {
      const taskDate = new Date(today);
      taskDate.setDate(today.getDate() + i);
      const dateStr = taskDate.toISOString().split('T')[0];

      let minutesAllocated = 0;

      // Slot 1: Coding / Practical Skill Lesson
      if (focusAreas.includes('Coding') && minutesAllocated < dailyMinutes) {
        const lesson = pendingSkills[i % (pendingSkills.length || 1)] || allSkillLessons[0];
        tasks.push({
          title: `Learn: ${lesson.title}`,
          date: dateStr,
          durationMinutes: 20,
          priority: 'high',
          category: 'Coding',
          reason: 'Sequential practical curriculum progression',
          relatedLessonId: lesson.id
        });
        minutesAllocated += 20;
      }

      // Slot 2: Academic Theory or Practice
      if (focusAreas.includes('Academic') && minutesAllocated < dailyMinutes) {
        const acadLesson = pendingAcademics[i % (pendingAcademics.length || 1)] || allAcademicLessons[0];
        tasks.push({
          title: `Study: ${acadLesson.title}`,
          date: dateStr,
          durationMinutes: 20,
          priority: 'medium',
          category: 'Academic',
          reason: 'Core foundational academic theory & equations',
          relatedLessonId: acadLesson.id
        });
        minutesAllocated += 20;
      }

      // Slot 3: Interactive Coding Challenge or Project Milestone
      if (focusAreas.includes('Project') && minutesAllocated < dailyMinutes && activeProject) {
        const uncompletedTask = activeProject.tasks?.find(t => !t.completed);
        const taskTitle = uncompletedTask ? `${activeProject.name}: ${uncompletedTask.text}` : `Work on ${activeProject.name}`;

        tasks.push({
          title: taskTitle,
          date: dateStr,
          durationMinutes: 25,
          priority: 'medium',
          category: 'Project',
          reason: 'Milestone delivery & portfolio preparation'
        });
        minutesAllocated += 25;
      } else if (focusAreas.includes('Coding') && minutesAllocated < dailyMinutes && pendingChallenges.length > 0) {
        const challenge = pendingChallenges[i % pendingChallenges.length];
        tasks.push({
          title: `Challenge: ${challenge.title}`,
          date: dateStr,
          durationMinutes: 20,
          priority: 'high',
          category: 'Coding',
          reason: 'Hands-on algorithm and DOM practice in IDE'
        });
        minutesAllocated += 20;
      }

      // Slot 4: Quick Assessment Revision
      if (focusAreas.includes('Revision') && minutesAllocated < dailyMinutes) {
        tasks.push({
          title: `Assessment: Rapid Practice Quiz`,
          date: dateStr,
          durationMinutes: 15,
          priority: 'low',
          category: 'Revision',
          reason: 'Spaced repetition and memory reinforcement'
        });
        minutesAllocated += 15;
      }
    }

    return {
      id: `plan-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      targetDays: daysCount,
      dailyMinutes,
      focusAreas,
      tasks
    };
  }

  /**
   * Applies the generated plan into the student's local Planner tasks database
   */
  async applyPlanToPlanner(plan: SmartTimetablePlan): Promise<void> {
    for (const item of plan.tasks) {
      const task: PlannerTask = {
        id: `ai-task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: item.title,
        date: item.date,
        durationMinutes: item.durationMinutes,
        priority: item.priority,
        category: item.category,
        completed: false,
        notes: `AI Generated: ${item.reason}`,
        relatedId: item.relatedLessonId
      };
      await storageService.savePlannerTask(task);
    }
  }
}

export const smartTimetableService = new SmartTimetableService();
