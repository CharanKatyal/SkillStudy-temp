import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  Copy,
  Check,
  Play,
  Save,
  ChevronLeft,
  ChevronRight,
  Target,
  FileText
} from 'lucide-react';
import { Lesson } from '../../types';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface LessonViewerProps {
  lesson: Lesson;
  allLessons: Lesson[];
  onBack: () => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, allLessons, onBack }) => {
  const { openInIdeWithCode, setActiveNav } = useApp();
  const { progress, markLessonComplete, saveLessonNote } = useData();

  const [notes, setNotes] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const isCompleted = !!progress?.completedLessons?.[lesson.id];

  useEffect(() => {
    if (progress?.lessonNotes?.[lesson.id]) {
      setNotes(progress.lessonNotes[lesson.id]);
    } else {
      setNotes('');
    }
  }, [lesson.id, progress?.lessonNotes]);

  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveNotes = () => {
    saveLessonNote(lesson.id, notes);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roadmap</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => markLessonComplete(lesson.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md ${
              isCompleted
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/80'
                : 'bg-brand-600 hover:bg-brand-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-50/50 via-white to-white dark:from-slate-850 dark:via-slate-850 dark:to-slate-900 border border-slate-200 dark:border-slate-750 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant={lesson.category === 'academic' ? 'purple' : 'info'}>
            {lesson.category === 'academic' ? 'Academic Study' : 'Practical Skill'}
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{lesson.durationMinutes} mins</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">{lesson.title}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{lesson.description}</p>
      </div>

      {/* Objectives Box */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <Card className="bg-slate-50 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3 text-brand-600 dark:text-brand-400">
            <Target className="w-4 h-4" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">Learning Objectives</h3>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {lesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Main Content Area */}
      <Card className="p-6 sm:p-8 space-y-6 leading-relaxed text-sm text-slate-800 dark:text-slate-200">
        <div className="whitespace-pre-line font-sans space-y-4 text-slate-800 dark:text-slate-200">
          {lesson.content}
        </div>

        {/* Code Examples */}
        {lesson.codeExamples && lesson.codeExamples.length > 0 && (
          <div className="space-y-4 pt-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-500" />
              <span>Code Example</span>
            </h4>
            {lesson.codeExamples.map((ex, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-750 bg-slate-900 text-slate-100 shadow-sm">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700 text-xs">
                  <span className="font-mono text-slate-200 font-bold">{ex.title}</span>
                  <button
                    onClick={() => handleCopy(ex.code, idx)}
                    className="flex items-center gap-1 text-slate-300 hover:text-white font-medium"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto bg-slate-950">
                  <code>{ex.code}</code>
                </pre>
              </div>
            ))}
          </div>
        )}

        {/* Hands-On Starter Code Launch */}
        {lesson.starterCode && (
          <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
            <div>
              <h4 className="text-sm font-bold text-brand-800 dark:text-brand-300 flex items-center gap-2">
                <Play className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Hands-on Code Studio</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Launch this lesson's starter code directly in the integrated studio sandbox.
              </p>
            </div>
            <button
              onClick={() =>
                openInIdeWithCode(
                  lesson.title,
                  Object.fromEntries(
                    Object.entries(lesson.starterCode!).map(([name, content]) => [
                      name,
                      { name, content, language: name.endsWith('.html') ? 'html' : name.endsWith('.css') ? 'css' : 'javascript' }
                    ])
                  ),
                  lesson.challengeId
                )
              }
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shrink-0 transition"
            >
              <Code2 className="w-4 h-4" />
              <span>Open in Studio</span>
            </button>
          </div>
        )}
      </Card>

      {/* Student Study Notes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200">
            <FileText className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold">Personal Lesson Notes</h3>
          </div>
          <button
            onClick={handleSaveNotes}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/50 transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Notes</span>
          </button>
        </div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Write your notes, formulas, or key reflections here (saved automatically in local IndexedDB)..."
          className="w-full h-28 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500 font-sans resize-none transition"
        />
      </Card>

      {/* Next / Previous Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        {prevLesson ? (
          <button
            onClick={() => setActiveNav('academics', { lessonId: prevLesson.id })}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="truncate max-w-[150px]">{prevLesson.title}</span>
          </button>
        ) : (
          <div />
        )}

        {nextLesson && (
          <button
            onClick={() => setActiveNav('academics', { lessonId: nextLesson.id })}
            className="flex items-center gap-2 text-xs font-bold text-white px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 shadow-md transition"
          >
            <span className="truncate max-w-[150px]">{nextLesson.title}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
