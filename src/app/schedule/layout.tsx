import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yt-playlist-calculator.com';

export const metadata: Metadata = {
  title: 'Playlist Watch Schedule Estimator | Daily, Weekly & Monthly Planner',
  description: 'Estimate your completion date for any YouTube playlist. Set daily watch goals (15m, 30m, 1h, 2h/day) and calculate completion times at 1.25x, 1.5x, 2x, and 3x playback speeds.',
  openGraph: {
    title: 'YouTube Playlist Watch Schedule Estimator',
    description: 'Calculate exact finish dates and daily/weekly/monthly schedules for YouTube playlists at any speed.',
    url: `${baseUrl}/schedule`,
  },
  alternates: {
    canonical: `${baseUrl}/schedule`,
  },
};

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
