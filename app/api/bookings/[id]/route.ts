import { NextRequest, NextResponse } from "next/server";
import { getBookingDetail } from "@/lib/bookingEngine";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/http";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ip = getClientIp(req);
  const bucket = rateLimit(`booking:get:${ip}`, 60, 60_000);
  if (!bucket.success) {
    return NextResponse.json({ ok: false, error: "Troppe richieste." }, { status: 429 });
  }

  try {
    const booking = await getBookingDetail(params.id);
    if (!booking) {
      return NextResponse.json({ ok: false, error: "Prenotazione non trovata." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: booking });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}
