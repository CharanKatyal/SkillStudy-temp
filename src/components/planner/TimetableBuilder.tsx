import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Code2,
  Coffee,
  FolderKanban,
  RotateCcw,
  Sparkles,
  School,
  CalendarCheck,
  CheckCircle2,
  Layers,
  Wand2
} from 'lucide-react';
import { StudentSchedule, TimetableSlot, DayOfWeek, TimetableSlotType } from '../../types';
import { TIMETABLE_PRESETS, DEFAULT_STUDENT_SCHEDULE } from '../../data/defaultSchedules';
import { TimetableSlotModal } from './TimetableSlotModal';
import { scheduleService } from '../../services/scheduleService';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface TimetableBuilderProps {
  schedule: StudentSchedule;
  onSaveSchedule: (newSchedule: StudentSchedule) => void;
  onSyncTasks?: () => void;
  isStandalone?: boolean;
}

const ALL_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const TimetableBuilder: React.FC<TimetableBuilderProps> = ({
  schedule,
  onSaveSchedule,
  onSyncTasks,
  isStandalone = false
}) => {
  const [localSchedule, setLocalSchedule] = useState<StudentSchedule>(
    schedule || DEFAULT_STUDENT_SCHEDULE
  );
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('All');
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [slotToEdit, setSlotToEdit] = useState<TimetableSlot | null>(null);

  const handleUpdateSchoolHours = (
    key: keyof StudentSchedule['schoolHours'],
    val: any
  ) => {
    const updated: StudentSchedule = {
      ...localSchedule,
      schoolHours: {
        ...localSchedule.schoolHours,
        [key]: val
      },
      lastUpdated: new Date().toISOString()
    };
    setLocalSchedule(updated);
    onSaveSchedule(updated);
  };

  const handleToggleSchoolDay = (day: DayOfWeek) => {
    const currentDays = localSchedule.schoolHours.days || [];
    const nextDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];

    handleUpdateSchoolHours('days', nextDays);
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = TIMETABLE_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    const updated: StudentSchedule = {
      hasCustomTimetable: true,
      schoolHours: preset.schoolHours,
      slots: preset.slots,
      lastUpdated: new Date().toISOString()
    };
    setLocalSchedule(updated);
    onSaveSchedule(updated);
  };

  const handleSaveSlot = (slot: TimetableSlot) => {
    let nextSlots: TimetableSlot[];
    const exists = localSchedule.slots.some(s => s.id === slot.id);
    if (exists) {
      nextSlots = localSchedule.slots.map(s => (s.id === slot.id ? slot : s));
    } else {
      nextSlots = [...localSchedule.slots, slot];
    }

    const updated: StudentSchedule = {
      ...localSchedule,
      hasCustomTimetable: true,
      slots: nextSlots,
      lastUpdated: new Date().toISOString()
    };
    setLocalSchedule(updated);
    onSaveSchedule(updated);
  };

  const handleDeleteSlot = (slotId: string) => {
    const nextSlots = localSchedule.slots.filter(s => s.id !== slotId);
    const updated: StudentSchedule = {
      ...localSchedule,
      slots: nextSlots,
      lastUpdated: new Date().toISOString()
    };
    setLocalSchedule(updated);
    onSaveSchedule(updated);
  };

  const getSlotIcon = (type: TimetableSlotType) => {
    switch (type) {
      case 'coding': return <Code2 className="w-4 h-4" />;
      case 'break': return <Coffee className="w-4 h-4" />;
      case 'project': return <FolderKanban className="w-4 h-4" />;
      case 'revision': return <RotateCcw className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const filteredSlots = selectedDayFilter === 'All'
    ? localSchedule.slots
    : localSchedule.slots.filter(s => scheduleService.isDayMatching(s.day, selectedDayFilter as DayOfWeek));

  const sortedSlots = [...filteredSlots].sort(
    (a, b) => scheduleService.timeToMinutes(a.startTime) - scheduleService.timeToMinutes(b.startTime)
  );

  return (
    <div className="space-y-6">
      {/* 1. Quick Presets Card */}
      <Card className="p-6 bg-gradient-to-r from-brand-50/60 via-white to-white dark:from-slate-850 dark:via-slate-850 dark:to-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Choose a Routine Template
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pick a routine to jumpstart your daily timetable, or customize every block manually.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {TIMETABLE_PRESETS.map(preset => (
            <div
              key={preset.id}
              onClick={() => handleApplyPreset(preset.id)}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 hover:shadow-md cursor-pointer transition flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="info">{preset.badge}</Badge>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    {preset.slots.length} Blocks
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                  {preset.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-brand-600 dark:text-brand-400 font-bold">
                <span>Apply Template</span>
                <span>&rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 2. School Hours Configuration */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                School Hours &amp; Schedule
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The app automatically enters School Mode during these hours.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localSchedule.schoolHours.enabled}
              onChange={e => handleUpdateSchoolHours('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
            <span className="ml-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              {localSchedule.schoolHours.enabled ? 'School Hours Active' : 'School Hours Disabled'}
            </span>
          </label>
        </div>

        {localSchedule.schoolHours.enabled && (
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* School Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  School / Institute Name
                </label>
                <input
                  type="text"
                  value={localSchedule.schoolHours.name}
                  onChange={e => handleUpdateSchoolHours('name', e.target.value)}
                  placeholder="e.g. Regular High School"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* School Start Time */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  School Starts
                </label>
                <input
                  type="time"
                  value={localSchedule.schoolHours.startTime}
                  onChange={e => handleUpdateSchoolHours('startTime', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* School End Time */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  School Ends
                </label>
                <input
                  type="time"
                  value={localSchedule.schoolHours.endTime}
                  onChange={e => handleUpdateSchoolHours('endTime', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* School Days */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                School Days
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {ALL_DAYS.map(day => {
                  const isChecked = localSchedule.schoolHours.days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleToggleSchoolDay(day)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        isChecked
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* 3. Study & Coding Timetable Blocks */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span>Study, Coding &amp; Break Blocks ({localSchedule.slots.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              These recurring sessions determine your real-time focus blocks throughout the day.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onSyncTasks && (
              <button
                type="button"
                onClick={onSyncTasks}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
                title="Sync today's slots as checklist items in your planner"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Sync to Today's Tasks</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setSlotToEdit(null);
                setIsSlotModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Block</span>
            </button>
          </div>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedDayFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedDayFilter === 'All'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All Days
          </button>
          {ALL_DAYS.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDayFilter(day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedDayFilter === day
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Slots List */}
        {sortedSlots.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Clock className="w-10 h-10 mx-auto text-slate-400 opacity-60 mb-2" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Timetable Blocks Scheduled</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Add a study or coding block to structure your day.
            </p>
            <button
              type="button"
              onClick={() => {
                setSlotToEdit(null);
                setIsSlotModalOpen(true);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
            >
              Add First Block
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedSlots.map(slot => {
              const startM = scheduleService.timeToMinutes(slot.startTime);
              const endM = scheduleService.timeToMinutes(slot.endTime);
              const durationM = endM > startM ? endM - startM : 1440 - startM + endM;

              return (
                <div
                  key={slot.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition"
                  style={{ borderLeftWidth: '5px', borderLeftColor: slot.color || '#3b82f6' }}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: slot.color || '#3b82f6' }}
                    >
                      {getSlotIcon(slot.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {slot.title}
                        </h4>
                        <Badge size="sm">{slot.day}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {scheduleService.minutesTo12Hour(startM)} – {scheduleService.minutesTo12Hour(endM)}
                        </span>
                        <span>•</span>
                        <span>{scheduleService.formatDuration(durationM)}</span>
                        {slot.notes && (
                          <>
                            <span>•</span>
                            <span className="italic truncate max-w-xs">{slot.notes}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSlotToEdit(slot);
                        setIsSlotModalOpen(true);
                      }}
                      className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Edit Slot"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Delete Slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Modal */}
      <TimetableSlotModal
        isOpen={isSlotModalOpen}
        onClose={() => {
          setIsSlotModalOpen(false);
          setSlotToEdit(null);
        }}
        onSave={handleSaveSlot}
        slotToEdit={slotToEdit}
      />
    </div>
  );
};
