import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { rateLimiter } from "@/lib/rate-limiter";
import { verifyCaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    // Validasi awal request
    if (request.headers.get("content-type") !== "application/json") {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }
    // Parse request body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { username, captchaToken } = body;

    // Log lebih informatif
    console.log("Request Details:", {
      ip,
      userAgent,
      username: username ? `${username.substring(0, 3)}...` : "missing",
      hasToken: !!captchaToken,
      timestamp: new Date().toISOString(),
    });

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

    // Verify CAPTCHA (skip in non-production)
    let captchaValid = process.env.NODE_ENV !== "production";
    let captchaMessage = "Non-production mode - skipping captcha";

    // Validasi CAPTCHA lebih ketat
    if (process.env.NODE_ENV === "production") {
      if (!captchaToken) {
        console.warn("Missing CAPTCHA Token - Possible Bot Attack", {
          ip,
          userAgent,
          username,
        });
        return NextResponse.json(
          {
            error: "Security verification required",
            details: "CAPTCHA token is missing",
          },
          { status: 403 }
        );
      }

      const captchaResult = await verifyCaptcha(captchaToken);
      if (!captchaResult.success) {
        console.error("CAPTCHA Verification Failed", {
          ip,
          userAgent,
          username,
          reason: captchaResult.message,
          // errorCodes: captchaResult.errorCodes, // Removed as it does not exist on the type
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

    return NextResponse.json(
      {
        success: true,
        totalRoasts: rows.affectedRows,
        captcha: {
          verified: captchaValid,
          message: captchaMessage,
        },
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("API Error:", {
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
