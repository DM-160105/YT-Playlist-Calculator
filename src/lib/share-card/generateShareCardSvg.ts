type ShareCardResult = {
  title: string;
  thumbnail?: string | null;
  totalVideos: number;
  totalSeconds: number;
  durationsBySpeed: Array<{
    speed: number;
    seconds: number;
    timeSavedSeconds: number;
  }>;
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const formatTime = (totalSeconds: number) => {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}m`);
  }
  parts.push(`${secs}s`);
  return parts.join(' ');
};

/**
 * Deterministic title wrapping.
 * We intentionally do NOT let SVG/browser text wrapping decide where the title breaks.
 */
const getTitleLines = (title: string): [string, string] => {
  const cleanTitle = title.replace(/\s+/g, ' ').trim();
  const maxChars = 39;
  if (cleanTitle.length <= maxChars) {
    return [cleanTitle, ''];
  }
  const firstChunk = cleanTitle.slice(0, maxChars);
  const breakPosition = firstChunk.lastIndexOf(' ');
  const firstLine =
    breakPosition > 20
      ? cleanTitle.slice(0, breakPosition)
      : cleanTitle.slice(0, maxChars);
  const remaining = cleanTitle.slice(firstLine.length).trim();
  if (!remaining) {
    return [firstLine, ''];
  }
  const secondLine =
    remaining.length > maxChars
      ? `${remaining.slice(0, maxChars - 1).trimEnd()}…`
      : remaining;
  return [firstLine, secondLine];
};

const getThumbnailDataUri = async (thumbnail?: string | null) => {
  if (!thumbnail) {
    return null;
  }
  try {
    const url = new URL(thumbnail);
    const allowedHosts = [
      'i.ytimg.com',
      'img.youtube.com',
      'yt3.ggpht.com',
      'ytimg.com',
    ];
    const isAllowed = allowedHosts.some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`)
    );
    if (!isAllowed) {
      return null;
    }
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      cache: 'force-cache',
    });
    if (!response.ok) {
      return null;
    }
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch {
    return null;
  }
};

const playIcon = `
  <path
    d="M6 4.8C6 3.6 7.3 2.9 8.3 3.5L20.1 10.7C21 11.3 21 12.7 20.1 13.3L8.3 20.5C7.3 21.1 6 20.4 6 19.2V4.8Z"
    fill="#ffffff"
  />
`;

const layersIcon = `
  <path
    d="M12 3L3 7.8L12 12.6L21 7.8L12 3Z"
    fill="none"
    stroke="#ef4444"
    stroke-width="1.8"
    stroke-linejoin="round"
  />
  <path
    d="M3 12L12 16.8L21 12"
    fill="none"
    stroke="#ef4444"
    stroke-width="1.8"
    stroke-linejoin="round"
  />
  <path
    d="M3 16.2L12 21L21 16.2"
    fill="none"
    stroke="#ef4444"
    stroke-width="1.8"
    stroke-linejoin="round"
  />
`;

const clockIcon = `
  <circle
    cx="12"
    cy="12"
    r="8.5"
    fill="none"
    stroke="#f59e0b"
    stroke-width="1.8"
  />
  <path
    d="M12 7V12L15.5 14"
    fill="none"
    stroke="#f59e0b"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
`;

const zapIcon = (active: boolean) => `
  <path
    d="M13.1 2.8L5 13H11L9.8 21.2L19 10H13L13.1 2.8Z"
    fill="none"
    stroke="${active ? '#f87171' : '#71717a'}"
    stroke-width="1.8"
    stroke-linejoin="round"
  />
`;

