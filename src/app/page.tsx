'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatSecondsToHHMMSS } from '@/lib/timeUtils';
import { Header } from '@/components/header';
import Image from 'next/image';
import { usePlaylist } from '@/context/PlaylistContext';
import { 
  Loader2, 
  Clock, 
  PlaySquare, 
  AlertCircle, 
  Sparkles, 
  Copy, 
  Check, 
  X, 
  Zap, 
  Calendar,
  Film,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  BookOpen,
  CheckCircle,
} from 'lucide-react';

const SAMPLE_LINKS = [
  {
    label: 'React Tutorial Playlist',
    url: 'https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PrE9srvEn8nbhOOyxnWXfp',
  },
  {
    label: 'Short Link (youtu.be)',
    url: 'https://youtu.be/0gUwbTCQ78k?si=E1uPXu6vo9oOFGmm',
  },
  {
    label: 'Video in Playlist',
    url: 'https://www.youtube.com/watch?v=0gUwbTCQ78k&list=PL0Zuz27SZ-6PrE9srvEn8nbhOOyxnWXfp',
  },
  {
    label: 'Web Dev Course',
    url: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w',
  },
];

const FAQS = [
  {
    question: "How do I calculate the duration of a YouTube playlist?",
    answer: "Copy the link of any public YouTube playlist or video (or a short link starting with youtu.be), paste it into the calculator above, and click 'Calculate Duration'. Our tool instantly fetches all video durations and calculates total watch time across different playback speeds."
  },
  {
    question: "Can I calculate video watch times at 1.25x, 1.5x, 1.75x, 2x, or 3x speed?",
    answer: "Yes! The calculator automatically computes the total duration at 1x (normal), 1.25x, 1.5x, 1.75x, 2x, 2.5x, and 3x playback speeds, showing you exactly how many hours and minutes you save."
  },
  {
    question: "Does this YouTube playlist calculator work with short links or single videos?",
    answer: "Yes, our tool supports standard playlist links, mobile short URLs (youtu.be), YouTube Shorts, YouTube Music links, videos within playlists, and single YouTube video IDs."
  },
  {
    question: "How can I plan a daily watch schedule for long courses?",
    answer: "Use our dedicated Schedule Estimator page to set a daily watch target (such as 15m, 30m, 1h, or 2h/day). The tool generates daily, weekly, monthly, and yearly finish dates with a milestone progress roadmap."
  }
];

