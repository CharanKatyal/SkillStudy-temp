import { LearningPath } from '../types';

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'lp-web-starter',
    title: 'Frontend Web Developer Roadmap',
    skillId: 'web-dev-basics',
    description: 'A complete step-by-step roadmap from your first HTML tag to building interactive, responsive web applications.',
    difficulty: 'Beginner',
    estimatedHours: 6,
    steps: [
      {
        id: 'lp-step-1',
        lessonId: 'les-web-101',
        title: 'HTML Semantic Elements & Page Structure',
        type: 'lesson',
        durationMinutes: 15
      },
      {
        id: 'lp-step-2',
        lessonId: 'les-web-102',
        title: 'CSS Flexbox & Responsive Layouts',
        type: 'lesson',
        durationMinutes: 20
      },
      {
        id: 'lp-step-3',
        challengeId: 'chal-web-101',
        title: 'Hands-on Coding: Glowing Profile Card',
        type: 'challenge',
        durationMinutes: 25
      },
      {
        id: 'lp-step-4',
        title: 'Web Fundamentals Assessment Quiz',
        type: 'practice',
        durationMinutes: 15
      },
      {
        id: 'lp-step-5',
        title: 'Capstone Project: Interactive Calculator Studio',
        type: 'project',
        durationMinutes: 45
      }
    ]
  },
  {
    id: 'lp-python-journey',
    title: 'Python Programming & Problem Solving',
    skillId: 'python-programming',
    description: 'Master practical Python programming, clean code syntax, data structures, and algorithmic logic.',
    difficulty: 'Beginner',
    estimatedHours: 4,
    steps: [
      {
        id: 'lp-py-1',
        lessonId: 'les-py-101',
        title: 'Variables, Data Types & Formatted Strings',
        type: 'lesson',
        durationMinutes: 15
      },
      {
        id: 'lp-py-2',
        challengeId: 'chal-py-101',
        title: 'Challenge: Study Streak Point Calculator',
        type: 'challenge',
        durationMinutes: 20
      },
      {
        id: 'lp-py-3',
        title: 'Python Syntax & Logic Practice Quiz',
        type: 'practice',
        durationMinutes: 15
      }
    ]
  },
  {
    id: 'lp-academic-mastery',
    title: 'Core Science, Math & Computational Logic',
    skillId: 'math-foundations',
    description: 'Connect mathematical algebra with physics laws and computational binary logic.',
    difficulty: 'Intermediate',
    estimatedHours: 5,
    steps: [
      {
        id: 'lp-acad-1',
        lessonId: 'les-math-101',
        title: 'Linear Equations & Variable Balancing',
        type: 'lesson',
        durationMinutes: 15
      },
      {
        id: 'lp-acad-2',
        lessonId: 'les-sci-101',
        title: "Newton's Laws of Motion & Force",
        type: 'lesson',
        durationMinutes: 20
      },
      {
        id: 'lp-acad-3',
        lessonId: 'les-cs-101',
        title: 'Binary Numbers & Bitwise Fundamentals',
        type: 'lesson',
        durationMinutes: 15
      }
    ]
  }
];
