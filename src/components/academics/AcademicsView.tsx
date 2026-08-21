import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  ArrowLeft,
  FileQuestion
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';
import { ACADEMIC_SUBJECTS } from '../../data/academicData';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const AcademicsView: React.FC = () => {
  const { selectedSubjectId, setSelectedSubjectId, setActiveNav } = useApp();
  const { progress } = useData();
  const [, setSelectedChapterId] = useState<string | null>(null);

  const currentSubject = ACADEMIC_SUBJECTS.find(s => s.id === selectedSubjectId) || null;

  if (currentSubject) {
    const allLessons = currentSubject.chapters.flatMap(c => c.topics.flatMap(t => t.lessons));
    const completedCount = allLessons.filter(l => progress?.completedLessons?.[l.id]).length;
    const progressPercent = Math.round((completedCount / (allLessons.length || 1)) * 100);

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Subject Header Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedSubjectId(null);
              setSelectedChapterId(null);
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Subjects</span>
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
              <span>Overall Progress</span>
              <span className="font-bold text-slate-900 dark:text-slate-200">{progressPercent}%</span>
            </div>
            <ProgressBar value={progressPercent} color="bg-sky-500" height="md" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {completedCount} of {allLessons.length} lessons finished
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
                              onClick={() => {
                                setActiveNav('learn', { lessonId: lesson.id });
                              }}
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

  // All Academic Subjects List
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Academic Subjects</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Master core academic subjects with structured chapters, topics, and interactive practice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ACADEMIC_SUBJECTS.map(subject => {
          const allLessons = subject.chapters.flatMap(c => c.topics.flatMap(t => t.lessons));
          const completedCount = allLessons.filter(l => progress?.completedLessons?.[l.id]).length;
          const percentage = Math.round((completedCount / (allLessons.length || 1)) * 100);

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
                  <span>{completedCount} / {allLessons.length} lessons</span>
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
    </div>
  );
};
