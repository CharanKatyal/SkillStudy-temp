import { describe, it, expect } from 'vitest';
import { ACADEMIC_SUBJECTS } from '../data/academicData';
import { SKILL_SUBJECTS } from '../data/skillData';
import { PRACTICE_QUESTIONS } from '../data/practiceData';
import { PROJECT_TEMPLATES } from '../data/projectTemplates';

describe('SkillForge Curriculum & Data Integrity', () => {
  it('should contain all required academic subjects', () => {
    const subjectNames = ACADEMIC_SUBJECTS.map(s => s.name);
    expect(subjectNames).toContain('Mathematics');
    expect(subjectNames).toContain('Science');
    expect(subjectNames).toContain('English & Communication');
  });

  it('every academic topic should have at least one lesson with objectives and content', () => {
    ACADEMIC_SUBJECTS.forEach(subject => {
      subject.chapters.forEach(chapter => {
        expect(chapter.topics.length).toBeGreaterThan(0);
        chapter.topics.forEach(topic => {
          expect(topic.lessons.length).toBeGreaterThan(0);
          topic.lessons.forEach(lesson => {
            expect(lesson.title).toBeTruthy();
            expect(lesson.content).toBeTruthy();
            expect(lesson.objectives.length).toBeGreaterThan(0);
          });
        });
      });
    });
  });

  it('should contain all core practical skills with challenges', () => {
    const skillNames = SKILL_SUBJECTS.map(s => s.name);
    expect(skillNames).toContain('HTML5');
    expect(skillNames).toContain('CSS3 & Styling');
    expect(skillNames).toContain('JavaScript Programming');
    expect(skillNames).toContain('Python Fundamentals');
    expect(skillNames).toContain('Git & Version Control');
    expect(skillNames).toContain('UI/UX & Visual Design');
    expect(skillNames).toContain('Digital Skills & Productivity');
  });

  it('every skill challenge must have starterFiles and valid languages', () => {
    SKILL_SUBJECTS.forEach(skill => {
      skill.challenges.forEach(challenge => {
        expect(challenge.title).toBeTruthy();
        expect(challenge.starterFiles).toBeDefined();
        expect(Object.keys(challenge.starterFiles).length).toBeGreaterThan(0);
      });
    });
  });

  it('should contain at least 8 starter project templates for IDE', () => {
    expect(PROJECT_TEMPLATES.length).toBeGreaterThanOrEqual(8);
    PROJECT_TEMPLATES.forEach(tmpl => {
      expect(tmpl.name).toBeTruthy();
      expect(tmpl.files).toBeDefined();
      expect(tmpl.files['index.html'] || tmpl.files['main.py']).toBeDefined();
    });
  });

  it('practice questions should have valid question types and explanations', () => {
    expect(PRACTICE_QUESTIONS.length).toBeGreaterThanOrEqual(10);
    PRACTICE_QUESTIONS.forEach(q => {
      expect(['mcq', 'true_false', 'short_answer', 'code_quiz']).toContain(q.type);
      expect(q.question).toBeTruthy();
      expect(q.explanation).toBeTruthy();
      expect(q.correctAnswer).toBeDefined();
    });
  });
});
