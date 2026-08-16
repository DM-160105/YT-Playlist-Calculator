import Link from 'next/link';
import { Header } from '@/components/header';
import { 
  BookOpen, 
  Clock, 
  Zap, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  Sparkles,
  Layers,
  Search
} from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12">
        {/* Article Header */}
        <header className="space-y-4 text-center sm:text-left border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold tracking-wide uppercase">
            <BookOpen className="h-3.5 w-3.5" />
            Complete Guide & Best Practices
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
            How to Calculate YouTube Playlist Length & Optimize Watch Time
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Everything you need to know about calculating YouTube playlist lengths, planning course completion milestones, and saving hours with playback speed optimization.
          </p>
        </header>

        {/* Article Body */}
        <article className="prose dark:prose-invert max-w-none space-y-8 text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
              <Search className="h-6 w-6 text-red-500 shrink-0" />
              1. Why YouTube Doesn&apos;t Show Total Playlist Duration
            </h2>
            <p>
              By default, YouTube displays the total number of videos in a playlist but does not sum up the total hours, minutes, and seconds. If you are preparing to study a 50-video coding course or binge a video essay series, estimating the total commitment manually is tedious.
            </p>
            <p>
              Our <Link href="/" className="text-red-600 dark:text-red-400 font-bold hover:underline">YouTube Playlist Calculator</Link> solves this problem by directly fetching the metadata for each video via the official YouTube Data API v3 and aggregating the total duration in seconds.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
              <Zap className="h-6 w-6 text-amber-500 shrink-0" />
              2. How Playback Speeds Reduce Total Watch Time
            </h2>
            <p>
              Modern video players allow playback speeds ranging from 0.25x up to 3x. Increasing the playback speed compresses the duration proportionally without losing audio pitch.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
                <div className="text-xl font-black text-amber-500 font-mono">1.25x Speed</div>
                <div className="text-xs text-zinc-500 mt-1">20% Time Saved</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
                <div className="text-xl font-black text-amber-500 font-mono">1.50x Speed</div>
                <div className="text-xs text-zinc-500 mt-1">33.3% Time Saved</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
                <div className="text-xl font-black text-amber-500 font-mono">2.00x Speed</div>
                <div className="text-xs text-zinc-500 mt-1">50% Time Saved</div>
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Check our <Link href="/speed-calculator" className="text-red-600 dark:text-red-400 font-semibold hover:underline">Speed & Time-Saved Matrix</Link> to view detailed conversions for any custom length.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
              <Calendar className="h-6 w-6 text-emerald-500 shrink-0" />
              3. Structuring a Daily Study Schedule
            </h2>
            <p>
              Consistency is key when finishing long educational playlists. When embarking on a 30-hour course, divide the total commitment into daily blocks:
            </p>
            <ul className="space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-1" />
                <span><strong>Micro-Sessions (15–30 mins/day):</strong> Ideal for busy professionals looking to build steady daily momentum.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-1" />
                <span><strong>Focused Study (1 hr/day):</strong> The standard pace for bootcamp students and self-taught developers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-1" />
                <span><strong>Intensive Sprint (2–3 hrs/day):</strong> Fast-track learning to complete a full 40-hour curriculum in under 3 weeks.</span>
              </li>
            </ul>

            <p>
              You can generate an automated breakdown of your course with our <Link href="/schedule" className="text-red-600 dark:text-red-400 font-bold hover:underline">Schedule Estimator</Link>.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
              <Layers className="h-6 w-6 text-indigo-500 shrink-0" />
              4. Supported URL Formats
            </h2>
            <p>Our tool supports all popular YouTube link structures:</p>
            <div className="space-y-2">
              <code className="block p-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-xs font-mono text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800">
                https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PrE9srvEn8nbhOOyxnWXfp
              </code>
              <code className="block p-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-xs font-mono text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800">
                https://youtu.be/0gUwbTCQ78k?si=E1uPXu6vo9oOFGmm
              </code>
              <code className="block p-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-xs font-mono text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800">
                https://www.youtube.com/watch?v=0gUwbTCQ78k&list=PL0Zuz27SZ-6...
              </code>
            </div>
          </section>
        </article>

        {/* Bottom CTA Box */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black">
            Calculate Your YouTube Playlist Length Now
          </h2>
          <p className="text-sm opacity-90 max-w-md mx-auto">
            Try our instant duration calculator and plan your watch schedule with milestone roadmap tracking.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-900 font-extrabold text-sm shadow-md hover:bg-zinc-100 transition-colors"
          >
            Launch Calculator
            <ArrowRight className="h-4 w-4 text-red-600" />
          </Link>
        </div>
      </main>

      <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p>YT Playlist Calculator • Educational Guide</p>
      </footer>
    </div>
  );
}
