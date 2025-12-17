type Bucket = {
  timestamps: number[];
};

const globalBuckets = (globalThis as unknown as { __rateLimit?: Map<string, Bucket> }).__rateLimit ??
  new Map<string, Bucket>();

if (!(globalThis as unknown as { __rateLimit?: Map<string, Bucket> }).__rateLimit) {
  (globalThis as unknown as { __rateLimit?: Map<string, Bucket> }).__rateLimit = globalBuckets;
}

export function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const bucket = globalBuckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    return { success: false, remaining: 0 };
  }

  bucket.timestamps.push(now);
  globalBuckets.set(key, bucket);
  return { success: true, remaining: Math.max(0, limit - bucket.timestamps.length) };
}
