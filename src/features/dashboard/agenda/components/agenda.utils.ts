import {
  buildSlotStart,
  resolveBusinessHours,
  SLOT_INTERVAL_MINUTES,
} from "@/features/booking/services/availability";
import { getBusinessDateOnly } from "@/shared/utils/businessTime";
import type { AgendaSlot } from "./agenda.types";

const SATURDAY_BUSINESS_HOURS = resolveBusinessHours({
  openHour: "09:30",
  closeHour: "16:30",
});

export function addDays(dateInput: string, days: number) {
  const date = new Date(`${dateInput}T12:00:00`);
  date.setDate(date.getDate() + days);
  return getBusinessDateOnly(date);
}

export function isValidDateInput(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  return !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
}

export function buildDailySlots(dateInput: string): AgendaSlot[] | null {
  const dayOfWeek = new Date(`${dateInput}T12:00:00`).getDay();

  if (dayOfWeek === 0) return null;

  const businessHours = dayOfWeek === 6
    ? SATURDAY_BUSINESS_HOURS
    : resolveBusinessHours();
  const totalMinutes =
    businessHours.closeHour * 60 +
    businessHours.closeMinute -
    (businessHours.openHour * 60 + businessHours.openMinute);

  return Array.from(
    { length: totalMinutes / SLOT_INTERVAL_MINUTES },
    (_, index) => {
      const start = buildSlotStart(
        dateInput,
        index * SLOT_INTERVAL_MINUTES,
        businessHours,
      )!;

      return {
        start,
        end: new Date(start.getTime() + SLOT_INTERVAL_MINUTES * 60 * 1000),
      };
    },
  );
}