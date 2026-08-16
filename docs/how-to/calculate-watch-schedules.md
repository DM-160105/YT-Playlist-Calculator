# How to Calculate Custom Watch Schedules & Export Share Cards

This guide shows how to plan daily watch schedules for long YouTube courses and export PNG share cards.

---

## Prerequisites

- Active instance of **YT Playlist Calculator** running locally or deployed.
- A public YouTube playlist or video link.

---

## Steps

### Step 1: Calculate Playlist Duration

1. Open the homepage (`/`).
2. Enter your playlist URL (e.g. `https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PrE9srvEn8nbhOOyxnWXfp`).
3. Click **Calculate Duration**.

### Step 2: Open the Schedule Estimator

1. Click the **"Plan Watch Schedule"** button or navigate to `/schedule`.
2. Select your preferred **Playback Speed** (1x, 1.25x, 1.5x, 1.75x, 2x, 2.5x, 3x).
3. Choose or type a **Daily Target Watch Time** (e.g. `15m`, `30m`, `1h`, `2h`, `4h`).

---

## Step 3: Review Calculated Finish Milestones

The schedule engine automatically calculates:
- **Total Days Required**: `Math.ceil(totalSecondsAtSpeed / dailySeconds)`
- **Target Completion Date**: Future calendar date formatted in human-readable format.
- **Weekly & Monthly Breakdown**: Expected completion progress week-by-week.

---

## Step 4: Export & Share PNG Summary Card

1. Click **"Share Summary"** or **"Download PNG Card"**.
2. The server-side API (`/api/share-card`) renders an optimized 880px PNG image using `sharp` containing:
   - Playlist Title & Video Count
   - Total 1x Duration vs 2x Speed Time
   - High-resolution Thumbnail Preview

---

## Verification

To verify that the schedule calculations and image rendering work:
- Change playback speed from `1x` to `2x`. Observe the estimated finish date move closer by exactly half the duration.
- Click **Download PNG Card**. Confirm a `.png` file downloads to your device with crisp typography.

---

## Troubleshooting

### Issue: "Playlist not found or private"
- **Cause**: The YouTube playlist is set to `Private`.
- **Fix**: Open YouTube, change the playlist visibility from `Private` to `Unlisted` or `Public`, and try again.

### Issue: Share Card Generation Fails
- **Cause**: YouTube thumbnail image domain was unreachable or SVG parsing error.
- **Fix**: Check server logs. The generator falls back gracefully to a dark-mode gradient thumbnail if external image fetch times out.
