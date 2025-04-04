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
    <div className="ad-container flex justify-center">
      <ins
        style={{ width: "300px", height: "250px", display: "block" }}
        data-width="300"
        data-height="250"
        className="d473e55225c"
        data-domain="//101047.shop"
        data-affquery="/056416dae0209cc31ff7/473e55225c/?placementName=default"
      ></ins>
    </div>
  );
}
