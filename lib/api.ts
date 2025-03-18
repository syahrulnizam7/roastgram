// File: lib/api.ts
import { ApifyClient } from "apify-client";
import { InstagramProfile } from "@/types";

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export async function scrapeInstagramProfile(
  username: string
): Promise<InstagramProfile> {
  try {
    const client = new ApifyClient({
      token: APIFY_API_TOKEN,
    });

    // Prepare Actor input
    const input = {
      directUrls: [`https://www.instagram.com/${username}/`],
      resultsType: "details",
      resultsLimit: 1,
    };

    // Run the Actor and wait for it to finish
    const run = await client.actor("apify/instagram-scraper").call(input);

    // Fetch data from the run's dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (!items || items.length === 0) {
      throw new Error("Profil tidak ditemukan");
    }

    const profileData: any = items[0];

    // Parse and return the profile data
    return {
      username: profileData.username || username,
      fullName: profileData.fullName || "",
      biography: profileData.biography || "",
      profilePicUrl: formatImageUrl(profileData.profilePicUrl) || "",

      postsCount: profileData.postsCount || 0,
      followersCount: profileData.followersCount || 0,
      followsCount: profileData.followsCount || 0,
      isPrivate: profileData.isPrivate || false,
      isVerified: profileData.isVerified || false,
      recentPosts: (profileData.latestPosts || [])
        .slice(0, 5)
        .map((post: any) => ({
          caption: post.caption || "",
          likesCount: post.likesCount || 0,
          commentsCount: post.commentsCount || 0,
          imageUrl: formatImageUrl(post.imageUrl) || "",
        })),
    };
  } catch (error) {
    console.error("Error scraping Instagram profile:", error);
    throw new Error("Gagal mengambil data profil Instagram");
  }
}

function formatImageUrl(url: string): string {
  if (!url) return "";

  // Jika URL tidak valid atau tidak dimulai dengan http/https
  if (!url.startsWith("http")) {
    return "";
  }

  // Gunakan proxy untuk mengatasi CORS
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;

  // Atau alternatifnya, kembalikan URL asli
  // return url;
}

export async function generateRoast(
  username: string,
  profile: InstagramProfile
): Promise<string> {
  try {
    // Convert profile data to string for Gemini prompt
    const profileDataString = JSON.stringify({
      username: profile.username,
      fullName: profile.fullName,
      biography: profile.biography,
      postsCount: profile.postsCount,
      followersCount: profile.followersCount,
      followsCount: profile.followsCount,
      isPrivate: profile.isPrivate,
      isVerified: profile.isVerified,
      recentPosts: profile.recentPosts,
    });

    // Call Gemini API for roast generation
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Berikan roasting sarkastik, kejam, dan menyindir secara lucu (tapi tidak terlalu kasar) untuk profil Instagram "${username}" ini. 
                  
                    PENTING: Berikan HANYA teks roasting, tanpa kata pengantar atau pembuka apapun seperti "Oke, siap" atau "Berikut roasting untuk". Langsung mulai dengan roastingnya.
                    Gunakan **gaya sarkastik dan menyakitkan** sampai kena mental,
Gunakan Bahasa Gaul, boleh menggunakan kata kata kasar tapi jangan berlebihan,
                    gunakan kata kata yang bisa dipahami.
                    Boleh menyindir jumlah followers, postingan, bio, gaya foto, atau apapun yang relevan berdasarkan data berikut: ${profileDataString}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Gagal mendapatkan respon dari Gemini API: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Extract the generated text from Gemini's response
    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, tidak dapat membuat roast untuk profil ini saat ini.";

    return generatedText;
  } catch (error) {
    console.error("Error generating roast:", error);
    throw new Error("Gagal membuat roast untuk profil ini");
  }
}
