import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    // Load script iklan
    const script = document.createElement("script");
    script.src = "//101047.shop/js/responsive.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="ad-container w-full bg-white py-4">
      {" "}
      {/* Tambahkan bg-white dan padding */}
      <div className="max-w-7xl mx-auto px-4">
        {" "}
        {/* Container untuk membatasi lebar konten */}
        <ins
          style={{
            width: "100%", // Ubah jadi 100%
            height: "250px", // Sesuaikan tinggi
            display: "block",
            margin: "0 auto", // Pusatkan
          }}
          data-width="100%"
          data-height="250"
          className="d473e55225c"
          data-domain="//101047.shop"
          data-affquery="/056416dae0209cc31ff7/473e55225c/?placementName=default"
        ></ins>
      </div>
    </div>
  );
}
