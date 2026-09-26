import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  SLOT_INTERVAL_MINUTES,
  buildSlotStart,
  getActiveService,
  getAvailabilityCandidates,
  getBusinessHoursForDate,
  isInsideBusinessWindow,
  isValidReservationStart,
} from "@/features/booking/services/availability";

function isValidDateInput(date: string | null): date is string {
  return date !== null && /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export async function GET(request: NextRequest) {
  const serviceId = request.nextUrl.searchParams.get("serviceId");
  const date = request.nextUrl.searchParams.get("date");
  const professionalId = request.nextUrl.searchParams.get("professionalId") ?? undefined;

  if (!serviceId || !isValidDateInput(date)) {
    return NextResponse.json(
      { error: "Servicio y fecha válidos son requeridos." },
      { status: 400 },
    );
  }

  const businessHours = getBusinessHoursForDate(date);

  if (!businessHours) {
    return NextResponse.json({ slots: [], closed: true });
  }

  const service = await getActiveService(prisma, serviceId);

  if (!service) {
    return NextResponse.json({ error: "Servicio no disponible." }, { status: 404 });
  }

  const candidates = await getAvailabilityCandidates(
    prisma,
    service,
    professionalId,
  );
  const openMinutes = businessHours.openHour * 60 + businessHours.openMinute;
  const closeMinutes = businessHours.closeHour * 60 + businessHours.closeMinute;
  const slotCount = Math.ceil((closeMinutes - openMinutes) / SLOT_INTERVAL_MINUTES);

  const slots = Array.from({ length: slotCount }, (_, index) => {
    const start = buildSlotStart(date, index * SLOT_INTERVAL_MINUTES, businessHours);
    const isValidStart = Boolean(start && isValidReservationStart(start, new Date(), businessHours));

    return {
      time: start
        ? `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`
        : "",
      start,
      isValidStart,
    };
  });

  const reservations = await prisma.reservation.findMany({
    where: {
      professionalId: { in: candidates.map((candidate) => candidate.professionalId) },
      status: { in: ["PENDING", "CONFIRMED"] },
      startAt: { lt: buildSlotStart(date, closeMinutes - openMinutes, businessHours)! },
      endAt: { gt: buildSlotStart(date, 0, businessHours)! },
    },
    select: { professionalId: true, startAt: true, endAt: true },
  });

  return NextResponse.json({
    closed: false,
    slots: slots.map((slot) => ({
      time: slot.time,
      available:
        slot.isValidStart &&
        candidates.some((candidate) => {
          const candidateEnd = new Date(
            slot.start!.getTime() + candidate.durationMin * 60 * 1000,
          );

          if (!isInsideBusinessWindow({ start: slot.start!, end: candidateEnd, businessHours })) {
            return false;
          }

          return !reservations.some(
            (reservation) =>
              reservation.professionalId === candidate.professionalId &&
              reservation.startAt < candidateEnd &&
              reservation.endAt > slot.start!,
          );
        }),
    })),
  });
}