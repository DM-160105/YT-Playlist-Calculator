import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/siteConfig";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: "Complete Guide: How to Calculate YouTube Playlist Length & Watch Time",
  description:
    "Learn how to accurately calculate YouTube playlist length, estimate watch time for courses, manage playback speeds, and build custom study completion schedules.",
  keywords: [
    "how to calculate youtube playlist length",
    "calculate youtube watch time guide",
    "youtube playlist duration tool",
    "youtube course finish date estimator",
    "youtube binge watch guide",
  ],
  alternates: {
    canonical: `${baseUrl}/guide`,
  },
  openGraph: {
    title: "Guide: How to Calculate YouTube Playlist Length & Watch Schedules",
    description:
      "A complete guide to calculating total playlist duration, speed-saving formulas, and study pacing.",
    url: `${baseUrl}/guide`,
    type: "article",
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
