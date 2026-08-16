'use client';

import { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { usePlaylist } from '@/context/PlaylistContext';
import { formatSecondsToHHMMSS } from '@/lib/timeUtils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  PlaySquare, 
  Zap, 
  Sparkles, 
  ArrowLeft, 
  RefreshCw, 
  X, 
  Loader2, 
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Flag,
  Award,
  Sun,
  Flame
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SPEEDS = [1, 1.25, 1.5, 1.75, 2, 2.5, 3];

const DAILY_PRESETS = [
  { label: '15m/day', fullLabel: '15 mins/day', minutes: 15 },
  { label: '30m/day', fullLabel: '30 mins/day', minutes: 30 },
  { label: '45m/day', fullLabel: '45 mins/day', minutes: 45 },
  { label: '1h/day', fullLabel: '1 hr/day', minutes: 60 },
  { label: '1.5h/day', fullLabel: '1.5 hrs/day', minutes: 90 },
  { label: '2h/day', fullLabel: '2 hrs/day', minutes: 120 },
  { label: '3h/day', fullLabel: '3 hrs/day', minutes: 180 },
];

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
    label: 'Web Dev Course',
    url: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w',
  },
];

export default function SchedulePage() {
  const { 
    playlistInput, 
    result, 
    loading, 
    error, 
    analyzeUrl, 
    clearPlaylist 
  } = usePlaylist();

  const [selectedSpeed, setSelectedSpeed] = useState<number>(1);
  const [dailyMinutes, setDailyMinutes] = useState<number>(30);
  const [showInputModal, setShowInputModal] = useState<boolean>(!result);
  const [newUrlInput, setNewUrlInput] = useState<string>(playlistInput);

  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP animation hook
  useGSAP(() => {
    if (!result) return;

    // Animate stats cards entry
    gsap.from('.gsap-stat-card', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
    });

    // Animate timeline milestone items
    gsap.from('.gsap-timeline-item', {
      opacity: 0,
      x: -20,
      duration: 0.5,
      stagger: 0.12,
      scrollTrigger: {
        trigger: '.gsap-timeline-container',
        start: 'top 85%',
      },
    });
  }, { scope: containerRef, dependencies: [result, selectedSpeed, dailyMinutes] });

  const handleFetchNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrlInput.trim()) return;
    await analyzeUrl(newUrlInput);
    setShowInputModal(false);
  };

  const handleSampleClick = async (url: string) => {
    setNewUrlInput(url);
    await analyzeUrl(url);
    setShowInputModal(false);
  };

  // Accurate re-calculations
  const calculations = useMemo(() => {
    if (!result) return null;

    const baseSeconds = result.totalSeconds;
    const effectiveSeconds = Math.ceil(baseSeconds / selectedSpeed);
    const timeSavedSeconds = Math.max(0, baseSeconds - effectiveSeconds);

    const dailySeconds = dailyMinutes * 60;
    const totalDays = Math.ceil(effectiveSeconds / dailySeconds);
    const totalWeeks = Number((totalDays / 7).toFixed(1));
    const totalMonths = Number((totalDays / 30.4375).toFixed(1));

    // Finish date calculation
    const today = new Date();
    const finishDate = new Date(today);
    finishDate.setDate(today.getDate() + totalDays);

    const formatDate = (d: Date) =>
      d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

    // Milestone completion dates (25%, 50%, 75%, 100%)
    const milestones = [25, 50, 75, 100].map((pct) => {
      const daysOffset = Math.ceil((totalDays * pct) / 100);
      const milestoneDate = new Date(today);
      milestoneDate.setDate(today.getDate() + daysOffset);

      const secondsForMilestone = (effectiveSeconds * pct) / 100;
      return {
        percentage: pct,
        dateStr: formatDate(milestoneDate),
        days: daysOffset,
        formattedTime: formatSecondsToHHMMSS(Math.round(secondsForMilestone)),
      };
    });

    const weeklyHours = Number(((dailyMinutes * 7) / 60).toFixed(1));
    const monthlyHours = Number(((dailyMinutes * 30.4375) / 60).toFixed(1));

    return {
      effectiveSeconds,
      timeSavedSeconds,
      totalDays,
      totalWeeks,
      totalMonths,
      finishDateStr: formatDate(finishDate),
      weeklyHours,
      monthlyHours,
      milestones,
    };
  }, [result, selectedSpeed, dailyMinutes]);

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

  return (
    <div ref={containerRef} className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-12 space-y-6 sm:space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-2 text-zinc-900 dark:text-white">
              <CalendarIcon className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 shrink-0" />
              Playlist Schedule Estimator
            </h1>
          </div>

          {result && (
            <button
              onClick={() => setShowInputModal(!showInputModal)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-semibold transition-colors border border-zinc-300/80 dark:border-zinc-700/80 shrink-0 min-h-[44px]"
            >
              <RefreshCw className="h-4 w-4" />
              <span>{showInputModal ? 'Close Switcher' : 'Paste Another Playlist'}</span>
            </button>
          )}
        </div>

        {/* Input Switcher (Collapsible / Modal) */}
        {(showInputModal || !result) && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-8 space-y-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-red-500 shrink-0" />
                {result ? 'Switch to Another Playlist' : 'Enter YouTube Link to Estimate Schedule'}
              </h2>
              {result && (
                <button
                  onClick={() => setShowInputModal(false)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <form onSubmit={handleFetchNew} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <input
                type="text"
                value={newUrlInput}
                onChange={(e) => setNewUrlInput(e.target.value)}
                placeholder="Paste YouTube playlist URL, short link (youtu.be), or video ID..."
                className="flex-1 px-3.5 sm:px-4 py-3 sm:py-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-300 dark:border-zinc-800 focus:border-red-500 outline-hidden text-sm sm:text-base text-zinc-900 dark:text-zinc-100 min-h-[48px]"
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading || !newUrlInput.trim()}
                className="px-5 py-3 sm:py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-md min-h-[48px]"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Calculate Schedule'}
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1 w-full sm:w-auto">
                Try Sample:
              </span>
              {SAMPLE_LINKS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleClick(s.url)}
                  disabled={loading}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 rounded-xl flex items-center gap-2 text-xs sm:text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Content Display when Playlist Data Loaded */}
        {result && calculations && (
          <div className="space-y-6 sm:space-y-8">
            {/* Playlist Info Banner */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                {result.thumbnail && (
                  <div className="relative w-20 sm:w-24 aspect-video rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 shadow-xs">
                    <Image
                      src={result.thumbnail}
                      alt={result.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                <div>
                  <h2 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-white leading-snug">
                    {result.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                    <span className="flex items-center gap-1">
                      <PlaySquare className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      {result.totalVideos} {result.totalVideos === 1 ? 'video' : 'videos'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      Base 1x: {formatSecondsToHHMMSS(result.totalSeconds)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reset/Switch Playlist quick link */}
              <button
                onClick={clearPlaylist}
                className="text-xs font-semibold text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1 shrink-0 self-end sm:self-auto"
              >
                <X className="h-3.5 w-3.5" />
                Clear Selection
              </button>
            </div>

            {/* Controls Bar: Playback Speed & Daily Commitment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800 shadow-md">
              {/* Speed Selector */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                    1. Playback Speed
                  </label>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 font-mono">
                    {selectedSpeed}x Speed
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-1 sm:gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSpeed(s)}
                      className={`
                        py-2 sm:px-3 rounded-lg text-xs font-black transition-all duration-200 min-h-[36px]
                        ${selectedSpeed === s
                          ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs scale-102'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                        }
                      `}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Commitment Selector */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Sun className="h-4 w-4 text-orange-500 shrink-0" />
                    2. Daily Watch Goal
                  </label>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 font-mono">
                    {dailyMinutes >= 60 ? `${(dailyMinutes / 60).toFixed(1)} hrs/day` : `${dailyMinutes} mins/day`}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {DAILY_PRESETS.map((preset) => (
                    <button
                      key={preset.minutes}
                      onClick={() => setDailyMinutes(preset.minutes)}
                      className={`
                        px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold transition-all border min-h-[36px]
                        ${dailyMinutes === preset.minutes
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs font-bold scale-102'
                          : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                        }
                      `}
                    >
                      <span className="hidden sm:inline">{preset.fullLabel}</span>
                      <span className="inline sm:hidden">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4 Frequency Schedule Cards (Daily, Weekly, Monthly, Yearly) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Daily Schedule Card */}
              <div className="gsap-stat-card bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 border border-zinc-200 dark:border-zinc-800 shadow-md flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-orange-500 shrink-0" />
                    Daily Schedule
                  </span>
                  <span className="text-xs font-mono font-semibold">1 Day</span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-zinc-900 dark:text-white">
                    {calculations.totalDays} <span className="text-sm sm:text-base font-normal text-zinc-500">days</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    At {dailyMinutes} mins/day @ {selectedSpeed}x speed
                  </p>
                </div>
              </div>

              {/* Weekly Schedule Card */}
              <div className="gsap-stat-card bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 border border-zinc-200 dark:border-zinc-800 shadow-md flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-indigo-500 shrink-0" />
                    Weekly Pace
                  </span>
                  <span className="text-xs font-mono font-semibold">7 Days</span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-zinc-900 dark:text-white">
                    {calculations.totalWeeks} <span className="text-sm sm:text-base font-normal text-zinc-500">weeks</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {calculations.weeklyHours} hours watch time / week
                  </p>
                </div>
              </div>

              {/* Monthly Schedule Card */}
              <div className="gsap-stat-card bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 border border-zinc-200 dark:border-zinc-800 shadow-md flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                    Monthly Pace
                  </span>
                  <span className="text-xs font-mono font-semibold">30 Days</span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-zinc-900 dark:text-white">
                    {calculations.totalMonths} <span className="text-sm sm:text-base font-normal text-zinc-500">months</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {calculations.monthlyHours} hours watch time / month
                  </p>
                </div>
              </div>

              {/* Yearly Projected Finish Date Card */}
              <div className="gsap-stat-card bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 text-white rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="h-4 w-4 shrink-0" />
                    Projected Finish
                  </span>
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">
                    Target Date
                  </span>
                </div>

                <div>
                  <div className="text-lg sm:text-2xl font-black leading-tight">
                    {calculations.finishDateStr}
                  </div>
                  <p className="text-[11px] sm:text-xs opacity-90 mt-0.5">
                    {calculations.timeSavedSeconds > 0
                      ? `⚡ Saves ${formatVerboseTime(calculations.timeSavedSeconds)}!`
                      : 'At standard 1x playback speed'}
                  </p>
                </div>
              </div>
            </div>

            {/* GSAP Animated Milestone Roadmap Timeline */}
            <div className="gsap-timeline-container bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Flag className="h-5 w-5 text-red-500 shrink-0" />
                    Completion Milestone Roadmap
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Estimated progress checkpoints based on {dailyMinutes} mins/day at {selectedSpeed}x speed:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {calculations.milestones.map((m) => (
                  <div
                    key={m.percentage}
                    className="gsap-timeline-item relative p-4 sm:p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2.5 sm:space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                        {m.percentage}% Complete
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    </div>

                    <div>
                      <div className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                        {m.dateStr}
                      </div>
                      <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Day {m.days} ({m.formattedTime} watched)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p>YT Playlist Calculator • Schedule Estimator Page</p>
      </footer>
    </div>
  );
}
