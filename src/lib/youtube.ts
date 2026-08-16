import { parseISO8601Duration } from './timeUtils';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface DurationResult {
  speed: number;
  seconds: number;
  timeSavedSeconds: number;
}

export interface PlaylistResult {
  title: string;
  thumbnail: string;
  totalVideos: number;
  totalSeconds: number;
  durationsBySpeed: DurationResult[];
  isSingleVideo?: boolean;
}

export interface ExtractedTarget {
  type: 'playlist' | 'video';
  id: string;
}

interface PlaylistItem {
  contentDetails?: {
    videoId?: string;
  };
}

/**
 * Robustly extracts the YouTube playlist ID or video ID from any user input (URL or raw ID).
 * Handles URLs missing protocol (e.g. youtube.com/...), short links (youtu.be), shorts, embeds, music links, etc.
 */
export function extractYouTubeTarget(input: string): ExtractedTarget | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  let urlString = trimmed;
  // If input looks like a URL missing http/https, prepend https://
  if (!/^https?:\/\//i.test(trimmed) && (trimmed.includes('.') || trimmed.includes('/') || trimmed.includes('?'))) {
    urlString = `https://${trimmed}`;
  }

  try {
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');

    // 1. Check list query parameter first (applies to youtube.com, music.youtube.com, m.youtube.com, youtu.be)
    const listParam = url.searchParams.get('list');
    if (listParam && listParam.trim().length > 0) {
      return { type: 'playlist', id: listParam.trim() };
    }

    // 2. YouTu.be short links: https://youtu.be/VIDEO_ID or https://youtu.be/PLAYLIST_ID
    if (hostname === 'youtu.be') {
      const pathId = url.pathname.slice(1).split('/')[0].split('?')[0];
      if (pathId) {
        if (/^(PL|UU|FL|RD|OLAK|CL)/i.test(pathId) || pathId.length > 18) {
          return { type: 'playlist', id: pathId };
        }
        if (/^[a-zA-Z0-9_-]{11}$/.test(pathId)) {
          return { type: 'video', id: pathId };
        }
      }
    }

    // 3. YouTube domain URLs (watch, shorts, embed, playlist)
    if (hostname.includes('youtube.com')) {
      const vParam = url.searchParams.get('v');
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam.trim())) {
        return { type: 'video', id: vParam.trim() };
      }

      // /shorts/VIDEO_ID
      if (url.pathname.startsWith('/shorts/')) {
        const parts = url.pathname.split('/shorts/')[1]?.split('/')[0];
        if (parts && /^[a-zA-Z0-9_-]{11}$/.test(parts)) {
          return { type: 'video', id: parts };
        }
      }

      // /embed/VIDEO_ID
      if (url.pathname.startsWith('/embed/')) {
        const parts = url.pathname.split('/embed/')[1]?.split('/')[0];
        if (parts && parts !== 'videoseries') {
          if (/^[a-zA-Z0-9_-]{11}$/.test(parts)) {
            return { type: 'video', id: parts };
          }
        }
      }

      // /playlist/PLAYLIST_ID
      if (url.pathname.startsWith('/playlist/')) {
        const parts = url.pathname.split('/playlist/')[1]?.split('/')[0];
        if (parts) {
          return { type: 'playlist', id: parts };
        }
      }
    }
  } catch {
    // Input is not a URL, fallback to raw ID checks below
  }

  // Raw ID checks
  // Playlist ID format: starts with PL, UU, FL, RD, OLAK, CL or length > 18
  if (/^(PL|UU|FL|RD|OLAK|CL)[a-zA-Z0-9_-]+$/i.test(trimmed) || (trimmed.length >= 18 && /^[a-zA-Z0-9_-]+$/.test(trimmed))) {
    return { type: 'playlist', id: trimmed };
  }

  // Standard Video ID format: 11 characters
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { type: 'video', id: trimmed };
  }

  // Fallback for general playlist ID string (10+ chars)
  if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) {
    return { type: 'playlist', id: trimmed };
  }

  return null;
}

/**
 * Deprecated alias for backwards compatibility
 */
export function extractPlaylistId(input: string): string | null {
  const target = extractYouTubeTarget(input);
  return target ? target.id : null;
}

interface CacheEntry {
  data: PlaylistResult;
  timestamp: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour in-memory cache
const memoryCache = new Map<string, CacheEntry>();

/**
 * Fetches playlist or single video data from YouTube API and calculates total duration.
 * Utilizes in-memory caching and parallel chunk execution for maximum performance.
 */
export async function fetchYouTubeData(target: ExtractedTarget): Promise<PlaylistResult> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YOUTUBE_API_KEY is not defined. Please add it to your .env.local file.');
  }

  const cacheKey = `${target.type}:${target.id}`;
  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  let result: PlaylistResult;
  if (target.type === 'video') {
    result = await fetchSingleVideoData(target.id);
  } else {
    result = await fetchPlaylistData(target.id);
  }

  memoryCache.set(cacheKey, { data: result, timestamp: Date.now() });
  return result;
}

/**
 * Fetches details for a single video.
 */
