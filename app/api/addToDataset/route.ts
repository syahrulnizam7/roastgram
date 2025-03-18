import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, profile } = body;

  const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN || "";
  const DATASET_ID = process.env.DATASET_ID || "";

  const dataToSend = {
    username: profile.username,
    fullName: profile.fullName,
    biography: profile.biography,
    followersCount: profile.followersCount,
    postsCount: profile.postsCount,
    isPrivate: profile.isPrivate,
    isVerified: profile.isVerified,
    scrapedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(
      `https://api.apify.com/v2/datasets/${DATASET_ID}/items?token=${APIFY_API_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Gagal menambahkan data ke dataset: ${response.statusText}`
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data berhasil ditambahkan ke dataset!",
    });
  } catch (error) {
    console.error("Error menambahkan data ke dataset:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gagal menambahkan data ke dataset",
      },
      { status: 500 }
    );
  }
}
