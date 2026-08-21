import { storageService } from './storageService';
import { ACADEMIC_SUBJECTS } from '../data/academicData';
import { SKILL_SUBJECTS } from '../data/skillData';
import { PRACTICE_QUESTIONS } from '../data/practiceData';
import { SkillGapInsight, NextBestAction } from '../types/ai';

export class AdaptiveLearningService {
  /**
   * Diagnoses skill gaps and mastery level across curriculum topics
   */
  async computeSkillGaps(): Promise<SkillGapInsight[]> {
    const [progress, practiceAttempts] = await Promise.all([
      storageService.getProgress(),
      storageService.getPracticeAttempts()
    ]);

    const insights: SkillGapInsight[] = [];

    // Analyze Academic Subjects
    ACADEMIC_SUBJECTS.forEach(subject => {
      subject.chapters.forEach(chapter => {
        chapter.topics.forEach(topic => {
          const completedInTopic = topic.lessons.filter(l => progress?.completedLessons?.[l.id]).length;
          const topicQuestions = PRACTICE_QUESTIONS.filter(q => topic.practiceQuestionIds.includes(q.id));
          const topicAttempts = practiceAttempts.filter(a => a.subjectOrSkillId === subject.id);

          let mastery = 0;
          if (topic.lessons.length > 0) {
            mastery += (completedInTopic / topic.lessons.length) * 50;
          }
          if (topicAttempts.length > 0) {
            const avgAcc = topicAttempts.reduce((sum, a) => sum + a.accuracy, 0) / topicAttempts.length;
            mastery += (avgAcc / 100) * 50;
          }

          mastery = Math.round(mastery);

          if (completedInTopic === 0 && mastery === 0) {
            // Not started yet
            return;
          }

          let status: SkillGapInsight['status'] = 'Developing';
          let recommendation = 'Continue practicing topic exercises.';

          if (mastery < 50 || (topicAttempts.length > 0 && topicAttempts[0].accuracy < 70)) {
            status = 'Needs Review';
            recommendation = `Review foundational lessons and re-attempt practice quiz in ${topic.title}.`;
          } else if (mastery >= 85) {
            status = 'Mastered';
            recommendation = `Excellent comprehension! Advance to related higher-level challenges.`;
          }

          insights.push({
            id: topic.id,
            topicTitle: topic.title,
            subjectOrSkillId: subject.name,
            masteryPercentage: mastery,
            status,
            recommendation,
            remedialLessonId: topic.lessons[0]?.id
          });
        });
      });
    });

    // Analyze Practical Coding Skills
    SKILL_SUBJECTS.forEach(skill => {
      const completedLessons = skill.lessons.filter(l => progress?.completedLessons?.[l.id]).length;
      const completedChallenges = skill.challenges.filter(c => progress?.completedChallenges?.[c.id]).length;
      const totalItems = skill.lessons.length + skill.challenges.length;

      let mastery = totalItems > 0 ? Math.round(((completedLessons + completedChallenges * 2) / (totalItems * 2)) * 100) : 0;

      if (completedLessons > 0 || completedChallenges > 0) {
        let status: SkillGapInsight['status'] = mastery >= 85 ? 'Mastered' : mastery >= 50 ? 'Developing' : 'Needs Review';
        let recommendation = completedChallenges === 0 && skill.challenges.length > 0
          ? `Solve the hands-on coding challenge in the IDE to reinforce ${skill.name}.`
          : `Build a starter project using ${skill.name}.`;

        insights.push({
          id: skill.id,
          topicTitle: skill.name,
          subjectOrSkillId: 'Practical Skills',
          masteryPercentage: mastery,
          status,
          recommendation,
          remedialLessonId: skill.lessons[0]?.id
        });
      }
    });

    return insights;
  }

  /**
   * Generates prioritized "Next Best Actions" based on student progress and weaknesses
   */
  async computeNextBestActions(): Promise<NextBestAction[]> {
    const [progress, practiceAttempts, projects] = await Promise.all([
      storageService.getProgress(),
      storageService.getPracticeAttempts(),
      storageService.getManagedProjects()
    ]);

    const actions: NextBestAction[] = [];

    // 1. Check for uncompleted lessons in core roadmaps
    const allSkillLessons = SKILL_SUBJECTS.flatMap(s => s.lessons);
    const pendingSkillLesson = allSkillLessons.find(l => !progress?.completedLessons?.[l.id]);

    if (pendingSkillLesson) {
      actions.push({
        id: `act-lesson-${pendingSkillLesson.id}`,
        title: pendingSkillLesson.title,
        type: 'lesson',
        subjectOrSkillName: pendingSkillLesson.category === 'skill' ? 'Coding & Skills' : 'Academics',
        targetId: pendingSkillLesson.id,
        reason: 'Recommended next step in your sequential learning path.',
        estimatedMinutes: pendingSkillLesson.durationMinutes || 20,
        priorityBadge: 'High Priority'
      });
    }

    // 2. Check for unsolved challenges
    const allChallenges = SKILL_SUBJECTS.flatMap(s => s.challenges);
    const pendingChallenge = allChallenges.find(c => !progress?.completedChallenges?.[c.id]);

    if (pendingChallenge) {
      actions.push({
        id: `act-ch-${pendingChallenge.id}`,
        title: pendingChallenge.title,
        type: 'challenge',
        subjectOrSkillName: pendingChallenge.skillId.toUpperCase(),
        targetId: pendingChallenge.id,
        reason: 'Hands-on practice to apply coding knowledge in the sandboxed IDE.',
        estimatedMinutes: 25,
        priorityBadge: 'Recommended'
      });
    }

    // 3. Quiz reinforcement if attempts are low
    if (practiceAttempts.length === 0 || practiceAttempts[practiceAttempts.length - 1]?.accuracy < 80) {
      actions.push({
        id: 'act-quiz-practice',
        title: 'Mixed Practice Assessment',
        type: 'quiz',
        subjectOrSkillName: 'Assessment Hub',
        targetId: 'practice',
        reason: 'Strengthen core memory retention through rapid-fire questions.',
        estimatedMinutes: 15,
        priorityBadge: 'Recommended'
      });
    }

    // 4. Project building action
    const inProgressProject = projects.find(p => p.status === 'in_progress');
    if (inProgressProject) {
      actions.push({
        id: `act-proj-${inProgressProject.id}`,
        title: `Continue: ${inProgressProject.name}`,
        type: 'project',
        subjectOrSkillName: inProgressProject.skill,
        targetId: inProgressProject.id,
        reason: `${inProgressProject.progress}% complete. Finish remaining milestone tasks.`,
        estimatedMinutes: 30,
        priorityBadge: 'High Priority'
      });
    }

    return actions;
  }
}

export const adaptiveLearningService = new AdaptiveLearningService();
