import { ModeToggle } from "./mode-toggle"
import { PlayCircle } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlayCircle className="h-6 w-6 text-red-600" />
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
            YT Playlist Calculator
          </span>
        </div>
        <ModeToggle />
      </div>
    </header>
  )
}
