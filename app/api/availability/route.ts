import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAvailability } from "@/lib/bookingEngine";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/http";

const querySchema = z.object({
  serviceId: z.string().min(1),
  staffId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const bucket = rateLimit(`availability:${ip}`, 60, 60_000);
  if (!bucket.success) {
    return NextResponse.json({ ok: false, error: "Troppe richieste." }, { status: 429 });
  }

  const parsed = querySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Parametri non validi." }, { status: 400 });
  }

  try {
    const { slots, timezone } = await getAvailability(parsed.data);
    return NextResponse.json({ ok: true, data: { slots, timezone } });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
