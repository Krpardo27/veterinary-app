import type { PrismaClient } from "@/generated/prisma/client";
import { ReservationStatus } from "@/generated/prisma/enums";
import {
  getBusinessClockParts,
  parseBusinessDateInputRange,
  parseBusinessDateTimeInput,
} from "@/shared/utils/businessTime";
import { getRequiredProfessionalRole } from "../serviceRoles";

export const OPEN_HOUR = 9;
export const CLOSE_HOUR = 20;
export const SLOT_INTERVAL_MINUTES = 30;

export type BusinessHours = {
  openHour: number;
  closeHour: number;
  openMinute: number;
  closeMinute: number;
};

export const ACTIVE_RESERVATION_STATUSES: ReservationStatus[] = [
  ReservationStatus.PENDING,
  ReservationStatus.CONFIRMED,
];

type AvailabilityClient = Pick<
  PrismaClient,
  "service" | "professional" | "reservation" | "professionalService"
>;

type ServiceSnapshot = {
  id: string;
  slug: string;
  name: string;
  price: number;
  durationMin: number;
};

type ProfessionalCandidate = {
  id: string;
  name?: string;
  services: Array<{
    durationMin: number | null;
    isActive: boolean;
  }>;
};

export type AvailableProfessional = {
  professionalId: string;
  professionalName: string;
  durationMin: number;
};

type ReservationWindow = {
  professionalId: string | null;
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

function mapReservationsByProfessional(reservations: ReservationWindow[]) {
  return reservations.reduce<Map<string, ReservationWindow[]>>((acc, reservation) => {
    if (!reservation.professionalId) return acc;

    const current = acc.get(reservation.professionalId) ?? [];
    current.push(reservation);
    acc.set(reservation.professionalId, current);

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

function getCandidateDurationForProfessional(service: ServiceSnapshot, professional: ProfessionalCandidate) {
  const assignment = professional.services[0];

  if (assignment?.isActive === false) {
    return null;
  }

  return assignment?.durationMin ?? service.durationMin;
}

export async function getActiveService(db: AvailabilityClient, serviceId: string) {
  return db.service.findFirst({
    where: { id: serviceId, isActive: true },
    select: { id: true, slug: true, name: true, price: true, durationMin: true },
  });
}

export async function getDurationForProfessional(
  db: AvailabilityClient,
  service: ServiceSnapshot,
  professionalId: string,
) {
  const professional = await db.professional.findFirst({
    where: {
      id: professionalId,
      isActive: true,
      role: getRequiredProfessionalRole(service.slug),
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

  if (!professional) return null;

  return getCandidateDurationForProfessional(service, professional);
}

export async function hasReservationConflict(
  db: AvailabilityClient,
  params: {
    professionalId: string;
    start: Date;
    end: Date;
    excludeReservationId?: string;
  },
) {
  const conflict = await db.reservation.findFirst({
    where: {
      professionalId: params.professionalId,
      status: { in: ACTIVE_RESERVATION_STATUSES },
      ...(params.excludeReservationId ? { id: { not: params.excludeReservationId } } : {}),
      OR: [{ startAt: { lt: params.end }, endAt: { gt: params.start } }],
    },
    select: { id: true },
  });

  return Boolean(conflict);
}

export async function findAvailableProfessional(
  db: AvailabilityClient,
  params: { service: ServiceSnapshot; start: Date },
): Promise<AvailableProfessional | null> {
  const professionals = await db.professional.findMany({
    where: {
      isActive: true,
      role: getRequiredProfessionalRole(params.service.slug),
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

  const candidates = professionals
    .map((professional) => {
      const durationMin = getCandidateDurationForProfessional(params.service, professional);

      if (!durationMin) return null;

      return {
        professionalId: professional.id,
        professionalName: professional.name,
        durationMin,
      };
    })
    .filter((candidate): candidate is AvailableProfessional => candidate !== null);

  if (!candidates.length) {
    return null;
  }

  const maxDuration = Math.max(...candidates.map((candidate) => candidate.durationMin));
  const maxEnd = new Date(params.start.getTime() + maxDuration * 60 * 1000);

  const activeReservations = await db.reservation.findMany({
    where: {
      professionalId: { in: candidates.map((candidate) => candidate.professionalId) },
      status: { in: ACTIVE_RESERVATION_STATUSES },
      startAt: { lt: maxEnd },
      endAt: { gt: params.start },
    },
    select: { professionalId: true, startAt: true, endAt: true },
  });

  const reservationsByProfessional = mapReservationsByProfessional(activeReservations);

  for (const candidate of candidates) {
    const end = new Date(params.start.getTime() + candidate.durationMin * 60 * 1000);
    const hasConflict = getReservationConflicts(
      reservationsByProfessional.get(candidate.professionalId),
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
  professionalId?: string,
) {
  if (professionalId) {
    const durationMin = await getDurationForProfessional(db, service, professionalId);

    return durationMin
      ? [{ professionalId, durationMin }]
      : [];
  }

  const professionals = await db.professional.findMany({
    where: {
      isActive: true,
      role: getRequiredProfessionalRole(service.slug),
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

  return professionals.flatMap((professional) => {
    const durationMin = getCandidateDurationForProfessional(service, professional);

    return durationMin ? [{ professionalId: professional.id, durationMin }] : [];
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