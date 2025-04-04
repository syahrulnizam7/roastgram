"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type { InstagramProfile } from "@/types";
import { scrapeInstagramProfile, generateRoast } from "@/lib/api";
import { useAnimationControls } from "framer-motion";
import { ThemeToggle } from "./components/theme-toggle";
import { Header } from "./components/header";
import { InputForm } from "./components/input-form";
import { ResultsSection } from "./components/results-section";
import { LoadingOverlay } from "./components/loading-overlay";
import { useTheme } from "./hooks/use-theme";
import { BackgroundPattern } from "./components/background-pattern";
import { DecorationElements } from "./components/decoration-elements";
import Adbanner from "./components/AdBanner";
import Footer from "./components/footer";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roast, setRoast] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<InstagramProfile | null>(null);
  const [stage, setStage] = useState<
    "idle" | "scraping" | "roasting" | "complete"
  >("idle");
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);
  const { darkMode, setDarkMode } = useTheme();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const flameControls = useAnimationControls();

  // useEffect(() => {
  //   if (process.env.NODE_ENV === "development") {
  //     localStorage.removeItem("scrapeCount");
  //     localStorage.removeItem(`roast_${username}`);
  //     console.log("Limit reset (Development Mode)");
  //   }
  // }, [username]); // Akan berjalan setiap username berubah

  useEffect(() => {
    if (typeof window !== "undefined" && username) {
      const existingRoast = getRoastFromLocalStorage(username);
      if (existingRoast && Date.now() - existingRoast.timestamp < 600000) {
        setRoast(existingRoast.roast);
        setProfileData(existingRoast.profile);
        setShowResults(true);

        // Hitung waktu tersisa sebelum reset
        setTimeLeft(
          Math.ceil((600000 - (Date.now() - existingRoast.timestamp)) / 1000)
        );
      }
    }
  }, [username]); // Hanya dijalankan saat username berubah

  // Fungsi untuk menyimpan hasil roasting ke localStorage
  const saveRoastToLocalStorage = (
    username: string,
    roast: string,
    profile: InstagramProfile
  ) => {
    // Pastikan kode ini hanya dijalankan di browser
    if (typeof window !== "undefined") {
      const roastData = {
        roast,
        profile,
        timestamp: Date.now(),
      };
      localStorage.setItem(`roast_${username}`, JSON.stringify(roastData));
    }
  };

  // Fungsi untuk mengambil hasil roasting dari localStorage
  const getRoastFromLocalStorage = (username: string) => {
    // Pastikan kode ini hanya dijalankan di browser
    if (typeof window !== "undefined") {
      const roastData = localStorage.getItem(`roast_${username}`);
      if (roastData) {
        return JSON.parse(roastData);
      }
    }
    return null;
  };

  // Fungsi untuk menyimpan jumlah scraping ke localStorage
  const saveScrapeCountToLocalStorage = () => {
    // Pastikan kode ini hanya dijalankan di browser
    if (typeof window !== "undefined") {
      const scrapeCountData = {
        count: 1,
        timestamp: Date.now(),
      };
      const existingData = localStorage.getItem("scrapeCount");
      if (existingData) {
        const parsedData = JSON.parse(existingData);
        scrapeCountData.count = parsedData.count + 1;
      }
      localStorage.setItem("scrapeCount", JSON.stringify(scrapeCountData));
    }
  };

  // Fungsi untuk mengambil jumlah scraping dari localStorage
  const getScrapeCountFromLocalStorage = () => {
    // Pastikan kode ini hanya dijalankan di browser
    if (typeof window !== "undefined") {
      const scrapeCountData = localStorage.getItem("scrapeCount");
      if (scrapeCountData) {
        return JSON.parse(scrapeCountData);
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input kosong
    if (!username.trim()) {
      setError("Masukkan username terlebih dahulu");
      return;
    }

    setError(null);

    // Cek apakah pengguna sudah mencapai limit scraping (2x/10 menit)
    const scrapeCountData = getScrapeCountFromLocalStorage();
    if (
      scrapeCountData &&
      scrapeCountData.count >= 2 &&
      Date.now() - scrapeCountData.timestamp < 600000
    ) {
      setError(
        "Limit roasting anda tercapai (2x/10 menit). Coba lagi nanti!(  •̀⤙•́  )"
      );
      return;
    }

    try {
      setLoading(true);
      setStage("scraping");

      // Get reCAPTCHA token
      let captchaToken = "";
      try {
        captchaToken = await window.grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
          { action: "submit" }
        );
      } catch (captchaError) {
        console.error("Failed to execute reCAPTCHA:", captchaError);
        throw new Error(
          "Gagal memverifikasi keamanan. Silakan refresh halaman dan coba lagi."
        );
      }
      // Cek apakah hasil roasting sudah ada di localStorage
      const existingRoast = getRoastFromLocalStorage(username);
      if (existingRoast && Date.now() - existingRoast.timestamp < 600000) {
        // Jika hasil roasting masih valid (kurang dari 10 menit), gunakan data yang ada
        setRoast(existingRoast.roast);
        setProfileData(existingRoast.profile);
        setShowResults(true);

        // Hitung waktu tersisa sebelum reset
        const timeLeft = Math.ceil(
          (600000 - (Date.now() - existingRoast.timestamp)) / 1000
        );
        setTimeLeft(timeLeft);
        return;
      }

      // Jika hasil roasting tidak ada atau sudah kadaluarsa, lakukan scraping baru
      // Scrape profile
      const scrapeResponse = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, captchaToken }),
      });

      if (!scrapeResponse.ok) {
        const errorData = await scrapeResponse.json();
        throw new Error(errorData.error || "Gagal mengambil data profil");
      }

      const { profile } = await scrapeResponse.json();

      // Generate roast
      setStage("roasting");
      const roastResponse = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, profile }),
      });

      if (!roastResponse.ok) {
        throw new Error("Gagal membuat roast");
      }

      const { roast: roastText } = await roastResponse.json();

      // Set hasil
      setProfileData(profile);
      setRoast(roastText);
      setShowResults(true);

      // Simpan hasil roasting dan data profil ke localStorage
      saveRoastToLocalStorage(username, roastText, profile);
      saveScrapeCountToLocalStorage();

      // Hitung waktu tersisa sebelum reset
      const timeLeft = 600; // 10 menit dalam detik
      setTimeLeft(timeLeft);

      // Update roast count with error handling
      try {
        // Dapatkan token captcha baru khusus untuk update-roast-count
        let newCaptchaToken = "";
        try {
          newCaptchaToken = await window.grecaptcha.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
            { action: "update_roast" } // Gunakan action berbeda
          );
        } catch (captchaError) {
          console.error(
            "Failed to execute reCAPTCHA for update:",
            captchaError
          );
          throw new Error(
            "Gagal memverifikasi keamanan untuk update. Silakan coba lagi."
          );
        }

        const updateResponse = await fetch("/api/update-roast-count", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            captchaToken: newCaptchaToken, // Gunakan token baru
            clientInfo: {
              userAgent: navigator.userAgent,
              screenResolution: `${window.screen.width}x${window.screen.height}`,
            },
          }),
        });

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          console.error("Failed to update roast count:", errorData);
          throw new Error(errorData.error || "Gagal memperbarui jumlah roast");
        }

        const result = await updateResponse.json();
        console.log("Update roast count success:", result);
      } catch (updateError) {
        console.error("Error updating roast count:", updateError);
      }
      // Beritahu pengguna bahwa hasil roasting akan direset setelah 10 menit
      setTimeout(() => {
        localStorage.removeItem(`roast_${username}`);
        setRoast(null);
        setProfileData(null);
        setUsername("");
        setShowResults(false);
        setError("Hasil roasting telah direset. Silakan coba lagi.");
        setTimeLeft(null); // Reset waktu tersisa
      }, 600000); // 10 menit dalam milidetik
    } catch (error) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowResults(false);
    setRoast(null);
    setProfileData(null);
    setUsername("");
  };

  const copyToClipboard = () => {
    if (!roast) return;

    navigator.clipboard.writeText(`Roast for @${username}:\n\n${roast}`);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <main
      className={`min-h-screen font-mono overflow-x-hidden transition-colors duration-300 ${
        darkMode ? "bg-zinc-900" : "bg-[#FF5F1F]"
      } relative`}
    >
      <BackgroundPattern darkMode={darkMode} />

      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="relative w-full z-10">
        <DecorationElements darkMode={darkMode} />

        <Header
          showResults={showResults}
          resetForm={resetForm}
          darkMode={darkMode}
        />

        <div className="pt-20 md:pt-24 pb-8 md:pb-10 px-3 md:px-8">
          {!showResults ? (
            <InputForm
              username={username}
              setUsername={setUsername}
              handleSubmit={handleSubmit}
              loading={loading}
              error={error}
              darkMode={darkMode}
              flameControls={flameControls}
            />
          ) : (
            <ResultsSection
              username={username}
              profileData={profileData}
              roast={roast}
              darkMode={darkMode}
              copied={copied}
              copyToClipboard={copyToClipboard}
              timeLeft={timeLeft}
            />
          )}

          {loading && <LoadingOverlay stage={stage} darkMode={darkMode} />}
        </div>
      </div>

      <Footer />
      <Adbanner />
    </main>
  );
}
