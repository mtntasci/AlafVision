"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, LogOut } from "lucide-react";
import { PlateFeed, PlateResult } from "../../components/PlateFeed";

export default function Dashboard() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [results, setResults] = useState<PlateResult[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("alafplate_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Initialize WebSocket
    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://plateapi.alafteknoloji.com/stream";
    const socket = new WebSocket(`${socketUrl}?token=${token}`);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Assuming data is { text: "...", make: "...", model: "...", color: "..." }
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
    localStorage.removeItem("alafplate_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-slate-950/80 to-transparent">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <Camera className="text-blue-500" />
          AlafPlate
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all backdrop-blur-sm"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Camera View */}
      <main className="flex-1 relative bg-black flex items-center justify-center">
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 z-10 flex-col gap-4">
            <Camera size={48} className="animate-pulse opacity-50" />
            <p>Initializing camera...</p>
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </main>

      {/* Results Feed */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <PlateFeed results={results} />
      </div>
    </div>
  );
}
