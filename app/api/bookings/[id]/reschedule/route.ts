import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rescheduleBooking } from "@/lib/bookingEngine";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const querySchema = z.object({
  token: z.string().min(10)
});

const bodySchema = z.object({
  newStartAt: z.string().datetime().optional(),
  date: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/).optional(),
  time: z.string().regex(/^\\d{2}:\\d{2}$/).optional()
}).refine(
  (data) => data.newStartAt || (data.date && data.time),
  { message: "Specificare newStartAt oppure date + time." }
);

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ip = getClientIp(req);
  const bucket = rateLimit(`booking:reschedule:${ip}`, 20, 60_000);
  if (!bucket.success) {
    return NextResponse.json({ ok: false, error: "Troppe richieste." }, { status: 429 });
  }

  const queryParsed = querySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!queryParsed.success) {
    return NextResponse.json({ ok: false, error: "Token non valido." }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const bodyParsed = bodySchema.safeParse(body);
  if (!bodyParsed.success) {
    return NextResponse.json(
      { ok: false, error: "Dati non validi", issues: bodyParsed.error.issues },
      { status: 400 }
    );
  }

  const token = queryParsed.data.token;
  let date: string;
  let time: string;

  const settings = await prisma.businessSettings.findFirst();
  const tz = settings?.timezone ?? "Europe/Rome";

  if (bodyParsed.data.newStartAt) {
    const start = new Date(bodyParsed.data.newStartAt);
    if (isNaN(start.getTime())) {
      return NextResponse.json({ ok: false, error: "Data non valida." }, { status: 400 });
    }
    const formatter = new Intl.DateTimeFormat("it-IT", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    const parts = formatter.formatToParts(start);
    const toString = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    date = `${toString("year")}-${toString("month")}-${toString("day")}`;
    const timeFormatter = new Intl.DateTimeFormat("it-IT", {
      timeZone: tz,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit"
    });
    time = timeFormatter.format(start);
  } else {
    date = bodyParsed.data.date!;
    time = bodyParsed.data.time!;
  }

  try {
    const { booking } = await rescheduleBooking({
      id: params.id,
      token,
      date,
      time
    });
    return NextResponse.json({ ok: true, data: booking });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
