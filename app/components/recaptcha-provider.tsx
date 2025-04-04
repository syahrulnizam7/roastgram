"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function ReCaptchaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <>{children}</>;
}
