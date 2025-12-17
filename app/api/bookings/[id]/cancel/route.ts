import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cancelBooking } from "@/lib/bookingEngine";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/http";

const querySchema = z.object({
  token: z.string().min(10)
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ip = getClientIp(req);
  const bucket = rateLimit(`booking:cancel:${ip}`, 20, 60_000);
  if (!bucket.success) {
    return NextResponse.json({ ok: false, error: "Troppe richieste." }, { status: 429 });
  }

  const parsed = querySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Token non valido." }, { status: 400 });
  }

  try {
    const booking = await cancelBooking({ id: params.id, token: parsed.data.token });
    return NextResponse.json({ ok: true, data: booking });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
