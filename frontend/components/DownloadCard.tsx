import { Button } from "@/components/ui/button";
import { Download, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DownloadCardProps {
  jobId: string;
  apiUrl: string;
}

export function DownloadCard({ jobId, apiUrl }: DownloadCardProps) {
  const downloadUrl = `${apiUrl}/api/download/${jobId}`;
  
  return (
    <Card className="bg-slate-900 border-slate-800 shadow-2xl overflow-hidden relative group">
      {/* Success gradient background */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
      
      <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-900/20 rounded-full flex items-center justify-center relative">
          <FileText className="w-10 h-10 text-emerald-400" />
          <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-0.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-900/50" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-100">Ready to Download</h3>
          <p className="text-slate-400 text-sm">Your PDF has been successfully generated and is ready to be saved.</p>
        </div>
        
        <a href={downloadUrl} download className="w-full mt-4 block">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 text-lg rounded-xl shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02]">
            <Download className="w-6 h-6 mr-2" />
            Download PDF
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}
