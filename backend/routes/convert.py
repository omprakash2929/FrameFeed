from fastapi import APIRouter, UploadFile, Form, BackgroundTasks, HTTPException, File
import uuid
import os
import aiofiles
from datetime import datetime
from models.job import jobs, JobState
from utils.ffmpeg import extract_frames
from utils.pdf import generate_pdf
from utils.cleanup import auto_cleanup
from pydantic import BaseModel
from typing import List

router = APIRouter()

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi", ".webm"}
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB

async def process_video_task(job_id: str, video_path: str, tmp_dir: str, fps: float, quality: str, max_frames: int):
    try:
        jobs[job_id].status = "extracting"
        frames_dir = os.path.join(tmp_dir, "frames")
        
        extracted_count = await extract_frames(video_path, frames_dir, fps, quality, job_id)
        
        frames = sorted([f for f in os.listdir(frames_dir) if f.endswith('.jpg')])
        if len(frames) > max_frames:
            for f in frames[max_frames:]:
                os.remove(os.path.join(frames_dir, f))
            frames = frames[:max_frames]
            extracted_count = max_frames
            
        jobs[job_id].frames = [{"name": f, "url": f"/api/frames/{job_id}/{f}", "selected": True} for f in frames]
        jobs[job_id].status = "review"
        jobs[job_id].progress = 100
        jobs[job_id].message = "Frames extracted! Please review and arrange them."
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        error_msg = str(e) if str(e) else repr(e)
        jobs[job_id].status = "error"
        jobs[job_id].message = f"Error: {error_msg}"
        print(f"Job {job_id} failed: {error_msg}")

@router.post("/api/convert")
async def convert_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    fps: float = Form(1.0),
    max_frames: int = Form(60),
    quality: str = Form("medium"),
    orientation: str = Form("landscape"),
    deduplicate: str = Form("false"),
    frames_per_page: int = Form(1),
    add_timestamps: str = Form("false"),
    start_time: str = Form(""),
    end_time: str = Form("")
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type")
        
    job_id = str(uuid.uuid4())
    tmp_dir = os.path.join("/tmp", job_id)
    if os.name == 'nt':
        import tempfile
        tmp_dir = os.path.join(tempfile.gettempdir(), job_id)
        
    os.makedirs(tmp_dir, exist_ok=True)
    video_path = os.path.join(tmp_dir, "video" + ext)
    
    async with aiofiles.open(video_path, 'wb') as out_file:
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large")
        await out_file.write(content)
        
    settings = {
        "orientation": orientation,
        "max_frames": max_frames,
        "deduplicate": deduplicate.lower() == "true",
        "frames_per_page": frames_per_page,
        "add_timestamps": add_timestamps.lower() == "true",
        "start_time": start_time,
        "end_time": end_time
    }
        
    jobs[job_id] = JobState(
        job_id=job_id,
        status="queued",
        progress=0,
        frames_extracted=0,
        total_frames=0,
        message="Queued...",
        created_at=datetime.utcnow(),
        settings=settings
    )
    
    background_tasks.add_task(process_video_task, job_id, video_path, tmp_dir, fps, quality, max_frames)
    background_tasks.add_task(auto_cleanup, tmp_dir, 3600) # keep for 1 hour for review
    
    return {"job_id": job_id, "status": "queued"}

class GeneratePDFRequest(BaseModel):
    selected_frames: List[str]
    frames_per_page: int
    add_timestamps: bool
    orientation: str

@router.post("/api/generate-pdf/{job_id}")
async def generate_pdf_endpoint(job_id: str, req: GeneratePDFRequest, background_tasks: BackgroundTasks):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
        
    job = jobs[job_id]
    job.status = "generating"
    job.message = "Generating PDF document..."
    job.progress = 50
    
    tmp_dir = os.path.join("/tmp", job_id)
    if os.name == 'nt':
        import tempfile
        tmp_dir = os.path.join(tempfile.gettempdir(), job_id)
        
    frames_dir = os.path.join(tmp_dir, "frames")
    pdf_path = os.path.join(tmp_dir, "output.pdf")
    
    async def do_generate():
        try:
            # We need to update utils.pdf to support new settings
            from utils.pdf import generate_pdf
            await generate_pdf(frames_dir, pdf_path, req.orientation, req.selected_frames, req.frames_per_page, req.add_timestamps)
            job.status = "done"
            job.message = "PDF generated successfully!"
            job.progress = 100
            job.pdf_path = pdf_path
        except Exception as e:
            import traceback
            traceback.print_exc()
            job.status = "error"
            job.message = f"PDF Error: {str(e)}"
            
    background_tasks.add_task(do_generate)
    return {"message": "Started PDF generation"}
