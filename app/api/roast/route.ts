import { NextResponse } from "next/server";
import { generateRoast } from "@/lib/api";

export async function POST(request: Request) {
  const { username, profile } = await request.json();

  try {
    const roastText = await generateRoast(username, profile);
    return NextResponse.json({ success: true, roast: roastText });
  } catch (error) {
    console.error("Error generating roast:", error);
    return NextResponse.json(
      { error: "Gagal membuat roast / limit token, coba lagi nanti" },
      { status: 500 }
    );
  }
}
