# 📺 YouTube Playlist Duration & Schedule Calculator

[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-v1.3.14-fbf0df?logo=bun)](https://bun.sh/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A high-performance web application built with **Next.js 16 (App Router + Turbopack)** designed to calculate YouTube playlist lengths, multi-speed watch times (1x to 3x), custom daily finish date schedules, and generate server-rendered PNG share cards for social media.

---

## 🚀 Key Features

- ⚡ **Universal YouTube Link Support**: Parses standard playlist links, short links (`youtu.be`), Shorts, embeds, videos within playlists, and raw IDs.
- ⏱️ **Multi-Speed Duration Matrix**: Calculates total watch time and exact time saved across **1x, 1.25x, 1.5x, 1.75x, 2x, 2.5x, and 3x** playback speeds.
- 📅 **Schedule Estimator & Finish Date Roadmap**: Set custom daily watch targets (`15m`, `30m`, `1h`, `2h`, `4h`) to receive exact estimated finish dates.
- 🖼️ **Dynamic Social Share Card Generator**: Generates high-resolution 880px PNG summary cards on demand via `/api/share-card` using `sharp`.
- 🚀 **High-Speed API Caching & Concurrent Execution**: Features an in-memory 1-hour LRU cache and `Promise.all` chunking for **0ms response latency** on repeated lookups.
- 🌙 **Dark & Light Mode**: Fluid Theme Toggle supported via `next-themes` and Tailwind CSS v4.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Next.js** | `16.3.1` | App Router framework with Turbopack & package import optimization |
| **React** | `19.2.8` | UI Component rendering engine |
| **TypeScript** | `7.0.2` | End-to-end type safety |
| **Tailwind CSS** | `^4.0` | Modern utility-first styling |
| **Lucide React** | `1.31.0` | Consistent UI icon system |
| **Sharp** | `^0.35` | Server-side SVG to PNG image rendering |
| **YouTube Data API** | `v3` | Metadata & video duration extraction |

---

## 📁 Project Structure

```text
YT-Playlist-Calculator/
├── docs/                             # Diataxis Documentation Suite
│   ├── tutorials/getting-started.md  # Step-by-step setup tutorial
│   ├── how-to/calculate-watch-schedules.md # Schedule calculation guide
│   ├── reference/api-and-architecture.md   # Complete API & route specs
│   └── explanation/caching-and-performance.md # Caching architecture
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/
│   │   │   ├── playlist/route.ts     # YouTube API data endpoint
│   │   │   └── share-card/route.ts   # PNG Share Card generation route
│   │   ├── schedule/page.tsx         # Schedule Planner Page
│   │   ├── layout.tsx                # Root layout & providers
│   │   └── page.tsx                  # Home Playlist Calculator
│   ├── components/                   # UI Components & Navigation
│   ├── context/                      # Global Playlist State Context
│   └── lib/                          # YouTube API & SVG Share Card utilities
├── next.config.ts                    # Turbopack & package import config
└── package.json                      # Dependencies & automated scripts
```

---

## 🏁 Getting Started

### 1. Prerequisites

- **Node.js** (v18.0.0+) or **Bun** (v1.0.0+)
- **YouTube Data API v3 Key** from [Google Cloud Console](https://console.cloud.google.com/)

### 2. Environment Setup

Create `.env.local` in the project root:

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 3. Installation & Local Development

```bash
# Install dependencies
bun install

# Run dev server
bun run dev
```

Open `http://localhost:3000` in your browser.

---

## 📜 Available NPM / Bun Scripts

| Command | Action |
| :--- | :--- |
| `bun run dev` | Launch Next.js dev server with Turbopack (`http://localhost:3000`) |
| `bun run build` | Build optimized production bundle |
| `bun run start` | Start production server |
| `bun run clean` | Clear `.next` build cache |
| `bun run dev:clean` | Clear `.next` cache and launch dev server fresh |
| `bun run update:deps` | Automatically check and update all dependencies to `@latest` |
| `bun run update:next` | Automatically upgrade Next.js and React stack to `@latest` |

---

## 📚 Documentation (Diataxis Framework)

Comprehensive documentation is available in the [`docs/`](docs/) directory:

| Quadrant | Document | Description |
| :--- | :--- | :--- |
| 🎓 **Tutorial** | [`docs/tutorials/getting-started.md`](docs/tutorials/getting-started.md) | First-time setup, API key config, and initial playlist query. |
| 🛠️ **How-To Guide** | [`docs/how-to/calculate-watch-schedules.md`](docs/how-to/calculate-watch-schedules.md) | How to calculate daily finish dates & export PNG summary cards. |
| 📖 **Reference** | [`docs/reference/api-and-architecture.md`](docs/reference/api-and-architecture.md) | Technical specs for API routes, regex URL parser, and Next.js config. |
| 💡 **Explanation** | [`docs/explanation/caching-and-performance.md`](docs/explanation/caching-and-performance.md) | Deep dive into `Promise.all` chunking and 1-hour LRU in-memory cache. |

---

## 🤝 Contributing

Contributions are welcome!
1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'feat: Add AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.
