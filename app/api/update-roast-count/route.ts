import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  const { username } = await request.json();

  try {
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
