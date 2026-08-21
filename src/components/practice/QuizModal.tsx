import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, Trophy, Check } from 'lucide-react';
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

  const handleSubmitAnswer = () => {
    if (isAnswerSubmitted) return;

    let isCorrect = false;
    let userAnsStr = '';

    if (currentQ.type === 'mcq' || currentQ.type === 'true_false' || currentQ.type === 'code_quiz') {
      if (selectedOption === null) return;
      isCorrect = Number(selectedOption) === Number(currentQ.correctAnswer);
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
      const finalScore = score + (isAnswerSubmitted && answersHistory[answersHistory.length - 1]?.isCorrect ? 0 : 0);
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
        <div className="text-center py-6 space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/40">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-100">Practice Session Complete! 🎉</h3>
            <p className="text-sm text-slate-400 mt-1">
              Your results are saved locally in your progress history.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
              <span className="text-xs text-slate-400">Final Score</span>
              <p className="text-2xl font-bold text-slate-100 mt-1">
                {score} / {questions.length}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
              <span className="text-xs text-slate-400">Accuracy</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                {Math.round((score / questions.length) * 100)}%
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <button
              onClick={handleRestart}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Session</span>
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
          {/* Header info */}
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <span>
              Question <strong className="text-slate-200">{currentIndex + 1}</strong> of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="info">{currentQ.type.replace('_', ' ')}</Badge>
              <span className="font-semibold text-emerald-400">Score: {score}</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h4 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              {currentQ.question}
            </h4>

            {currentQ.codeSnippet && (
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* Options / Input */}
          <div className="space-y-2.5">
            {currentQ.options && (
              <div className="space-y-2">
                {currentQ.options.map((opt, idx) => {
                  let optStyle = 'bg-slate-850 border-slate-800 text-slate-200 hover:bg-slate-800';

                  if (isAnswerSubmitted) {
                    if (idx === Number(currentQ.correctAnswer)) {
                      optStyle = 'bg-emerald-950/80 border-emerald-600 text-emerald-200';
                    } else if (selectedOption === idx) {
                      optStyle = 'bg-rose-950/80 border-rose-600 text-rose-200';
                    } else {
                      optStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-60';
                    }
                  } else if (selectedOption === idx) {
                    optStyle = 'bg-brand-950/60 border-brand-500 text-brand-200 font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && idx === Number(currentQ.correctAnswer) && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isAnswerSubmitted && selectedOption === idx && idx !== Number(currentQ.correctAnswer) && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {currentQ.type === 'short_answer' && (
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={isAnswerSubmitted}
                  value={shortAnswerInput}
                  onChange={e => setShortAnswerInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSubmitAnswer(); }}
                  placeholder="Type your exact answer here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
            )}
          </div>

          {/* Explanation Box when Answer Submitted */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-slate-850/90 border border-slate-750 text-xs space-y-1.5 animate-fadeIn">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                <span>Explanation</span>
              </span>
              <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null && !shortAnswerInput.trim()}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-bold shadow-md transition"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
