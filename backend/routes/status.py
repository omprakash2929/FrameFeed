from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from models.job import jobs
import os
import tempfile

router = APIRouter()

@router.get("/api/status/{job_id}")
async def get_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]

@router.get("/api/download/{job_id}")
async def download_pdf(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
        
    job = jobs[job_id]
    if job.status != "done" or not job.pdf_path:
        raise HTTPException(status_code=400, detail="PDF not ready")
        
    return FileResponse(
        job.pdf_path,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=video_frames.pdf"}
    )

@router.get("/api/frames/{job_id}/{frame_name}")
async def get_frame(job_id: str, frame_name: str):
    tmp_dir = os.path.join("/tmp", job_id)
    if os.name == 'nt':
        tmp_dir = os.path.join(tempfile.gettempdir(), job_id)
        
    frame_path = os.path.join(tmp_dir, "frames", frame_name)
    if not os.path.exists(frame_path):
        raise HTTPException(status_code=404, detail="Frame not found")
        
    return FileResponse(frame_path, media_type="image/jpeg")
