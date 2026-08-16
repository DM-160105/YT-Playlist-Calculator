'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { formatSecondsToHHMMSS } from '@/lib/timeUtils';
import { 
  Zap, 
  Clock, 
  ArrowRight, 
  Calculator, 
  CheckCircle2, 
  Sparkles, 
  Info,
  TrendingDown
} from 'lucide-react';

const COMMON_DURATIONS = [
  { label: '15 Minutes', seconds: 15 * 60 },
  { label: '30 Minutes', seconds: 30 * 60 },
  { label: '1 Hour', seconds: 60 * 60 },
  { label: '2 Hours', seconds: 2 * 60 * 60 },
  { label: '5 Hours', seconds: 5 * 60 * 60 },
  { label: '10 Hours', seconds: 10 * 60 * 60 },
  { label: '25 Hours', seconds: 25 * 60 * 60 },
  { label: '50 Hours', seconds: 50 * 60 * 60 },
];

const SPEEDS = [1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 3.0];

export default function SpeedCalculatorPage() {
  const [customHours, setCustomHours] = useState<number>(1);
  const [customMinutes, setCustomMinutes] = useState<number>(30);
  const [selectedSpeed, setSelectedSpeed] = useState<number>(1.5);

  const totalInputSeconds = (customHours * 3600) + (customMinutes * 60);
  const effectiveSeconds = Math.round(totalInputSeconds / selectedSpeed);
  const timeSavedSeconds = Math.max(0, totalInputSeconds - effectiveSeconds);

  const formatVerbose = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(' ');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-14">
        {/* Header Section */}
        <section className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 text-xs font-semibold tracking-wide uppercase">
            <Zap className="h-3.5 w-3.5" />
            Speed & Time Savings Matrix
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-zinc-900 dark:text-white">
            YouTube Video Speed <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-500 via-rose-500 to-red-600">
              Time Saved Calculator
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Instantly compute how much time you save when speeding up videos and playlists from 1.25x to 3x playback speed.
          </p>
        </section>

        {/* Interactive Speed Converter Tool */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-amber-500" />
              Quick Video Time Estimator
            </h2>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Custom Duration Converter
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Input Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  Enter Original Video Length
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-400 font-medium">Hours</span>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={customHours}
                      onChange={(e) => setCustomHours(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-300 dark:border-zinc-800 font-mono text-base font-bold text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-400 font-medium">Minutes</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-300 dark:border-zinc-800 font-mono text-base font-bold text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  Select Playback Speed
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSpeed(s)}
                      className={`
                        py-2 rounded-xl text-xs font-black transition-all border
                        ${selectedSpeed === s
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm scale-102'
                          : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                        }
                      `}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Output Result Banner */}
            <div className="p-6 rounded-2xl bg-linear-to-br from-amber-500 via-rose-500 to-red-600 text-white space-y-4 shadow-lg">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-90">
                <span>Calculated Output</span>
                <span>@{selectedSpeed}x Speed</span>
              </div>

              <div className="space-y-1">
                <span className="text-xs opacity-80 font-medium">New Watch Time:</span>
                <div className="text-3xl sm:text-4xl font-mono font-black tracking-tight">
                  {formatSecondsToHHMMSS(effectiveSeconds)}
                </div>
                <div className="text-xs opacity-90">
                  {formatVerbose(effectiveSeconds)} total
                </div>
              </div>

              <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] opacity-80 font-medium block">Time Saved:</span>
                  <span className="text-base sm:text-lg font-bold font-mono">
                    {formatVerbose(timeSavedSeconds)}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-bold">
                  {Math.round((timeSavedSeconds / (totalInputSeconds || 1)) * 100)}% Faster
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Common Time Savings Reference Table */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-8 border border-zinc-200 dark:border-zinc-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
              Playback Speed Time Savings Lookup Matrix
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Reference chart for common video and playlist lengths across popular playback speeds:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Original Length (1x)</th>
                  <th className="py-3 px-3">1.25x Speed</th>
                  <th className="py-3 px-3">1.5x Speed</th>
                  <th className="py-3 px-3">1.75x Speed</th>
                  <th className="py-3 px-3 font-bold text-amber-500">2x Speed</th>
                  <th className="py-3 px-3 text-red-500">Time Saved at 2x</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono">
                {COMMON_DURATIONS.map((row) => {
                  const s125 = Math.round(row.seconds / 1.25);
                  const s15 = Math.round(row.seconds / 1.5);
                  const s175 = Math.round(row.seconds / 1.75);
                  const s20 = Math.round(row.seconds / 2.0);
                  const saved20 = row.seconds - s20;

                  return (
                    <tr key={row.label} className="hover:bg-zinc-50 dark:hover:bg-zinc-850/50 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-zinc-900 dark:text-zinc-100 font-sans">
                        {row.label}
                      </td>
                      <td className="py-3.5 px-3 text-zinc-600 dark:text-zinc-400">
                        {formatSecondsToHHMMSS(s125)}
                      </td>
                      <td className="py-3.5 px-3 text-zinc-600 dark:text-zinc-400">
                        {formatSecondsToHHMMSS(s15)}
                      </td>
                      <td className="py-3.5 px-3 text-zinc-600 dark:text-zinc-400">
                        {formatSecondsToHHMMSS(s175)}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-amber-600 dark:text-amber-400">
                        {formatSecondsToHHMMSS(s20)}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                        -{formatSecondsToHHMMSS(saved20)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Speed Formula & Learning Tips */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Info className="h-5 w-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
              Playback Speed Math Formula
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              To calculate adjusted duration at any playback speed, divide the total duration in seconds by the speed multiplier:
            </p>
            <div className="p-3 bg-zinc-100 dark:bg-zinc-950 rounded-xl font-mono text-xs text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800">
              Adjusted Duration = Total Seconds / Speed
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
              <TrendingDown className="h-5 w-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
              Recommended Speeds by Content
            </h3>
            <ul className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5 font-sans">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span><strong>1.25x:</strong> Best for technical coding & math courses.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span><strong>1.50x:</strong> Ideal sweet spot for conversational podcasts.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span><strong>2.00x:</strong> Excellent for video reviews and known concepts.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA to Full Playlist Duration Calculator */}
        <section className="text-center p-8 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
            Have a YouTube Playlist to Calculate?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
            Paste any YouTube playlist link into our main calculator to instantly compute durations across all speeds.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md transition-all"
          >
            Go to Playlist Calculator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p>YT Playlist Calculator • Playback Speed & Time Saved Matrix</p>
      </footer>
    </div>
  );
}
