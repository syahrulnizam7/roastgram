import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();

    // Test koneksi
    await connection.ping();

    const [rows]: any = await connection.query(
      "SELECT SUM(roast_count) as total FROM roasted_users"
    );

    return NextResponse.json({
      success: true,
      total: rows[0]?.total || 0,
    });
  } catch (error: any) {
    console.error("Database error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
