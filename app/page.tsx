"use client";

import type React from "react";

import { useState } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Scrape profile
      const scrapeResponse = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!scrapeResponse.ok) {
        throw new Error("Gagal mengambil data profil");
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

      {/* Tambahkan Footer di sini */}
      <Footer />
    </main>
  );
}
