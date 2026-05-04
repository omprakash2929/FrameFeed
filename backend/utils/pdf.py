import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import inch
from PIL import Image

async def generate_pdf(frames_dir: str, output_path: str, orientation: str, selected_frames: list, frames_per_page: int, add_timestamps: bool):
    if not selected_frames:
        raise Exception("No frames selected")
        
    page_size = landscape(A4) if orientation == "landscape" else A4
    page_width, page_height = page_size
    
    c = canvas.Canvas(output_path, pagesize=page_size)
    
    total_frames = len(selected_frames)
    
    # Calculate layout
    if frames_per_page == 1:
        cols, rows = 1, 1
    elif frames_per_page == 2:
        cols, rows = 1, 2
    elif frames_per_page == 4:
        cols, rows = 2, 2
    elif frames_per_page == 6:
        cols, rows = 2, 3
    else:
        cols, rows = 1, 1
        
    margin = 0.5 * inch
    usable_width = page_width - (2 * margin)
    usable_height = page_height - (2 * margin)
    
    cell_width = usable_width / cols
    cell_height = usable_height / rows
    
    padding = 0.1 * inch
    
    current_frame = 0
    while current_frame < total_frames:
        for row in range(rows):
            for col in range(cols):
                if current_frame >= total_frames:
                    break
                    
                frame = selected_frames[current_frame]
                frame_path = os.path.join(frames_dir, frame)
                
                if not os.path.exists(frame_path):
                    current_frame += 1
                    continue
                
                try:
                    with Image.open(frame_path) as img:
                        img_w, img_h = img.size
                except Exception:
                    current_frame += 1
                    continue
                
                # Fit image in cell
                draw_w = cell_width - (2 * padding)
                draw_h = cell_height - (2 * padding)
                
                aspect_ratio = img_w / img_h
                if draw_w / draw_h > aspect_ratio:
                    draw_w = draw_h * aspect_ratio
                else:
                    draw_h = draw_w / aspect_ratio
                
                x_pos = margin + (col * cell_width) + (cell_width - draw_w) / 2
                y_pos = page_height - margin - ((row + 1) * cell_height) + (cell_height - draw_h) / 2
                
                c.drawImage(frame_path, x_pos, y_pos, width=draw_w, height=draw_h)
                
                if add_timestamps:
                    try:
                        frame_num = int(frame.replace('frame_', '').replace('.jpg', ''))
                        timestamp_str = f"Frame: {frame_num}"
                        c.setFont("Helvetica", max(10, int(draw_h*0.03)))
                        c.setFillColorRGB(0.5, 0.5, 0.5)
                        c.drawString(x_pos, y_pos - 15, timestamp_str)
                    except:
                        pass
                
                current_frame += 1
                
        c.showPage()
        
    c.save()
    return output_path
