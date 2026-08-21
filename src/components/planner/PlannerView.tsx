import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PlannerTask } from '../../types';
import { TaskModal } from './TaskModal';
import { SmartTimetableModal } from '../ai/SmartTimetableModal';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const PlannerView: React.FC = () => {
  const { plannerTasks, togglePlannerTask, deletePlannerTask } = useData();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAiTimetableModalOpen, setIsAiTimetableModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<PlannerTask | null>(null);

  // Calculate current week days
  const getDaysOfWeek = (dateStr: string) => {
    const current = new Date(dateStr);
    const day = current.getDay(); // 0 is Sunday
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(monday);
      next.setDate(monday.getDate() + i);
      week.push(next.toISOString().split('T')[0]);
    }
    return week;
  };

  const weekDays = getDaysOfWeek(selectedDate);

  const filteredTasks = viewMode === 'day'
    ? plannerTasks.filter(t => t.date === selectedDate)
    : plannerTasks.filter(t => weekDays.includes(t.date));

  const totalMinutes = filteredTasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  const completedCount = filteredTasks.filter(t => t.completed).length;

  const handleOpenAdd = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEdit = (task: PlannerTask) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleDateShift = (delta: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + (viewMode === 'day' ? delta : delta * 7));
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-750">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'day' ? 'bg-slate-900 text-brand-400 shadow' : 'text-slate-400'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'week' ? 'bg-slate-900 text-brand-400 shadow' : 'text-slate-400'
              }`}
            >
              Week View
            </button>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center gap-1 bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-750 text-xs text-slate-200">
            <button onClick={() => handleDateShift(-1)} className="p-1 hover:text-white">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-semibold px-2">
              {new Date(selectedDate).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <button onClick={() => handleDateShift(1)} className="p-1 hover:text-white">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Phase 3 AI Smart Timetable Generator */}
          <button
            onClick={() => setIsAiTimetableModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-950/60 border border-purple-700/60 hover:bg-purple-900/60 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition shadow"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Smart Timetable</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Week Day Pills (if week view) */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(dStr => {
            const d = new Date(dStr);
            const isSelected = selectedDate === dStr;
            const count = plannerTasks.filter(t => t.date === dStr).length;

            return (
              <button
                key={dStr}
                onClick={() => setSelectedDate(dStr)}
                className={`p-2.5 rounded-xl border text-center transition ${
                  isSelected
                    ? 'bg-brand-950/60 border-brand-500 text-brand-300 font-bold'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="text-[10px] uppercase">{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                <div className="text-sm font-bold text-slate-200 mt-0.5">{d.getDate()}</div>
                {count > 0 && (
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">{count} tasks</div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Tasks List */}
      <Card className="p-5 border-slate-800">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-brand-400" />
            <span className="font-bold text-slate-200">
              {filteredTasks.length} Scheduled Tasks
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>{completedCount} Completed</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {totalMinutes} mins total
            </span>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p>No study tasks scheduled for this period. Click "Add Task" or generate an AI Smart Timetable.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTasks.map(task => {
              const priorityColors = {
                high: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
                medium: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
                low: 'bg-slate-800 text-slate-400 border-slate-700'
              };

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                    task.completed
                      ? 'bg-slate-900/60 border-slate-800/80 opacity-70'
                      : 'bg-slate-850/90 border-slate-750 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate mr-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => togglePlannerTask(task.id)}
                      className="w-4 h-4 rounded text-brand-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer shrink-0"
                    />
                    <div className="truncate">
                      <h4
                        className={`text-sm font-semibold truncate ${
                          task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {task.title}
                      </h4>
                      {task.notes && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">{task.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={task.category === 'Coding' ? 'info' : task.category === 'Academic' ? 'purple' : 'default'}>
                      {task.category}
                    </Badge>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 pl-1">
                      <Clock className="w-3 h-3" />
                      {task.durationMinutes}m
                    </span>

                    <button
                      onClick={() => handleOpenEdit(task)}
                      className="p-1 text-slate-400 hover:text-slate-200 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deletePlannerTask(task.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
        defaultDate={selectedDate}
      />

      <SmartTimetableModal
        isOpen={isAiTimetableModalOpen}
        onClose={() => setIsAiTimetableModalOpen(false)}
      />
    </div>
  );
};
