/** Simple in-memory sliding-window rate limiter (single-instance, bounded). */
const buckets = new Map<string, number[]>();
const MAX_KEYS = 2_000;

function pruneBuckets(now: number, windowMs: number): void {
  for (const [key, hits] of buckets) {
    const kept = hits.filter((t) => t > now - windowMs);
    if (kept.length === 0) buckets.delete(key);
    else buckets.set(key, kept);
  }
  while (buckets.size > MAX_KEYS) {
    const first = buckets.keys().next().value;
    if (first == null) break;
    buckets.delete(first);
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number } {
  const now = Date.now();
  if (buckets.size > MAX_KEYS) pruneBuckets(now, windowMs);

  const windowStart = now - windowMs;
  const hits = (buckets.get(key) || []).filter((t) => t > windowStart);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, remaining: 0 };
  }
  hits.push(now);
  buckets.set(key, hits);
  return { ok: true, remaining: limit - hits.length };
}

export function clientIp(request: Request): string {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}