async function fetchSingleVideoData(videoId: string): Promise<PlaylistResult> {
  const response = await fetch(
    `${BASE_URL}/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch video details');
  }

  const data = await response.json();
  const item = data.items?.[0];

  if (!item) {
    throw new Error('Video not found. Please verify the link or video ID.');
  }

  const title = item.snippet?.title || 'Single Video';
  const thumbnail =
    item.snippet?.thumbnails?.maxres?.url ||
    item.snippet?.thumbnails?.high?.url ||
    item.snippet?.thumbnails?.medium?.url ||
    item.snippet?.thumbnails?.default?.url ||
    '';

  const durationStr = item.contentDetails?.duration || 'PT0S';
  const totalSeconds = parseISO8601Duration(durationStr);

  const speeds = [1, 1.25, 1.5, 1.75, 2];
  const durationsBySpeed = speeds.map((speed) => {
    const seconds = Math.ceil(totalSeconds / speed);
    const timeSavedSeconds = Math.max(0, totalSeconds - seconds);
    return { speed, seconds, timeSavedSeconds };
  });

  return {
    title,
    thumbnail,
    totalVideos: 1,
    totalSeconds,
    durationsBySpeed,
    isSingleVideo: true,
  };
}

/**
 * Fetches all videos in a playlist and calculates total duration.
 */
export async function fetchPlaylistData(playlistId: string): Promise<PlaylistResult> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YOUTUBE_API_KEY is not defined. Please add it to your .env.local file.');
  }

  // 1. Fetch playlist details and initial playlist items concurrently
  const initialItemsUrl = `${BASE_URL}/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}`;
  const playlistDetailsUrl = `${BASE_URL}/playlists?part=snippet&id=${playlistId}&key=${YOUTUBE_API_KEY}`;

  const [playlistResponse, initialItemsResponse] = await Promise.all([
    fetch(playlistDetailsUrl, { next: { revalidate: 3600 } }),
    fetch(initialItemsUrl, { next: { revalidate: 3600 } }),
  ]);

  if (!playlistResponse.ok) {
    const errorData = await playlistResponse.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch playlist details');
  }

  const playlistData = await playlistResponse.json();
  const playlistSnippet = playlistData.items?.[0]?.snippet;

  if (!playlistSnippet) {
    if (/^[a-zA-Z0-9_-]{11}$/.test(playlistId)) {
      return fetchSingleVideoData(playlistId);
    }
    throw new Error('Playlist not found. Please check if the playlist is public or unlisted.');
  }

  const title = playlistSnippet.title || 'YouTube Playlist';
  const thumbnail =
    playlistSnippet.thumbnails?.maxres?.url ||
    playlistSnippet.thumbnails?.high?.url ||
    playlistSnippet.thumbnails?.medium?.url ||
    playlistSnippet.thumbnails?.default?.url ||
    '';

  const videoIds: string[] = [];

  if (initialItemsResponse.ok) {
    const firstData = await initialItemsResponse.json();
    if (firstData.items) {
      const ids = firstData.items
        .map((item: PlaylistItem) => item.contentDetails?.videoId)
        .filter((id: string | undefined): id is string => Boolean(id));
      videoIds.push(...ids);
    }

    let nextPageToken: string | undefined = firstData.nextPageToken;

    // Fetch remaining item pages if playlist has >50 videos
    while (nextPageToken) {
      const params = new URLSearchParams({
        part: 'contentDetails',
        playlistId: playlistId,
        maxResults: '50',
        pageToken: nextPageToken,
        key: YOUTUBE_API_KEY,
      });

      const res = await fetch(`${BASE_URL}/playlistItems?${params.toString()}`, { next: { revalidate: 3600 } });
      if (!res.ok) break;

      const pageData = await res.json();
      if (!pageData.items || pageData.items.length === 0) break;

      const ids = pageData.items
        .map((item: PlaylistItem) => item.contentDetails?.videoId)
        .filter((id: string | undefined): id is string => Boolean(id));
      videoIds.push(...ids);
      nextPageToken = pageData.nextPageToken;
    }
  }

  const speeds = [1, 1.25, 1.5, 1.75, 2];

  if (videoIds.length === 0) {
    return {
      title,
      thumbnail,
      totalVideos: 0,
      totalSeconds: 0,
      durationsBySpeed: speeds.map((speed) => ({ speed, seconds: 0, timeSavedSeconds: 0 })),
      isSingleVideo: false,
    };
  }

  // 2. Fetch video duration details concurrently in 50-video chunks via Promise.all
  const chunkSize = 50;
  const chunkArrays: string[][] = [];
  for (let i = 0; i < videoIds.length; i += chunkSize) {
    chunkArrays.push(videoIds.slice(i, i + chunkSize));
  }

  const chunkResponses = await Promise.all(
    chunkArrays.map(async (chunk) => {
      const params = new URLSearchParams({
        part: 'contentDetails',
        id: chunk.join(','),
        key: YOUTUBE_API_KEY,
      });
      const res = await fetch(`${BASE_URL}/videos?${params.toString()}`, { next: { revalidate: 3600 } });
      if (!res.ok) return null;
      return res.json();
    })
  );

  let totalSeconds = 0;
  for (const data of chunkResponses) {
    if (data?.items) {
      for (const item of data.items) {
        const duration = item.contentDetails?.duration;
        if (duration) {
          totalSeconds += parseISO8601Duration(duration);
        }
      }
    }
  }

  // 3. Calculate durations and time saved for each speed
  const durationsBySpeed = speeds.map((speed) => {
    const seconds = Math.ceil(totalSeconds / speed);
    const timeSavedSeconds = Math.max(0, totalSeconds - seconds);
    return { speed, seconds, timeSavedSeconds };
  });

  return {
    title,
    thumbnail,
    totalVideos: videoIds.length,
    totalSeconds,
    durationsBySpeed,
    isSingleVideo: false,
  };
}
