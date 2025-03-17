"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function ThemeToggle({ darkMode, setDarkMode }: ThemeToggleProps) {
  return (
    <motion.button
      onClick={() => setDarkMode(!darkMode)}
      className={`fixed top-4 right-4 z-50 p-2 md:p-3 rounded-full ${
        darkMode ? "bg-yellow-400 text-black" : "bg-purple-900 text-white"
      } border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 md:w-6 md:h-6" />
      ) : (
        <Moon className="w-5 h-5 md:w-6 md:h-6" />
      )}
    </motion.button>
  );
}
