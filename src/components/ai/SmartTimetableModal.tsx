import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { SmartTimetablePlan } from '../../types/ai';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface SmartTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartTimetableModal: React.FC<SmartTimetableModalProps> = ({ isOpen, onClose }) => {
  const { generateSmartTimetable, applySmartTimetable } = useAI();

  const [daysCount, setDaysCount] = useState(5);
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [focusAreas, setFocusAreas] = useState<string[]>(['Coding', 'Academic', 'Project', 'Revision']);
  const [generatedPlan, setGeneratedPlan] = useState<SmartTimetablePlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    const plan = await generateSmartTimetable(daysCount, dailyMinutes, focusAreas);
    setGeneratedPlan(plan);
    setIsGenerating(false);
  };

  const handleApply = async () => {
    if (!generatedPlan) return;
    await applySmartTimetable(generatedPlan);
    onClose();
  };

  const toggleFocusArea = (area: string) => {
    setFocusAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Smart Timetable Generator" maxWidth="2xl">
      <div className="space-y-4">
        {/* Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-brand-950/70 to-slate-900 border border-brand-800/40 text-xs text-slate-300 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <p>
            The Smart Timetable analyzes your pending curriculum, unsolved coding challenges, and study consistency to generate an optimal daily schedule.
          </p>
        </div>

        {/* Configuration inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Study Schedule Span
            </label>
            <select
              value={daysCount}
              onChange={e => setDaysCount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
            >
              <option value="3">Next 3 Days</option>
              <option value="5">Next 5 Days (School Week)</option>
              <option value="7">Next 7 Days (Full Week)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Daily Study Time
            </label>
            <select
              value={dailyMinutes}
              onChange={e => setDailyMinutes(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
            >
              <option value="30">30 minutes / day (Light)</option>
              <option value="45">45 minutes / day (Standard)</option>
              <option value="60">60 minutes / day (Intensive)</option>
              <option value="90">90 minutes / day (Bootcamp)</option>
            </select>
          </div>
        </div>

        {/* Focus Areas */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Focus Areas to Include
          </label>
          <div className="flex flex-wrap gap-2">
            {['Coding', 'Academic', 'Project', 'Revision'].map(area => {
              const active = focusAreas.includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleFocusArea(area)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                    active
                      ? 'bg-brand-950/60 border-brand-500 text-brand-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  {area}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        {!generatedPlan && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating || focusAreas.length === 0}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Synthesizing Schedule...' : 'Generate Smart Schedule'}</span>
          </button>
        )}

        {/* Preview of Generated Plan */}
        {generatedPlan && (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold">
                Generated Plan: {generatedPlan.tasks.length} tasks across {generatedPlan.targetDays} days
              </span>
              <button
                onClick={handleGenerate}
                className="text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Re-roll</span>
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 p-2 bg-slate-950 rounded-xl border border-slate-800">
              {generatedPlan.tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="truncate mr-2">
                    <h5 className="font-semibold text-slate-200 truncate">{task.title}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {task.date} • {task.reason}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={task.category === 'Coding' ? 'info' : task.category === 'Academic' ? 'purple' : 'default'} size="sm">
                      {task.category}
                    </Badge>
                    <span className="text-[10px] text-slate-400">{task.durationMinutes}m</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setGeneratedPlan(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleApply}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition"
              >
                Apply to My Study Planner
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
