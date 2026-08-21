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
  BookOpen,
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
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roadmap</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => markLessonComplete(lesson.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              isCompleted
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/80'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-900/30'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-850 to-slate-900 border border-slate-750">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant={lesson.category === 'academic' ? 'purple' : 'info'}>
            {lesson.category === 'academic' ? 'Academic Study' : 'Practical Skill'}
          </Badge>
          <span className="text-xs text-slate-400 font-medium">{lesson.durationMinutes} mins</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{lesson.title}</h1>
        <p className="text-sm text-slate-400 mt-1">{lesson.description}</p>
      </div>

      {/* Objectives Box */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <Card className="bg-slate-850/60 border-slate-800">
          <div className="flex items-center gap-2 mb-3 text-brand-400">
            <Target className="w-4 h-4" />
            <h3 className="text-sm font-bold text-slate-200">Learning Objectives</h3>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {lesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand-400 font-bold">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Main Content Area */}
      <Card className="prose prose-invert max-w-none p-6 sm:p-8 space-y-6 leading-relaxed text-sm text-slate-200">
        <div className="whitespace-pre-line font-sans space-y-4">
          {lesson.content}
        </div>

        {/* Code Examples */}
        {lesson.codeExamples && lesson.codeExamples.length > 0 && (
          <div className="space-y-4 pt-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>Code Example</span>
            </h4>
            {lesson.codeExamples.map((ex, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border border-slate-750 bg-slate-950">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
                  <span className="font-mono text-slate-300 font-semibold">{ex.title}</span>
                  <button
                    onClick={() => handleCopy(ex.code, idx)}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto">
                  <code>{ex.code}</code>
                </pre>
              </div>
            ))}
          </div>
        )}

        {/* Hands-On Starter Code Launch */}
        {lesson.starterCode && (
          <div className="p-4 rounded-xl bg-brand-950/30 border border-brand-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
            <div>
              <h4 className="text-sm font-bold text-brand-300 flex items-center gap-2">
                <Play className="w-4 h-4" />
                <span>Hands-on Code Playground</span>
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Launch this lesson's starter code directly in the integrated offline IDE sandbox.
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
              className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shrink-0 transition"
            >
              <Code2 className="w-4 h-4" />
              <span>Open in IDE</span>
            </button>
          </div>
        )}
      </Card>

      {/* Student Study Notes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-slate-200">
            <FileText className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold">Personal Lesson Notes</h3>
          </div>
          <button
            onClick={handleSaveNotes}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 px-3 py-1 rounded bg-sky-950/40 border border-sky-800/50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Notes</span>
          </button>
        </div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Write your notes, formulas, or key reflections here (saved offline in IndexedDB)..."
          className="w-full h-28 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-sans resize-none"
        />
      </Card>

      {/* Next / Previous Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        {prevLesson ? (
          <button
            onClick={() => setActiveNav('learn', { lessonId: prevLesson.id })}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="truncate max-w-[150px]">{prevLesson.title}</span>
          </button>
        ) : (
          <div />
        )}

        {nextLesson && (
          <button
            onClick={() => setActiveNav('learn', { lessonId: nextLesson.id })}
            className="flex items-center gap-2 text-xs font-semibold text-slate-100 hover:text-white px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 shadow-md"
          >
            <span className="truncate max-w-[150px]">{nextLesson.title}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
