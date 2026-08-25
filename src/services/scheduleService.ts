import { StudentSchedule, TimetableSlot, DayOfWeek } from '../types';

export interface ScheduleStatus {
  currentDay: DayOfWeek;
  currentTimeStr: string; // "16:45"
  statusType: 'school' | 'study' | 'coding' | 'break' | 'project' | 'revision' | 'free';
  title: string;
  subtitle: string;
  activeSlot: TimetableSlot | null;
  nextSlot: TimetableSlot | null;
  isSchoolTime: boolean;
  schoolInfo?: {
    name: string;
    startTime: string;
    endTime: string;
  };
  progressPercent: number;
  remainingMinutes: number;
  formattedRemainingTime: string;
  todaySlots: TimetableSlot[];
}

export class ScheduleService {
  // Convert "HH:MM" to total minutes from midnight
  timeToMinutes(timeStr: string): number {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  // Convert minutes from midnight to "h:mm A" or "HH:MM"
  minutesTo12Hour(minutes: number): string {
    const hours24 = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${mins.toString().padStart(2, '0')} ${period}`;
  }

  formatDuration(mins: number): string {
    if (mins <= 0) return '0m';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  }

  getDayOfWeek(date = new Date()): DayOfWeek {
    const days: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }

  isDayMatching(slotDay: TimetableSlot['day'], currentDay: DayOfWeek): boolean {
    if (slotDay === 'Daily') return true;
    if (slotDay === 'Weekdays') {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(currentDay);
    }
    if (slotDay === 'Weekends') {
      return ['Sat', 'Sun'].includes(currentDay);
    }
    return slotDay === currentDay;
  }

  getTodaySlots(schedule: StudentSchedule, date = new Date()): TimetableSlot[] {
    const currentDay = this.getDayOfWeek(date);
    return schedule.slots
      .filter(s => this.isDayMatching(s.day, currentDay))
      .sort((a, b) => this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime));
  }

  getCurrentStatus(schedule: StudentSchedule | null, date = new Date()): ScheduleStatus {
    const currentDay = this.getDayOfWeek(date);
    const currentHour = date.getHours();
    const currentMin = date.getMinutes();
    const nowMinutes = currentHour * 60 + currentMin;
    const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;

    if (!schedule) {
      return {
        currentDay,
        currentTimeStr,
        statusType: 'free',
        title: 'Free Exploration',
        subtitle: 'Self-paced learning & coding',
        activeSlot: null,
        nextSlot: null,
        isSchoolTime: false,
        progressPercent: 0,
        remainingMinutes: 0,
        formattedRemainingTime: '',
        todaySlots: []
      };
    }

    const todaySlots = this.getTodaySlots(schedule, date);

    // 1. Check School Hours
    const { schoolHours } = schedule;
    if (schoolHours?.enabled && schoolHours.days.includes(currentDay)) {
      const schoolStart = this.timeToMinutes(schoolHours.startTime);
      const schoolEnd = this.timeToMinutes(schoolHours.endTime);

      if (nowMinutes >= schoolStart && nowMinutes < schoolEnd) {
        const totalDuration = schoolEnd - schoolStart;
        const elapsed = nowMinutes - schoolStart;
        const remaining = schoolEnd - nowMinutes;
        const progress = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

        const nextSlot = todaySlots.find(s => this.timeToMinutes(s.startTime) >= schoolEnd) || null;

        return {
          currentDay,
          currentTimeStr,
          statusType: 'school',
          title: schoolHours.name || 'School in Session',
          subtitle: `Ends at ${this.minutesTo12Hour(schoolEnd)}`,
          activeSlot: null,
          nextSlot,
          isSchoolTime: true,
          schoolInfo: {
            name: schoolHours.name || 'School',
            startTime: schoolHours.startTime,
            endTime: schoolHours.endTime
          },
          progressPercent: progress,
          remainingMinutes: remaining,
          formattedRemainingTime: this.formatDuration(remaining),
          todaySlots
        };
      }
    }

    // 2. Check Today's Specific Timetable Slots
    for (let i = 0; i < todaySlots.length; i++) {
      const slot = todaySlots[i];
      const start = this.timeToMinutes(slot.startTime);
      const end = this.timeToMinutes(slot.endTime);

      if (nowMinutes >= start && nowMinutes < end) {
        const totalDuration = end - start;
        const elapsed = nowMinutes - start;
        const remaining = end - nowMinutes;
        const progress = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
        const nextSlot = todaySlots[i + 1] || null;

        return {
          currentDay,
          currentTimeStr,
          statusType: slot.type === 'break' ? 'break' : slot.type === 'coding' ? 'coding' : slot.type === 'project' ? 'project' : slot.type === 'revision' ? 'revision' : 'study',
          title: slot.title,
          subtitle: `${this.minutesTo12Hour(start)} – ${this.minutesTo12Hour(end)}`,
          activeSlot: slot,
          nextSlot,
          isSchoolTime: false,
          progressPercent: progress,
          remainingMinutes: remaining,
          formattedRemainingTime: this.formatDuration(remaining),
          todaySlots
        };
      }
    }

    // 3. No active slot currently -> Find next upcoming slot today
    const nextSlot = todaySlots.find(s => this.timeToMinutes(s.startTime) > nowMinutes) || null;

    let subtitle = 'Self-paced learning & coding';
    if (nextSlot) {
      const start = this.timeToMinutes(nextSlot.startTime);
      const diff = start - nowMinutes;
      subtitle = `Next: ${nextSlot.title} at ${this.minutesTo12Hour(start)} (in ${this.formatDuration(diff)})`;
    }

    return {
      currentDay,
      currentTimeStr,
      statusType: 'free',
      title: 'Free Study Time',
      subtitle,
      activeSlot: null,
      nextSlot,
      isSchoolTime: false,
      progressPercent: 0,
      remainingMinutes: 0,
      formattedRemainingTime: '',
      todaySlots
    };
  }
}

export const scheduleService = new ScheduleService();
