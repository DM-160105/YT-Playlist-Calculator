import { NextResponse } from 'next/server';
import { extractYouTubeTarget, fetchYouTubeData } from '@/lib/youtube';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playlistInput } = body;

    if (!playlistInput || typeof playlistInput !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a YouTube playlist or video URL/ID.' },
        { status: 400 }
      );
    }

    const target = extractYouTubeTarget(playlistInput);

    if (!target) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL or ID. Please enter a valid playlist link, short link, or video ID.' },
        { status: 400 }
      );
    }

    const data = await fetchYouTubeData(target);

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error('Playlist API Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch playlist data. Please try again.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
