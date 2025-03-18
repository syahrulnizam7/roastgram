import { ApifyClient } from "apify-client";
import { InstagramProfile } from "@/types";

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN || "";
const GEMINI_API_KEY_1 = process.env.GEMINI_API_KEY_1 || "";
const GEMINI_API_KEY_2 = process.env.GEMINI_API_KEY_2 || "";

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
    const profile: InstagramProfile = {
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

    return profile;
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
}

export async function generateRoast(
  username: string,
  profile: InstagramProfile
): Promise<string> {
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

  // Function to try generating roast with a specific API key
  const tryGenerateRoast = async (apiKey: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
<<<<<<< HEAD
Gunakan Bahasa Gaul, boleh menggunakan kata kata kasar tapi jangan berlebihan,
=======
                    Gunakan Bahasa Gaul, boleh menggunakan kata kata kasar tapi jangan berlebihan,
>>>>>>> fadd9a6 (add token and dataset)
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

      const generatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Maaf, tidak dapat membuat roast untuk profil ini saat ini.";

      return generatedText;
    } catch (error) {
      console.error("Error generating roast with API key:", apiKey, error);
      throw error;
    }
  };

  try {
    return await tryGenerateRoast(GEMINI_API_KEY_1);
  } catch (error) {
    console.log("Token pertama mencapai limit, mencoba token kedua...");
    // If the first token fails, try with the second API key
    return await tryGenerateRoast(GEMINI_API_KEY_2);
  }
}
