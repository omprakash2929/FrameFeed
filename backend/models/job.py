from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class JobState(BaseModel):
    job_id: str
    status: str        # queued | extracting | review | generating | done | error
    progress: int      # 0-100
    frames_extracted: int
    total_frames: int
    message: str
    pdf_path: Optional[str] = None
    created_at: datetime
    frames: List[dict] = []
    settings: Dict[str, Any] = {}

# In-memory store
jobs: dict[str, JobState] = {}
