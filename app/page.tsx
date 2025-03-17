// File: app/page.tsx
"use client";

import { useState } from "react";
import { InstagramProfile } from "@/types";
import { scrapeInstagramProfile, generateRoast } from "@/lib/api";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roast, setRoast] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<InstagramProfile | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Username tidak boleh kosong!");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setRoast(null);

      // Scrape profile Instagram
      const profile = await scrapeInstagramProfile(username);
      setProfileData(profile);

      // Generate roast
      const roastText = await generateRoast(username, profile);
      setRoast(roastText);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memproses permintaan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 text-white">
        <h1 className="text-3xl font-bold text-center mb-6">
          Instagram Roaster 🔥
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username Instagram
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                @
              </span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-r-md border border-gray-300 bg-gray-50 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="username"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Roast! 🔥"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-500/30 border border-red-500 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {roast && (
          <div className="mt-6 p-4 bg-black/30 rounded-md">
            <h2 className="text-xl font-bold mb-2">Roast untuk @{username}</h2>
            <p className="text-sm italic">{roast}</p>
          </div>
        )}

        {profileData && (
          <div className="mt-6 p-4 bg-black/30 rounded-md">
            <h2 className="text-xl font-bold mb-2">Profil yang di-roast:</h2>
            <div className="flex items-center space-x-3 mb-2">
              {profileData.profilePicUrl && (
                // Gunakan img element biasa, bukan Image dari Next.js
                <img
                  src={profileData.profilePicUrl}
                  alt={`${username}'s profile`}
                  className="w-12 h-12 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback jika gambar gagal dimuat
                    e.currentTarget.src = "https://via.placeholder.com/48";
                  }}
                />
              )}
              <div>
                <p className="font-medium">@{username}</p>
                {profileData.fullName && (
                  <p className="text-sm">{profileData.fullName}</p>
                )}
              </div>
            </div>
            {profileData.biography && (
              <p className="text-sm mb-2">{profileData.biography}</p>
            )}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="font-bold">{profileData.postsCount}</p>
                <p>Posts</p>
              </div>
              <div>
                <p className="font-bold">{profileData.followersCount}</p>
                <p>Followers</p>
              </div>
              <div>
                <p className="font-bold">{profileData.followsCount}</p>
                <p>Following</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
