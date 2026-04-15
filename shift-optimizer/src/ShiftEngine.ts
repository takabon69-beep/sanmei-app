import type { DayRequirement, SpecialRequirement } from './components/RequirementsEditor';
import type { WorkerAvailability } from './components/AvailabilityImporter';
import { format, eachDayOfInterval, getDay } from 'date-fns';

export interface AssignedShift {
  workerName: string;
  timeSlot: string;
  date: string;
}

export interface ShiftPlan {
  assignments: AssignedShift[];
  shortages: { date: string; count: number }[];
  workerHours: { [name: string]: number };
}

/** "9:00-17:00" や "9-17" 形式から勤務時間数（小数）を計算 */
const parseHours = (timeSlot: string): number => {
  const match = timeSlot.match(/(\d+)(?::(\d+))?\s*[-~〜–]\s*(\d+)(?::(\d+))?/);
  if (!match) return 0;
  const startH = parseInt(match[1]);
  const startM = parseInt(match[2] ?? '0');
  const endH = parseInt(match[3]);
  const endM = parseInt(match[4] ?? '0');
  const hours = (endH + endM / 60) - (startH + startM / 60);
  return hours > 0 ? hours : 0;
};

export const generateShift = (
  startDate: Date,
  endDate: Date,
  dayRequirements: DayRequirement[],
  specialRequirements: SpecialRequirement[],
  workers: WorkerAvailability[]
): ShiftPlan => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const assignments: AssignedShift[] = [];
  const shortages: { date: string; count: number }[] = [];

  // 各スタッフの累積勤務時間を追跡
  const workerHours: { [name: string]: number } = {};
  workers.forEach(w => (workerHours[w.name] = 0));

  const daysToFill = days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayOfWeek = getDay(day);
    const special = specialRequirements.find(s => s.date === dateStr);
    const countNeeded = special
      ? special.count
      : (dayRequirements.find(dr => dr.dayOfWeek === dayOfWeek)?.count ?? 0);
    return { dateStr, countNeeded };
  });

  daysToFill.forEach(({ dateStr, countNeeded }) => {
    if (countNeeded <= 0) return;

    // この日に出勤可能で、かつ上限時間を超えないスタッフ
    const availableWorkers = workers.filter(w => {
      if (!w.availability[dateStr]) return false;
      const slotHours = parseHours(w.availability[dateStr]);
      const maxH = w.maxHours ?? Infinity;
      return workerHours[w.name] + slotHours <= maxH;
    });

    // 優先順位: ①下限未達のスタッフ優先 ②累積時間が少ない順
    availableWorkers.sort((a, b) => {
      const aMin = a.minHours ?? 0;
      const bMin = b.minHours ?? 0;
      const aNeedsMore = workerHours[a.name] < aMin ? 1 : 0;
      const bNeedsMore = workerHours[b.name] < bMin ? 1 : 0;
      if (aNeedsMore !== bNeedsMore) return bNeedsMore - aNeedsMore;
      return workerHours[a.name] - workerHours[b.name];
    });

    let filledCount = 0;
    for (let i = 0; i < countNeeded; i++) {
      if (i < availableWorkers.length) {
        const worker = availableWorkers[i];
        const slotHours = parseHours(worker.availability[dateStr]);
        assignments.push({
          workerName: worker.name,
          timeSlot: worker.availability[dateStr],
          date: dateStr,
        });
        workerHours[worker.name] += slotHours;
        filledCount++;
      }
    }

    if (filledCount < countNeeded) {
      shortages.push({ date: dateStr, count: countNeeded - filledCount });
    }
  });

  return { assignments, shortages, workerHours };
};
