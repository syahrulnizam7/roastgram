import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
