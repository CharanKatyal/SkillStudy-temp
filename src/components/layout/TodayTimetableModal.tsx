import React, { useState } from 'react';
import {
  X,
  Clock,
  School,
  BookOpen,
  Code2,
  Coffee,
  FolderKanban,
  RotateCcw,
  Sparkles,
  Calendar,
  CheckCircle2,
  Edit2,
  Play
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { scheduleService } from '../../services/scheduleService';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

interface TodayTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TodayTimetableModal: React.FC<TodayTimetableModalProps> = ({
  isOpen,
  onClose
}) => {
  const { schedule, scheduleStatus } = useData();
  const { setActiveNav } = useApp();

  if (!isOpen) return null;

  const todaySlots = scheduleStatus.todaySlots;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const handleOpenPlanner = () => {
    onClose();
    setActiveNav('planner');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'coding': return <Code2 className="w-4 h-4 text-purple-500" />;
      case 'break': return <Coffee className="w-4 h-4 text-emerald-500" />;
      case 'project': return <FolderKanban className="w-4 h-4 text-pink-500" />;
      case 'revision': return <RotateCcw className="w-4 h-4 text-amber-500" />;
      default: return <BookOpen className="w-4 h-4 text-brand-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Today's Schedule &amp; Focus
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {scheduleStatus.currentDay} • {scheduleService.minutesTo12Hour(nowMinutes)}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time timetable synchronization
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

        {/* Current Active Status Banner */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Current Status
                </span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {scheduleStatus.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {scheduleStatus.subtitle}
              </p>
            </div>

            {scheduleStatus.formattedRemainingTime && (
              <div className="text-right shrink-0 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Remaining</span>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                  {scheduleStatus.formattedRemainingTime}
                </span>
              </div>
            )}
          </div>

          {scheduleStatus.progressPercent > 0 && (
            <div className="mt-3">
              <ProgressBar value={scheduleStatus.progressPercent} color="bg-brand-500" height="sm" />
            </div>
          )}
        </div>

        {/* Today's Timeline */}
        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Full Timeline for Today
          </h4>

          {/* School Hours if applicable today */}
          {schedule?.schoolHours.enabled && schedule.schoolHours.days.includes(scheduleStatus.currentDay) && (
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
              scheduleStatus.isSchoolTime
                ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800/60'
                : 'bg-slate-50 dark:bg-slate-850/40 border-slate-200 dark:border-slate-800 opacity-75'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {schedule.schoolHours.name || 'School Hours'}
                    </h5>
                    {scheduleStatus.isSchoolTime && (
                      <span className="text-[10px] bg-sky-500 text-white px-1.5 py-0.5 rounded-md font-bold animate-pulse">
                        ACTIVE NOW
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {scheduleService.minutesTo12Hour(scheduleService.timeToMinutes(schedule.schoolHours.startTime))} – {scheduleService.minutesTo12Hour(scheduleService.timeToMinutes(schedule.schoolHours.endTime))}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Study / Activity Slots */}
          {schedule?.mode === 'open' ? (
            <div className="text-center py-8 space-y-2 text-slate-500 dark:text-slate-400 text-xs">
              <Sparkles className="w-8 h-8 mx-auto text-amber-500 opacity-80" />
              <p className="font-bold text-slate-800 dark:text-slate-200">Full Open Learning Active</p>
              <p className="text-[11px] max-w-xs mx-auto">No timetable constraints are set. You can study, code, and take practice assessments anytime.</p>
            </div>
          ) : todaySlots.length === 0 ? (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs">
              <p>No study blocks configured for today.</p>
            </div>
          ) : (
            todaySlots.map(slot => {
              const startM = scheduleService.timeToMinutes(slot.startTime);
              const endM = scheduleService.timeToMinutes(slot.endTime);
              const isCurrent = nowMinutes >= startM && nowMinutes < endM;
              const isPast = nowMinutes >= endM;

              return (
                <div
                  key={slot.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                    isCurrent
                      ? 'bg-brand-50/70 dark:bg-brand-950/40 border-brand-400 dark:border-brand-600/60 shadow-sm'
                      : isPast
                      ? 'bg-slate-50 dark:bg-slate-850/40 border-slate-200 dark:border-slate-800 opacity-60'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800'
                  }`}
                  style={{ borderLeftWidth: '4px', borderLeftColor: slot.color || '#3b82f6' }}
                >
                  <div className="flex items-center gap-3 truncate mr-2">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                      {getIcon(slot.type)}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {slot.title}
                        </h5>
                        {isCurrent && (
                          <span className="text-[10px] bg-brand-600 text-white px-1.5 py-0.5 rounded-md font-bold shrink-0">
                            NOW
                          </span>
                        )}
                        {isPast && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {scheduleService.minutesTo12Hour(startM)} – {scheduleService.minutesTo12Hour(endM)}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0 capitalize">
                    {slot.type}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <button
            onClick={handleOpenPlanner}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Customize Timetable &amp; Routine</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
