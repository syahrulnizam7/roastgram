"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, type AnimationControls } from "framer-motion";
import {
  Instagram,
  AtSign,
  Flame,
  ArrowRight,
  Zap,
  Sparkles,
} from "lucide-react";

interface InputFormProps {
  username: string;
  setUsername: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  error: string | null;
  darkMode: boolean;
  flameControls: AnimationControls;
}

export function InputForm({
  username,
  setUsername,
  handleSubmit,
  loading,
  error,
  darkMode,
  flameControls,
}: InputFormProps) {
  const [totalRoasted, setTotalRoasted] = useState<number | null>(null);
  const [totalRoastedError, setTotalRoastedError] = useState<string | null>(
    null
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmitWithCaptcha = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Generate token reCAPTCHA
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action: "submit" }
      );

      // Panggil handleSubmit original dengan token
      await handleSubmit(e);
    } catch (error) {
      setValidationError("Gagal verifikasi captcha. Coba lagi.");
    }
  };

  // Fungsi untuk mengambil total roasted dari API
  useEffect(() => {
    const fetchTotalRoasted = async () => {
      try {
        const response = await fetch("/api/total-roasted");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Gagal mengambil data");
        }

        setTotalRoasted(data.total);
        setTotalRoastedError(null);
      } catch (error) {
        console.error("Error fetching total roasted:", error);
        setTotalRoastedError("Gagal memuat statistik total roasted");
        setTotalRoasted(null);
      }
    };

    fetchTotalRoasted();
  }, []);

  return (
    <motion.div
      key="input-form"
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center mb-6 md:mb-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <img
          src="/roastgramlogo.png"
          alt="RoastGram Logo"
          className="h-20 md:h-28 w-auto mx-auto mb-5 md:mb-8"
        />

        {/* Tambahkan tampilan total roasted di sini */}
        {totalRoastedError && (
          <motion.div
            className={`mt-2 p-2 ${
              darkMode ? "bg-red-800" : "bg-red-400"
            } rounded-md`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              {totalRoastedError}
            </p>
          </motion.div>
        )}

        <p
          className={`${
            darkMode ? "text-gray-300" : "text-black"
          } text-lg md:text-xl max-w-md mx-auto font-bold px-2`}
        >
          Roasting akun instagram-mu, siap kena mental? 💀
        </p>
      </motion.div>

      {totalRoasted !== null && (
        <motion.div
          className={`mb-4 ${
            darkMode ? "bg-yellow-500" : "bg-yellow-400"
          } border-3 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-3 py-2 w-full text-center`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{
            y: -3,
            x: -3,
            boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
            transition: { duration: 0.2 },
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="bg-black p-1 border-2 border-black">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>

            <div className="font-mono">
              <span className="text-lg font-black text-black">
                {totalRoasted.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              </span>
              <span className="text-sm font-bold text-black ml-1">
                akun telah di roasting
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        className={`${
          darkMode ? "bg-cyan-600" : "bg-[#00DDFF]"
        } border-4 md:border-8 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden mx-2 md:mx-0`}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{
          y: -5,
          boxShadow: "6px 11px 0px 0px rgba(0,0,0,1)",
        }}
      >
        <div className="p-4 md:p-8">
          <form
            onSubmit={handleSubmitWithCaptcha}
            className="space-y-4 md:space-y-6"
          >
            <div className="flex flex-col space-y-2 md:space-y-3">
              <label
                htmlFor="username"
                className={`text-xl md:text-2xl font-black ${
                  darkMode ? "text-white" : "text-black"
                } flex items-center gap-2`}
              >
                <Instagram className="w-5 h-5 md:w-6 md:h-6" />
                Username Instagram
              </label>
              <div className="relative">
                <motion.div
                  className="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4"
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  <AtSign
                    className={`w-5 h-5 md:w-6 md:h-6 ${
                      darkMode ? "text-gray-300" : "text-black"
                    }`}
                  />
                </motion.div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-10 md:pl-14 pr-3 md:pr-4 py-3 md:py-5 ${
                    darkMode
                      ? "bg-zinc-800 text-white placeholder-gray-500"
                      : "bg-white text-black placeholder-black/50"
                  } border-3 md:border-4 border-black rounded-md text-base md:text-xl focus:outline-none focus:ring-4 focus:ring-black transition-all`}
                  placeholder="username"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full ${
                darkMode
                  ? "bg-pink-600 hover:bg-pink-700 text-white"
                  : "bg-[#FF3366] hover:bg-[#FF1F4B] text-black"
              } font-black text-lg md:text-xl py-3 md:py-5 px-4 md:px-6 border-4 md:border-8 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-70 flex items-center justify-center gap-2 md:gap-3`}
              whileHover={{
                x: -2,
                y: -2,
                boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
              }}
              whileTap={{
                x: 0,
                y: 0,
                boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
              }}
            >
              {!loading && (
                <>
                  <Flame className="w-5 h-5 md:w-6 md:h-6" />
                  <span>Roast! 🔥</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.div>
                </>
              )}
            </motion.button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                className={`mt-4 md:mt-6 p-3 md:p-4 ${
                  darkMode ? "bg-red-600" : "bg-red-500"
                } border-3 md:border-4 border-black rounded-md`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p
                  className={`text-base md:text-lg font-bold ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <FeatureSection darkMode={darkMode} />
    </motion.div>
  );
}

function FeatureSection({ darkMode }: { darkMode: boolean }) {
  return (
    <motion.div
      className="mt-10 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <FeatureCard
        title="Super Cepat"
        description="Hasil roasting dalam hitungan detik"
        icon={
          <Zap
            className={`w-6 h-6 md:w-8 md:h-8 ${
              darkMode ? "text-yellow-300" : "text-white"
            }`}
          />
        }
        bgColor={darkMode ? "bg-purple-700" : "bg-[#9933FF]"}
        iconBgColor={darkMode ? "bg-purple-900" : "bg-purple-600"}
        darkMode={darkMode}
      />

      <FeatureCard
        title="Roast Pedas"
        description="Dijamin bikin mental terbakar"
        icon={
          <Flame
            className={`w-6 h-6 md:w-8 md:h-8 ${
              darkMode ? "text-yellow-300" : "text-white"
            }`}
          />
        }
        bgColor={darkMode ? "bg-green-700" : "bg-green-500"}
        iconBgColor={darkMode ? "bg-green-900" : "bg-green-600"}
        darkMode={darkMode}
      />

      <FeatureCard
        title="AI Powered"
        description="Dibuat dengan teknologi AI terbaru"
        icon={
          <Sparkles
            className={`w-6 h-6 md:w-8 md:h-8 ${
              darkMode ? "text-yellow-300" : "text-white"
            }`}
          />
        }
        bgColor={darkMode ? "bg-orange-700" : "bg-orange-500"}
        iconBgColor={darkMode ? "bg-orange-900" : "bg-orange-600"}
        darkMode={darkMode}
      />
    </motion.div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  iconBgColor: string;
  darkMode: boolean;
}

function FeatureCard({
  title,
  description,
  icon,
  bgColor,
  iconBgColor,
  darkMode,
}: FeatureCardProps) {
  return (
    <motion.div
      className={`${bgColor} border-4 md:border-8 border-black rounded-none p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
      whileHover={{
        y: -5,
        x: -5,
        boxShadow: "7px 7px 0px 0px rgba(0,0,0,1)",
      }}
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          className={`${iconBgColor} p-2 md:p-3 rounded-md border-2 border-black mb-2 md:mb-3`}
          whileHover={{ rotate: 10 }}
        >
          {icon}
        </motion.div>
        <h3
          className={`text-lg md:text-xl font-bold ${
            darkMode ? "text-white" : "text-black"
          } mb-1 md:mb-2`}
        >
          {title}
        </h3>
        <p
          className={`${
            darkMode ? "text-gray-300" : "text-black"
          } text-sm md:text-base`}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}
