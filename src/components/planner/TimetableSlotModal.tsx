import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  BookOpen,
  Code2,
  Coffee,
  FolderKanban,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Palette
} from 'lucide-react';
import { TimetableSlot, TimetableSlotType, DayOfWeek } from '../../types';

interface TimetableSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slot: TimetableSlot) => void;
  slotToEdit?: TimetableSlot | null;
}

const PRESET_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#ef4444', // red
  '#64748b'  // slate
];

const SLOT_TYPES: { type: TimetableSlotType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { type: 'study', label: 'Academic Study', icon: BookOpen },
  { type: 'coding', label: 'Code Studio / IDE', icon: Code2 },
  { type: 'break', label: 'Break & Snack', icon: Coffee },
  { type: 'project', label: 'Project Work', icon: FolderKanban },
  { type: 'revision', label: 'Quiz / Revision', icon: RotateCcw },
  { type: 'homework', label: 'Homework / School Prep', icon: BookOpen },
  { type: 'other', label: 'Self Study / Other', icon: Sparkles }
];

export const TimetableSlotModal: React.FC<TimetableSlotModalProps> = ({
  isOpen,
  onClose,
  onSave,
  slotToEdit
}) => {
  const [title, setTitle] = useState('');
  const [day, setDay] = useState<TimetableSlot['day']>('Weekdays');
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('17:00');
  const [type, setType] = useState<TimetableSlotType>('study');
  const [color, setColor] = useState('#3b82f6');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (slotToEdit) {
      setTitle(slotToEdit.title);
      setDay(slotToEdit.day);
      setStartTime(slotToEdit.startTime);
      setEndTime(slotToEdit.endTime);
      setType(slotToEdit.type);
      setColor(slotToEdit.color || '#3b82f6');
      setNotes(slotToEdit.notes || '');
    } else {
      setTitle('');
      setDay('Weekdays');
      setStartTime('16:00');
      setEndTime('17:00');
      setType('study');
      setColor('#3b82f6');
      setNotes('');
    }
  }, [slotToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSlot: TimetableSlot = {
      id: slotToEdit ? slotToEdit.id : `slot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      day,
      startTime,
      endTime,
      type,
      color,
      notes: notes.trim()
    };

    onSave(newSlot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {slotToEdit ? 'Edit Schedule Slot' : 'Add Timetable Slot'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Set study, coding, project, or break times
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Slot Title / Subject Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Mathematics, Python Coding, Physics Revision"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Activity Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SLOT_TYPES.map(st => {
                const Icon = st.icon;
                const isSelected = type === st.type;
                return (
                  <button
                    key={st.type}
                    type="button"
                    onClick={() => setType(st.type)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-brand-600 dark:text-brand-400" />
                    <span className="truncate">{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Applies to Day(s)
            </label>
            <select
              value={day}
              onChange={e => setDay(e.target.value as TimetableSlot['day'])}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Weekdays">Weekdays (Mon – Fri)</option>
              <option value="Daily">Every Day (Daily)</option>
              <option value="Weekends">Weekends (Sat & Sun)</option>
              <option value="Mon">Mondays Only</option>
              <option value="Tue">Tuesdays Only</option>
              <option value="Wed">Wednesdays Only</option>
              <option value="Thu">Thursdays Only</option>
              <option value="Fri">Fridays Only</option>
              <option value="Sat">Saturdays Only</option>
              <option value="Sun">Sundays Only</option>
            </select>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                End Time
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Color Accent */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <span>Color Tag</span>
            </label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-xl transition ${
                    color === c ? 'ring-2 ring-offset-2 ring-brand-500 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Notes or Goals (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Chapter 4 problem set, practice coding loops"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition"
            >
              {slotToEdit ? 'Save Changes' : 'Add Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
