"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { VideoUploader } from "../../components/VideoUploader";
import { SettingsPanel } from "../../components/SettingsPanel";
import { ProgressTracker } from "../../components/ProgressTracker";
import { DownloadCard } from "../../components/DownloadCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL !== undefined ? process.env.NEXT_PUBLIC_API_URL : "http://localhost:8000";

interface Frame {
  name: string;
  url: string;
  selected: boolean;
}

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fps, setFps] = useState(1);
  const [maxFrames, setMaxFrames] = useState(60);
  const [quality, setQuality] = useState("medium");
  const [orientation, setOrientation] = useState("landscape");
  
  const [deduplicate, setDeduplicate] = useState(false);
  const [framesPerPage, setFramesPerPage] = useState(1);
  const [addTimestamps, setAddTimestamps] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("idle"); // idle | uploading | queued | extracting | review | generating | done | error
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  
  const [frames, setFrames] = useState<Frame[]>([]);
  
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const startConversion = async () => {
    if (!file) {
      toast.error("Please upload a video file first");
      return;
    }
    
    setStatus("uploading");
    setProgress(0);
    setMessage("Uploading video...");
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fps", fps.toString());
    formData.append("max_frames", maxFrames.toString());
    formData.append("quality", quality);
    formData.append("orientation", orientation);
    formData.append("deduplicate", deduplicate.toString());
    formData.append("frames_per_page", framesPerPage.toString());
    formData.append("add_timestamps", addTimestamps.toString());
    formData.append("start_time", startTime);
    formData.append("end_time", endTime);
    
    try {
      const res = await fetch(`${API_URL}/api/convert`, {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Upload failed");
      }
      
      const data = await res.json();
      setJobId(data.job_id);
      setStatus("queued");
      
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to start conversion");
      setStatus("error");
    }
  };
  
  const generatePDF = async () => {
    if (!jobId) return;
    setStatus("generating");
    setMessage("Generating PDF...");
    
    try {
      const selectedFrames = frames.filter(f => f.selected).map(f => f.name);
      
      const res = await fetch(`${API_URL}/api/generate-pdf/${jobId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selected_frames: selectedFrames,
          frames_per_page: framesPerPage,
          add_timestamps: addTimestamps,
          orientation: orientation
        })
      });
      
      if (!res.ok) throw new Error("Failed to start PDF generation");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate PDF");
      setStatus("error");
    }
  };

  useEffect(() => {
    if (!jobId || status === "done" || status === "error" || status === "review") return;
    
    const pollStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/status/${jobId}`);
        if (!res.ok) throw new Error("Failed to fetch status");
        
        const data = await res.json();
        setStatus(data.status);
        setProgress(data.progress);
        setMessage(data.message);
        
        if (data.status === "review" && data.frames) {
            setFrames(data.frames);
        }
        
        if (data.status === "error") {
          toast.error(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    pollingInterval.current = setInterval(pollStatus, 2000);
    return () => clearInterval(pollingInterval.current!);
  }, [jobId, status]);

  const toggleFrame = (index: number) => {
    const newFrames = [...frames];
    newFrames[index].selected = !newFrames[index].selected;
    setFrames(newFrames);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500 pb-2">FrameFeed</h1>
          <p className="text-slate-400 text-lg">Configure your settings and extract frames to a beautifully formatted PDF document.</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <VideoUploader file={file} setFile={setFile} disabled={status !== "idle" && status !== "error" && status !== "done"} />
            <SettingsPanel 
              fps={fps} setFps={setFps}
              maxFrames={maxFrames} setMaxFrames={setMaxFrames}
              quality={quality} setQuality={setQuality}
              orientation={orientation} setOrientation={setOrientation}
              deduplicate={deduplicate} setDeduplicate={setDeduplicate}
              framesPerPage={framesPerPage} setFramesPerPage={setFramesPerPage}
              addTimestamps={addTimestamps} setAddTimestamps={setAddTimestamps}
              startTime={startTime} setStartTime={setStartTime}
              endTime={endTime} setEndTime={setEndTime}
              disabled={status !== "idle" && status !== "error" && status !== "done"}
              onStart={startConversion}
            />
          </div>
          
          <div className="space-y-8 flex flex-col justify-start">
            {(status === "idle" || status === "error") && !jobId && (
              <div className="h-full border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-12 text-slate-500 text-center min-h-[400px] bg-slate-900/30">
                <div className="w-16 h-16 mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-medium text-lg text-slate-400">Waiting to start conversion...</p>
                <p className="text-sm mt-2">Your progress will appear here</p>
              </div>
            )}
            
            {status !== "idle" && status !== "done" && status !== "error" && status !== "review" && (
              <ProgressTracker status={status} progress={progress} message={message} />
            )}
            
            {status === "review" && jobId && (
               <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Review Frames</h3>
                    <p className="text-sm text-slate-400">{frames.filter(f => f.selected).length} of {frames.length} selected</p>
                </div>
                <div className="grid grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {frames.map((frame, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => toggleFrame(idx)}
                            className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${frame.selected ? 'border-violet-500 shadow-[0_0_10px_rgba(124,58,237,0.5)]' : 'border-slate-800 opacity-50 grayscale'}`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={`${API_URL}${frame.url}`} alt={frame.name} className="w-full h-full object-cover" />
                            {frame.selected && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <button 
                  onClick={generatePDF}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl font-bold text-white shadow-lg hover:shadow-violet-500/25 transition-all"
                >
                  Confirm & Generate PDF
                </button>
               </div>
            )}
            
            {status === "done" && jobId && (
              <DownloadCard jobId={jobId} apiUrl={API_URL} />
            )}
            
            {status === "error" && (
              <div className="p-8 bg-red-950/30 border border-red-900/50 rounded-2xl text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-red-900/50 text-red-400 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-red-400 font-semibold text-xl mb-2">Conversion failed</p>
                <p className="text-slate-400 mb-6">{message || "An unexpected error occurred"}</p>
                <button 
                  onClick={() => { setStatus("idle"); setJobId(null); }}
                  className="px-6 py-3 bg-slate-800 rounded-full font-medium hover:bg-slate-700 transition-colors shadow-lg"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
