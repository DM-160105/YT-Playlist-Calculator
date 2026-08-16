/**
 * Centralized site configuration and canonical URL resolver.
 * Ensures consistent canonical URLs, sitemaps, robots.txt, and metadata.
 */

export const siteConfig = {
  name: "YouTube Playlist Duration Calculator",
  shortName: "YT Playlist Calc",
  description:
    "Free YouTube playlist duration calculator. Calculate exact watch time at 1x, 1.25x, 1.5x, 1.75x, 2x, 2.5x, and 3x playback speeds. Generate custom daily, weekly, and monthly watch schedule plans.",
  keywords: [
    "youtube playlist calculator",
    "youtube playlist duration",
    "calculate youtube playlist length",
    "youtube watch time estimator",
    "youtube speed calculator",
    "youtube binge watch timer",
    "playlist finish date calculator",
    "how long is a youtube playlist",
    "youtube watch schedule planner",
    "youtube course time calculator",
    "video speed time savings",
  ],
  author: "Devang Makwana",
  links: {
    github: "https://github.com/DM-160105/YT-Playlist-Calculator",
  },
};

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/+$/, '')}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, '')}`;
  }
  // Default to live production / studio domain
  return 'https://yt-playlist-length-calculator.ai.studio';
}
