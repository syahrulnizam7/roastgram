import { NextResponse } from "next/server";
import { scrapeInstagramProfile } from "@/lib/api";

export async function POST(request: Request) {
  const { username } = await request.json();

  try {
    // Scrape profile Instagram
    const profile = await scrapeInstagramProfile(username);

    // Simpan data ke Apify dataset
    const addToDatasetResponse = await fetch(
      "http://localhost:3000/api/addToDataset",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, profile }),
      }
    );

    if (!addToDatasetResponse.ok) {
      throw new Error("Gagal menambahkan data ke dataset");
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error scraping profile:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data profil" },
      { status: 500 }
    );
  }
}
