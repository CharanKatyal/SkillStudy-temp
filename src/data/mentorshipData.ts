import { MentorProfile } from '../types';

export const MENTORS_LIST: MentorProfile[] = [
  {
    id: 'mentor-1',
    name: 'Dr. Evelyn Vance',
    roleTitle: 'Senior Software Engineer & Educator',
    organization: 'Open Robotics Lab',
    rating: 4.9,
    sessionsCompleted: 42,
    expertise: ['Frontend Architecture', 'Algorithm Optimization', 'Python'],
    avatar: '👩‍💻',
    bio: 'Dedicated to helping students build their first open-source contributions and master clean software engineering.',
    availability: 'Tuesdays & Thursdays (4:00 PM - 6:00 PM)'
  },
  {
    id: 'mentor-2',
    name: 'Marcus Chen',
    roleTitle: 'Staff Frontend Engineer',
    organization: 'Web Standards Alliance',
    rating: 5.0,
    sessionsCompleted: 68,
    expertise: ['CSS Grid & Flexbox', 'UI/UX Accessibility', 'JavaScript Logic'],
    avatar: '👨‍💻',
    bio: 'Passionate about accessible web development and guiding student developers through portfolio reviews.',
    availability: 'Mondays & Wednesdays (5:00 PM - 7:00 PM)'
  },
  {
    id: 'mentor-3',
    name: 'Sarah Jenkins, M.Sc.',
    roleTitle: 'Mathematics & STEM Instructor',
    organization: 'National Math Academy',
    rating: 4.8,
    sessionsCompleted: 55,
    expertise: ['Algebra & Calculus', 'Physics Mechanics', 'Data Visualization'],
    avatar: '👩‍🔬',
    bio: 'Helping learners connect abstract mathematical formulas to practical real-world computer science applications.',
    availability: 'Weekends (10:00 AM - 1:00 PM)'
  }
];
