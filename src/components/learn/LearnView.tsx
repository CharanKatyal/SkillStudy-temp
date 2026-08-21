import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  Clock,
  ChevronRight,
  FolderKanban,
  FileQuestion,
  Code2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';
import { LEARNING_PATHS } from '../../data/learningPaths';
import { ACADEMIC_SUBJECTS } from '../../data/academicData';
import { SKILL_SUBJECTS } from '../../data/skillData';
import { LessonViewer } from './LessonViewer';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const LearnView: React.FC = () => {
  const { selectedLessonId, setSelectedLessonId, setActiveNav } = useApp();
  const { progress } = useData();
  const [activePathId, setActivePathId] = useState<string>(LEARNING_PATHS[0].id);

  // Gather all lessons across academics and skills for lookup
  const allAcademicLessons = ACADEMIC_SUBJECTS.flatMap(s =>
    s.chapters.flatMap(c => c.topics.flatMap(t => t.lessons))
  );
  const allSkillLessons = SKILL_SUBJECTS.flatMap(s => s.lessons);
  const allLessons = [...allAcademicLessons, ...allSkillLessons];

  const currentLesson = selectedLessonId
    ? allLessons.find(l => l.id === selectedLessonId)
    : null;

  if (currentLesson) {
    return (
      <LessonViewer
        lesson={currentLesson}
        allLessons={allLessons}
        onBack={() => setSelectedLessonId(null)}
      />
    );
  }

  const currentPath = LEARNING_PATHS.find(p => p.id === activePathId) || LEARNING_PATHS[0];

  const completedStepsCount = currentPath.steps.filter(step => {
    if (step.lessonId && progress?.completedLessons?.[step.lessonId]) return true;
    if (step.challengeId && progress?.completedChallenges?.[step.challengeId]) return true;
    return false;
  }).length;

  const pathProgressPercent = Math.round(
    (completedStepsCount / (currentPath.steps.length || 1)) * 100
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Learning Path Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {LEARNING_PATHS.map(path => (
          <button
            key={path.id}
            onClick={() => setActivePathId(path.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activePathId === path.id
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{path.title}</span>
          </button>
        ))}
      </div>

      {/* Path Header Overview */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-50/60 via-white to-white dark:from-slate-850 dark:via-slate-850 dark:to-slate-900 border border-slate-200 dark:border-slate-750 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="info">{currentPath.difficulty}</Badge>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              ~{currentPath.estimatedHours} hours total
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{currentPath.title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">{currentPath.description}</p>
        </div>

        <div className="w-full md:w-64 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
            <span>Roadmap Completion</span>
            <span className="font-bold text-slate-900 dark:text-slate-200">{pathProgressPercent}%</span>
          </div>
          <ProgressBar value={pathProgressPercent} color="bg-brand-500" height="md" />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            {completedStepsCount} of {currentPath.steps.length} milestones reached
          </p>
        </div>
      </div>

      {/* Step by Step Roadmap Timeline */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-200">Curriculum Steps</h3>

        <div className="space-y-3 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {currentPath.steps.map((step, index) => {
            const isLessonDone = step.lessonId ? !!progress?.completedLessons?.[step.lessonId] : false;
            const isChallengeDone = step.challengeId ? !!progress?.completedChallenges?.[step.challengeId] : false;
            const isStepDone = isLessonDone || isChallengeDone;

            const iconMap = {
              lesson: <BookOpen className="w-4 h-4 text-sky-500" />,
              challenge: <Code2 className="w-4 h-4 text-amber-500" />,
              practice: <FileQuestion className="w-4 h-4 text-emerald-500" />,
              project: <FolderKanban className="w-4 h-4 text-purple-500" />
            };

            const handleStepClick = () => {
              if (step.lessonId) {
                setSelectedLessonId(step.lessonId);
              } else if (step.challengeId) {
                setActiveNav('skills', { skillId: currentPath.skillId });
              } else if (step.type === 'project') {
                setActiveNav('projects');
              } else if (step.type === 'practice') {
                setActiveNav('practice');
              }
            };

            return (
              <div
                key={step.id}
                onClick={handleStepClick}
                className={`relative pl-12 pr-4 py-4 rounded-xl border cursor-pointer transition flex items-center justify-between group shadow-sm ${
                  isStepDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-400'
                    : 'bg-white dark:bg-slate-850/80 border-slate-200 dark:border-slate-800 hover:border-brand-500'
                }`}
              >
                {/* Node indicator badge on timeline */}
                <div
                  className={`absolute left-4 w-5 h-5 rounded-full flex items-center justify-center -translate-x-1/2 border-2 ${
                    isStepDone
                      ? 'bg-emerald-500 border-white dark:border-slate-900 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isStepDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px] font-bold">{index + 1}</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    {iconMap[step.type]}
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        isStepDone ? 'text-slate-900 dark:text-slate-100' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">{step.type}</span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">•</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{step.durationMinutes} mins</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isStepDone ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </span>
                  ) : (
                    <button className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-brand-600 text-slate-700 dark:text-slate-300 group-hover:text-white text-xs font-bold flex items-center gap-1.5 transition">
                      <span>Start</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
