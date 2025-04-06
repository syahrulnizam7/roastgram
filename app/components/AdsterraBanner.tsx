"use client";
import { useEffect } from "react";

export default function AdsterraBanner() {
  useEffect(() => {
    // Load script secara dinamis
    const loadAdScript = () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.innerHTML = `
        atOptions = {
          'key': 'd8e89bc0e226ce13f9e32c65f2e02487',
          'format': 'iframe',
          'height': 600,
          'width': 160,
          'params': {}
        };
      `;
      document.body.appendChild(script);

      const script2 = document.createElement("script");
      script2.type = "text/javascript";
      script2.src =
        "//www.highperformanceformat.com/d8e89bc0e226ce13f9e32c65f2e02487/invoke.js";
      script2.async = true;
      document.body.appendChild(script2);
    };

    // Hanya load di production
    if (process.env.NODE_ENV === "production") {
      loadAdScript();
    }

    return () => {
      // Bersihkan script saat komponen unmount
      document
        .querySelectorAll('script[src*="highperformanceformat"]')
        .forEach((el) => el.remove());
    };
  }, []);

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {/* Placeholder untuk development */}
      {process.env.NODE_ENV !== "production" && (
        <div className="border-2 border-dashed border-gray-400 p-4 text-center">
          <p>Iklan Adsterra akan muncul di production</p>
          <p>Ukuran: 160x600</p>
        </div>
      )}
      {/* Container untuk iklan */}
      <div id="container-d8e89bc0e226ce13f9e32c65f2e02487"></div>
    </div>
  );
}
