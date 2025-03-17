"use client";

import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa"; // Import ikon GitHub dari react-icons

export default function Footer() {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode based on user preference
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDarkMode(true);
    }
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <footer className={`w-full py-6 px-4  flex items-center justify-between`}>
      <p
        className={`text-sm font-bold ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        by alangkun
      </p>

      <a
        href="https://github.com/syahrulnizam7/roastgram"
        target="_blank"
        rel="noopener noreferrer"
        className={`p-2 rounded-md ${
          darkMode ? "bg-zinc-800" : "bg-white"
        } border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-shadow`}
      >
        <FaGithub
          className={`w-5 h-5 ${darkMode ? "text-white" : "text-black"}`}
        />
      </a>
    </footer>
  );
}
