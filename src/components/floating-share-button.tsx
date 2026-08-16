'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { usePlaylist } from '@/context/PlaylistContext';
import {
  Share2,
  Download,
  X,
  Sparkles,
  Check,
  Play,
  Clock,
  Zap,
  Layers,
} from 'lucide-react';
import gsap from 'gsap';

export function FloatingShareButton() {
  const pathname = usePathname();
  const { result } = usePlaylist();

  const [modalOpen, setModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastScrollY = useRef(0);

  const isSchedulePage = pathname === '/schedule';

  // ============================================================
  // Scroll behavior: hide on scroll down, reveal on scroll up
  // ============================================================
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!buttonRef.current) return;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        gsap.to(buttonRef.current, {
          y: 90,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: true,
        });
      } else {
        gsap.to(buttonRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: true,
        });
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format duration helper for UI preview
  const formatTime = useCallback((totalSeconds: number) => {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
    parts.push(`${secs}s`);
    return parts.join(' ');
  }, []);

  // ============================================================
  // API Call to generate PNG via SVG + Sharp on backend
  // ============================================================
  const generateShareImage = useCallback(async () => {
    if (!result) {
      throw new Error('Playlist result is missing.');
    }
    const response = await fetch('/api/share-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        result,
        isSchedulePage,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || 'Failed to generate share image.');
    }
    return response.blob();
  }, [result, isSchedulePage]);

  // ============================================================
  // Download PNG Card
  // ============================================================
  const handleDownloadImage = useCallback(async () => {
    if (!result || isGenerating) return;
    setIsGenerating(true);

    try {
      const blob = await generateShareImage();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `yt-playlist-${isSchedulePage ? 'schedule' : 'summary'}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [generateShareImage, isGenerating, isSchedulePage, result]);

  // ============================================================
  // Share / Copy Image
  // ============================================================
  const handleShare = useCallback(async () => {
    if (!result || isGenerating) return;
    setIsGenerating(true);
    setCopied(false);

    try {
      const blob = await generateShareImage();
      const file = new File([blob], 'yt-playlist-summary.png', {
        type: 'image/png',
      });

      // 1. Native Web Share API (Mobile / Desktop Safari)
      if (
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            title: result.title || 'YouTube Playlist Stats',
            text: `Check out my playlist stats for "${result.title}"`,
            files: [file],
          });
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') {
            return;
          }
          console.warn('Native share failed:', error);
        }
      }

      // 2. Clipboard API Copy
      if (navigator.clipboard && 'ClipboardItem' in window) {
        const ClipboardItemConstructor = window.ClipboardItem;
        await navigator.clipboard.write([
          new ClipboardItemConstructor({
            'image/png': blob,
          }),
        ]);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
        return;
      }

      // 3. Fallback Download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'yt-playlist-summary.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Share failed:', error);
      // Direct Download on failure
      try {
        const blob = await generateShareImage();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'yt-playlist-summary.png';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch (fallbackErr) {
        console.error('Fallback download failed:', fallbackErr);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [generateShareImage, isGenerating, result]);

  if (!result) return null;

  return (
    <>
      {/* Floating Bottom Pill Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xl backdrop-blur-xl border border-zinc-700/80 dark:border-zinc-300/80 rounded-full px-5 py-3 flex items-center gap-2.5 font-bold text-xs sm:text-sm cursor-pointer hover:scale-105 active:scale-95 transition-all min-h-[46px]"
        aria-label="Share Playlist Image Summary"
      >
        <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white">
          <Share2 className="h-3.5 w-3.5" />
        </div>
        <span>Share Summary Card</span>
        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 dark:text-red-600 text-[10px] font-extrabold uppercase border border-red-500/30">
          PNG
        </span>
      </button>

      {/* Share Modal & UI Preview */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-900 text-zinc-100 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white leading-tight">
                    Playlist Summary Card
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Excludes URL • Server-Rendered HD Card
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors border border-zinc-700"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* UI Preview Card */}
            <div className="overflow-x-auto p-1 flex justify-center">
              <div
                style={{
                  width: '440px',
                  maxWidth: '100%',
                  backgroundColor: '#09090b',
                  color: '#ffffff',
                  border: '1px solid #27272a',
                  borderTop: '3px solid #ef4444',
                  borderRadius: '16px',
                  padding: '22px',
                  boxSizing: 'border-box',
                  fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
                className="space-y-4 relative text-left"
              >
                {/* Brand Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white">
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </div>
                    <span className="font-extrabold text-sm text-white">
                      YT Playlist <span className="text-red-500">Calc</span>
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-red-950/80 text-red-400 border border-red-900/60 text-[10px] font-bold uppercase">
                    {isSchedulePage ? 'Schedule Plan' : 'Duration Report'}
                  </span>
                </div>

                {/* Playlist Header */}
                <div className="flex items-start gap-3">
                  {result.thumbnail && (
                    <img
                      src={result.thumbnail}
                      alt={result.title}
                      className="w-[76px] h-[54px] object-cover rounded-lg border border-zinc-800 shrink-0"
                    />
                  )}

                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-white line-clamp-2 leading-snug">
                      {result.title}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                      <span className="flex items-center gap-1 text-zinc-200">
                        <Layers className="h-3.5 w-3.5 text-red-500" />
                        {result.totalVideos} {result.totalVideos === 1 ? 'Video' : 'Videos'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-zinc-200">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        {formatTime(result.totalSeconds)} at 1x
                      </span>
                    </div>
                  </div>
                </div>

                {/* Duration or Schedule Table */}
                {!isSchedulePage ? (
                  <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800 space-y-2">
                    <div className="text-[10px] font-bold uppercase text-zinc-400 pb-1.5 border-b border-zinc-800 flex justify-between">
                      <span>Speed Factor</span>
                      <span>Total Duration (Saved)</span>
                    </div>

                    <div className="space-y-1.5">
                      {result.durationsBySpeed.map((d) => (
                        <div
                          key={d.speed}
                          className="flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-1.5 font-bold text-zinc-200">
                            <Zap className={`h-3.5 w-3.5 ${d.speed > 1 ? 'text-red-400' : 'text-zinc-500'}`} />
                            <span>{d.speed}x Speed</span>
                          </div>

                          <div className="flex items-center gap-2 text-white font-mono">
                            <span className="font-bold">{formatTime(d.seconds)}</span>
                            {d.timeSavedSeconds > 0 && (
                              <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-900/60 px-1.5 py-0.5 rounded text-[10px] font-semibold font-sans">
                                -{formatTime(d.timeSavedSeconds)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Target Speed</span>
                        <span className="font-extrabold text-sm text-red-400">1.5x Playback</span>
                      </div>
                      <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Daily Watch Goal</span>
                        <span className="font-extrabold text-sm text-amber-400">1 Hour / Day</span>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-medium">Estimated Completion</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {Math.ceil(result.totalSeconds / 1.5 / 3600)} Days
                      </span>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>yt-playlist-calculator.com</span>
                  <span>Binge Watch Planner</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50 min-h-[44px]"
              >
                <Download className="h-4 w-4" />
                <span>{isGenerating ? 'Generating HD PNG...' : 'Download PNG'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 border border-zinc-700 disabled:opacity-50 min-h-[44px]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied Image!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    <span>Share / Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}