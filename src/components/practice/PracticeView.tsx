import React, { useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Target,
  Clock,
  History,
  FileQuestion,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PRACTICE_QUESTIONS } from '../../data/practiceData';
import { ACADEMIC_SUBJECTS } from '../../data/academicData';
import { SKILL_SUBJECTS } from '../../data/skillData';
import { QuizModal } from './QuizModal';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const PracticeView: React.FC = () => {
  const { practiceAttempts } = useData();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeQuizMeta, setActiveQuizMeta] = useState<{
    isOpen: boolean;
    title: string;
    questions: typeof PRACTICE_QUESTIONS;
    subjectOrSkillId: string;
  }>({
    isOpen: false,
    title: '',
    questions: [],
    subjectOrSkillId: ''
  });

  const subjectsList = [
    { id: 'All', name: 'All Topics' },
    ...ACADEMIC_SUBJECTS.map(s => ({ id: s.id, name: s.name })),
    ...SKILL_SUBJECTS.map(s => ({ id: s.id, name: s.name }))
  ];

  const filteredQuestions = selectedFilter === 'All'
    ? PRACTICE_QUESTIONS
    : PRACTICE_QUESTIONS.filter(q => q.subjectOrSkillId === selectedFilter);

  const startQuiz = (title: string, questions: typeof PRACTICE_QUESTIONS, subjectOrSkillId: string) => {
    setActiveQuizMeta({
      isOpen: true,
      title,
      questions,
      subjectOrSkillId
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-850 to-slate-900 border border-slate-750 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-100">Practice &amp; Assessment Hub</h2>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Reinforce academic theories and coding fundamentals through MCQs, True/False, Short answers, and Code quizzes.
          </p>
        </div>

        <button
          onClick={() => startQuiz('Complete Practice Marathon', PRACTICE_QUESTIONS, 'all')}
          className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-900/40 shrink-0 transition"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Full Quiz Session</span>
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {subjectsList.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedFilter(s.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedFilter === s.id
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* 2-Column: Question Sets & Past Attempts History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Sets List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-200">
              Questions ({filteredQuestions.length})
            </h3>
            {filteredQuestions.length > 0 && (
              <button
                onClick={() =>
                  startQuiz(
                    `${selectedFilter === 'All' ? 'Mixed' : selectedFilter} Practice`,
                    filteredQuestions,
                    selectedFilter
                  )
                }
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Practice These Questions</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q, idx) => (
              <Card key={q.id} className="p-4 space-y-2 border-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <Badge size="sm" variant="info">{q.type.replace('_', ' ')}</Badge>
                    <span className="text-xs text-slate-400 capitalize">{q.subjectOrSkillId}</span>
                  </div>
                  {q.topicTitle && <Badge size="sm">{q.topicTitle}</Badge>}
                </div>

                <h4 className="text-sm font-semibold text-slate-100">{q.question}</h4>

                {q.codeSnippet && (
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                    <code>{q.codeSnippet}</code>
                  </pre>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Practice History Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-400" />
            <h3 className="text-base font-bold text-slate-200">Recent Attempts</h3>
          </div>

          {practiceAttempts.length === 0 ? (
            <Card className="text-center py-8 text-slate-400 text-xs">
              <p>No practice attempts yet. Take a quiz to record your accuracy!</p>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {practiceAttempts.slice(0, 8).map(att => (
                <Card key={att.id} className="p-3.5 flex items-center justify-between border-slate-800">
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{att.subjectOrSkillName}</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(att.date).toLocaleDateString()} • {att.score} / {att.totalQuestions} correct
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold ${
                        att.accuracy >= 80
                          ? 'text-emerald-400'
                          : att.accuracy >= 60
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {att.accuracy}%
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <QuizModal
        isOpen={activeQuizMeta.isOpen}
        onClose={() => setActiveQuizMeta(prev => ({ ...prev, isOpen: false }))}
        title={activeQuizMeta.title}
        questions={activeQuizMeta.questions}
        subjectOrSkillId={activeQuizMeta.subjectOrSkillId}
      />
    </div>
  );
};
