import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic"; // Important for Vercel

export async function GET() {
  try {
    const connection = await pool.getConnection();

    try {
      await connection.ping();
      const [rows]: any = await connection.query(
        "SELECT SUM(roast_count) as total FROM roasted_users"
      );

      return NextResponse.json({
        success: true,
        total: rows[0]?.total || 0,
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("Database error:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
