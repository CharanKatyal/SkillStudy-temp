import React, { useState } from 'react';
import {
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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-50/60 via-white to-white dark:from-slate-850 dark:via-slate-850 dark:to-slate-900 border border-slate-200 dark:border-slate-750 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Practice Hub</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Reinforce academic theories and coding fundamentals through MCQs, True/False, Short answers, and Code quizzes.
          </p>
        </div>

        <button
          onClick={() => startQuiz('Complete Practice Marathon', PRACTICE_QUESTIONS, 'all')}
          className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shrink-0 transition"
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
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700'
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
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-200">
              Questions ({filteredQuestions.length})
            </h3>
            {filteredQuestions.length > 0 && (
              <button
                onClick={() =>
                  startQuiz(
                    selectedFilter === 'All' ? 'Filtered Questions' : `${selectedFilter} Quiz`,
                    filteredQuestions,
                    selectedFilter
                  )
                }
                className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Quiz</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q, idx) => (
              <Card key={q.id} className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="info">
                      {q.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 leading-snug">
                    <span className="text-brand-600 dark:text-brand-400 font-bold mr-1.5">Q{idx + 1}.</span>
                    {q.question}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Topic: {q.topicTitle}
                  </p>
                </div>

                <button
                  onClick={() => startQuiz(q.question, [q], q.subjectOrSkillId)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold shrink-0 transition"
                >
                  Practice
                </button>
              </Card>
            ))}
          </div>
        </div>

        {/* Practice History Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200">
            <History className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="text-base font-bold">Recent Attempts</h3>
          </div>

          {practiceAttempts.length === 0 ? (
            <Card className="p-6 text-center text-slate-500 dark:text-slate-400 text-xs space-y-2">
              <FileQuestion className="w-8 h-8 mx-auto text-slate-400" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">No attempts recorded yet</p>
              <p>Complete quizzes to see your score history and accuracy analytics!</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {practiceAttempts.slice(0, 8).map(att => (
                <Card key={att.id} className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate mr-2">
                      {att.subjectOrSkillName}
                    </span>
                    <Badge variant={att.accuracy >= 80 ? 'success' : 'warning'} size="sm">
                      {att.accuracy}%
                    </Badge>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{att.score} / {att.totalQuestions} correct</span>
                    <span>{new Date(att.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Quiz Assessment Modal */}
      <QuizModal
        isOpen={activeQuizMeta.isOpen}
        onClose={() => setActiveQuizMeta({ ...activeQuizMeta, isOpen: false })}
        title={activeQuizMeta.title}
        questions={activeQuizMeta.questions}
        subjectOrSkillId={activeQuizMeta.subjectOrSkillId}
      />
    </div>
  );
};
