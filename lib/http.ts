import { NextRequest } from "next/server";

export const getClientIp = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  // @ts-expect-error - req.ip exists in Node runtimes behind proxy
  req.ip ||
  "unknown";
