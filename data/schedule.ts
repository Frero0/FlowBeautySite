export type OpeningWindow = {
  day: number; // 0 Sunday, 6 Saturday
  open: string; // HH:mm
  close: string; // HH:mm
};

export const weeklySchedule: OpeningWindow[] = [
  { day: 2, open: "09:00", close: "19:00" }, // Tuesday
  { day: 3, open: "09:00", close: "19:00" }, // Wednesday
  { day: 4, open: "09:00", close: "19:00" }, // Thursday
  { day: 5, open: "09:00", close: "19:00" }, // Friday
  { day: 6, open: "09:00", close: "13:00" } // Saturday
];

export const slotIntervalMinutes = 15;
export const defaultBufferMinutes = 0;
