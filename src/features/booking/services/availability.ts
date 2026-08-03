import type { PrismaClient } from "@/generated/prisma/client";
import { ReservationStatus } from "@/generated/prisma/enums";
import {
  getBusinessClockParts,
  parseBusinessDateInputRange,
  parseBusinessDateTimeInput,
} from "@/shared/utils/businessTime";

export const OPEN_HOUR = 9;
export const CLOSE_HOUR = 20;
export const SLOT_INTERVAL_MINUTES = 30;

export type BusinessHours = {
  openHour: number;
  closeHour: number;
  openMinute: number;
  closeMinute: number;
};

const ACTIVE_RESERVATION_STATUSES = [
  ReservationStatus.PENDING,
  ReservationStatus.CONFIRMED,
];

type AvailabilityClient = Pick<
  PrismaClient,
  "service" | "veterinarian" | "reservation" | "veterinarianService"
>;

type ServiceSnapshot = {
  id: string;
  name: string;
  price: number;
  durationMin: number;
};

type VeterinarianCandidate = {
  id: string;
  name?: string;
  services: Array<{
    durationMin: number | null;
    isActive: boolean;
  }>;
};

export type AvailableVeterinarian = {
  veterinarianId: string;
  veterinarianName: string;
  durationMin: number;
};

type ReservationWindow = {
  veterinarianId: string | null;
  startAt: Date;
  endAt: Date;
};

export function getDayRange(date: string) {
  return parseBusinessDateInputRange(date);
}

function parseTimeString(timeStr: string | null | undefined): { hours: number; minutes: number } | null {
  if (!timeStr || typeof timeStr !== "string") return null;
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return { hours, minutes };
}

export function resolveBusinessHours(input?: {
  openHour?: string | number | null;
  closeHour?: string | number | null;
  openMinute?: number;
  closeMinute?: number;
}): BusinessHours {
  const openHourInput = input?.openHour;
  const closeHourInput = input?.closeHour;

  let openHour: number | null = null;
  let openMinute: number = input?.openMinute ?? 0;
  let closeHour: number | null = null;
  let closeMinute: number = input?.closeMinute ?? 0;

  // Handle string format (HH:MM)
  if (typeof openHourInput === "string") {
    const parsed = parseTimeString(openHourInput);
    openHour = parsed ? parsed.hours : null;
    openMinute = parsed ? parsed.minutes : 0;
  } else if (typeof openHourInput === "number") {
    openHour = openHourInput;
  }

  if (typeof closeHourInput === "string") {
    const parsed = parseTimeString(closeHourInput);
    closeHour = parsed ? parsed.hours : null;
    closeMinute = parsed ? parsed.minutes : 0;
  } else if (typeof closeHourInput === "number") {
    closeHour = closeHourInput;
  }

  const hasValidOpenHour = Number.isInteger(openHour) && openHour! >= 0 && openHour! <= 23;
  const hasValidCloseHour = Number.isInteger(closeHour) && closeHour! >= 1 && closeHour! <= 24;

  if (!hasValidOpenHour || !hasValidCloseHour || closeHour! <= openHour!) {
    return { openHour: OPEN_HOUR, closeHour: CLOSE_HOUR, openMinute: 0, closeMinute: 0 };
  }

  return { openHour: openHour!, closeHour: closeHour!, openMinute, closeMinute };
}

export function buildSlotStart(
  date: string,
  minuteOffsetFromOpening: number,
  businessHours?: BusinessHours,
) {
  const resolved = resolveBusinessHours(businessHours);
  const { openHour, openMinute } = resolved;
  
  // Total minutes from midnight to opening time
  const openingTotalMinutes = openHour * 60 + openMinute;
  // Total minutes for the slot
  const slotTotalMinutes = openingTotalMinutes + minuteOffsetFromOpening;
  
  const hour = Math.floor(slotTotalMinutes / 60);
  const minute = slotTotalMinutes % 60;

  return parseBusinessDateTimeInput(
    `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`,
  );
}

function getReservationConflicts(
  reservations: ReservationWindow[] | undefined,
  start: Date,
  end: Date,
) {
  if (!reservations?.length) return false;

  return reservations.some(
    (reservation) => reservation.startAt < end && reservation.endAt > start,
  );
}

function mapReservationsByVeterinarian(reservations: ReservationWindow[]) {
  return reservations.reduce<Map<string, ReservationWindow[]>>((acc, reservation) => {
    if (!reservation.veterinarianId) return acc;

    const current = acc.get(reservation.veterinarianId) ?? [];
    current.push(reservation);
    acc.set(reservation.veterinarianId, current);

    return acc;
  }, new Map());
}

export function isStartOnSlotInterval(start: Date) {
  const { minute, second, millisecond } = getBusinessClockParts(start);

  return minute % SLOT_INTERVAL_MINUTES === 0 && second === 0 && millisecond === 0;
}

export function isValidReservationStart(
  start: Date,
  now = new Date(),
  businessHours?: BusinessHours,
) {
  const { openHour, openMinute, closeHour, closeMinute } = resolveBusinessHours(businessHours);

  if (!isStartOnSlotInterval(start)) {
    return false;
  }

  if (start.getTime() <= now.getTime()) {
    return false;
  }

  const { hour, minute } = getBusinessClockParts(start);
  const startTotalMinutes = hour * 60 + minute;
  const openTotalMinutes = openHour * 60 + openMinute;
  const closeTotalMinutes = closeHour * 60 + closeMinute;

  if (startTotalMinutes < openTotalMinutes) return false;

  return startTotalMinutes < closeTotalMinutes;
}

