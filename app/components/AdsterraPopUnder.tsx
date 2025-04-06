"use client";
import { useEffect } from "react";

export default function AdsterraPopUnder() {
  useEffect(() => {
    // Hanya load di production
    if (process.env.NODE_ENV !== "production") return;

    // Load script hanya setelah interaksi user
    const handleFirstInteraction = () => {
      const script = document.createElement("script");
      script.src =
        "//pl26305716.effectiveratecpm.com/48/a8/15/48a81509724f8a4f0f505827988404f6.js";
      script.async = true;
      document.body.appendChild(script);

      // Hapus event listener setelah dijalankan
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
    };

    // Trigger setelah interaksi (click/scroll)
    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("scroll", handleFirstInteraction, { once: true });

    return () => {
      // Cleanup
      document
        .querySelectorAll('script[src*="effectiveratecpm"]')
        .forEach((el) => el.remove());
    };
  }, []);

  return null; // Komponen ini tidak render apapun
}
