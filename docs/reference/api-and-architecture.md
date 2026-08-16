# Reference: API Specifications & Architecture

Technical reference manual for developers building or integrating with **YT Playlist Calculator**.

---

## 1. System Architecture

```text
[ Browser / Client UI ]
       │
       ├── POST /api/playlist ────────► [ src/lib/youtube.ts ]
       │                                     │
       │                                     ├── In-Memory LRU Cache (1h TTL)
       │                                     └── YouTube Data API v3 (googleapis.com)
       │
       └── POST /api/share-card ───────► [ generateShareCardSvg.ts ] ──► [ sharp PNG ]
```

---

## 2. API Endpoints

### POST `/api/playlist`

Fetches playlist or video duration details from YouTube Data API v3.

#### Request Body
```json
{
  "playlistInput": "https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PrE9srvEn8nbhOOyxnWXfp"
}
```

#### Response (200 OK)
```json
{
  "title": "React Tutorial Series",
  "thumbnail": "https://i.ytimg.com/vi/.../maxresdefault.jpg",
  "totalVideos": 24,
  "totalSeconds": 14400,
  "durationsBySpeed": [
    { "speed": 1, "seconds": 14400, "timeSavedSeconds": 0 },
    { "speed": 1.25, "seconds": 11520, "timeSavedSeconds": 2880 },
    { "speed": 1.5, "seconds": 9600, "timeSavedSeconds": 4800 },
    { "speed": 1.75, "seconds": 8229, "timeSavedSeconds": 6171 },
    { "speed": 2, "seconds": 7200, "timeSavedSeconds": 7200 }
  ],
  "isSingleVideo": false
}
```

#### Error Response (400 Bad Request)
```json
{
  "error": "Invalid YouTube URL or ID. Please enter a valid playlist link, short link, or video ID."
}
```

---

### POST `/api/share-card`

Generates an 880px PNG summary card image for social sharing.

#### Request Body
```json
{
  "result": {
    "title": "React Tutorial Series",
    "thumbnail": "https://i.ytimg.com/vi/.../maxresdefault.jpg",
    "totalVideos": 24,
    "totalSeconds": 14400,
    "durationsBySpeed": [...]
  },
  "isSchedulePage": false
}
```

#### Response Headers
- `Content-Type: image/png`
- `Cache-Control: private, no-store`

---

## 3. URL Extraction Specs (`extractYouTubeTarget`)

Supported input patterns:
- Standard Playlist: `https://www.youtube.com/playlist?list=PLAYLIST_ID`
- Short Link: `https://youtu.be/VIDEO_ID`
- Shorts: `https://www.youtube.com/shorts/VIDEO_ID`
- Embed Link: `https://www.youtube.com/embed/VIDEO_ID`
- Video in Playlist: `https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID`
- Raw ID string: `PL0Zuz27SZ-6PrE9srvEn8nbhOOyxnWXfp` (18+ chars) or 11-char video ID

---

## 4. Next.js Configurations (`next.config.ts`)

- `turbopack.root`: Set to `path.resolve(__dirname)` for explicit root module resolution.
- `experimental.optimizePackageImports`: Configured for `['lucide-react', 'gsap', '@gsap/react']`.
- `images.remotePatterns`: Allowed hosts `i.ytimg.com` and `yt3.ggpht.com`.
