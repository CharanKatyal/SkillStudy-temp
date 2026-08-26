import { StudentSchedule, TimetableSlot } from '../types';

export const DEFAULT_SCHEDULE_SLOTS: TimetableSlot[] = [
  {
    id: 'slot-1',
    day: 'Weekdays',
    startTime: '15:30',
    endTime: '16:30',
    title: 'Homework & Core Subject Study',
    type: 'study',
    color: '#3b82f6', // blue
    notes: 'Review today’s school lessons and complete academic tasks.'
  },
  {
    id: 'slot-2',
    day: 'Weekdays',
    startTime: '16:30',
    endTime: '17:00',
    title: 'Break & Refreshment ☕',
    type: 'break',
    color: '#10b981', // emerald
    notes: 'Hydrate, stretch, and relax before coding session.'
  },
  {
    id: 'slot-3',
    day: 'Weekdays',
    startTime: '17:00',
    endTime: '18:15',
    title: 'Web Dev & Coding Studio',
    type: 'coding',
    color: '#8b5cf6', // purple
    notes: 'Practical programming in Skudium Code Studio.'
  },
  {
    id: 'slot-4',
    day: 'Weekdays',
    startTime: '18:30',
    endTime: '19:30',
    title: 'Science & Math Revision',
    type: 'revision',
    color: '#f59e0b', // amber
    notes: 'Concept reinforcement and practice quizzes.'
  },
  {
    id: 'slot-5',
    day: 'Weekdays',
    startTime: '19:45',
    endTime: '20:45',
    title: 'Capstone Project Work',
    type: 'project',
    color: '#ec4899', // pink
    notes: 'Building and refining portfolio projects.'
  },
  // Weekend slots
  {
    id: 'slot-wk-1',
    day: 'Weekends',
    startTime: '10:00',
    endTime: '12:00',
    title: 'Weekend Deep Coding & Studio',
    type: 'coding',
    color: '#8b5cf6',
    notes: 'Deep focus on code projects and architecture.'
  },
  {
    id: 'slot-wk-2',
    day: 'Weekends',
    startTime: '14:00',
    endTime: '15:30',
    title: 'Skill Exploration & Quizzes',
    type: 'study',
    color: '#3b82f6',
    notes: 'Taking assessments and earning achievement badges.'
  }
];

export const DEFAULT_STUDENT_SCHEDULE: StudentSchedule = {
  mode: 'structured',
  hasCustomTimetable: true,
  schoolHours: {
    enabled: true,
    name: 'School Hours',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    startTime: '08:00',
    endTime: '14:30'
  },
  slots: DEFAULT_SCHEDULE_SLOTS,
  lastUpdated: new Date().toISOString()
};

export interface TimetablePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  schoolHours: StudentSchedule['schoolHours'];
  slots: TimetableSlot[];
}

export const TIMETABLE_PRESETS: TimetablePreset[] = [
  {
    id: 'balanced',
    name: 'Balanced Student Routine',
    badge: 'Recommended',
    description: 'Standard 8 AM – 2:30 PM school hours with structured study, coding studio, and evening breaks.',
    schoolHours: {
      enabled: true,
      name: 'School',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      startTime: '08:00',
      endTime: '14:30'
    },
    slots: DEFAULT_SCHEDULE_SLOTS
  },
  {
    id: 'coder_intensive',
    name: 'Future Software Engineer',
    badge: 'Coding Focused',
    description: 'Heavy emphasis on Code Studio, building web apps, and algorithms after school.',
    schoolHours: {
      enabled: true,
      name: 'School',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      startTime: '08:00',
      endTime: '14:00'
    },
    slots: [
      {
        id: 'slot-c1',
        day: 'Weekdays',
        startTime: '15:00',
        endTime: '16:30',
        title: 'Full-Stack Web & Algorithms',
        type: 'coding',
        color: '#8b5cf6',
        notes: 'HTML/CSS/JS/Python practice and logic challenges.'
      },
      {
        id: 'slot-c2',
        day: 'Weekdays',
        startTime: '16:30',
        endTime: '17:00',
        title: 'Break & Snack 🍎',
        type: 'break',
        color: '#10b981'
      },
      {
        id: 'slot-c3',
        day: 'Weekdays',
        startTime: '17:00',
        endTime: '18:30',
        title: 'Project Development',
        type: 'project',
        color: '#ec4899',
        notes: 'Shipping portfolio items and apps.'
      },
      {
        id: 'slot-c4',
        day: 'Weekdays',
        startTime: '19:00',
        endTime: '20:00',
        title: 'School Homework & Math',
        type: 'study',
        color: '#3b82f6'
      }
    ]
  },
  {
    id: 'exam_prep',
    name: 'Exam & Academic Ace',
    badge: 'Academic Focus',
    description: 'Targeted revision, subject problem sets, and practice test assessments.',
    schoolHours: {
      enabled: true,
      name: 'School & Classes',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      startTime: '08:00',
      endTime: '15:00'
    },
    slots: [
      {
        id: 'slot-e1',
        day: 'Weekdays',
        startTime: '16:00',
        endTime: '17:15',
        title: 'Mathematics & Formulas',
        type: 'study',
        color: '#3b82f6'
      },
      {
        id: 'slot-e2',
        day: 'Weekdays',
        startTime: '17:15',
        endTime: '17:45',
        title: 'Break ☕',
        type: 'break',
        color: '#10b981'
      },
      {
        id: 'slot-e3',
        day: 'Weekdays',
        startTime: '17:45',
        endTime: '19:00',
        title: 'Science Concepts & Experiments',
        type: 'revision',
        color: '#06b6d4'
      },
      {
        id: 'slot-e4',
        day: 'Weekdays',
        startTime: '19:15',
        endTime: '20:15',
        title: 'Practice Hub Quizzes',
        type: 'study',
        color: '#f59e0b'
      }
    ]
  }
];
