import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PlaylistProvider } from "@/context/PlaylistContext";
import { SeoSchema } from "@/components/seo-schema";

import { getBaseUrl, siteConfig } from "@/lib/siteConfig";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "YouTube Playlist Duration Calculator | Calculate Binge Watch Time",
    template: "%s | YT Playlist Calculator",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.shortName,
  publisher: siteConfig.shortName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: siteConfig.name,
    title: "YouTube Playlist Duration & Schedule Calculator",
    description: siteConfig.description,
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
    description: siteConfig.description,
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
