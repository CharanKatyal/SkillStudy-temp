import { Classroom } from '../types';

export const CLASSROOMS_LIST: Classroom[] = [
  {
    id: 'class-1',
    code: 'CS-101',
    name: 'Introduction to Computer Science & Web Engineering',
    teacherName: 'Prof. Harrison',
    subject: 'Computer Science',
    announcements: [
      'Welcome to Semester 1! Please finish the HTML & CSS starter roadmaps before Friday.',
      'Reminder: Submit your Interactive Calculator project link by end of week.'
    ],
    assignments: [
      {
        id: 'asg-1',
        title: 'Build a Semantic Student Bio Page',
        subject: 'Web Development',
        dueDate: '2026-08-28',
        points: 100,
        submitted: true,
        grade: '98/100 (A+)',
        instructions: 'Use semantic HTML5 elements (<header>, <main>, <article>, <footer>) with CSS Flexbox layout.'
      },
      {
        id: 'asg-2',
        title: 'Interactive Calculator Logic in IDE',
        subject: 'JavaScript',
        dueDate: '2026-09-05',
        points: 100,
        submitted: false,
        instructions: 'Implement add, subtract, multiply, and divide functions with keyboard listener support.'
      }
    ]
  },
  {
    id: 'class-2',
    code: 'MATH-202',
    name: 'Algebra II & Quadratic Functions',
    teacherName: 'Dr. Henderson',
    subject: 'Mathematics',
    announcements: [
      'Complete Chapter 1: Linear Systems practice quiz before our Friday assessment.'
    ],
    assignments: [
      {
        id: 'asg-3',
        title: 'Quadratic Discriminant Problem Set',
        subject: 'Algebra',
        dueDate: '2026-09-02',
        points: 50,
        submitted: false,
        instructions: 'Solve 10 quadratic polynomial equations and classify the nature of the roots.'
      }
    ]
  }
];
