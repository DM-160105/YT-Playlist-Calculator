import { parseISO8601Duration } from './timeUtils';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface PlaylistResult {
  title: string;
  thumbnail: string;
  totalVideos: number;
  totalSeconds: number;
  durationsBySpeed: { speed: number; seconds: number }[];
}

/**
 * Extracts the playlist ID from a URL or returns the input if it looks like an ID.
 * @param input - The user input (URL or ID).
 * @returns The playlist ID or null if invalid.
 */
export function extractPlaylistId(input: string): string | null {
  // Check if input is a URL
  try {
    const url = new URL(input);
    const listParam = url.searchParams.get('list');
    if (listParam) {
      return listParam;
    }
  } catch {
    // Not a URL, check if it looks like a playlist ID (usually starts with PL, UU, FL, RD)
    // Basic validation: alphanumeric, dashes, underscores, reasonable length
    if (/^[a-zA-Z0-9_-]{10,}$/.test(input)) {
      return input;
    }
  }
  return null;
}

/**
 * Fetches all videos in a playlist and calculates total duration.
 * @param playlistId - The ID of the playlist.
 * @returns The calculated playlist data.
 */
export async function fetchPlaylistData(playlistId: string): Promise<PlaylistResult> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YOUTUBE_API_KEY is not defined');
  }

  let videoIds: string[] = [];
  let nextPageToken: string | undefined = undefined;

  // 0. Fetch playlist details (title, thumbnail)
  const playlistResponse = await fetch(
    `${BASE_URL}/playlists?part=snippet&id=${playlistId}&key=${YOUTUBE_API_KEY}`
  );

  if (!playlistResponse.ok) {
     const errorData = await playlistResponse.json();
     throw new Error(errorData.error?.message || 'Failed to fetch playlist details');
  }

  const playlistData = await playlistResponse.json();
  const playlistSnippet = playlistData.items?.[0]?.snippet;

  if (!playlistSnippet) {
      throw new Error('Playlist not found');
  }

  const title = playlistSnippet.title;
  const thumbnail = playlistSnippet.thumbnails?.high?.url || playlistSnippet.thumbnails?.medium?.url || playlistSnippet.thumbnails?.default?.url;

  // 1. Fetch all video IDs from the playlist
  do {
    const params = new URLSearchParams({
      part: 'contentDetails',
      playlistId: playlistId,
      maxResults: '50',
      key: YOUTUBE_API_KEY,
    });
    if (nextPageToken) {
      params.append('pageToken', nextPageToken);
    }

    const response = await fetch(`${BASE_URL}/playlistItems?${params.toString()}`);
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch playlist items');
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
        if (videoIds.length === 0) {
             // Empty playlist
             return {
                title,
                thumbnail,
                totalVideos: 0,
                totalSeconds: 0,
                durationsBySpeed: [1, 1.25, 1.5, 1.75, 2].map(speed => ({ speed, seconds: 0 }))
             };
        }
        break; 
    }

    const ids = data.items.map((item: any) => item.contentDetails?.videoId).filter(Boolean);
    videoIds.push(...ids);
    nextPageToken = data.nextPageToken;

  } while (nextPageToken);

  if (videoIds.length === 0) {
      return {
          title,
          thumbnail,
          totalVideos: 0,
          totalSeconds: 0,
          durationsBySpeed: [1, 1.25, 1.5, 1.75, 2].map(speed => ({ speed, seconds: 0 }))
      };
  }

  // 2. Fetch video details (durations) in chunks of 50
  let totalSeconds = 0;
  const chunkSize = 50;

  for (let i = 0; i < videoIds.length; i += chunkSize) {
    const chunk = videoIds.slice(i, i + chunkSize);
    const params = new URLSearchParams({
      part: 'contentDetails',
      id: chunk.join(','),
      key: YOUTUBE_API_KEY,
    });

    const response = await fetch(`${BASE_URL}/videos?${params.toString()}`);
    
    if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error?.message || 'Failed to fetch video details');
    }

    const data = await response.json();
    
    if (data.items) {
        for (const item of data.items) {
            const duration = item.contentDetails?.duration;
            if (duration) {
                totalSeconds += parseISO8601Duration(duration);
            }
        }
    }
  }

  // 3. Calculate speeds
  const speeds = [1, 1.25, 1.5, 1.75, 2];
  const durationsBySpeed = speeds.map(speed => ({
    speed,
    seconds: Math.ceil(totalSeconds / speed),
  }));

  return {
    title,
    thumbnail,
    totalVideos: videoIds.length,
    totalSeconds,
    durationsBySpeed,
  };
}
