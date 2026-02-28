import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// ─── Rate Limiting ─────────────────────────────────────
// Uses Upstash Redis for serverless-compatible rate limiting.
// Falls back to no-op when Upstash is not configured.

let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
    analytics: true,
    prefix: "uc-ratelimit",
  });
}

/**
 * Rate limit an API request by IP.
 * Returns null if allowed, or a NextResponse if blocked.
 */
export async function rateLimitByIp(
  ip: string | null,
  limit?: { requests: number; window: string }
): Promise<NextResponse | null> {
  if (!ratelimit) return null; // No Upstash configured — allow all

  const identifier = ip ?? "anonymous";

  try {
    const { success, remaining, reset } = await ratelimit.limit(identifier);

    if (!success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please slow down.",
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": remaining.toString(),
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  } catch (err) {
    // If Redis is down, don't block the request
    console.error("[RATE_LIMIT] Redis error:", err);
  }

  return null;
}

/**
 * Stricter rate limit for sensitive endpoints (auth, checkout)
 */
export async function rateLimitStrict(ip: string | null): Promise<NextResponse | null> {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }

  const strictLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per minute
    prefix: "uc-strict",
  });

  const identifier = ip ?? "anonymous";

  try {
    const { success, remaining, reset } = await strictLimiter.limit(identifier);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  } catch (err) {
    console.error("[RATE_LIMIT_STRICT] Redis error:", err);
  }

  return null;
}
