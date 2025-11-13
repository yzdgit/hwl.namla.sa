# Hawil (hawil.namla.sa)

Hawil is a lightweight Arabic-first web app that converts any uploaded video into an MP3 audio file directly inside the browser. It uses FFmpeg.wasm, so the media never leaves the user's device, which keeps private files private and avoids slow uploads.

## Features
- Instant video to audio conversion powered by FFmpeg.js running fully client-side
- Tailwind CSS UI tuned for right-to-left Arabic content
- Progress tracking, inline error handling, and ready-to-share output filenames
- Works without sign-up or installs on modern browsers

## Tech Stack
- Static HTML page served from any static host
- Tailwind CSS CDN build with a small custom config
- Vanilla JavaScript in `app.js`
- FFmpeg.wasm (`@ffmpeg/ffmpeg`) for media processing

## Usage
1. Open `index.html` in any modern browser.
2. Choose a video file (MP4, MOV, etc.).
3. Click **تحويل الفيديو إلى صوت** and wait for the progress bar to reach 100%.
4. Preview or download the generated MP3 file from the results card.

## Development Notes
- All custom styles live in `styles.css`; Tailwind handles the utility classes.
- `app.js` initializes the FFmpeg.wasm worker, tracks conversion progress, and updates the UI state.
- No build step is required; edit the HTML/CSS/JS files and refresh the browser to test changes.
