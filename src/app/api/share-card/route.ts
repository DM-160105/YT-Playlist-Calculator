import { NextRequest } from 'next/server';
import sharp from 'sharp';
import { generateShareCardSvg } from '@/lib/share-card/generateShareCardSvg';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { result, isSchedulePage = false } = body;

    if (!result) {
      return Response.json(
        { error: 'Playlist result is required.' },
        { status: 400 }
      );
    }

    const svg = await generateShareCardSvg(result, Boolean(isSchedulePage));

    /**
     * SVG is 440px wide.
     * Render at 2x: 880px wide PNG.
     */
    const pngBuffer = await sharp(Buffer.from(svg))
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
      })
      .resize({
        width: 880,
        kernel: sharp.kernel.lanczos3,
      })
      .toBuffer();

    return new Response(new Uint8Array(pngBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': String(pngBuffer.length),
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('Share card generation failed:', error);
    return Response.json(
      { error: 'Failed to generate share card.' },
      { status: 500 }
    );
  }
}
