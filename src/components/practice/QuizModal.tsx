import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Check } from 'lucide-react';
import { PracticeQuestion, PracticeAttempt } from '../../types';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  questions: PracticeQuestion[];
  subjectOrSkillId: string;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  title,
  questions,
  subjectOrSkillId
}) => {
  const { recordPracticeAttempt } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
  const [shortAnswerInput, setShortAnswerInput] = useState('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<
    { questionId: string; isCorrect: boolean; userAnswer: string }[]
  >([]);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen || questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const checkOptionIsCorrect = (idx: number): boolean => {
    if (!currentQ.options || idx < 0 || idx >= currentQ.options.length) return false;
    const optText = currentQ.options[idx];
    const correctVal = currentQ.correctAnswer;

    // Direct index match
    if (typeof correctVal === 'number' && correctVal === idx) return true;
    if (typeof correctVal === 'string' && !isNaN(Number(correctVal)) && Number(correctVal) === idx) return true;

    // Direct text string match (case-insensitive)
    if (String(optText).trim().toLowerCase() === String(correctVal).trim().toLowerCase()) return true;

    // Boolean match
    if (typeof correctVal === 'boolean') {
      return String(optText).trim().toLowerCase() === String(correctVal).toLowerCase();
    }

    return false;
  };

  const handleSubmitAnswer = () => {
    if (isAnswerSubmitted) return;

    let isCorrect = false;
    let userAnsStr = '';

    if (currentQ.type === 'mcq' || currentQ.type === 'true_false' || currentQ.type === 'code_quiz') {
      if (selectedOption === null) return;
      isCorrect = checkOptionIsCorrect(Number(selectedOption));
      userAnsStr = currentQ.options ? String(currentQ.options[Number(selectedOption)]) : String(selectedOption);
    } else if (currentQ.type === 'short_answer') {
      if (!shortAnswerInput.trim()) return;
      isCorrect = shortAnswerInput.trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();
      userAnsStr = shortAnswerInput.trim();
    }

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnswersHistory(prev => [
      ...prev,
      {
        questionId: currentQ.id,
        isCorrect,
        userAnswer: userAnsStr
      }
    ]);

    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShortAnswerInput('');
      setIsAnswerSubmitted(false);
    } else {
      // Complete quiz
      const accuracy = Math.round((score / questions.length) * 100);

      const attempt: PracticeAttempt = {
        id: `att-${Date.now()}`,
        date: new Date().toISOString(),
        subjectOrSkillId,
        subjectOrSkillName: title,
        totalQuestions: questions.length,
        score,
        accuracy,
        answers: answersHistory
      };

      await recordPracticeAttempt(attempt);
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShortAnswerInput('');
    setIsAnswerSubmitted(false);
    setScore(0);
    setAnswersHistory([]);
    setIsCompleted(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="2xl">
      {isCompleted ? (
        <div className="text-center py-6 space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center mx-auto text-amber-500 shadow-md">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Quiz Completed!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Your practice score has been saved to your local profile.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-xs mx-auto grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Score</span>
              <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                {score} / {questions.length}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Accuracy</span>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((score / questions.length) * 100)}%
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={handleRestart}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="info">{currentQ.type.replace('_', ' ')}</Badge>
              <span className="text-slate-500 dark:text-slate-400 font-semibold">{currentQ.topicTitle}</span>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Question Body */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
              {currentQ.question}
            </h4>

            {currentQ.codeSnippet && (
              <pre className="p-4 rounded-xl bg-slate-950 text-emerald-300 text-xs font-mono overflow-x-auto border border-slate-800">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            )}

            {/* MCQ & True/False Options */}
            {currentQ.options && (
              <div className="space-y-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = checkOptionIsCorrect(idx);

                  let optClass = 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-brand-500';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200';
                    }
                  } else if (isSelected) {
                    optClass = 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-800 dark:text-brand-300 font-bold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${optClass}`}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Short Answer Input */}
            {currentQ.type === 'short_answer' && (
              <div>
                <input
                  type="text"
                  disabled={isAnswerSubmitted}
                  value={shortAnswerInput}
                  onChange={e => setShortAnswerInput(e.target.value)}
                  placeholder="Type your exact answer here..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500 transition"
                />
              </div>
            )}

            {/* Explanation box after submitting */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 animate-fadeIn">
                <span className="font-bold text-slate-900 dark:text-slate-200">Explanation:</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">Current Score: {score}</span>

            <div>
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null && !shortAnswerInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
