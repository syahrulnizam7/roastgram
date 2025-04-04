import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Lebih ketat untuk request yang mencurigakan
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "60 s"), // 3 request per menit
});

// Rate limit khusus untuk request tanpa captcha yang valid
const strictRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "60 s"), // 1 request per menit
});

export async function rateLimiter(ip: string, hasValidCaptcha: boolean) {
  if (hasValidCaptcha) {
    const { success } = await ratelimit.limit(ip);
    return success;
  } else {
    const { success } = await strictRatelimit.limit(ip);
    return success;
  }
}