export async function generateShareCardSvg(
  result: ShareCardResult,
  isSchedulePage: boolean
) {
  const thumbnail = await getThumbnailDataUri(result.thumbnail);
  const [titleLine1, titleLine2] = getTitleLines(result.title);
  const title1 = escapeXml(titleLine1);
  const title2 = escapeXml(titleLine2);
  const durations = result.durationsBySpeed;

  const width = 440;
  const height = isSchedulePage ? 420 : 478;

  const rows = durations
    .map((duration, index) => {
      const y = 224 + index * 40;
      const speed = duration.speed;
      const durationText = formatTime(duration.seconds);
      const savedText =
        duration.timeSavedSeconds > 0
          ? `-${formatTime(duration.timeSavedSeconds)}`
          : '';
      return `
        <g>
          <g transform="translate(18 ${y - 12}) scale(0.8)">
            ${zapIcon(speed > 1)}
          </g>
          <text
            x="38"
            y="${y}"
            fill="#f4f4f5"
            font-size="13"
            font-weight="700"
            font-family="Arial, Helvetica, sans-serif"
            dominant-baseline="middle"
          >
            ${escapeXml(`${speed}x Speed`)}
          </text>
          <text
            x="${savedText ? 340 : 402}"
            y="${y}"
            fill="#ffffff"
            font-size="13"
            font-weight="700"
            font-family="Arial, Helvetica, sans-serif"
            text-anchor="end"
            dominant-baseline="middle"
          >
            ${escapeXml(durationText)}
          </text>
          ${
            savedText
              ? `
                <rect
                  x="348"
                  y="${y - 12}"
                  width="56"
                  height="24"
                  rx="6"
                  fill="#064e3b"
                  stroke="#065f46"
                />
                <text
                  x="376"
                  y="${y + 1}"
                  fill="#34d399"
                  font-size="10"
                  font-weight="700"
                  font-family="Arial, Helvetica, sans-serif"
                  text-anchor="middle"
                  dominant-baseline="middle"
                >
                  ${escapeXml(savedText)}
                </text>
              `
              : ''
          }
        </g>
      `;
    })
    .join('');

  const content = isSchedulePage
    ? `
      <!-- Schedule -->
      <rect
        x="23"
        y="188"
        width="394"
        height="150"
        rx="12"
        fill="#18181b"
        stroke="#27272a"
      />
      <rect
        x="36"
        y="201"
        width="183"
        height="54"
        rx="8"
        fill="#09090b"
        stroke="#27272a"
      />
      <text
        x="48"
        y="219"
        fill="#a1a1aa"
        font-size="10"
        font-weight="700"
        font-family="Arial, Helvetica, sans-serif"
      >
        TARGET SPEED
      </text>
      <text
        x="48"
        y="242"
        fill="#f87171"
        font-size="14"
        font-weight="800"
        font-family="Arial, Helvetica, sans-serif"
      >
        1.5x Playback
      </text>
      <rect
        x="228"
        y="201"
        width="183"
        height="54"
        rx="8"
        fill="#09090b"
        stroke="#27272a"
      />
      <text
        x="240"
        y="219"
        fill="#a1a1aa"
        font-size="10"
        font-weight="700"
        font-family="Arial, Helvetica, sans-serif"
      >
        DAILY WATCH GOAL
      </text>
      <text
        x="240"
        y="242"
        fill="#fbbf24"
        font-size="14"
        font-weight="800"
        font-family="Arial, Helvetica, sans-serif"
      >
        1 Hour / Day
      </text>
      <rect
        x="36"
        y="264"
        width="375"
        height="54"
        rx="8"
        fill="#09090b"
        stroke="#27272a"
      />
      <text
        x="48"
        y="296"
        fill="#a1a1aa"
        font-size="12"
        font-family="Arial, Helvetica, sans-serif"
      >
        Estimated Completion
      </text>
      <text
        x="399"
        y="296"
        fill="#34d399"
        font-size="12"
        font-weight="700"
        font-family="Arial, Helvetica, sans-serif"
        text-anchor="end"
      >
        ${Math.ceil(result.totalSeconds / 1.5 / 3600)} Days
      </text>
    `
    : `
      <!-- Duration table -->
      <rect
        x="23"
        y="188"
        width="394"
        height="216"
        rx="12"
        fill="#18181b"
        stroke="#27272a"
      />
      <text
        x="38"
        y="216"
        fill="#a1a1aa"
        font-size="10"
        font-weight="700"
        font-family="Arial, Helvetica, sans-serif"
        letter-spacing="0.5"
      >
        SPEED FACTOR
      </text>
      <text
        x="402"
        y="216"
        fill="#a1a1aa"
        font-size="10"
        font-weight="700"
        font-family="Arial, Helvetica, sans-serif"
        text-anchor="end"
        letter-spacing="0.5"
      >
        TOTAL DURATION (TIME SAVED)
      </text>
      <line
        x1="38"
        y1="229"
        x2="402"
        y2="229"
        stroke="#27272a"
      />
      ${rows}
    `;

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
    >
      <!-- Background -->
      <rect
        x="0"
        y="0"
        width="${width}"
        height="${height}"
        rx="16"
        fill="#09090b"
      />
      <!-- Outer border -->
      <rect
        x="0.5"
        y="0.5"
        width="${width - 1}"
        height="${height - 1}"
        rx="16"
        fill="none"
        stroke="#27272a"
      />
      <!-- Top red border -->
      <path
        d="M16 1H424"
        stroke="#ef4444"
        stroke-width="3"
        stroke-linecap="round"
      />
      <!-- ==========================================
           HEADER
      =========================================== -->
      <rect
        x="23"
        y="25"
        width="28"
        height="28"
        rx="8"
        fill="#dc2626"
      />
      <g transform="translate(26 29)">
        ${playIcon}
      </g>
      <text
        x="59"
        y="46"
        fill="#ffffff"
        font-size="15"
        font-weight="800"
        font-family="Arial, Helvetica, sans-serif"
        dominant-baseline="middle"
      >
        YT Playlist
      </text>
      <text
        x="141"
        y="46"
        fill="#ef4444"
        font-size="15"
        font-weight="800"
        font-family="Arial, Helvetica, sans-serif"
        dominant-baseline="middle"
      >
        Calc
      </text>
      <!-- Report badge -->
      <rect
        x="293"
        y="26"
        width="124"
        height="25"
        rx="13"
        fill="#450a0a"
        stroke="#7f1d1d"
      />
      <text
        x="355"
        y="43"
        fill="#fca5a5"
        font-size="10"
        font-weight="700"
        font-family="Arial, Helvetica, sans-serif"
        text-anchor="middle"
        letter-spacing="0.5"
      >
        ${isSchedulePage ? 'SCHEDULE PLAN' : 'DURATION REPORT'}
      </text>
      <!-- Header divider -->
      <line
        x1="23"
        y1="66"
        x2="417"
        y2="66"
        stroke="#27272a"
      />
      <!-- ==========================================
           PLAYLIST INFO
      =========================================== -->
      ${
        thumbnail
          ? `
            <defs>
              <clipPath id="thumbnailClip">
                <rect
                  x="23"
                  y="83"
                  width="76"
                  height="54"
                  rx="8"
                />
              </clipPath>
            </defs>
            <image
              x="23"
              y="83"
              width="76"
              height="54"
              preserveAspectRatio="xMidYMid slice"
              href="${thumbnail}"
              xlink:href="${thumbnail}"
              clip-path="url(#thumbnailClip)"
            />
            <rect
              x="23.5"
              y="83.5"
              width="75"
              height="53"
              rx="8"
              fill="none"
              stroke="#27272a"
            />
          `
          : ''
      }
      <!-- Title -->
      <text
        x="111"
        y="100"
        fill="#ffffff"
        font-size="14"
        font-weight="700"
        font-family="Arial, Helvetica, sans-serif"
      >
        ${title1}
      </text>
      ${
        title2
          ? `
            <text
              x="111"
              y="120"
              fill="#ffffff"
              font-size="14"
              font-weight="700"
              font-family="Arial, Helvetica, sans-serif"
            >
              ${title2}
            </text>
          `
          : ''
      }
      <!-- Metadata -->
      <g transform="translate(111 130)">
        <g transform="translate(0 -10) scale(0.6)">
          ${layersIcon}
        </g>
        <text
          x="18"
          y="1"
          fill="#e4e4e7"
          font-size="12"
          font-weight="600"
          font-family="Arial, Helvetica, sans-serif"
        >
          ${result.totalVideos} ${result.totalVideos === 1 ? 'Video' : 'Videos'}
        </text>
        <circle
          cx="100"
          cy="-3"
          r="2.5"
          fill="#a1a1aa"
        />
        <g transform="translate(112 -10) scale(0.6)">
          ${clockIcon}
        </g>
        <text
          x="130"
          y="1"
          fill="#e4e4e7"
          font-size="12"
          font-weight="600"
          font-family="Arial, Helvetica, sans-serif"
        >
          ${escapeXml(formatTime(result.totalSeconds))} at 1x
        </text>
      </g>
      <!-- ==========================================
           CONTENT
      =========================================== -->
      ${content}
      <!-- ==========================================
           FOOTER
      =========================================== -->
      <line
        x1="23"
        y1="${isSchedulePage ? 358 : 422}"
        x2="417"
        y2="${isSchedulePage ? 358 : 422}"
        stroke="#27272a"
      />
      <text
        x="23"
        y="${isSchedulePage ? 388 : 452}"
        fill="#71717a"
        font-size="11"
        font-family="Arial, Helvetica, sans-serif"
      >
        yt-playlist-calculator.com
      </text>
      <text
        x="417"
        y="${isSchedulePage ? 388 : 452}"
        fill="#71717a"
        font-size="11"
        font-family="Arial, Helvetica, sans-serif"
        text-anchor="end"
      >
        Binge Watch Planner
      </text>
    </svg>
  `;
}
