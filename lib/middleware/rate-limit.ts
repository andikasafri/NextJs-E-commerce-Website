import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // per window

interface RateLimit {
  timestamp: number; // Timestamp of the first request in the window
  count: number; // Count of requests in the current window
}

const rateLimits = new Map<string, RateLimit>();

/**
 * Gets the rate limit status for a given IP address.
 *
 * @param ip - The IP address to check the rate limit for.
 * @returns An object indicating if the request is allowed and the remaining requests.
 */
export function getRateLimit(ip: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const rateLimit = rateLimits.get(ip);

  if (!rateLimit) {
    rateLimits.set(ip, { timestamp: now, count: 1 });
    return { ok: true, remaining: MAX_REQUESTS - 1 };
  }

  if (now - rateLimit.timestamp > WINDOW_SIZE) {
    rateLimits.set(ip, { timestamp: now, count: 1 });
    return { ok: true, remaining: MAX_REQUESTS - 1 };
  }

  if (rateLimit.count >= MAX_REQUESTS) {
    return { ok: false, remaining: 0 };
  }

  rateLimit.count++;
  return { ok: true, remaining: MAX_REQUESTS - rateLimit.count };
}

/**
 * Middleware function to enforce rate limiting on incoming requests.
 *
 * @param request - The incoming request object.
 * @returns A NextResponse object with a 429 status if the limit is exceeded, otherwise null.
 */
export function rateLimitMiddleware(request: NextRequest) {
  // Use headers to get the IP address if 'ip' is not available
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const rateLimit = getRateLimit(ip);

  if (!rateLimit.ok) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "60",
        "X-RateLimit-Limit": MAX_REQUESTS.toString(),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": (Math.floor(Date.now() / 1000) + 60).toString(),
      },
    });
  }

  // Optionally, you can log the request ID for tracking
  const requestId = nanoid();
  console.log(`Request ID: ${requestId} from IP: ${ip}`);

  return null;
}
