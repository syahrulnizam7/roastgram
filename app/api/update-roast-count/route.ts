import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { rateLimiter } from "@/lib/rate-limiter";
import { verifyCaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const contentType = request.headers.get("content-type");

  // 1. Validasi Content-Type
  if (contentType !== "application/json") {
    console.warn("Invalid Content-Type", { ip, userAgent });
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 400 }
    );
  }

  try {
    // 2. Parse body
    const body = await request.json();
    const { username, captchaToken } = body;

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "Username harus berupa string" },
        { status: 400 }
      );
    }

    // 3. Validasi CAPTCHA (wajib di production)
    if (process.env.NODE_ENV === "production") {
      if (!captchaToken) {
        console.warn("CAPTCHA Token Missing - Potential Bot Attack", {
          ip,
          userAgent,
          username,
          timestamp: new Date().toISOString(),
        });
        return NextResponse.json(
          {
            error: "Security verification failed",
            details: "CAPTCHA token is required",
          },
          { status: 403 }
        );
      }

      const captchaResult = await verifyCaptcha(captchaToken);
      if (!captchaResult.success || captchaResult.action !== "update_roast") {
        console.warn("CAPTCHA Verification Failed", {
          ip,
          userAgent,
          username,
          reason: captchaResult.message,
          score: captchaResult.score,
          action: captchaResult.action,
        });
        return NextResponse.json(
          {
            error: "Security verification failed",
            details: captchaResult.message,
          },
          { status: 403 }
        );
      }
    }

    // 4. Validasi pola username
    const usernamePattern = /^[a-z0-9._]{3,30}$/;
    if (!usernamePattern.test(username)) {
      return NextResponse.json(
        { error: "Format username tidak valid" },
        { status: 400 }
      );
    }

    // 5. Rate Limiting
    const isRateLimited = await rateLimiter(ip, true);
    if (!isRateLimited) {
      return NextResponse.json(
        { error: "Terlalu banyak request. Coba lagi nanti." },
        { status: 429 }
      );
    }

    // 6. Eksekusi query database
    const result = await pool.query(
      `INSERT INTO roasted_users (username, roast_count, last_ip, user_agent) 
       VALUES (?, 1, ?, ?)
       ON DUPLICATE KEY UPDATE 
       roast_count = roast_count + 1, 
       last_roasted_at = CURRENT_TIMESTAMP,
       last_ip = VALUES(last_ip),
       user_agent = VALUES(user_agent)`,
      [username, ip, userAgent]
    );

    return NextResponse.json({
      success: true,
      data: {
        username,
        affectedRows: (result as any).affectedRows || 0, // Cast to any or adjust based on actual type
      },
    });
  } catch (error) {
    console.error("Database Error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      ip,
      userAgent,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
