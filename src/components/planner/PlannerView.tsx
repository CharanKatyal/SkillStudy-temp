import React, { useState } from 'react';
import {
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar
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
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-750">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'day'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Week View
            </button>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-750 text-xs text-slate-800 dark:text-slate-200 shadow-sm">
            <button onClick={() => handleDateShift(-1)} className="p-1 hover:text-brand-600 dark:hover:text-white">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold px-2">
              {new Date(selectedDate).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <button onClick={() => handleDateShift(1)} className="p-1 hover:text-brand-600 dark:hover:text-white">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Smart Timetable Generator */}
          <button
            onClick={() => setIsAiTimetableModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-700/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-200 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Smart Timetable</span>
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
                    ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300 font-bold'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-[10px] uppercase font-bold">{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-200 mt-0.5">{d.getDate()}</div>
                {count > 0 && (
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">{count} tasks</div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Total Planned Tasks</span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{filteredTasks.length}</div>
          </div>
          <Calendar className="w-6 h-6 text-brand-600 dark:text-brand-400" />
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Completed Tasks</span>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {completedCount} / {filteredTasks.length}
            </div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Planned Study Time</span>
            <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
              {totalMinutes} mins
            </div>
          </div>
          <Clock className="w-6 h-6 text-purple-500" />
        </Card>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-200">
          Scheduled Tasks for {viewMode === 'day' ? 'Today' : 'This Week'}
        </h3>

        {filteredTasks.length === 0 ? (
          <Card className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
            <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-400" />
            <p>No study tasks scheduled for this date.</p>
            <button
              onClick={handleOpenAdd}
              className="mt-3 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold"
            >
              Add Your First Task
            </button>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {filteredTasks.map(task => (
              <Card
                key={task.id}
                className={`p-4 flex items-center justify-between gap-4 transition ${
                  task.completed ? 'opacity-70' : ''
                }`}
              >
                <div className="flex items-center gap-3 flex-1 truncate">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => togglePlannerTask(task.id)}
                    className="w-5 h-5 rounded accent-brand-600 cursor-pointer"
                  />
                  <div className="truncate">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge
                        variant={
                          task.priority === 'high'
                            ? 'danger'
                            : task.priority === 'medium'
                            ? 'warning'
                            : 'info'
                        }
                        size="sm"
                      >
                        {task.priority}
                      </Badge>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{task.category}</span>
                      <span className="text-[11px] text-slate-400">•</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.durationMinutes}m
                      </span>
                    </div>
                    <h4
                      className={`text-sm font-bold truncate ${
                        task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {task.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(task)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit Task"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePlannerTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

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
