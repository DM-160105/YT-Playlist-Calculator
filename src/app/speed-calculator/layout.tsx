import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/siteConfig";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: "YouTube Speed & Time Saved Calculator | 1.25x to 3x Duration Matrix",
  description:
    "Free YouTube speed calculator and time-savings chart. Find out exactly how much time you save watching videos and playlists at 1.25x, 1.5x, 1.75x, 2x, and 3x playback speeds.",
  keywords: [
    "youtube speed calculator",
    "video playback speed time saved",
    "youtube 1.5x speed duration",
    "youtube 2x speed time calculator",
    "how much time do you save watching 2x speed",
    "playback speed multiplier table",
  ],
  alternates: {
    canonical: `${baseUrl}/speed-calculator`,
  },
  openGraph: {
    title: "YouTube Video Speed & Time-Saved Calculator",
    description:
      "Interactive time savings matrix and playback speed conversion calculator for YouTube videos and playlists.",
    url: `${baseUrl}/speed-calculator`,
    type: "website",
  },
};

export default function SpeedCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
