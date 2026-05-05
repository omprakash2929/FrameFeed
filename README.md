<div align="center">

<img src="https://raw.githubusercontent.com/omprakash2929/FrameFeed/main/framefeed_logo.svg" alt="FrameFeed Logo" width="480"/>

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](LICENSE)

**Upload a video. Extract frames. Get a PDF. Feed it to any AI.**

[Live Demo](https://framefeed.vercel.app) · [Report Bug](https://github.com/omprakash2929/FrameFeed/issues) · [Request Feature](https://github.com/omprakash2929/FrameFeed/issues)

</div>

---

## What is FrameFeed?

FrameFeed converts any video into a single PDF of extracted frames — making it easy to upload video content to AI models like Claude, ChatGPT, or Gemini that don't support direct video input.

Upload a video → extract frames at your chosen rate → download a clean PDF → upload to any AI.

---

## Features

- **Video to PDF** — extract frames at 0.1 to 2 fps and bundle them into one PDF
- **Smart frame sampling** — scene change detection to skip redundant frames
- **Live progress tracking** — real-time status updates during extraction
- **Adjustable settings** — control FPS, max frames, quality, and page orientation
- **AI-ready output** — works with Claude, ChatGPT, Gemini, and any PDF-accepting AI
- **Fully responsive** — dark-themed UI, works on mobile and desktop
- **Docker support** — run the whole stack with a single command

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS, shadcn/ui |
| Backend | FastAPI (Python) |
| Video processing | FFmpeg |
| PDF generation | ReportLab |
| Containerization | Docker, Docker Compose |

---

## Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Python 3.8+](https://www.python.org/)
- [FFmpeg](https://ffmpeg.org/) — required for frame extraction
- [Docker](https://www.docker.com/) *(optional, for Docker setup)*

#### Install FFmpeg

**Ubuntu / Debian**
```bash
sudo apt update && sudo apt install ffmpeg
```

**macOS**
```bash
brew install ffmpeg
```

**Windows**

Download from the [official FFmpeg site](https://ffmpeg.org/download.html) and add the `bin` folder to your system `PATH`.

---

## Option 1 — Docker Compose (Recommended)

The easiest way to run FrameFeed locally. No manual setup needed.

**1. Clone the repository**
```bash
git clone https://github.com/omprakash2929/FrameFeed.git
cd FrameFeed
```

**2. Start the full stack**
```bash
docker compose up --build
```

**3. Open in browser**
```
http://localhost:3000
```

That's it. Both frontend and backend start automatically.

**Stop the stack**
```bash
docker compose down
```

**Rebuild after code changes**
```bash
docker compose up --build
```

---

## Option 2 — Manual Setup

### 1. Clone the repository

```bash
git clone https://github.com/omprakash2929/FrameFeed.git
cd FrameFeed
```

### 2. Run the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`

### 3. Run the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

### 4. Configure Environment

Create a `.env.local` file inside the `frontend/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Option 3 — Docker Images (Separate)

Pull and run the pre-built images individually from Docker Hub.

**Backend**
```bash
docker pull omprakash2929/framefeed-backend:latest
docker run -p 8000:8000 omprakash2929/framefeed-backend:latest
```

**Frontend**
```bash
docker pull omprakash2929/framefeed-frontend:latest
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  omprakash2929/framefeed-frontend:latest
```

---

## Project Structure

```
FrameFeed/
├── frontend/                  ← Next.js app
│   ├── app/
│   │   ├── page.tsx           ← Landing page
│   │   └── convert/
│   │       └── page.tsx       ← Main tool page
│   ├── components/
│   │   ├── VideoUploader.tsx
│   │   ├── SettingsPanel.tsx
│   │   ├── ProgressTracker.tsx
│   │   └── DownloadCard.tsx
│   ├── .env.local             ← API URL config
│   └── next.config.js
│
├── backend/                   ← FastAPI app
│   ├── main.py
│   ├── routes/
│   │   ├── convert.py
│   │   └── status.py
│   ├── utils/
│   │   ├── ffmpeg.py          ← Frame extraction
│   │   ├── pdf.py             ← PDF generation
│   │   └── cleanup.py         ← Temp file cleanup
│   ├── models/
│   │   └── job.py             ← Job state schema
│   └── requirements.txt
│
├── docker-compose.yml         ← Full stack compose file
├── framefeed_logo.svg
└── README.md
```

---

## How It Works

```
1. Upload video (MP4, MOV, AVI, WEBM — up to 500MB)
        ↓
2. Choose settings (FPS, max frames, quality, orientation)
        ↓
3. Backend extracts frames using FFmpeg
        ↓
4. Frames are compiled into a PDF using ReportLab
        ↓
5. Download your PDF — upload to any AI
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/convert` | Upload video + settings, returns `job_id` |
| `GET` | `/api/status/{job_id}` | Poll for progress (0–100%) |
| `GET` | `/api/download/{job_id}` | Download the generated PDF |

---

## Deployment

### Frontend → Vercel

1. Import `omprakash2929/FrameFeed` on [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend.onrender.com
   ```

### Backend → Render

1. New Web Service → Deploy existing Docker image
2. Image: `docker.io/omprakash2929/framefeed-backend:latest`
3. Port: `8000`, Region: Singapore, Plan: Free

---

## Roadmap

- [ ] Redis job queue for production scaling
- [ ] S3 / Cloudflare R2 storage for large files
- [ ] User authentication (Clerk or NextAuth)
- [ ] Per-IP usage limits
- [ ] Frame preview before PDF generation
- [ ] Scene change detection (smart frame sampling)
- [ ] Support for YouTube URL input

---

## Contributing

Contributions are welcome!

```bash
# Fork the repo, then:
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a Pull Request
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Made with ❤️ by [omprakash2929](https://github.com/omprakash2929)

⭐ Star this repo if you find it useful!

</div>
