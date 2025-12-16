import { NextResponse } from "next/server";
import { z } from "zod";
import { addBooking } from "@/lib/bookings";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email().optional().or(z.literal("")),
  serviceId: z.string().min(2),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().max(300).optional().or(z.literal(""))
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Dati non validi", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const booking = addBooking({
      ...parsed.data,
      email: parsed.data.email || undefined,
      notes: parsed.data.notes || undefined
    });
    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
