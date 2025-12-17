import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/bookingEngine";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/http";
import { z } from "zod";

const bookingCreateSchema = z.object({
  serviceId: z.string().min(1),
  staffId: z.string().min(1),
  startAt: z.string().datetime(),
  customer: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(6),
    email: z.string().email().optional().or(z.literal("")).optional(),
  }),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const bucket = rateLimit(`booking:create:${ip}`, 30, 60_000);
  if (!bucket.success) {
    return NextResponse.json({ ok: false, error: "Troppe richieste." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bookingCreateSchema.safeParse(body);

  if (!parsed.success) {
    console.log("Validation error details:", parsed.error.format());
    return NextResponse.json(
      { ok: false, error: "Dati non validi", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const start = new Date(parsed.data.startAt);
    const tz = "Europe/Rome";

    const dateFormatter = new Intl.DateTimeFormat("it-IT", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const dateParts = dateFormatter.formatToParts(start);
    const getPart = (type: string) => dateParts.find((p) => p.type === type)?.value ?? "";
    const date = `${getPart("year")}-${getPart("month")}-${getPart("day")}`; // YYYY-MM-DD in Rome TZ

    const timeFormatter = new Intl.DateTimeFormat("it-IT", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const time = timeFormatter.format(start); // HH:mm in Rome TZ

    const { booking, timezone } = await createBooking({
      serviceId: parsed.data.serviceId,
      staffId: parsed.data.staffId,
      date,
      time,
      fullName: parsed.data.customer.fullName,
      phone: parsed.data.customer.phone,
      email: parsed.data.customer.email || undefined,
      notes: parsed.data.notes || undefined,
    });

    return NextResponse.json({
      ok: true,
      data: {
        id: booking.id,
        startAt: booking.startAt,
        endAt: booking.endAt,
        timezone,
        cancelToken: booking.cancelToken,
      },
    });
  } catch (error) {
    const message = (error as Error).message;
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
