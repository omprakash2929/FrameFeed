import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";

interface SettingsPanelProps {
  fps: number;
  setFps: (v: number) => void;
  maxFrames: number;
  setMaxFrames: (v: number) => void;
  quality: string;
  setQuality: (v: string) => void;
  orientation: string;
  setOrientation: (v: string) => void;
  deduplicate: boolean;
  setDeduplicate: (v: boolean) => void;
  framesPerPage: number;
  setFramesPerPage: (v: number) => void;
  addTimestamps: boolean;
  setAddTimestamps: (v: boolean) => void;
  startTime: string;
  setStartTime: (v: string) => void;
  endTime: string;
  setEndTime: (v: string) => void;
  disabled: boolean;
  onStart: () => void;
}

export function SettingsPanel({
  fps, setFps, maxFrames, setMaxFrames, quality, setQuality,
  orientation, setOrientation, deduplicate, setDeduplicate,
  framesPerPage, setFramesPerPage, addTimestamps, setAddTimestamps,
  startTime, setStartTime, endTime, setEndTime, disabled, onStart
}: SettingsPanelProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-8 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-slate-100 flex items-center">
        <svg className="w-5 h-5 mr-2 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Extraction Settings
      </h2>
      
      <div className="space-y-6">
        {/* Basic Settings */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-slate-300 font-medium">Frames Per Second (FPS)</Label>
            <span className="text-xs font-medium bg-violet-500/20 text-violet-300 px-2.5 py-1 rounded-full">{fps} fps</span>
          </div>
          <Slider 
            disabled={disabled}
            value={[fps]} 
            onValueChange={(vals: any) => setFps(Array.isArray(vals) ? vals[0] : vals)} 
            max={2} min={0.1} step={0.1}
            className="py-2"
          />
          <p className="text-xs text-slate-500">How many frames to extract per second of video.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">Start Time (e.g. 00:10)</Label>
            <Input disabled={disabled} type="text" placeholder="HH:MM:SS or Secs" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-slate-950/50 border-slate-800" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">End Time (e.g. 01:20)</Label>
            <Input disabled={disabled} type="text" placeholder="HH:MM:SS or Secs" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bg-slate-950/50 border-slate-800" />
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-slate-300 font-medium">Max Frames Total</Label>
          <Input 
            disabled={disabled}
            type="number" 
            value={maxFrames} 
            onChange={(e) => setMaxFrames(Number(e.target.value))}
            className="bg-slate-950/50 border-slate-800 text-slate-200"
          />
          <p className="text-xs text-slate-500">Stop extracting after this many frames.</p>
        </div>
        
        <div className="space-y-3">
          <Label className="text-slate-300 font-medium">Image Quality (PDF Size)</Label>
          <select 
            disabled={disabled} 
            value={quality} 
            onChange={(e) => setQuality(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          >
            <option value="low">Low (Fast & Smallest PDF)</option>
            <option value="medium">Medium (Balanced)</option>
            <option value="high">High (Best Quality)</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
          <div className="space-y-0.5">
            <Label className="text-slate-200">AI Smart Deduplication</Label>
            <p className="text-xs text-slate-500">Automatically skip duplicate frames (e.g. static slides)</p>
          </div>
          <Switch disabled={disabled} checked={deduplicate} onCheckedChange={setDeduplicate} />
        </div>
        
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800/50">
          <div className="space-y-3">
            <Label className="text-slate-300 font-medium">Frames Per Page</Label>
            <select 
              disabled={disabled} 
              value={framesPerPage} 
              onChange={(e) => setFramesPerPage(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            >
              <option value={1}>1 Frame (Full)</option>
              <option value={2}>2 Frames (Notes)</option>
              <option value={4}>4 Frames (Grid)</option>
              <option value={6}>6 Frames (Grid)</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <Label className="text-slate-300 font-medium">Page Orientation</Label>
            <RadioGroup value={orientation} onValueChange={setOrientation} disabled={disabled} className="flex space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="landscape" id="landscape" className="border-slate-600 text-violet-500 aria-checked:bg-violet-500 aria-checked:border-violet-500" />
                <Label htmlFor="landscape" className="text-slate-300 cursor-pointer">Landscape</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="portrait" id="portrait" className="border-slate-600 text-violet-500 aria-checked:bg-violet-500 aria-checked:border-violet-500" />
                <Label htmlFor="portrait" className="text-slate-300 cursor-pointer">Portrait</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
          <div className="space-y-0.5">
            <Label className="text-slate-200">Include Timestamps</Label>
            <p className="text-xs text-slate-500">Print the video frame timestamp on the PDF</p>
          </div>
          <Switch disabled={disabled} checked={addTimestamps} onCheckedChange={setAddTimestamps} />
        </div>
      </div>
      
      <Button 
        onClick={onStart} 
        disabled={disabled}
        className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-6 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Extract Frames
      </Button>
    </div>
  );
}
