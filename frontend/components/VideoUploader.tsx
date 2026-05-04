import { UploadCloud, FileVideo, X } from "lucide-react";
import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface VideoUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  disabled?: boolean;
}

export function VideoUploader({ file, setFile, disabled }: VideoUploaderProps) {
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidVideo(droppedFile)) {
        setFile(droppedFile);
      }
    }
  }, [disabled, setFile]);

  const isValidVideo = (file: File) => {
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    return validTypes.includes(file.type) || /\.(mp4|mov|avi|webm)$/i.test(file.name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (isValidVideo(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  if (file) {
    return (
      <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden relative group">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-400">
              <FileVideo className="w-8 h-8" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="text-slate-200 font-medium truncate" title={file.name}>{file.name}</h3>
              <p className="text-slate-500 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            {!disabled && (
              <button 
                onClick={() => setFile(null)}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "bg-slate-900/50 border-2 border-dashed border-slate-700 shadow-xl transition-all",
        !disabled && "hover:border-violet-500/50 hover:bg-slate-800/50 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <label className="flex flex-col items-center justify-center p-12 w-full h-full cursor-pointer relative">
        <input 
          type="file" 
          className="hidden" 
          accept=".mp4,.mov,.avi,.webm"
          onChange={handleFileChange}
          disabled={disabled}
        />
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <UploadCloud className="w-10 h-10 text-violet-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-200 mb-2">Upload Video</h3>
        <p className="text-slate-400 text-center max-w-xs">
          Drag and drop your video here, or click to browse.
        </p>
        <p className="text-xs text-slate-500 mt-4 font-medium tracking-wide">
          MP4, MOV, AVI, WEBM up to 500MB
        </p>
      </label>
    </Card>
  );
}
