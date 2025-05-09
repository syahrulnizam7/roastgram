import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import ReCaptchaProvider from "./components/recaptcha-provider";
import Adsterra from "./components/Adsterra";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RoastGram - Roast akun instagram anda dengan AI",
  description:
    "RoastGram menggunakan AI untuk mengejek profil Instagram Anda dengan komentar lucu dan pedas. Bersiaplah untuk di-roasting!",
  keywords: [
    "instagram roast",
    "ai roast",
    "social media roast",
    "instagram profile",
    "funny roast",
  ],
  openGraph: {
    type: "website",
    title: "RoastGram - Roast akun instagram anda dengan AI",
    description:
      "Biarkan profil Instagram Anda di-roasting oleh AI kami. Lucu, pedas, dan dijamin membakar ego Anda",
    url: "https://roastgram.vercel.app",
    siteName: "RoastGram",
    images: [
      {
        url: "/images/roastgramss.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoastGram - Roast akun instagram anda dengan AI",
    description:
      "Get your Instagram profile roasted by our AI. Hilarious, spicy, and guaranteed to burn your ego!",
    images: ["/images/roastgramlogo2.png"],
    creator: "@roastgram",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  creator: "Alangkun",
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LVPPX8J2VK"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-LVPPX8J2VK');
          `}
        </Script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReCaptchaProvider>
          {children}
          <Analytics />
          {/* <Adsterra /> */}
        </ReCaptchaProvider>
      </body>
    </html>
  );
}
