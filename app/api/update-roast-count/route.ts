import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { rateLimiter } from "@/lib/rate-limiter";
import { verifyCaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  // Dapatkan IP pengguna
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // Cek rate limit
  const isAllowed = await rateLimiter(ip);
  if (!isAllowed) {
    return NextResponse.json(
      { error: "Terlalu banyak request. Coba lagi nanti." },
      { status: 429 }
    );
  }

  // Validasi input
  const { username, captchaToken } = await request.json();
  const isCaptchaValid = await verifyCaptcha(captchaToken);
  if (!isCaptchaValid) {
    return NextResponse.json(
      { error: "Verifikasi captcha gagal" },
      { status: 403 }
    );
  }
  if (!username || typeof username !== "string") {
    return NextResponse.json(
      { error: "Username harus berupa string" },
      { status: 400 }
    );
  }

  // Blokir username suspicious
  if (/loop\d+/i.test(username)) {
    return NextResponse.json(
      { error: "Format username tidak diizinkan" },
      { status: 403 }
    );
  }

  try {
    // Eksekusi query
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
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Gagal update roast count" },
      { status: 500 }
    );
  }
}
