import { PlannerCategory, PlannerPriority } from './index';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  codeSnippet?: string;
  suggestedActions?: {
    label: string;
    actionType: 'navigate' | 'open_ide' | 'apply_task';
    payload: any;
  }[];
}

export type AIProvider = 'offline-engine' | 'gemini' | 'openai' | 'local-ollama';

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  endpoint?: string;
  modelName?: string;
  temperature?: number;
}

export interface SkillGapInsight {
  id: string;
  topicTitle: string;
  subjectOrSkillId: string;
  masteryPercentage: number;
  status: 'Needs Review' | 'Developing' | 'Mastered';
  recommendation: string;
  remedialLessonId?: string;
}

export interface SmartTimetableGeneratedTask {
  title: string;
  date: string;
  durationMinutes: number;
  priority: PlannerPriority;
  category: PlannerCategory;
  reason: string;
  relatedLessonId?: string;
}

export interface SmartTimetablePlan {
  id: string;
  generatedAt: string;
  targetDays: number;
  dailyMinutes: number;
  focusAreas: string[];
  tasks: SmartTimetableGeneratedTask[];
}

export interface NextBestAction {
  id: string;
  title: string;
  type: 'lesson' | 'challenge' | 'quiz' | 'project';
  subjectOrSkillName: string;
  targetId: string;
  reason: string;
  estimatedMinutes: number;
  priorityBadge: 'High Priority' | 'Recommended' | 'Explore';
}
