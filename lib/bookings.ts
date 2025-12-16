import { isValidSlot } from "@/lib/slots";
import { categories } from "@/data/services";

export type BookingInput = {
  name: string;
  phone: string;
  email?: string;
  serviceId: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  notes?: string;
};

export type Booking = BookingInput & {
  id: string;
  createdAt: string;
};

const bookings: Booking[] = [];

export function addBooking(input: BookingInput): Booking {
  if (!isValidSlot(input.date, input.time)) {
    throw new Error("Slot non valido o fuori orario.");
  }

  const service = categories.flatMap((c) => c.services).find((s) => s.id === input.serviceId);
  if (!service) {
    throw new Error("Servizio non trovato.");
  }

  const id = `bk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const booking: Booking = {
    ...input,
    id,
    createdAt: new Date().toISOString()
  };
  bookings.push(booking);
  return booking;
}

export function getBookings() {
  return bookings;
}