export default function Home() {
  const { 
    playlistInput, 
    setPlaylistInput, 
    result, 
    loading, 
    error, 
    analyzeUrl, 
    clearPlaylist 
  } = usePlaylist();

  const [localInput, setLocalInput] = useState(playlistInput);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLocalInput(playlistInput);
  }, [playlistInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeUrl(localInput);
  };

  const handleSampleClick = (url: string) => {
    setLocalInput(url);
    analyzeUrl(url);
  };

  const copySummary = () => {
    if (!result) return;
    const double = result.durationsBySpeed.find((d) => d.speed === 2);
    
    const text = `📺 ${result.title}
📹 Videos: ${result.totalVideos}
⏱ Total Duration (1x): ${formatSecondsToHHMMSS(result.totalSeconds)}
⚡ At 2x Speed: ${double ? formatSecondsToHHMMSS(double.seconds) : ''}
Calculated via YT Playlist Calculator`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatVerboseTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(' ');
  };

  const getDaysToComplete = (totalSeconds: number, dailyMinutes: number) => {
    const dailySeconds = dailyMinutes * 60;
    return Math.ceil(totalSeconds / dailySeconds);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-12 space-y-8 sm:space-y-12">
        {/* Hero Banner */}
        <section className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            YouTube Playlist & Video Duration Calculator
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-zinc-900 dark:text-white">
            Calculate YouTube Playlist Length <br className="hidden sm:inline" />
            at <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 via-rose-500 to-amber-500">any speed</span>
          </h1>

          <p className="text-sm sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Paste any YouTube playlist link, short URL (<code className="text-xs bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-800 dark:text-zinc-200 font-mono">youtu.be</code>), or video link to see total watch time and calculate time saved.
          </p>
        </section>

        {/* Input Card */}
        <section className="bg-white dark:bg-zinc-900/90 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200/90 dark:border-zinc-800 p-4 sm:p-8 space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-bottom-8">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-red-500 to-amber-500 rounded-xl blur-xs opacity-20 group-hover:opacity-40 transition duration-300"></div>
              
              <div className="relative flex items-center bg-white dark:bg-zinc-950 rounded-xl border border-zinc-300 dark:border-zinc-800 focus-within:border-red-500 dark:focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 shadow-xs overflow-hidden transition-all">
                <input
                  type="text"
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  placeholder="Paste YouTube playlist URL, short link (youtu.be), or video ID..."
                  className="w-full px-3.5 sm:px-5 py-3.5 sm:py-4 bg-transparent outline-hidden text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm sm:text-lg min-h-[48px]"
                  disabled={loading}
                  aria-label="YouTube playlist or video URL"
                />
                
                {localInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalInput('');
                      clearPlaylist();
                    }}
                    className="p-2 mr-1 sm:mr-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg transition-colors shrink-0"
                    title="Clear input"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <button
                type="submit"
                disabled={loading || !localInput.trim()}
                className="flex-1 bg-linear-to-r from-red-600 to-rose-600 text-white font-bold text-base sm:text-lg py-3.5 sm:py-4 rounded-xl hover:from-red-500 hover:to-rose-500 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-red-600 disabled:hover:to-rose-600 flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 min-h-[48px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Analyzing YouTube Link...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Calculate Duration
                  </>
                )}
              </button>

              {result && (
                <button
                  type="button"
                  onClick={clearPlaylist}
                  className="px-4 py-3.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-sm sm:text-base rounded-xl transition-colors flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 min-h-[48px]"
                  title="Check another playlist"
                >
                  <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Check Another</span>
                </button>
              )}
            </div>
          </form>

          {/* Quick Try Sample Chips */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mr-1 w-full sm:w-auto">
              Try Sample:
            </span>
            {SAMPLE_LINKS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSampleClick(sample.url)}
                disabled={loading}
                className="text-xs px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors font-medium border border-zinc-200/60 dark:border-zinc-700/50"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-300 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-sm">Unable to calculate</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}
        </section>

        {/* Results Section */}
        {result && (
          <section className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-12">
            {/* Header Summary Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200/90 dark:border-zinc-800 overflow-hidden">
              <div className="p-4 sm:p-8 flex flex-col md:flex-row gap-5 sm:gap-6 items-start md:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center w-full md:w-auto">
                  {result.thumbnail ? (
                    <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden shadow-md shrink-0 bg-zinc-100 dark:bg-zinc-800">
                      <Image
                        src={result.thumbnail}
                        alt={result.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full sm:w-48 aspect-video rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <Film className="h-8 w-8" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold">
                      {result.isSingleVideo ? 'Single Video' : 'Playlist Details'}
                    </div>

                    <h2 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
                      {result.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-medium">
                      <div className="flex items-center gap-1.5">
                        <PlaySquare className="h-4 w-4 text-red-500 shrink-0" />
                        <span>{result.totalVideos} {result.totalVideos === 1 ? 'video' : 'videos'}</span>
                      </div>

                      {result.totalVideos > 1 && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                          <span>
                            Avg. {formatSecondsToHHMMSS(Math.round(result.totalSeconds / result.totalVideos))} / video
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-row items-center gap-2.5 sm:gap-3 w-full md:w-auto">
                  <button
                    onClick={copySummary}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 border border-zinc-200/80 dark:border-zinc-700/80 shrink-0 min-h-[44px]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>

                  <Link
                    href="/schedule"
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-red-500/20 shrink-0 min-h-[44px]"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>View Schedule Estimator</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Speed Matrix Cards */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500 shrink-0" />
                  Playback Speed Breakdown
                </h3>
                <span className="text-[11px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Select speed to calculate savings
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {result.durationsBySpeed.map((item) => {
                  const isNormal = item.speed === 1;
                  return (
                    <div
                      key={item.speed}
                      className={`
                        relative overflow-hidden rounded-2xl p-4 sm:p-6 transition-all duration-300 border flex flex-col justify-between gap-4
                        ${isNormal
                          ? 'bg-linear-to-br from-zinc-900 to-zinc-800 text-white dark:from-zinc-100 dark:to-zinc-200 dark:text-zinc-950 border-transparent shadow-xl ring-2 ring-red-500/30'
                          : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-lg sm:text-xl font-black ${isNormal ? '' : 'text-zinc-900 dark:text-white'}`}>
                          {item.speed}x
                        </span>

                        {isNormal ? (
                          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/20 dark:bg-black/10 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                            Normal Speed
                          </span>
                        ) : (
                          item.timeSavedSeconds > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-full text-[10px] sm:text-xs font-bold border border-emerald-200/60 dark:border-emerald-800/60">
                              <Zap className="h-3 w-3 shrink-0" />
                              Saves {formatVerboseTime(item.timeSavedSeconds)}
                            </span>
                          )
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className={`text-2xl sm:text-4xl font-mono font-bold tracking-tight ${isNormal ? '' : 'text-zinc-900 dark:text-zinc-100'}`}>
                          {formatSecondsToHHMMSS(item.seconds)}
                        </div>
                        <p className={`text-[11px] sm:text-xs font-medium ${isNormal ? 'opacity-80' : 'text-zinc-500 dark:text-zinc-400'}`}>
                          Total duration ({formatVerboseTime(item.seconds)})
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Watch Schedule Estimator Preview */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200/80 dark:border-zinc-800 p-4 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-red-500 shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                    Quick Daily Watch Preview
                  </h3>
                </div>

                <Link
                  href="/schedule"
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  Full Schedule Estimator
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {[15, 30, 60, 120].map((mins) => {
                  const days = getDaysToComplete(result.totalSeconds, mins);
                  return (
                    <div
                      key={mins}
                      className="p-3 sm:p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800/80 text-center space-y-0.5 sm:space-y-1"
                    >
                      <div className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white font-mono">
                        {days} {days === 1 ? 'day' : 'days'}
                      </div>
                      <div className="text-[11px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        @ {mins >= 60 ? `${mins / 60} hr/day` : `${mins} mins/day`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* SEO Informational & Content Section */}
        <section className="border-t border-zinc-200/80 dark:border-zinc-800/80 pt-8 sm:pt-12 space-y-8 sm:space-y-12">
          {/* Informational Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <article className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5 sm:space-y-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                How to Calculate Playlist Length
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Paste any public YouTube playlist URL or short link above. Our tool queries YouTube Data API v3 to aggregate all video durations and sum total seconds instantly.
              </p>
            </article>

            <article className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5 sm:space-y-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                Speed Time Savings Analysis
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Watching a 10-hour tutorial course at 1.5x speed saves 3 hours and 20 minutes! Increase to 2x speed to finish in just 5 hours.
              </p>
            </article>

            <article className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5 sm:space-y-3 sm:col-span-2 lg:col-span-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                Custom Schedule Estimator
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Use our Schedule Estimator to set daily watch goals and calculate exact projected finish dates with milestone completion roadmaps.
              </p>
            </article>
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 space-y-4 sm:space-y-6">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                <HelpCircle className="h-3.5 w-3.5 text-red-500" />
                Frequently Asked Questions
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                YouTube Playlist Calculator FAQ
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="space-y-1.5 sm:space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5 sm:mt-1" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 py-6 sm:py-8 text-center text-xs text-zinc-500 dark:text-zinc-400 space-y-1.5 px-4">
        <p className="font-semibold">YT Playlist Calculator • Free YouTube Playlist Duration & Speed Calculator</p>
        <p className="opacity-80">Not affiliated with YouTube or Google LLC.</p>
      </footer>
    </div>
  );
}
