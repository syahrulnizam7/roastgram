"use client";

import { motion } from "framer-motion";

interface LoadingOverlayProps {
  stage: "idle" | "scraping" | "roasting" | "complete";
  darkMode: boolean;
}

export function LoadingOverlay({ stage, darkMode }: LoadingOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Eye Blinking Animation */}
      <div className="relative mb-8">
        <span className="loader"></span>
        <style jsx>{`
          .loader {
            position: relative;
            width: 108px;
            height: 48px; /* Tetapkan tinggi tetap */
            display: flex;
            justify-content: space-between;
          }
          .loader::after,
          .loader::before {
            content: "";
            display: inline-block;
            width: 48px; /* Ukuran lingkaran mata */
            aspect-ratio: 1 / 1;
            height: auto; /* Ukuran lingkaran mata */
            background-color: #fff;
            background-image: radial-gradient(
              circle 14px,
              /* Ukuran bola mata putih */ #0d161b 100%,
              transparent 0
            );
            border: 1px solid red;
            background-size: contain; /* Ukuran bola mata putih */
            background-repeat: no-repeat;
            background-position: center; /* Posisi bola mata putih di tengah */
            border-radius: 50%;
            animation: eyeMove 10s infinite, blink 10s infinite;
          }
          @keyframes eyeMove {
            0%,
            10% {
              background-position: 0px 0px;
            }
            13%,
            40% {
              background-position: -15px 0px;
            }
            43%,
            70% {
              background-position: 15px 0px;
            }
            73%,
            90% {
              background-position: 0px 15px;
            }
            93%,
            100% {
              background-position: 0px 0px;
            }
          }
          @keyframes blink {
            0%,
            10%,
            12%,
            20%,
            22%,
            40%,
            42%,
            60%,
            62%,
            70%,
            72%,
            90%,
            92%,
            98%,
            100% {
              transform: scaleY(1); /* Buka mata (normal) */
            }
            11%,
            21%,
            41%,
            61%,
            71%,
            91%,
            99% {
              transform: scaleY(0.1); /* Kedip (mata tertutup) */
            }
          }
        `}</style>
      </div>

      {/* Progress Bar */}
      <div className="text-center px-4">
        <p className="text-white text-lg md:text-xl font-bold">
          {stage === "scraping"
            ? "Mencari profil Instagram..."
            : "Memproses roast yang pedas... 🔥"}
        </p>

        {/* Progress Bar Container */}
        <div className="w-48 md:w-64 h-1.5 md:h-2 bg-gray-700 rounded-full mx-auto mt-3 md:mt-4 overflow-hidden">
          <motion.div
            className={`h-full ${darkMode ? "bg-yellow-400" : "bg-red-500"}`}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: stage === "scraping" ? 3 : 5,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
