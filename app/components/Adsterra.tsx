"use client";
import { useEffect } from "react";

export default function AdsterraSocialBarAds() {
  useEffect(() => {
    // Hanya load di production
    if (process.env.NODE_ENV !== "production") return;

    const script = document.createElement("script");
    script.src =
      "//pl26305802.effectiveratecpm.com/06/a5/2f/06a52fa0a05e5891a5b6c6b505b15456.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document
        .querySelectorAll('script[src*="effectiveratecpm"]')
        .forEach((el) => el.remove());
    };
  }, []);

  return null; // Tidak render apapun
}
