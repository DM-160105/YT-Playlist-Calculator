'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { Play, Calculator, Calendar, Menu, X, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { usePlaylist } from "@/context/PlaylistContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function Header() {
  const pathname = usePathname();
  const { result } = usePlaylist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // GSAP animation for top-down mobile sheet entry
  useGSAP(() => {
    if (!mobileOpen) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      ".gsap-mobile-backdrop",
      { opacity: 0 },
      { opacity: 1, duration: 0.25 }
    )
      .fromTo(
        ".gsap-mobile-sheet",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35 },
        "-=0.15"
      )
      .fromTo(
        ".gsap-mobile-card",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.08 },
        "-=0.2"
      );
  }, { scope: menuContainerRef, dependencies: [mobileOpen] });

  const handleClose = () => {
    if (!menuContainerRef.current) {
      setMobileOpen(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => setMobileOpen(false),
      defaults: { ease: "power2.in" },
    });

    tl.to(".gsap-mobile-card", { opacity: 0, y: -10, duration: 0.15, stagger: 0.04 })
      .to(".gsap-mobile-sheet", { y: -20, opacity: 0, duration: 0.2 }, "-=0.1")
      .to(".gsap-mobile-backdrop", { opacity: 0, duration: 0.15 }, "-=0.15");
  };

  const navItems = [
    { 
      href: "/", 
      label: "Duration Calculator", 
      shortLabel: "Calculator", 
      icon: Calculator,
      description: "Find total watch time at 1x to 3x speeds"
    },
    { 
      href: "/schedule", 
      label: "Schedule Estimator", 
      shortLabel: "Schedule", 
      icon: Calendar, 
      badge: result ? "1 Loaded" : undefined,
      description: "Plan daily, weekly & monthly watch goals"
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-linear-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
            <Play className="h-4 w-4 fill-current ml-0.5" />
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-1">
            YT Playlist <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-rose-500 font-extrabold">Calc</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 min-h-10
                  ${isActive
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50"
                  }
                `}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-red-500' : ''}`} />
                <span>{item.shortLabel}</span>

                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-300 text-[10px] font-bold border border-red-200 dark:border-red-900/50">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Theme Toggle */}
        <div className="hidden md:flex items-center">
          <ModeToggle />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => (mobileOpen ? handleClose() : setMobileOpen(true))}
          className="md:hidden p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200/80 dark:border-zinc-700/80 flex items-center gap-2 font-medium text-xs min-h-11"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-red-500" />
          ) : (
            <Menu className="h-5 w-5 text-zinc-800 dark:text-zinc-100" />
          )}
          <span className="font-semibold text-xs">{mobileOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      {/* Mobile Header Dropdown Overlay Modal */}
      {mobileOpen && (
        <div ref={menuContainerRef}>
          {/* Dark Backdrop Overlay */}
          <div
            className="gsap-mobile-backdrop fixed inset-0 top-16 z-40 bg-black/75 dark:bg-black/85 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Solid Top Dropdown Container */}
          <div className="gsap-mobile-sheet fixed top-16 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-2xl p-4 sm:p-6 space-y-4 rounded-b-3xl">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-1 flex items-center justify-between">
              <span>Select Surface Page</span>
              <span className="text-[10px] text-red-500 font-semibold uppercase">2 Available</span>
            </div>

            {/* Navigation Cards List */}
            <div className="grid grid-cols-1 gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleClose}
                    className={`
                      gsap-mobile-card group relative p-4 rounded-2xl transition-all flex items-center justify-between border shadow-xs
                      ${isActive
                        ? "bg-red-500/10 dark:bg-red-950/40 border-red-500/40 text-zinc-900 dark:text-white ring-1 ring-red-500/20"
                        : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-850"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-3 rounded-xl ${isActive ? 'bg-linear-to-tr from-red-600 to-rose-500 text-white shadow-xs' : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'}`}>
                        <Icon className="h-5 w-5 shrink-0" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-300 text-[9px] font-bold border border-red-200 dark:border-red-900/50">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {isActive ? (
                      <CheckCircle2 className="h-5 w-5 text-red-500 shrink-0" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-zinc-400 shrink-0 transition-transform group-hover:translate-x-1" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Theme Toggle Card */}
            <div className="gsap-mobile-card pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Appearance Mode</span>
              </div>

              <div className="flex justify-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
