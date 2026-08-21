import React, { useState } from 'react';
import { Calendar, Clock, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { smartTimetableService } from '../../services/smartTimetableService';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface SmartTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartTimetableModal: React.FC<SmartTimetableModalProps> = ({ isOpen, onClose }) => {
  const { progress, practiceAttempts, savePlannerTask } = useData();
  const { addToast } = useApp();

  const [availableDailyMinutes, setAvailableDailyMinutes] = useState(60);
  const [preferredDaysCount, setPreferredDaysCount] = useState(5);
  const [generatedTasks, setGeneratedTasks] = useState<any[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    const plan = await smartTimetableService.generateSmartPlan(
      preferredDaysCount,
      availableDailyMinutes
    );
    setGeneratedTasks(plan.tasks);
    setIsGenerated(true);
  };

  const handleApplyAll = async () => {
    for (const task of generatedTasks) {
      await savePlannerTask(task);
    }
    addToast('Schedule Generated! 📅', `Added ${generatedTasks.length} study tasks to your planner calendar.`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Smart Timetable Generator" maxWidth="2xl">
      <div className="space-y-4">
        {/* Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-brand-50 via-white to-white dark:from-brand-950/70 dark:to-slate-900 border border-brand-200 dark:border-brand-800/40 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="leading-relaxed">
            The Smart Timetable generator analyzes your quiz accuracy and incomplete syllabus topics to produce an optimized, balanced study schedule.
          </p>
        </div>

        {!isGenerated ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Daily Study Target: {availableDailyMinutes} mins/day
                </label>
                <input
                  type="range"
                  min="20"
                  max="180"
                  step="10"
                  value={availableDailyMinutes}
                  onChange={e => setAvailableDailyMinutes(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Study Days per Week: {preferredDaysCount} days
                </label>
                <input
                  type="range"
                  min="3"
                  max="7"
                  step="1"
                  value={preferredDaysCount}
                  onChange={e => setPreferredDaysCount(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGenerate}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Schedule</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-200">
                Generated Plan ({generatedTasks.length} Sessions)
              </span>
              <button
                onClick={() => setIsGenerated(false)}
                className="text-brand-600 dark:text-brand-400 hover:underline font-bold"
              >
                Adjust Parameters
              </button>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {generatedTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shadow-sm"
                >
                  <div className="space-y-0.5 truncate mr-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="purple" size="sm">{task.category}</Badge>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{task.date}</span>
                    </div>
                    <h5 className="font-bold text-slate-900 dark:text-slate-200 truncate">{task.title}</h5>
                  </div>
                  <span className="font-semibold text-slate-600 dark:text-slate-400 shrink-0">{task.durationMinutes}m</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyAll}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add All to Planner Calendar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
