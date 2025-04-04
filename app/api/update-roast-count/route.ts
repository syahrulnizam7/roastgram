import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { rateLimiter } from "@/lib/rate-limiter";
import { verifyCaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    // Validate content type
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

    const { username, captchaToken, clientInfo } = body;

    // Early check for required fields
    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "Username must be a valid string" },
        { status: 400 }
      );
    }

    if (!captchaToken) {
      console.warn("Missing CAPTCHA Token - Possible Bot Attack", {
        ip,
        userAgent,
        username,
      });
      return NextResponse.json(
        { error: "Missing CAPTCHA Token - Possible Bot Attack" },
        { status: 403 }
      );
    }

    // Validate username format to prevent attacks
    if (/loop\d+/i.test(username) || username.length > 30) {
      return NextResponse.json(
        { error: "Invalid username format" },
        { status: 403 }
      );
    }

    // Always verify CAPTCHA in production
    if (process.env.NODE_ENV === "production") {
      const captchaResult = await verifyCaptcha(captchaToken);

      // Strict CAPTCHA validation
      if (!captchaResult.success || (captchaResult.score ?? 0) < 0.5) {
        console.error("CAPTCHA Verification Failed", {
          ip,
          userAgent,
          username,
          reason: captchaResult.message,
          score: captchaResult.score,
        });

        return NextResponse.json(
          {
            error: "Security verification failed",
            details: captchaResult.message,
          },
          { status: 403 }
        );
      }

      // Additional suspicious activity checks
      if ((captchaResult.score ?? 0) < 0.7) {
        console.warn("Suspicious activity with low CAPTCHA score", {
          ip,
          userAgent,
          username,
          score: captchaResult.score,
        });
      }
    }

    // Apply rate limiting after CAPTCHA verification
    const isAllowed = await rateLimiter(ip, true);
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Now safe to proceed with database operation
    const [rows]: any = await pool.query(
      `INSERT INTO roasted_users (username, roast_count, ip_address, user_agent) 
       VALUES (?, 1, ?, ?)
       ON DUPLICATE KEY UPDATE 
       roast_count = roast_count + 1, 
       last_roasted_at = CURRENT_TIMESTAMP,
       ip_address = VALUES(ip_address),
       user_agent = VALUES(user_agent)`,
      [username, ip, userAgent]
    );

    return NextResponse.json(
      {
        success: true,
        totalRoasts: rows.affectedRows,
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
      endpoint: "/api/update-roast-count",
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

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      status: 200,
    }
  );
}
