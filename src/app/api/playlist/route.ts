import { NextResponse } from 'next/server';
import { extractPlaylistId, fetchPlaylistData } from '@/lib/youtube';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playlistInput } = body;

    if (!playlistInput) {
      return NextResponse.json(
        { error: 'Playlist input is required' },
        { status: 400 }
      );
    }

    const playlistId = extractPlaylistId(playlistInput);

    if (!playlistId) {
      return NextResponse.json(
        { error: 'Invalid playlist URL or ID' },
        { status: 400 }
      );
    }

    const data = await fetchPlaylistData(playlistId);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
