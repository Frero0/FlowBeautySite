import { randomUUID } from "crypto";
import { addMinutes, isAfter, isBefore } from "date-fns";
import { formatInTimeZone, toZonedTime, fromZonedTime } from "date-fns-tz";
import {
  BookingStatus,
  Prisma,
  PrismaClient,
  Service,
  StaffMember
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

const SLOT_STEP_MIN = 15;
const DEFAULT_TZ = "Europe/Rome";

type AvailabilityResult = {
  slots: string[];
  service: Service;
  staff: StaffMember;
  timezone: string;
  settings: Awaited<ReturnType<typeof getSettings>>;
};

type LunchWindow = { start: Date; end: Date } | null;

const overlaps = (startA: Date, endA: Date, startB: Date, endB: Date) =>
  isBefore(startA, endB) && isAfter(endA, startB);

const dayOfWeekInTz = (date: string, tz: string) => {
  const middayUtc = fromZonedTime(`${date}T12:00:00`, tz);
  return toZonedTime(middayUtc, tz).getDay();
};

const toUtcFromLocal = (date: string, time: string, tz: string) =>
  fromZonedTime(`${date}T${time}:00`, tz);

type DbClient = PrismaClient | Prisma.TransactionClient;

async function getSettings(client: DbClient) {
  const existing = await client.businessSettings.findFirst();
  if (existing) return existing;
  return client.businessSettings.create({
    data: {}
  });
}

async function getService(client: DbClient, serviceId: string) {
  const service = await client.service.findFirst({
    where: { id: serviceId, isActive: true }
  });
  if (!service) {
    throw new Error("Servizio non trovato o non attivo.");
  }
  return service;
}

async function getStaff(client: DbClient, staffId?: string) {
  if (staffId) {
    const staff = await client.staffMember.findFirst({
      where: { id: staffId, isActive: true }
    });
    if (!staff) {
      throw new Error("Operatrice non trovata o non attiva.");
    }
    return staff;
  }
  const staff = await client.staffMember.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "asc" }
  });
  if (!staff) {
    throw new Error("Nessuno staff attivo disponibile.");
  }
  return staff;
}

function getLunchWindow(
  settings: Awaited<ReturnType<typeof getSettings>>,
  schedule: { lunchStart: string | null; lunchEnd: string | null },
  date: string,
  tz: string
): LunchWindow {
  const start = schedule.lunchStart || settings.lunchStart;
  const end = schedule.lunchEnd || settings.lunchEnd;
  if (!(settings.lunchEnabled && start && end)) return null;
  return { start: toUtcFromLocal(date, start, tz), end: toUtcFromLocal(date, end, tz) };
}

export async function getAvailability(params: {
  serviceId: string;
  staffId?: string;
  date: string;
  client?: DbClient;
}): Promise<AvailabilityResult> {
  const client = params.client ?? prisma;
  const settings = await getSettings(client);
  const tz = settings.timezone || DEFAULT_TZ;
  const service = await getService(client, params.serviceId);
  const staff = await getStaff(client, params.staffId);

  const dayOfWeek = dayOfWeekInTz(params.date, tz);
  const schedule = await client.weeklySchedule.findFirst({
    where: { dayOfWeek }
  });

  if (!schedule || schedule.isClosed || !schedule.openTime || !schedule.closeTime) {
    return { slots: [], service, staff, timezone: tz, settings };
  }

  const open = toUtcFromLocal(params.date, schedule.openTime, tz);
  const close = toUtcFromLocal(params.date, schedule.closeTime, tz);
  const lunchWindow = getLunchWindow(settings, schedule, params.date, tz);
  const dayStartUtc = toUtcFromLocal(params.date, "00:00", tz);
  const dayEndUtc = toUtcFromLocal(params.date, "23:59", tz);

  const bookings = await client.booking.findMany({
    where: {
      staffId: staff.id,
      status: { not: BookingStatus.CANCELLED },
      startAt: { lt: dayEndUtc },
      endAt: { gt: dayStartUtc }
    },
    include: { service: true }
  });

  const closures = await client.closure.findMany({
    where: {
      startAt: { lt: dayEndUtc },
      endAt: { gt: dayStartUtc }
    }
  });

  const slots: string[] = [];
  const leadLimit = addMinutes(new Date(), settings.leadTimeMin ?? 0);
  const buffer = service.bufferMin ?? settings.defaultBufferMin ?? 0;

  for (let cursor = open; isBefore(cursor, close); cursor = addMinutes(cursor, SLOT_STEP_MIN)) {
    const serviceEnd = addMinutes(cursor, service.durationMin);
    const blockEnd = addMinutes(serviceEnd, buffer);

    if (isAfter(blockEnd, close)) continue;
    if (isBefore(cursor, new Date())) continue;
    if (isBefore(cursor, leadLimit)) continue;
    if (lunchWindow && overlaps(cursor, blockEnd, lunchWindow.start, lunchWindow.end)) continue;
    if (closures.some((c) => overlaps(cursor, blockEnd, c.startAt, c.endAt))) continue;

    const hasConflict = bookings.some((b) => {
      const bookingBuffer = b.service?.bufferMin ?? settings.defaultBufferMin ?? 0;
      const bookingEndWithBuffer = addMinutes(b.endAt, bookingBuffer);
      return overlaps(cursor, blockEnd, b.startAt, bookingEndWithBuffer);
    });
    if (hasConflict) continue;

    slots.push(formatInTimeZone(cursor, tz, "HH:mm"));
  }

  return { slots, service, staff, timezone: tz, settings };
}

