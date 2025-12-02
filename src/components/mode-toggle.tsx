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
    return <div className="w-9 h-9" /> // Placeholder to prevent layout shift
  }

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-full transition-all ${
          theme === "light" 
            ? "bg-white text-yellow-500 shadow-sm" 
            : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
        }`}
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-full transition-all ${
          theme === "system" 
            ? "bg-white dark:bg-gray-700 text-blue-500 shadow-sm" 
            : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
        }`}
        aria-label="System mode"
      >
        <Laptop className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-full transition-all ${
          theme === "dark" 
            ? "bg-gray-700 text-blue-400 shadow-sm" 
            : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  )
}
