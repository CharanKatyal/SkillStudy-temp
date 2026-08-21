import { FossProject } from '../types';

export const FOSS_PROJECTS: FossProject[] = [
  {
    id: 'foss-1',
    title: 'Accessible UI Components',
    organization: 'OpenDesign Foundation',
    description: 'A collection of keyboard-navigable and screen-reader compliant accessible HTML/CSS/JS components.',
    tags: ['HTML5', 'CSS3', 'Accessibility', 'Good First Issue'],
    stars: 1420,
    goodFirstIssues: [
      {
        id: 'iss-1',
        title: 'Add ARIA expanded attributes to dropdown menus',
        difficulty: 'Beginner',
        description: 'Ensure all interactive accordion buttons toggle aria-expanded="true/false" dynamically.',
        completed: false
      },
      {
        id: 'iss-2',
        title: 'Fix color contrast ratio on warning badges',
        difficulty: 'Beginner',
        description: 'Update text color to meet WCAG AA minimum 4.5:1 ratio.',
        completed: true
      }
    ]
  },
  {
    id: 'foss-2',
    title: 'Python Math & Algorithm Utilities',
    organization: 'StudentDev FOSS',
    description: 'Lightweight numerical helpers, quadratic solvers, and statistical formulas for high-school learners.',
    tags: ['Python', 'Algorithms', 'Mathematics'],
    stars: 890,
    goodFirstIssues: [
      {
        id: 'iss-3',
        title: 'Implement greatest common divisor (GCD) using Euclid algorithm',
        difficulty: 'Beginner',
        description: 'Add a clean function gcd(a, b) with unit test assertions.',
        completed: false
      }
    ]
  },
  {
    id: 'foss-3',
    title: 'Retro Canvas 2D Game Engine',
    organization: 'IndieCode Collective',
    description: 'Zero-dependency browser canvas gaming primitives for student hobbyists.',
    tags: ['JavaScript', 'Canvas 2D', 'Game Dev'],
    stars: 2150,
    goodFirstIssues: [
      {
        id: 'iss-4',
        title: 'Add circle-to-box collision detector helper',
        difficulty: 'Intermediate',
        description: 'Create test helper checkCollision(circle, rect) returning boolean.',
        completed: false
      }
    ]
  }
];
