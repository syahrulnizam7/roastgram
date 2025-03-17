"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

interface HeaderProps {
  showResults: boolean;
  resetForm: () => void;
  darkMode: boolean;
}

export function Header({ showResults, resetForm, darkMode }: HeaderProps) {
  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-10 py-3 md:py-4 px-4 md:px-6 ${
        darkMode
          ? "bg-zinc-900/90 backdrop-blur-sm"
          : "bg-[#FF5F1F]/90 backdrop-blur-sm"
      } transition-colors duration-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div
          onClick={resetForm}
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="/roastgramlogo.png"
            alt="RoastGram Logo"
            className="h-8 w-auto md:h-10"
          />
        </motion.div>

        {showResults && (
          <motion.button
            onClick={resetForm}
            className={`${darkMode ? "bg-red-500" : "bg-red-500"} ${
              darkMode ? "text-white" : "text-black"
            } font-bold px-3 py-1.5 md:px-4 md:py-2 border-3 md:border-4 border-black rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 md:gap-2 text-sm md:text-base mr-14`}
            whileHover={{
              x: -2,
              y: -2,
              boxShadow: "5px 5px 0px 0px rgba(0,0,0,1)",
            }}
            whileTap={{
              x: 0,
              y: 0,
              boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Reset
          </motion.button>
        )}
      </div>
    </motion.header>
  );
}
