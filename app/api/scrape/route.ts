import { NextResponse } from "next/server";
import { scrapeInstagramProfile } from "@/lib/api";
import { verifyCaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  const { username, captchaToken } = await request.json();

  // Verifikasi reCAPTCHA
  const isCaptchaValid = await verifyCaptcha(captchaToken);
  if (!isCaptchaValid) {
    return NextResponse.json(
      { error: "Verifikasi captcha gagal" },
      { status: 403 }
    );
  }
  try {
    // Scrape profile Instagram
    const profile = await scrapeInstagramProfile(username);

    // Simpan data ke Apify dataset
    const addToDatasetResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/addToDataset`,
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
      {
        error:
          "Profil tidak ditemukan atau tidak valid/Limit token saya abis T_T",
      },
      { status: 404 }
    );
  }
}
