import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a safe Redis client that doesn't crash if env vars are missing
const createRateLimiter = (limit: number, window: any) => {
  try {
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      console.warn("Redis credentials missing, rate limiting disabled");
      return null;
    }

    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(limit, window),
    });
  } catch (error) {
    console.warn("Failed to initialize rate limiter:", error);
    return null;
  }
};

// Lebih ketat untuk request yang mencurigakan
const ratelimit = createRateLimiter(3, "60 s");

// Rate limit khusus untuk request tanpa captcha yang valid
const strictRatelimit = createRateLimiter(1, "60 s");

export async function rateLimiter(ip: string, hasValidCaptcha: boolean) {
  // If rate limiter is not initialized, allow the request (fail open)
  if (!ratelimit || !strictRatelimit) {
    return true;
  }

  try {
    if (hasValidCaptcha) {
      const { success } = await ratelimit.limit(ip);
      return success;
    } else {
      const { success } = await strictRatelimit.limit(ip);
      return success;
    }
  } catch (error) {
    console.error("Rate limiter error:", error);
    // If Redis fails, allow the request to proceed
    return true;
  }
}
