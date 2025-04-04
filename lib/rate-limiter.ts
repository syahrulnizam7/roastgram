import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Konfigurasi rate limit (contoh: 5 request per 10 detik per IP)
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 s"),
});

export async function rateLimiter(ip: string) {
  const { success } = await ratelimit.limit(ip);
  return success;
}
