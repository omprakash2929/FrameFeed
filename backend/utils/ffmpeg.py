import os
import asyncio
import subprocess
import imageio_ffmpeg
from models.job import jobs

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

def get_duration(video_path):
    cmd = [FFMPEG_EXE, "-i", video_path]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, errors='ignore')
    for line in result.stderr.splitlines():
        if "Duration:" in line:
            time_str = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = time_str.split(":")
            return float(h) * 3600 + float(m) * 60 + float(s)
    return 0.0

def run_ffmpeg(cmd, job_id, total_estimated_frames):
    try:
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, bufsize=1, universal_newlines=True, errors='ignore')
        frames_extracted = 0
        job = jobs.get(job_id)
        
        for line in process.stderr:
            if "frame=" in line:
                try:
                    parts = line.split("frame=")[1].strip().split()
                    frames_extracted = int(parts[0])
                    if total_estimated_frames > 0 and job:
                        progress = int((frames_extracted / total_estimated_frames) * 100)
                        job.progress = min(99, progress)
                except Exception:
                    pass
                    
        process.wait()
        return process.returncode, frames_extracted
    except FileNotFoundError:
        raise FileNotFoundError()

async def extract_frames(video_path: str, output_dir: str, fps: float, quality: str, job_id: str):
    os.makedirs(output_dir, exist_ok=True)
    
    job = jobs.get(job_id)
    settings = job.settings if job else {}
    start_time = settings.get("start_time")
    end_time = settings.get("end_time")
    deduplicate = settings.get("deduplicate", False)
    
    try:
        duration = await asyncio.to_thread(get_duration, video_path)
    except Exception as e:
        duration = 0.0
        
    total_estimated_frames = int(duration * fps)
    
    scale = "-1:-1"
    if quality == "low": scale = "854:480"
    elif quality == "medium": scale = "1280:720"
    elif quality == "high": scale = "1920:1080"
    
    cmd = [FFMPEG_EXE, "-y"]
    if start_time:
        cmd.extend(["-ss", str(start_time)])
    if end_time:
        cmd.extend(["-to", str(end_time)])
        
    cmd.extend([
        "-i", video_path,
        "-vf", f"fps={fps},scale={scale}",
        "-q:v", "2",
        os.path.join(output_dir, "frame_%04d.jpg")
    ])
    
    try:
        returncode, frames_extracted = await asyncio.to_thread(run_ffmpeg, cmd, job_id, total_estimated_frames)
    except FileNotFoundError:
        raise Exception("FFmpeg is not installed or not found in system PATH. Please install FFmpeg.")
        
    if returncode != 0:
        raise Exception("FFmpeg extraction failed")
        
    # Deduplication using imagehash
    if deduplicate and frames_extracted > 0:
        import imagehash
        from PIL import Image
        if job:
            job.message = "Running AI deduplication to remove similar frames..."
            
        def do_deduplication():
            frames = sorted([f for f in os.listdir(output_dir) if f.endswith('.jpg')])
            last_hash = None
            kept = 0
            for f in frames:
                path = os.path.join(output_dir, f)
                try:
                    img = Image.open(path)
                    current_hash = imagehash.phash(img)
                    img.close()
                    # if difference is very small (e.g. < 10), they are very similar
                    if last_hash is not None and (current_hash - last_hash) < 10:
                        os.remove(path)
                    else:
                        last_hash = current_hash
                        kept += 1
                except Exception as e:
                    pass
            return kept
            
        frames_extracted = await asyncio.to_thread(do_deduplication)
        
    return frames_extracted
