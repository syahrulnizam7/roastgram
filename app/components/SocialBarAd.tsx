"use client";
import { useEffect, useState } from "react";

export default function SocialBarAd() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (process.env.NODE_ENV !== "production") return;

    const loadAdScript = () => {
      const script = document.createElement("script");
      script.src =
        "//pl26305802.effectiveratecpm.com/06/a5/2f/06a52fa0a05e5891a5b6c6b505b15456.js";
      script.async = true;
      script.id = "social-bar-ad-script";
      document.body.appendChild(script);
    };

    // Tunggu hingga halaman selesai dimuat
    if (document.readyState === "complete") {
      loadAdScript();
    } else {
      window.addEventListener("load", loadAdScript, { once: true });
    }

    return () => {
      const script = document.getElementById("social-bar-ad-script");
      if (script) script.remove();
      window.removeEventListener("load", loadAdScript);
    };
  }, []);

  if (!isClient || process.env.NODE_ENV !== "production") {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-200 flex items-center justify-center text-sm">
        [Social Bar Ad Placeholder - 728x90]
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div id="social-bar-ad-container"></div>
    </div>
  );
}
