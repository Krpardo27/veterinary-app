export function parseBusinessDateTimeInput(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function parseBusinessDateInputRange(value: string): {
  dayStart: Date;
  dayEnd: Date;
} {
  const base = new Date(value);
  const dayStart = new Date(base);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(base);
  dayEnd.setHours(23, 59, 59, 999);

  return { dayStart, dayEnd };
}

export function getBusinessClockParts(date: Date): {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  dateInput: string;
} {
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    millisecond: date.getMilliseconds(),
    dateInput: `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`,
  };
}

export function getBusinessDateInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}
