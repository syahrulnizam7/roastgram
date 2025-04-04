import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//101047.shop/js/responsive.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full flex justify-center py-4 bg-white">
      {" "}
      {/* Container utama */}
      <div className="text-center">
        {" "}
        {/* Container untuk centering */}
        <ins
          style={{
            width: "100%", // Responsive width
            height: "250px", // Sesuaikan tinggi
            display: "block",
            margin: "0 auto",
            maxWidth: "970px", // Batas maksimal lebar
          }}
          data-width="0"
          data-height="0"
          className="na065232fba"
          data-domain="//101047.shop"
          data-affquery="/056416dae0209cc31ff7/a065232fba/?placementName=default"
        ></ins>
      </div>
    </div>
  );
}
