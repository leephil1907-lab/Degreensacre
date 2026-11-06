import type { NextRequest } from 'next/server';

type Bucket = { count: number; resetAt: number };

// Render's Node service can use this small in-process limiter for abuse
// protection. It is deliberately bounded; horizontal multi-instance deployments
// should move these counters to a shared store such as Upstash/Redis.
const globalLimiter = globalThis as unknown as { __deGreenacresRateLimits?: Map<string, Bucket> };
const buckets = globalLimiter.__deGreenacresRateLimits || new Map<string, Bucket>();
globalLimiter.__deGreenacresRateLimits = buckets;

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  current.count += 1;
  const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
  return {
    allowed: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
    retryAfter,
  };
}

export function requestRateLimit(request: NextRequest, scope: string, limit = 5, windowMs = 60 * 60 * 1000) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0].trim();
  const ip = forwarded || request.headers.get('x-real-ip') || 'unknown';
  return checkRateLimit(`${scope}:${ip}`, limit, windowMs);
}
