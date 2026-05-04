# FrameFeed

A full-stack web application that allows users to upload a video file, extract frames from it, and download a single PDF containing all frames. Ready to upload to AI models like Claude, ChatGPT, or Gemini.

## Features
- **Frontend**: Next.js 14, Tailwind CSS, shadcn/ui. Responsive, dark-themed UI with animated progress tracking.
- **Backend**: FastAPI (Python), FFmpeg, ReportLab. Asynchronous frame extraction and PDF generation.

## Prerequisites
- Node.js 18+
- Python 3.8+
- **FFmpeg**: Must be installed on the system to extract frames.

### Installing FFmpeg
**Ubuntu/Debian**
```bash
sudo apt install ffmpeg
```

**macOS**
```bash
brew install ffmpeg
```

**Windows**
Download the binaries from the [official FFmpeg site](https://ffmpeg.org/download.html) and add them to your system PATH.

## Run Instructions

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will run at `http://localhost:3000`.

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
The backend API will run at `http://localhost:8000`.

## Nice-to-have Features (Coming Soon)
- **Redis job queue**: For scaling in a production environment.
- **S3/R2 storage**: Storing large video files and PDFs in the cloud instead of local `/tmp`.
- **User Authentication**: Using Clerk or NextAuth.
- **Usage limits per IP**: To prevent abuse of the video processing resources.
- **Preview frames**: Allow users to preview the extracted frames before finalizing the PDF generation.
