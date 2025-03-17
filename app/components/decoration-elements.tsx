"use client";

import { motion } from "framer-motion";

interface DecorationElementsProps {
  darkMode: boolean;
}

export function DecorationElements({ darkMode }: DecorationElementsProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
      <motion.div
        className={`absolute top-20 right-[10%] w-24 h-24 rounded-none border-8 border-black ${
          darkMode ? "bg-purple-600" : "bg-[#00FFFF]"
        }`}
        animate={{
          rotate: 360,
          y: [0, 50, 0],
        }}
        transition={{
          rotate: {
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          },
          y: {
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            repeatType: "reverse",
          },
        }}
      />

      <motion.div
        className={`absolute bottom-40 left-[5%] w-20 h-20 rounded-none border-8 border-black ${
          darkMode ? "bg-cyan-500" : "bg-[#FF00FF]"
        }`}
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          repeatType: "reverse",
        }}
      />

      <motion.div
        className={`absolute top-[40%] left-[15%] w-16 h-16 rotate-45 border-8 border-black ${
          darkMode ? "bg-yellow-500" : "bg-[#FFFF00]"
        }`}
        animate={{
          rotate: [45, 90, 45],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          repeatType: "reverse",
        }}
      />
    </div>
  );
}
