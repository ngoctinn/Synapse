import { DayOfWeek, DaySchedule } from "../model/types";

export function applyScheduleToDay(
  targetSchedule: DaySchedule,
  sourceSchedule: DaySchedule,
  targetDay?: DayOfWeek
): DaySchedule {
  return {
    ...targetSchedule,
    day: targetDay ?? targetSchedule.day,
    isOpen: sourceSchedule.isOpen,
    timeSlots: sourceSchedule.timeSlots.map(slot => ({ ...slot })),
  };
}

export function copyScheduleToAllDays(
  schedules: DaySchedule[],
  sourceDay: DayOfWeek
): DaySchedule[] | null {
  const sourceSchedule = schedules.find(s => s.day === sourceDay);
  if (!sourceSchedule) return null;

  return schedules.map((day) => {
    if (day.day === sourceDay) return day;
    return applyScheduleToDay(day, sourceSchedule);
  });
}

export function copyScheduleToTargetDay(
  schedules: DaySchedule[],
  sourceDay: DayOfWeek,
  targetDay: DayOfWeek
): DaySchedule[] | null {
  const sourceSchedule = schedules.find(s => s.day === sourceDay);
  if (!sourceSchedule) return null;

  return schedules.map(schedule => {
    if (schedule.day === targetDay) {
      return applyScheduleToDay(schedule, sourceSchedule);
    }
    return schedule;
  });
}
