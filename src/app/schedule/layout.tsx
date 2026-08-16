import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/siteConfig";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: "YouTube Playlist Watch Schedule Estimator | Custom Target Finish Date",
  description:
    "Plan your YouTube course and playlist watch goals. Calculate exact completion dates based on daily watch time (15m, 30m, 1h, 2h) and playback speeds (1x to 3x).",
  keywords: [
    "youtube watch schedule planner",
    "playlist finish date calculator",
    "youtube course completion estimator",
    "youtube daily study planner",
    "binge watch completion time",
  ],
  alternates: {
    canonical: `${baseUrl}/schedule`,
  },
  openGraph: {
    title: "YouTube Playlist Watch Schedule & Finish Date Estimator",
    description:
      "Set daily watch targets and get accurate projected finish dates with custom milestones.",
    url: `${baseUrl}/schedule`,
    type: "website",
  },
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
