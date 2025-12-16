import {
  addMinutes,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isValid,
  parse
} from "date-fns";
import { weeklySchedule, slotIntervalMinutes } from "@/data/schedule";

const timeToDate = (day: Date, time: string) => {
  const [hours, minutes] = time.split(":").map((v) => parseInt(v, 10));
  const d = new Date(day);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

export type Slot = {
  label: string;
  value: string;
};

export function getSlotsForDay(day: Date): Slot[] {
  const daySchedule = weeklySchedule.find((w) => w.day === day.getDay());
  if (!daySchedule) return [];

  const start = timeToDate(day, daySchedule.open);
  const end = timeToDate(day, daySchedule.close);
  const slots: Slot[] = [];

  for (
    let cursor = start;
    isBefore(cursor, end) || isSameDay(cursor, end);
    cursor = addMinutes(cursor, slotIntervalMinutes)
  ) {
    if (isAfter(cursor, end)) break;
    slots.push({
      label: format(cursor, "HH:mm"),
      value: format(cursor, "HH:mm")
    });
  }
  return slots;
}

export function isValidSlot(day: string, time: string) {
  const date = parse(day, "yyyy-MM-dd", new Date());
  if (!isValid(date)) return false;
  return getSlotsForDay(date).some((slot) => slot.value === time);
}
