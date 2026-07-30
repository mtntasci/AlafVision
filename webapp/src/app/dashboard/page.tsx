"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, LogOut, Video } from "lucide-react";
import { PlateFeed, PlateResult } from "../../components/PlateFeed";

export default function Dashboard() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [results, setResults] = useState<PlateResult[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("alafvision_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Initialize WebSocket
    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://visionapi.alafteknoloji.com/stream";
    const socket = new WebSocket(`${socketUrl}?token=${token}`);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newResult: PlateResult = {
          id: Date.now().toString(),
          text: data.text || "UNKNOWN",
          make: data.make,
          model: data.model,
          color: data.color,
          timestamp: Date.now(),
        };
        
        setResults((prev) => [newResult, ...prev]);
      } catch (e) {
        console.error("Error parsing message", e);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setWs(null);
    };

    return () => {
      socket.close();
    };
  }, [router]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let intervalId: NodeJS.Timeout;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }

        // Send frames every 300ms (approx 3 frames per second)
        intervalId = setInterval(sendFrame, 300);
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    const sendFrame = () => {
      if (videoRef.current && canvasRef.current && ws && ws.readyState === WebSocket.OPEN) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (context && video.videoWidth > 0 && video.videoHeight > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              ws.send(blob);
            }
          }, "image/jpeg", 0.7);
        }
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      clearInterval(intervalId);
    };
  }, [ws]);

  const handleLogout = () => {
    localStorage.removeItem("alafvision_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Effects matching AGENTS.md */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px]" />
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: `40px 40px`,
          }} 
        />
      </div>

      {/* Header (Navbar Rule) */}
      <header className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-6 py-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Camera className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Alaf <span className="text-blue-500">Vision</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 ml-4 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Canlı Akış
          </span>
        </div>
        
        {/* Secondary Button Rule */}
        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-white border border-white/10 rounded-lg hover:bg-slate-800 transition-all font-medium text-sm"
        >
          <LogOut size={16} className="text-slate-400 group-hover:text-white transition-colors" />
          Çıkış
        </button>
      </header>

      {/* Camera View */}
      <main className="flex-1 relative bg-slate-950 flex items-center justify-center pt-20 pb-4 px-4 z-10">
        <div className="w-full h-full max-h-[60vh] max-w-5xl mx-auto bg-slate-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
          {!isStreaming && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 z-10 flex-col gap-4 bg-slate-900/80 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Video className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              <p className="font-medium text-slate-400">Kamera başlatılıyor...</p>
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover opacity-90 mix-blend-screen"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Subtle overlay to make it fit dark theme better */}
          <div className="absolute inset-0 border-4 border-slate-950/20 rounded-3xl pointer-events-none" />
        </div>
      </main>

      {/* Results Feed */}
      <div className="relative z-20 container mx-auto px-4 pb-4">
        <PlateFeed results={results} />
      </div>
    </div>
  );
}
