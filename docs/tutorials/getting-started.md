# Tutorial: Getting Started with YT Playlist Calculator

Learn how to set up, run, and use the **YouTube Playlist Duration & Schedule Calculator** in under 5 minutes.

---

## What You'll Build & Accomplish

By the end of this tutorial, you will:
1. Run the YT Playlist Calculator locally using Next.js 16 and Bun/Node.
2. Connect your YouTube Data API Key.
3. Calculate total watch time, playback speed acceleration (1x to 3x), and generate custom daily finish date schedules.

---

## What You'll Need

- **Node.js** (v18.0.0 or higher) or **Bun** (v1.0.0 or higher)
- **Git**
- A free **YouTube Data API Key** from the [Google Cloud Console](https://console.cloud.google.com/)

---

## Step 1: Clone & Install Dependencies

Open your terminal and execute:

```bash
git clone https://github.com/yourusername/YT-Playlist-Calculator.git
cd YT-Playlist-Calculator
bun install
```

*(Note: You can also use `npm install`, `pnpm install`, or `yarn`)*

---

## Step 2: Configure Your API Key

Create a `.env.local` file in the root directory:

```bash
echo "YOUTUBE_API_KEY=your_actual_api_key_here" > .env.local
```

Replace `your_actual_api_key_here` with your YouTube Data API v3 key.

---

## Step 3: Launch the Development Server

Start the local server:

```bash
bun run dev
```

Output:
```text
▲ Next.js 16.3.1 (Turbopack)
- Local: http://localhost:3000
✓ Ready in 208ms
```

Open `http://localhost:3000` in your browser.

---

## Step 4: Calculate Your First Playlist

1. Copy any public YouTube Playlist URL (for example: `https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PrE9srvEn8nbhOOyxnWXfp`) or short link (`youtu.be`).
2. Paste the link into the main input field.
3. Click **"Calculate Duration"**.

### What You See:
- **Total Duration at 1x**: Hours, minutes, and seconds required at normal speed.
- **Speed Savings (1.25x – 3x)**: Exact time saved when watching at faster speeds.
- **Finish Date Roadmap**: Calculated target finish dates based on your daily study goal.

---

## Next Steps

- Explore [How to Calculate Custom Watch Schedules](../how-to/calculate-watch-schedules.md)
- Learn about [API & Architecture Reference](../reference/api-and-architecture.md)
- Read [Caching & Performance Explanation](../explanation/caching-and-performance.md)
