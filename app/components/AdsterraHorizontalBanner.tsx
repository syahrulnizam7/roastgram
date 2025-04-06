"use client";
import { useEffect } from "react";

export default function AdsterraHorizontalBanner() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const loadAdScript = () => {
      const configScript = document.createElement("script");
      configScript.innerHTML = `
        atOptions = {
          'key': '634d5bbcc6a1eb9848c5bbad138e9e09',
          'format': 'iframe',
          'height': 60,
          'width': 468,
          'params': {}
        }
      `;
      document.body.appendChild(configScript);

      const adScript = document.createElement("script");
      adScript.src =
        "//www.highperformanceformat.com/634d5bbcc6a1eb9848c5bbad138e9e09/invoke.js";
      adScript.async = true;
      document.body.appendChild(adScript);
    };

    loadAdScript();

    return () => {
      // Cleanup
      document
        .querySelectorAll('script[src*="highperformanceformat"]')
        .forEach((el) => el.remove());
    };
  }, []);

  return (
    <div className="w-full flex justify-center my-4">
      {/* Placeholder untuk development */}
      {process.env.NODE_ENV !== "production" && (
        <div className="border-2 border-dashed border-gray-400 p-4 text-center w-[468px] h-[60px] flex items-center justify-center">
          <p>Iklan Horizontal Adsterra (468x60)</p>
        </div>
      )}
      {/* Container untuk iklan */}
      <div id="container-634d5bbcc6a1eb9848c5bbad138e9e09"></div>
    </div>
  );
}
