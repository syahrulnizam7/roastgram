import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { rateLimiter } from "@/lib/rate-limiter";
import { verifyCaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    // Parse request body
    const body = await request.json();
    const { username, captchaToken } = body;

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "Username harus berupa string" },
        { status: 400 }
      );
    }

    // Validate username pattern
    if (/loop\d+/i.test(username) || username.length > 30) {
      return NextResponse.json(
        { error: "Format username tidak diizinkan" },
        { status: 403 }
      );
    }

    // Verify CAPTCHA (skip in development)
    let captchaValid = true;
    let captchaMessage = "Development mode - skipping captcha";

    if (process.env.NODE_ENV !== "development") {
      const captchaResult = await verifyCaptcha(captchaToken);
      captchaValid = captchaResult.success;
      captchaMessage = captchaResult.message || "Captcha verification";

      if (!captchaValid) {
        console.log(
          `Captcha failed for ${username} (IP: ${ip}): ${captchaMessage}`
        );
        return NextResponse.json(
          { error: "Verifikasi keamanan gagal. Silakan coba lagi." },
          { status: 403 }
        );
      }
    }

    // Check rate limit
    const isAllowed = await rateLimiter(ip, captchaValid);
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Terlalu banyak request. Coba lagi nanti." },
        { status: 429 }
      );
    }

    // Execute database query
    const [rows]: any = await pool.query(
      `INSERT INTO roasted_users (username, roast_count) 
       VALUES (?, 1)
       ON DUPLICATE KEY UPDATE 
       roast_count = roast_count + 1, 
       last_roasted_at = CURRENT_TIMESTAMP`,
      [username]
    );

    return NextResponse.json({
      success: true,
      totalRoasts: rows.affectedRows,
      captcha: {
        verified: captchaValid,
        message: captchaMessage,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
