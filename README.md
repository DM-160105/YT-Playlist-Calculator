# YouTube Playlist Duration Calculator

A beautiful, modern, and professional web application designed to calculate the total duration of any YouTube playlist. Whether you're planning a study session, a movie marathon, or just curious about how long a tutorial series will take, this tool provides instant insights with a premium user experience.

![Project Banner](https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3)

## 🚀 Features

- **Instant Duration Calculation**: Get the total length of any YouTube playlist in seconds.
- **Multi-Speed Analysis**: Automatically calculates how long the playlist will take to watch at different playback speeds (1.25x, 1.5x, 1.75x, 2x).
- **Average Video Duration**: See the average length of videos in the playlist.
- **Video Count**: Displays the total number of videos in the playlist.
- **Smart & Responsive UI**: Built with a mobile-first approach, ensuring it looks great on all devices.
- **Dark Mode Support**: Seamlessly switches between light and dark themes for comfortable viewing.
- **Visual Feedback**: Includes beautiful loading states, error handling, and smooth animations.

## 🛠️ Tech Stack

This project is built using the latest modern web technologies to ensure performance, scalability, and developer experience.

| Technology              | Description                                                    |
| :---------------------- | :------------------------------------------------------------- |
| **Next.js 16**          | The React Framework for the Web (App Router).                  |
| **React 19**            | The library for web and native user interfaces.                |
| **Tailwind CSS 4**      | A utility-first CSS framework for rapid UI development.        |
| **TypeScript**          | Strongly typed programming language that builds on JavaScript. |
| **Lucide React**        | Beautiful & consistent open-source icons.                      |
| **YouTube Data API v3** | Official API to fetch playlist and video metadata.             |

## 🏁 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v18 or higher recommended).
- **YouTube Data API Key**: You need an API key from the [Google Cloud Console](https://console.cloud.google.com/).
  1.  Create a project in Google Cloud Console.
  2.  Enable the **YouTube Data API v3**.
  3.  Create an API Key (Credentials).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/yt-playlist-calculator.git
    cd yt-playlist-calculator
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your YouTube API Key:

    ```env
    YOUTUBE_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Navigate to (http://localhost:3000) in your browser.

## 💡 Usage

1.  **Find a Playlist**: Go to YouTube and copy the URL of a playlist (e.g., `https://www.youtube.com/playlist?list=PL...`) or just the Playlist ID.
2.  **Paste & Calculate**: Paste the link into the input field on the home page and click **"Calculate Duration"**.
3.  **View Results**:
    - Top Section: Shows the playlist title, thumbnail, total videos, and average duration per video.
    - Grid Section: Displays the total time required to watch the playlist at **Normal (1x)** speed, as well as **1.25x**, **1.5x**, **1.75x**, and **2x** speeds.

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
