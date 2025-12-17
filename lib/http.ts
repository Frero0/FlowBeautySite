import { NextRequest } from "next/server";

type NextRequestWithIp = NextRequest & { ip?: string };

export const getClientIp = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  (req as NextRequestWithIp).ip ||
  "unknown";
