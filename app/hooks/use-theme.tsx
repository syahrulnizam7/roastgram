"use client";

import { useState, useEffect } from "react";

export function useTheme() {
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

  return { darkMode, setDarkMode };
}
