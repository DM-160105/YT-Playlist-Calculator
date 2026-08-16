import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PlaylistProvider } from "@/context/PlaylistContext";
import { SeoSchema } from "@/components/seo-schema";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yt-playlist-calculator.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "YouTube Playlist Duration Calculator | Calculate Binge Watch Time",
    template: "%s | YT Playlist Calculator",
  },
  description: "Calculate exact YouTube playlist and video duration at 1x, 1.25x, 1.5x, 1.75x, 2x, 2.5x, and 3x playback speeds. Generate custom daily, weekly, monthly, and yearly watch schedule plans.",
  keywords: [
    "youtube playlist calculator",
    "playlist duration calculator",
    "calculate youtube playlist length",
    "youtube watch time estimator",
    "youtube speed calculator",
    "youtube binge watch timer",
    "playlist finish date calculator",
    "how long is a youtube playlist",
    "youtube watch schedule planner"
  ],
  authors: [{ name: "YT Playlist Calculator Team" }],
  creator: "YT Playlist Calculator",
  publisher: "YT Playlist Calculator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "YT Playlist Calculator",
    title: "YouTube Playlist Duration & Schedule Calculator",
    description: "Find out exactly how long it takes to watch any YouTube playlist at any speed (1x to 3x). Get accurate daily, weekly, monthly, and yearly watch schedules.",
    images: [
      {
        url: `${baseUrl}/icon.svg`,
        width: 1200,
        height: 630,
        alt: "YT Playlist Duration Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Playlist Duration & Schedule Calculator",
    description: "Calculate YouTube playlist & video length at any playback speed with custom daily watch schedules.",
    creator: "@ytplaylistcalc",
    images: [`${baseUrl}/icon.svg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  verification: {
    google: "CNxHZu7NJws3hRiybE6G26POx2JSuuLK-A42WsLhi8E",
  },
};

import { FloatingShareButton } from "@/components/floating-share-button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.googleapis.com" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PlaylistProvider>
            <SeoSchema />
            {children}
            <FloatingShareButton />
          </PlaylistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
