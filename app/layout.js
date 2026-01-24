import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { siteConfig } from "@/app/data/siteConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "BizEase - Review Generator",
    template: "%s | BizEase",
  },
  description: "The smartest way to generate authentic, high-quality reviews for your business instantly. Boost your online reputation.",
  icons: {
    icon: siteConfig.header.favicon,
    shortcut: siteConfig.header.favicon,
    apple: siteConfig.header.favicon,
  },
  openGraph: {
    title: "BizEase - Review Generator",
    description: "Boost your online reputation with authentic 5-star reviews. Instant, professional, and platform-optimized.",
    siteName: "BizEase",
    type: "website",
    url: "https://www.bizease.com",
    images: [
      {
        url: siteConfig.header.logo,
        width: 800,
        height: 600,
        alt: "BizEase Reviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BizEase - Review Generator",
    description: "Generate authentic 5-star reviews instantly.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
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
