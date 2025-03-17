import { NextRequest, NextResponse } from "next/server";
import { scrapeInstagramProfile, generateRoast } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Username tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Scrape profile Instagram
    const profile = await scrapeInstagramProfile(username);

    // Generate roast
    const roastText = await generateRoast(username, profile);

    return NextResponse.json({
      success: true,
      profile,
      roast: roastText,
    });
  } catch (error) {
    console.error("Error in roast API:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memproses permintaan",
      },
      { status: 500 }
    );
  }
}
