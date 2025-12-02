'use client';

import { useState } from 'react';
import { formatSecondsToHHMMSS } from '@/lib/timeUtils';
import { Header } from '@/components/header';
import Image from 'next/image';
import { Loader2, Clock, PlaySquare, AlertCircle } from 'lucide-react';

interface DurationResult {
  speed: number;
  seconds: number;
}

interface PlaylistResult {
  title: string;
  thumbnail: string;
  totalVideos: number;
  totalSeconds: number;
  durationsBySpeed: DurationResult[];
}

export default function Home() {
  const [playlistInput, setPlaylistInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlaylistResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistInput.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlistInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch playlist data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-3xl space-y-8">
          
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Playlist <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Calculator</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Find out exactly how long it takes to binge-watch your favorite YouTube playlists at any speed.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative">
                  <input
                    type="text"
                    value={playlistInput}
                    onChange={(e) => setPlaylistInput(e.target.value)}
                    placeholder="Paste YouTube playlist URL or ID..."
                    className="w-full px-6 py-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 focus:border-red-500 dark:focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/20 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 text-lg shadow-sm"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading || !playlistInput.trim()}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-6 w-6" />
                    Analyzing Playlist...
                  </>
                ) : (
                  'Calculate Duration'
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}
          </div>

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
              {/* Playlist Summary Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  {result.thumbnail && (
                    <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden shadow-md flex-shrink-0 group">
                      <Image 
                        src={result.thumbnail} 
                        alt={result.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="space-y-2 flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                      {result.title}
                    </h2>
                    <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
                      <div className="flex items-center gap-1.5">
                        <PlaySquare className="h-4 w-4" />
                        {result.totalVideos} videos
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        Avg. {formatSecondsToHHMMSS(Math.round(result.totalSeconds / result.totalVideos))} / video
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Speed Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.durationsBySpeed.map((item) => (
                  <div 
                    key={item.speed}
                    className={`
                      relative overflow-hidden rounded-xl p-6 transition-all duration-300
                      ${item.speed === 1 
                        ? 'bg-gradient-to-br from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 shadow-xl scale-[1.02] ring-1 ring-black/5' 
                        : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="flex flex-col h-full justify-between gap-4">
                      <div className="flex items-center justify-between">
                        <span className={`text-lg font-bold ${item.speed === 1 ? 'opacity-100' : 'text-gray-900 dark:text-white'}`}>
                          {item.speed}x
                        </span>
                        {item.speed === 1 && (
                          <span className="px-2 py-1 bg-white/20 dark:bg-black/10 rounded text-xs font-bold uppercase tracking-wider">
                            Normal
                          </span>
                        )}
                      </div>
                      <div className={`text-3xl font-mono font-bold tracking-tight ${item.speed === 1 ? '' : 'text-gray-600 dark:text-gray-300'}`}>
                        {formatSecondsToHHMMSS(item.seconds)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
