import os
import shutil
import asyncio

async def auto_cleanup(directory: str, delay_seconds: int = 600):
    await asyncio.sleep(delay_seconds)
    if os.path.exists(directory):
        shutil.rmtree(directory, ignore_errors=True)
