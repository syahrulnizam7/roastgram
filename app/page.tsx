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

  const flameControls = useAnimationControls();

  // Fungsi untuk menyimpan hasil roasting ke localStorage
  const saveRoastToLocalStorage = (username: string, roast: string) => {
    const roastData = {
      roast,
      timestamp: Date.now(),
    };
    localStorage.setItem(`roast_${username}`, JSON.stringify(roastData));
  };

  // Fungsi untuk mengambil hasil roasting dari localStorage
  const getRoastFromLocalStorage = (username: string) => {
    const roastData = localStorage.getItem(`roast_${username}`);
    if (roastData) {
      return JSON.parse(roastData);
    }
    return null;
  };

  // Fungsi untuk menyimpan jumlah scraping ke localStorage
  const saveScrapeCountToLocalStorage = () => {
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
  };

  // Fungsi untuk mengambil jumlah scraping dari localStorage
  const getScrapeCountFromLocalStorage = () => {
    const scrapeCountData = localStorage.getItem("scrapeCount");
    if (scrapeCountData) {
      return JSON.parse(scrapeCountData);
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const scrapeCountData = getScrapeCountFromLocalStorage();
    if (
      scrapeCountData &&
      scrapeCountData.count >= 2 &&
      Date.now() - scrapeCountData.timestamp < 600000
    ) {
      setError(
        "Limit roasting anda tercapai (2x/10 menit). Coba lagi nanti!(  •̀⤙•́  )."
      );
      return;
    }

    try {
      setLoading(true);

      // Cek apakah hasil roasting sudah ada di localStorage
      const existingRoast = getRoastFromLocalStorage(username);
      if (existingRoast && Date.now() - existingRoast.timestamp < 600000) {
        setRoast(existingRoast.roast);
        setShowResults(true);
        return;
      }

      // Scrape profile
      const scrapeResponse = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!scrapeResponse.ok) {
        const errorData = await scrapeResponse.json();
        throw new Error(errorData.error || "Gagal mengambil data profil");
      }

      const { profile } = await scrapeResponse.json();

      // Generate roast
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

      // Simpan hasil roasting ke localStorage
      saveRoastToLocalStorage(username, roastText);
      saveScrapeCountToLocalStorage();

      // Beritahu pengguna bahwa hasil roasting akan direset setelah 10 menit
      setTimeout(() => {
        localStorage.removeItem(`roast_${username}`);
        setRoast(null);
        setProfileData(null);
        setUsername("");
        setShowResults(false);
        setError("Hasil roasting telah direset. Silakan coba lagi.");
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
            />
          )}

          {loading && <LoadingOverlay stage={stage} darkMode={darkMode} />}
        </div>
      </div>

      <Footer />
    </main>
  );
}
