export type NavSection =
  | 'dashboard'
  | 'academics'
  | 'skills'
  | 'learn'
  | 'practice'
  | 'ide'
  | 'projects'
  | 'foss'
  | 'mentors'
  | 'school'
  | 'opportunities'
  | 'planner'
  | 'portfolio'
  | 'achievements'
  | 'parent'
  | 'settings';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type SupportedLanguage = 'html' | 'css' | 'javascript' | 'python' | 'cpp' | 'java' | 'json' | 'text';

export interface UserProfile {
  displayName: string;
  bio: string;
  gradeLevel: string;
  avatarIcon: string;
  joinedAt: string;
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  lineNumbers: boolean;
  wordWrap: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  dyslexicFont: boolean;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  editor: EditorSettings;
  accessibility: AccessibilitySettings;
}

export interface AcademicSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  chapters: AcademicChapter[];
}

export interface AcademicChapter {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  topics: AcademicTopic[];
}

export interface AcademicTopic {
  id: string;
  chapterId: string;
  title: string;
  lessons: Lesson[];
  practiceQuestionIds: string[];
}

export interface CodeExample {
  lang: string;
  title: string;
  code: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  content: string;
  category: 'academic' | 'skill';
  subjectOrSkillId: string;
  durationMinutes: number;
  codeExamples?: CodeExample[];
  starterCode?: Record<string, string>;
  challengeId?: string;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Languages' | 'Design' | 'Foundations' | 'Tools';
  difficulty: Difficulty;
  prerequisites: string[];
  description: string;
  icon: string;
  color: string;
  learningPathIds: string[];
  lessons: Lesson[];
  challenges: CodingChallenge[];
  projectIdeas: string[];
}

export interface LearningPathStep {
  id: string;
  lessonId?: string;
  challengeId?: string;
  title: string;
  type: 'lesson' | 'practice' | 'challenge' | 'project';
  durationMinutes: number;
}

export interface LearningPath {
  id: string;
  title: string;
  skillId: string;
  description: string;
  difficulty: Difficulty;
  estimatedHours: number;
  steps: LearningPathStep[];
}

export interface CodingChallenge {
  id: string;
  title: string;
  skillId: string;
  lessonId?: string;
  difficulty: Difficulty;
  description: string;
  instructions: string[];
  hints: string[];
  starterFiles: Record<string, { name: string; content: string; language: string }>;
  expectedSolutionSnippet?: string;
  testCheck?: (code: string) => boolean;
}

export type PracticeQuestionType = 'mcq' | 'true_false' | 'short_answer' | 'code_quiz';

export interface PracticeQuestion {
  id: string;
  type: PracticeQuestionType;
  subjectOrSkillId: string;
  topicTitle?: string;
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
  hint?: string;
  codeSnippet?: string;
}

export interface PracticeAttempt {
  id: string;
  date: string;
  subjectOrSkillId: string;
  subjectOrSkillName: string;
  totalQuestions: number;
  score: number;
  accuracy: number;
  answers: {
    questionId: string;
    isCorrect: boolean;
    userAnswer: string;
  }[];
}

export interface IdeFile {
  name: string;
  content: string;
  language: SupportedLanguage;
}

export interface IdeProject {
  id: string;
  name: string;
  description: string;
  templateId?: string;
  languageEnvironment?: 'web' | 'python' | 'cpp' | 'java';
  files: Record<string, IdeFile>;
  activeFileName: string;
  openTabs: string[];
  createdAt: string;
  updatedAt: string;
  linkedProjectId?: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  difficulty: Difficulty;
  languageEnvironment?: 'web' | 'python' | 'cpp' | 'java';
  files: Record<string, IdeFile>;
}

export type ProjectStatus = 'not_started' | 'in_progress' | 'completed';

export interface ProjectTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  targetDate?: string;
}

export interface ManagedProject {
  id: string;
  name: string;
  description: string;
  skill: string;
  difficulty: Difficulty;
  technologies: string[];
  status: ProjectStatus;
  progress: number;
  tasks: ProjectTask[];
  milestones: ProjectMilestone[];
  notes: string;
  linkedIdeProjectId?: string;
  inPortfolio: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PlannerCategory = 'Academic' | 'Skill' | 'Coding' | 'Project' | 'Revision';
export type PlannerPriority = 'low' | 'medium' | 'high';

export interface PlannerTask {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  priority: PlannerPriority;
  category: PlannerCategory;
  completed: boolean;
  notes?: string;
  relatedId?: string;
}

export interface PortfolioData {
  customTitle: string;
  bio: string;
  skills: { name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' }[];
  featuredProjectIds: string[];
  featuredIdeProjectIds: string[];
  showAchievements: boolean;
  showStats: boolean;
  socialLinks: {
    github?: string;
    website?: string;
    email?: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'coding' | 'practice' | 'projects' | 'streak';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  secret?: boolean;
}

export interface UserProgressState {
  completedLessons: Record<string, { completedAt: string; score?: number }>;
  completedChallenges: Record<string, { completedAt: string; code?: string }>;
  lessonNotes: Record<string, string>;
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string;
  };
  stats: {
    lessonsCompleted: number;
    challengesCompleted: number;
    practiceQuizzesTaken: number;
    practiceAccuracy: number;
    projectsCompleted: number;
    codingTimeMinutes: number;
  };
}

// -------------------------------------------------------------
// Phase 4: FOSS & Advanced Coding Types
// -------------------------------------------------------------
export interface FossProject {
  id: string;
  title: string;
  organization: string;
  description: string;
  tags: string[];
  stars: number;
  goodFirstIssues: {
    id: string;
    title: string;
    difficulty: Difficulty;
    description: string;
    completed: boolean;
  }[];
}

// -------------------------------------------------------------
// Phase 5: Mentors, Schools, Real-World Projects & Opportunities
// -------------------------------------------------------------
export interface MentorProfile {
  id: string;
  name: string;
  roleTitle: string;
  organization: string;
  rating: number;
  sessionsCompleted: number;
  expertise: string[];
  avatar: string;
  bio: string;
  availability: string;
}

export interface ClassroomAssignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  points: number;
  submitted: boolean;
  grade?: string;
  instructions: string;
}

export interface Classroom {
  id: string;
  code: string;
  name: string;
  teacherName: string;
  subject: string;
  announcements: string[];
  assignments: ClassroomAssignment[];
}

export interface RealWorldProjectBrief {
  id: string;
  title: string;
  clientName: string;
  clientCategory: 'Non-Profit' | 'Community' | 'Education' | 'Local Business';
  description: string;
  budgetStipend: number;
  deadline: string;
  deliverables: string[];
  status: 'available' | 'in_progress' | 'completed';
}

export interface StudentOpportunity {
  id: string;
  title: string;
  organization: string;
  type: 'micro_bounty' | 'apprenticeship' | 'grant';
  stipendAmount: number;
  skills: string[];
  description: string;
  status: 'open' | 'applied' | 'awarded';
}

export interface StudentWallet {
  balanceUSD: number;
  transactions: {
    id: string;
    title: string;
    amount: number;
    type: 'credit' | 'debit';
    date: string;
    category: 'Grant' | 'Bounty' | 'Project Stipend';
  }[];
}
