"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 bg-zinc-200/60 dark:bg-zinc-800/60 p-1 rounded-full border border-zinc-200 dark:border-zinc-700/80 w-28 h-9" />
    )
  }

  const options = [
    { name: "light", icon: Sun, label: "Light mode" },
    { name: "system", icon: Laptop, label: "System mode" },
    { name: "dark", icon: Moon, label: "Dark mode" },
  ] as const;

  return (
    <div 
      className="flex items-center gap-0.5 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-full border border-zinc-300/80 dark:border-zinc-700/60 shadow-inner"
      role="group"
      aria-label="Theme preference selector"
    >
      {options.map((opt) => {
        const Icon = opt.icon
        const isActive = theme === opt.name
        return (
          <button
            key={opt.name}
            onClick={() => setTheme(opt.name)}
            title={opt.label}
            className={`
              relative p-1.5 rounded-full transition-all duration-200 flex items-center justify-center
              ${isActive 
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold scale-105" 
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }
            `}
            aria-label={opt.label}
            aria-pressed={isActive}
          >
            <Icon className={`h-4 w-4 ${isActive && opt.name === 'light' ? 'text-amber-500' : ''} ${isActive && opt.name === 'dark' ? 'text-indigo-400' : ''} ${isActive && opt.name === 'system' ? 'text-rose-500' : ''}`} />
            <span className="sr-only">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
