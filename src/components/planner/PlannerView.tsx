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
  Calendar,
  CalendarCheck,
  School,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { PlannerTask, StudentSchedule } from '../../types';
import { TaskModal } from './TaskModal';
import { TimetableBuilder } from './TimetableBuilder';
import { DEFAULT_STUDENT_SCHEDULE } from '../../data/defaultSchedules';
import { scheduleService } from '../../services/scheduleService';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const PlannerView: React.FC = () => {
  const {
    plannerTasks,
    togglePlannerTask,
    deletePlannerTask,
    savePlannerTask,
    schedule,
    updateSchedule
  } = useData();
  const { addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'tasks' | 'timetable'>('timetable');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
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

  const handleSyncTimetableToTasks = async () => {
    const activeSchedule = schedule || DEFAULT_STUDENT_SCHEDULE;
    const targetDate = new Date(selectedDate);
    const todaySlots = scheduleService.getTodaySlots(activeSchedule, targetDate);

    if (todaySlots.length === 0) {
      addToast('No Slots Today', 'No study blocks scheduled for this day.', 'info');
      return;
    }

    let addedCount = 0;
    for (const slot of todaySlots) {
      if (slot.type === 'break') continue;

      const alreadyExists = plannerTasks.some(
        t => t.date === selectedDate && t.title === slot.title
      );

      if (!alreadyExists) {
        const startM = scheduleService.timeToMinutes(slot.startTime);
        const endM = scheduleService.timeToMinutes(slot.endTime);
        const dur = endM > startM ? endM - startM : 60;

        const newTask: PlannerTask = {
          id: `task-sync-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: slot.title,
          date: selectedDate,
          durationMinutes: dur,
          priority: 'medium',
          category: slot.type === 'coding' ? 'Coding' : slot.type === 'project' ? 'Project' : slot.type === 'revision' ? 'Revision' : 'Academic',
          completed: false,
          notes: slot.notes || `Scheduled ${scheduleService.minutesTo12Hour(startM)} – ${scheduleService.minutesTo12Hour(endM)}`
        };

        await savePlannerTask(newTask);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      addToast('Timetable Synced! ✅', `Added ${addedCount} study blocks to ${selectedDate} checklist.`, 'success');
      setActiveTab('tasks');
    } else {
      addToast('Already Synced', "Today's timetable blocks are already on your checklist.", 'info');
      setActiveTab('tasks');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Study Planner &amp; Routine
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Build your personalized weekly schedule and track daily study checklist tasks.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-850 rounded-xl p-1 border border-slate-200 dark:border-slate-750 shrink-0">
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'timetable'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>My Timetable &amp; Routine</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Daily Checklist Tasks</span>
          </button>
        </div>
      </div>

      {activeTab === 'timetable' ? (
        /* Timetable Builder Mode */
        <TimetableBuilder
          schedule={schedule || DEFAULT_STUDENT_SCHEDULE}
          onSaveSchedule={updateSchedule}
          onSyncTasks={handleSyncTimetableToTasks}
        />
      ) : (
        /* Daily / Weekly Checklist Tasks Mode */
        <div className="space-y-6">
          {/* Header & Date Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 shadow-sm">
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
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 shadow-sm">
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
              <button
                onClick={handleSyncTimetableToTasks}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-750 transition"
              >
                <Clock className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Sync Today's Routine</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Total Tasks</span>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{filteredTasks.length}</h4>
              </div>
              <Calendar className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </Card>

            <Card className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Planned Time</span>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{Math.round(totalMinutes / 60 * 10) / 10} hrs</h4>
              </div>
              <Clock className="w-6 h-6 text-sky-500" />
            </Card>

            <Card className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Completed</span>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{completedCount} / {filteredTasks.length}</h4>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </Card>
          </div>

          {/* Tasks List */}
          {filteredTasks.length === 0 ? (
            <Card className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
              <Calendar className="w-12 h-12 mx-auto text-slate-400 opacity-60 mb-2" />
              <p>No study tasks scheduled for this date.</p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={handleSyncTimetableToTasks}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span>Sync from Timetable</span>
                </button>
                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition"
                >
                  Create Custom Task
                </button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <Card
                  key={task.id}
                  className={`p-4 flex items-center justify-between transition ${
                    task.completed
                      ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-60'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0 mr-4">
                    <button
                      onClick={() => togglePlannerTask(task.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition border ${
                        task.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-700 hover:border-brand-500'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4
                          className={`text-sm font-bold truncate ${
                            task.completed
                              ? 'line-through text-slate-500 dark:text-slate-500'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <Badge
                          variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'info'}
                          size="sm"
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {task.durationMinutes}m
                        </span>
                        <span>•</span>
                        <span>{task.category}</span>
                        {task.notes && (
                          <>
                            <span>•</span>
                            <span className="italic truncate">{task.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(task)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                      title="Edit Task"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePlannerTask(task.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 transition"
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
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        defaultDate={selectedDate}
      />
    </div>
  );
};
