"use client";

import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const script = document.createElement("script");
      script.src = "//101047.shop/js/responsive.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 py-4">
      <div className="container mx-auto px-4">
        {process.env.NODE_ENV === "production" ? (
          <div className="flex justify-center">
            <ins
              style={{
                display: "block",
                width: "100%",
                maxWidth: "1200px",
                height: "90px",
                margin: "0 auto",
              }}
              data-width="1200"
              data-height="90"
              className="d473e55225c"
              data-domain="//101047.shop"
              data-affquery="/056416dae0209cc31ff7/473e55225c/?placementName=default"
            ></ins>
          </div>
        ) : (
          <div className="w-full h-24 bg-yellow-200 dark:bg-yellow-800 flex items-center justify-center">
            <p className="text-center">[Placeholder Iklan - Lebar Penuh]</p>
          </div>
        )}
      </div>
    </div>
  );
}
