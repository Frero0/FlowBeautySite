import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/http";

const querySchema = z.object({
  category: z.string().optional(),
  featured: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => (val ? val === "true" : undefined))
});

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const bucket = rateLimit(`services:${ip}`, 60, 60_000);
  if (!bucket.success) {
    return NextResponse.json({ ok: false, error: "Troppe richieste." }, { status: 429 });
  }

  const parsed = querySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Parametri non validi." }, { status: 400 });
  }

  const where = {
    isActive: true,
    ...(parsed.data.category
      ? { category: { slug: parsed.data.category } }
      : {}),
    ...(parsed.data.featured !== undefined ? { isFeatured: parsed.data.featured } : {})
  };

  const services = await prisma.service.findMany({
    where,
    include: { category: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }]
  });

  return NextResponse.json({ ok: true, data: services });
}