function getCandidateDurationForVeterinarian(service: ServiceSnapshot, veterinarian: VeterinarianCandidate) {
  const assignment = veterinarian.services[0];

  if (assignment?.isActive === false) {
    return null;
  }

  return assignment?.durationMin ?? service.durationMin;
}

export async function getActiveService(db: AvailabilityClient, serviceId: string) {
  return db.service.findFirst({
    where: { id: serviceId, isActive: true },
    select: { id: true, name: true, price: true, durationMin: true },
  });
}

export async function getDurationForVeterinarian(
  db: AvailabilityClient,
  service: ServiceSnapshot,
  veterinarianId: string,
) {
  const veterinarian = await db.veterinarian.findFirst({
    where: {
      id: veterinarianId,
      isActive: true,
    },
    select: {
      id: true,
      services: {
        where: {
          serviceId: service.id,
        },
        select: { durationMin: true, isActive: true },
        take: 1,
      },
    },
  });

  if (!veterinarian) return null;

  return getCandidateDurationForVeterinarian(service, veterinarian);
}

export async function hasReservationConflict(
  db: AvailabilityClient,
  params: {
    veterinarianId: string;
    start: Date;
    end: Date;
    excludeReservationId?: string;
  },
) {
  const conflict = await db.reservation.findFirst({
    where: {
      veterinarianId: params.veterinarianId,
      status: { in: ACTIVE_RESERVATION_STATUSES },
      ...(params.excludeReservationId ? { id: { not: params.excludeReservationId } } : {}),
      OR: [{ startAt: { lt: params.end }, endAt: { gt: params.start } }],
    },
    select: { id: true },
  });

  return Boolean(conflict);
}

export async function findAvailableVeterinarian(
  db: AvailabilityClient,
  params: { service: ServiceSnapshot; start: Date },
): Promise<AvailableVeterinarian | null> {
  const veterinarians = await db.veterinarian.findMany({
    where: {
      isActive: true,
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      services: {
        where: {
          serviceId: params.service.id,
        },
        select: { durationMin: true, isActive: true },
        take: 1,
      },
    },
  });

  const candidates = veterinarians
    .map((veterinarian) => {
      const durationMin = getCandidateDurationForVeterinarian(params.service, veterinarian);

      if (!durationMin) return null;

      return {
        veterinarianId: veterinarian.id,
        veterinarianName: veterinarian.name,
        durationMin,
      };
    })
    .filter((candidate): candidate is AvailableVeterinarian => candidate !== null);

  if (!candidates.length) {
    return null;
  }

  const maxDuration = Math.max(...candidates.map((candidate) => candidate.durationMin));
  const maxEnd = new Date(params.start.getTime() + maxDuration * 60 * 1000);

  const activeReservations = await db.reservation.findMany({
    where: {
      veterinarianId: { in: candidates.map((candidate) => candidate.veterinarianId) },
      status: { in: ACTIVE_RESERVATION_STATUSES },
      startAt: { lt: maxEnd },
      endAt: { gt: params.start },
    },
    select: { veterinarianId: true, startAt: true, endAt: true },
  });

  const reservationsByVeterinarian = mapReservationsByVeterinarian(activeReservations);

  for (const candidate of candidates) {
    const end = new Date(params.start.getTime() + candidate.durationMin * 60 * 1000);
    const hasConflict = getReservationConflicts(
      reservationsByVeterinarian.get(candidate.veterinarianId),
      params.start,
      end,
    );

    if (!hasConflict) {
      return candidate;
    }
  }

  return null;
}

export async function getAvailabilityCandidates(
  db: AvailabilityClient,
  service: ServiceSnapshot,
  veterinarianId?: string,
) {
  if (veterinarianId) {
    const durationMin = await getDurationForVeterinarian(db, service, veterinarianId);

    return durationMin
      ? [{ veterinarianId, durationMin }]
      : [];
  }

  const veterinarians = await db.veterinarian.findMany({
    where: {
      isActive: true,
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      services: {
        where: {
          serviceId: service.id,
        },
        select: { durationMin: true, isActive: true },
        take: 1,
      },
    },
  });

  return veterinarians.flatMap((veterinarian) => {
    const durationMin = getCandidateDurationForVeterinarian(service, veterinarian);

    return durationMin ? [{ veterinarianId: veterinarian.id, durationMin }] : [];
  });
}

export function isInsideBusinessHours(slotEnd: Date, businessHours?: BusinessHours) {
  return isInsideBusinessWindow({
    start: slotEnd,
    end: slotEnd,
    businessHours,
  });
}

export function isInsideBusinessWindow(params: {
  start: Date;
  end: Date;
  businessHours?: BusinessHours;
}) {
  const { openHour, openMinute, closeHour, closeMinute } = resolveBusinessHours(params.businessHours);
  const startClock = getBusinessClockParts(params.start);
  const endClock = getBusinessClockParts(params.end);

  if (startClock.dateInput !== endClock.dateInput) {
    return false;
  }

  const startTotalMinutes = startClock.hour * 60 + startClock.minute;
  const endTotalMinutes = endClock.hour * 60 + endClock.minute;
  const openTotalMinutes = openHour * 60 + openMinute;
  const closeTotalMinutes = closeHour * 60 + closeMinute;

  const startsBeforeOpening = startTotalMinutes < openTotalMinutes;
  if (startsBeforeOpening) {
    return false;
  }

  const endsAfterClosing = endTotalMinutes > closeTotalMinutes;
  return !endsAfterClosing;
}