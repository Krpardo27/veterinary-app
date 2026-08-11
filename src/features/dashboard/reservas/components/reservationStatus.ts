import type { ReservationStatus } from "@/generated/prisma/enums";

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
};

export const RESERVATION_STATUS_STYLES: Record<ReservationStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  CONFIRMED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  COMPLETED: "border-zinc-200 bg-zinc-100 text-zinc-600",
  CANCELLED: "border-red-200 bg-red-50 text-red-600",
  NO_SHOW: "border-orange-200 bg-orange-50 text-orange-700",
};