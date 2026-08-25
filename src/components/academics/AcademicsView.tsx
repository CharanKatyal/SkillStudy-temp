import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  ArrowLeft,
  FileQuestion,
  Sparkles,
  Map,
  Code2,
  FolderKanban
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';
import { ACADEMIC_SUBJECTS } from '../../data/academicData';
import { SKILL_SUBJECTS } from '../../data/skillData';
import { LEARNING_PATHS } from '../../data/learningPaths';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { LessonViewer } from '../learn/LessonViewer';

export const AcademicsView: React.FC = () => {
  const {
    selectedSubjectId,
    setSelectedSubjectId,
    selectedLessonId,
    setSelectedLessonId,
    setActiveNav
  } = useApp();
  const { progress } = useData();

  const [activeTab, setActiveTab] = useState<'subjects' | 'roadmaps'>('subjects');
  const [activePathId, setActivePathId] = useState<string>(LEARNING_PATHS[0].id);

  // Gather all lessons across academics and skills for lookup
  const allAcademicLessons = ACADEMIC_SUBJECTS.flatMap(s =>
    s.chapters.flatMap(c => c.topics.flatMap(t => t.lessons))
  );
  const allSkillLessons = SKILL_SUBJECTS.flatMap(s => s.lessons);
  const allLessons = [...allAcademicLessons, ...allSkillLessons];

  // 1. Direct Lesson Viewer Mode
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

  // 2. Specific Academic Subject Detail Mode
  const currentSubject = ACADEMIC_SUBJECTS.find(s => s.id === selectedSubjectId) || null;

  if (currentSubject) {
    const subjectLessons = currentSubject.chapters.flatMap(c => c.topics.flatMap(t => t.lessons));
    const completedCount = subjectLessons.filter(l => progress?.completedLessons?.[l.id]).length;
    const progressPercent = Math.round((completedCount / (subjectLessons.length || 1)) * 100);

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Subject Header Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedSubjectId(null)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Academics</span>
          </button>

          <Badge variant="info">{currentSubject.chapters.length} Chapters</Badge>
        </div>

        {/* Subject Overview Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-50/50 via-white to-white dark:from-slate-850 dark:via-slate-850 dark:to-slate-900 border border-slate-200 dark:border-slate-750 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{currentSubject.name}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">{currentSubject.description}</p>
          </div>
          <div className="w-full md:w-64 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
              <span>Subject Progress</span>
              <span className="font-bold text-slate-900 dark:text-slate-200">{progressPercent}%</span>
            </div>
            <ProgressBar value={progressPercent} color="bg-sky-500" height="md" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {completedCount} of {subjectLessons.length} lessons finished
            </p>
          </div>
        </div>

        {/* Chapters & Topics List */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-200">Curriculum Chapters</h3>

          <div className="space-y-4">
            {currentSubject.chapters.map(chapter => (
              <Card key={chapter.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{chapter.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{chapter.description}</p>
                  </div>
                  <Badge>{chapter.topics.length} Topics</Badge>
                </div>

                <div className="mt-4 space-y-3">
                  {chapter.topics.map(topic => (
                    <div
                      key={topic.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">{topic.title}</h5>
                        {topic.practiceQuestionIds.length > 0 && (
                          <button
                            onClick={() => setActiveNav('practice')}
                            className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-semibold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 shadow-sm"
                          >
                            <FileQuestion className="w-3.5 h-3.5" />
                            <span>Practice Quiz</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                        {topic.lessons.map(lesson => {
                          const isDone = !!progress?.completedLessons?.[lesson.id];

                          return (
                            <div
                              key={lesson.id}
                              onClick={() => setSelectedLessonId(lesson.id)}
                              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                                isDone
                                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 text-slate-900 dark:text-slate-200 hover:border-emerald-400'
                                  : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-brand-500 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 truncate mr-2">
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                                <span className="text-xs font-semibold truncate">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {lesson.durationMinutes}m
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Top-Level Unified Academics & Learning Roadmaps View
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
      {/* Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Academics &amp; Learning
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Structured subject curricula, master roadmap milestones, and interactive lesson readers.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-850 rounded-xl p-1 border border-slate-200 dark:border-slate-750 shrink-0">
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'subjects'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Curriculum Subjects</span>
          </button>
          <button
            onClick={() => setActiveTab('roadmaps')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'roadmaps'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Learning Roadmaps</span>
          </button>
        </div>
      </div>

      {activeTab === 'subjects' ? (
        /* Academic Subjects Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACADEMIC_SUBJECTS.map(subject => {
            const subjectLessons = subject.chapters.flatMap(c => c.topics.flatMap(t => t.lessons));
            const completedCount = subjectLessons.filter(l => progress?.completedLessons?.[l.id]).length;
            const percentage = Math.round((completedCount / (subjectLessons.length || 1)) * 100);

            return (
              <Card
                key={subject.id}
                hoverable
                onClick={() => setSelectedSubjectId(subject.id)}
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: subject.color }}
                    >
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <Badge variant="info">{subject.chapters.length} Chapters</Badge>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{subject.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {subject.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
                    <span>{completedCount} / {subjectLessons.length} lessons</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">{percentage}%</span>
                  </div>
                  <ProgressBar value={percentage} color="bg-sky-500" height="sm" />
                  <button className="w-full mt-4 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition">
                    <span>Explore Subject</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Learning Roadmaps Mode */
        <div className="space-y-6">
          {/* Path Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {LEARNING_PATHS.map(path => (
              <button
                key={path.id}
                onClick={() => setActivePathId(path.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activePathId === path.id
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-750'
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

          {/* Roadmap Steps */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Milestone Roadmap</h3>

            <div className="space-y-3">
              {currentPath.steps.map((step, idx) => {
                const isLessonDone = step.lessonId && progress?.completedLessons?.[step.lessonId];
                const isChallengeDone = step.challengeId && progress?.completedChallenges?.[step.challengeId];
                const isDone = isLessonDone || isChallengeDone;

                return (
                  <Card
                    key={step.id}
                    className={`p-4 flex items-center justify-between transition ${
                      isDone
                        ? 'border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/10'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={step.type === 'lesson' ? 'info' : step.type === 'challenge' ? 'purple' : 'warning'} size="sm">
                            {step.type.toUpperCase()}
                          </Badge>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{step.durationMinutes} mins</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{step.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {step.lessonId && (
                        <button
                          onClick={() => setSelectedLessonId(step.lessonId || null)}
                          className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Study Lesson</span>
                        </button>
                      )}

                      {step.challengeId && (
                        <button
                          onClick={() => setActiveNav('skills', { challengeId: step.challengeId })}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>Code Challenge</span>
                        </button>
                      )}

                      {step.type === 'project' && (
                        <button
                          onClick={() => setActiveNav('projects')}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                        >
                          <FolderKanban className="w-3.5 h-3.5" />
                          <span>Open Projects</span>
                        </button>
                      )}

                      {step.type === 'practice' && (
                        <button
                          onClick={() => setActiveNav('practice')}
                          className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                        >
                          <FileQuestion className="w-3.5 h-3.5" />
                          <span>Practice Quiz</span>
                        </button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
