import { LearningPath } from '../types';

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'web-dev-beginner',
    title: 'Web Development Beginner Roadmap',
    skillId: 'html',
    difficulty: 'Beginner',
    estimatedHours: 12,
    description: 'A complete step-by-step path taking you from zero knowledge to building interactive offline web apps.',
    steps: [
      {
        id: 'step-1',
        lessonId: 'html-les-1',
        title: '1. HTML5 Basics & Semantic Tags',
        type: 'lesson',
        durationMinutes: 15
      },
      {
        id: 'step-2',
        challengeId: 'ch-html-1',
        title: '2. HTML Practice: Semantic Profile Card',
        type: 'challenge',
        durationMinutes: 20
      },
      {
        id: 'step-3',
        lessonId: 'css-les-1',
        title: '3. CSS Basics & Box Model',
        type: 'lesson',
        durationMinutes: 20
      },
      {
        id: 'step-4',
        challengeId: 'ch-css-1',
        title: '4. CSS Practice: Neon Card Component',
        type: 'challenge',
        durationMinutes: 20
      },
      {
        id: 'step-5',
        lessonId: 'css-les-2',
        title: '5. Modern Flexbox & Grid Layouts',
        type: 'lesson',
        durationMinutes: 25
      },
      {
        id: 'step-6',
        lessonId: 'js-les-1',
        title: '6. JavaScript Basics & Variables',
        type: 'lesson',
        durationMinutes: 20
      },
      {
        id: 'step-7',
        challengeId: 'ch-js-1',
        title: '7. JavaScript Practice: Student Info Program',
        type: 'challenge',
        durationMinutes: 20
      },
      {
        id: 'step-8',
        lessonId: 'js-les-2',
        title: '8. DOM Manipulation & Event Handlers',
        type: 'lesson',
        durationMinutes: 25
      },
      {
        id: 'step-9',
        title: '9. Mini Project: Interactive Calculator',
        type: 'project',
        durationMinutes: 45
      },
      {
        id: 'step-10',
        title: '10. Final Project: Full Showcase Portfolio',
        type: 'project',
        durationMinutes: 60
      }
    ]
  },
  {
    id: 'python-core',
    title: 'Python Core & Computational Thinking',
    skillId: 'python',
    difficulty: 'Beginner',
    estimatedHours: 8,
    description: 'Learn logic, data manipulation, algorithm formulation, and problem-solving with Python.',
    steps: [
      {
        id: 'py-step-1',
        lessonId: 'py-les-1',
        title: '1. Python Syntax & Data Structures',
        type: 'lesson',
        durationMinutes: 20
      },
      {
        id: 'py-step-2',
        title: '2. Python Logic & Comprehension Exercises',
        type: 'practice',
        durationMinutes: 25
      },
      {
        id: 'py-step-3',
        title: '3. Project: Student Grade Analyzer',
        type: 'project',
        durationMinutes: 40
      }
    ]
  },
  {
    id: 'digital-literacy',
    title: 'Digital Fluency & Offline Tech',
    skillId: 'digital-skills',
    difficulty: 'Beginner',
    estimatedHours: 5,
    description: 'Master local data sovereignty, Git fundamentals, UI/UX accessibility, and productivity tools.',
    steps: [
      {
        id: 'dig-step-1',
        lessonId: 'dig-les-1',
        title: '1. Offline Computing & Data Sovereignty',
        type: 'lesson',
        durationMinutes: 15
      },
      {
        id: 'dig-step-2',
        lessonId: 'git-les-1',
        title: '2. Git & Version Control Snapshots',
        type: 'lesson',
        durationMinutes: 15
      },
      {
        id: 'dig-step-3',
        lessonId: 'uiux-les-1',
        title: '3. UI/UX Hierarchy & Color Contrast',
        type: 'lesson',
        durationMinutes: 15
      }
    ]
  }
];
