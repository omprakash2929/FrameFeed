import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, Package, Layers } from "lucide-react";

interface ProgressTrackerProps {
  status: string;
  progress: number;
  message: string;
}

export function ProgressTracker({ status, progress, message }: ProgressTrackerProps) {
  const isDone = status === "done";
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur in background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
        
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-800" />
            <circle 
              cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="6" 
              className="text-violet-500 transition-all duration-500 ease-out" 
              strokeDasharray={`${progress * 2.89} 289`}
            />
          </svg>
          <div className="bg-slate-950 w-16 h-16 rounded-full flex items-center justify-center shadow-inner">
            {isDone ? (
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            ) : status === "extracting" ? (
              <Layers className="w-8 h-8 text-violet-400 animate-pulse" />
            ) : status === "generating" ? (
              <Package className="w-8 h-8 text-blue-400 animate-pulse" />
            ) : (
              <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-100 capitalize">
            {status}
          </h3>
          <p className="text-slate-400 max-w-[250px] mx-auto text-sm">{message}</p>
        </div>

        <div className="w-full space-y-2 pt-4">
          <div className="flex justify-between text-xs font-semibold text-slate-500 px-1">
            <span>Progress</span>
            <span className="text-violet-400">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-800" />
        </div>
        
      </div>
    </div>
  );
}