export async function createBooking(data: {
  serviceId: string;
  staffId?: string;
  date: string;
  time: string;
  fullName: string;
  phone: string;
  email?: string;
  notes?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const availability = await getAvailability({
      serviceId: data.serviceId,
      staffId: data.staffId,
      date: data.date,
      client: tx
    });
    if (!availability.slots.includes(data.time)) {
      throw new Error("Orario non disponibile.");
    }

    const startAt = toUtcFromLocal(data.date, data.time, availability.timezone);
    const endAt = addMinutes(startAt, availability.service.durationMin);
    const customer = await tx.customer.findFirst({
      where: {
        OR: [
          { phone: data.phone },
          data.email ? { email: data.email } : undefined
        ].filter(Boolean) as Prisma.CustomerWhereInput[]
      }
    });

    const customerId = customer
      ? customer.id
      : (
          await tx.customer.create({
            data: {
              fullName: data.fullName,
              phone: data.phone,
              email: data.email || null
            }
          })
        ).id;

    const cancelToken = randomUUID();

    let booking;
    try {
      booking = await tx.booking.create({
        data: {
          serviceId: availability.service.id,
          staffId: availability.staff.id,
          customerId,
          startAt,
          endAt,
          status: BookingStatus.CONFIRMED,
          notes: data.notes || null,
          cancelToken
        },
        include: {
          service: true,
          staff: true,
          customer: true
        }
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.message.includes("booking_no_overlap")
      ) {
        throw new Error("Slot occupato, scegli un altro orario.");
      }
      throw err;
    }

    return { booking, timezone: availability.timezone, settings: availability.settings };
  });
}

export async function getBookingDetail(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      staff: true,
      customer: true
    }
  });
}

export async function cancelBooking(params: { id: string; token: string }) {
  return prisma.$transaction(async (tx) => {
    const settings = await getSettings(tx);
    const booking = await tx.booking.findUnique({
      where: { id: params.id }
    });
    if (!booking) throw new Error("Prenotazione non trovata.");
    if (booking.cancelToken !== params.token) throw new Error("Token non valido.");
    if (booking.status === BookingStatus.CANCELLED) return booking;

    const limitMinutes = (settings.cancelLimitHours ?? 24) * 60;
    const now = new Date();
    const minutesToStart = (booking.startAt.getTime() - now.getTime()) / 60000;
    if (minutesToStart < limitMinutes) {
      throw new Error("Cancellazione oltre il limite consentito.");
    }

    return tx.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.CANCELLED }
    });
  });
}

export async function rescheduleBooking(params: {
  id: string;
  token: string;
  date: string;
  time: string;
}) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: params.id },
      include: { service: true, staff: true }
    });
    if (!booking) throw new Error("Prenotazione non trovata.");
    if (booking.cancelToken !== params.token) throw new Error("Token non valido.");
    if (booking.status === BookingStatus.CANCELLED) throw new Error("Prenotazione già annullata.");

    const availability = await getAvailability({
      serviceId: booking.serviceId,
      staffId: booking.staffId,
      date: params.date,
      client: tx
    });
    if (!availability.slots.includes(params.time)) {
      throw new Error("Orario non disponibile per il cambio.");
    }

    const startAt = toUtcFromLocal(params.date, params.time, availability.timezone);
    const endAt = addMinutes(startAt, booking.service.durationMin);

    let updated;
    try {
      updated = await tx.booking.update({
        where: { id: booking.id },
        data: {
          startAt,
          endAt,
          status: BookingStatus.RESCHEDULED
        },
        include: { service: true, staff: true, customer: true }
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.message.includes("booking_no_overlap")
      ) {
        throw new Error("Slot occupato, scegli un altro orario.");
      }
      throw err;
    }

    return { booking: updated, timezone: availability.timezone, settings: availability.settings };
  });
}
