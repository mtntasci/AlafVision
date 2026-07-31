"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, LogOut, Video } from "lucide-react";
import { PlateFeed, PlateResult } from "../../components/PlateFeed";

function getBoxCoords(box?: number[]) {
  if (!box || box.length === 0) return null;
  if (box.length === 4) {
    return { x: box[0], y: box[1], w: box[2], h: box[3] };
  }
  if (box.length >= 8) {
    const minX = Math.min(box[0], box[2], box[4], box[6]);
    const minY = Math.min(box[1], box[3], box[5], box[7]);
    const maxX = Math.max(box[0], box[2], box[4], box[6]);
    const maxY = Math.max(box[1], box[3], box[5], box[7]);
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
  }
  return null;
}

export default function Dashboard() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [results, setResults] = useState<PlateResult[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });

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
        
        // Gelen veriyi diziye normalize edelim (tek obje, dizi veya plates dizisi olabilir)
        let items: any[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data.plates && Array.isArray(data.plates)) {
          items = data.plates;
        } else if (data.text || data.make || data.model) {
          // Fallback for single flat object mock
          items = [data];
        }

        const filteredResults: PlateResult[] = items
          .map((item) => {
            return {
              id: item.id || Date.now().toString() + Math.random().toString(36).substring(7),
              text: item.text || "UNKNOWN",
              make: item.make || item.car?.make || "",
              model: item.model || item.car?.model || "",
              color: item.color || item.car?.color || "",
              type: item.type || item.car?.type || item.class || "", // class veya type olabilir
              box: item.car?.warpedBox || item.warpedBox || item.box || [],
              timestamp: Date.now(),
            } as PlateResult & { type?: string };
          })
          .filter((res) => {
            const makeLower = (res.make || "").trim().toLowerCase();
            const modelLower = (res.model || "").trim().toLowerCase();
            const textLower = (res.text || "").trim().toLowerCase();

            // Plaka, marka veya modelden en az biri geçerli (boş veya unknown değilse) olmalı
            const hasValidMake = makeLower !== "" && makeLower !== "unknown" && makeLower !== "null";
            const hasValidModel = modelLower !== "" && modelLower !== "unknown" && modelLower !== "null";
            const hasValidText = textLower !== "" && textLower !== "unknown" && textLower !== "null";

            return hasValidMake || hasValidModel || hasValidText;
          });

        // Ekranda hayalet araç birikmemesi için ...prev yerine doğrudan yeni listeyi set ediyoruz (replace)
        setResults(filteredResults);
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
          videoRef.current.onloadedmetadata = () => {
            setVideoDimensions({
              width: videoRef.current!.videoWidth,
              height: videoRef.current!.videoHeight,
            });
            setIsStreaming(true);
          };
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
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Effects matching AGENTS.md */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        
        
        
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
      <header className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-6 py-4 bg-background backdrop-blur-xl border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center border border-border-subtle">
            <Camera className="w-5 h-5 text-accent" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary-text">
            Alaf <span className="text-accent">Vision</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 ml-4 px-3 py-1 rounded-full bg-accent-soft border border-border-subtle text-accent text-xs font-semibold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-soft"></span>
            </span>
            Canlı Akış
          </span>
        </div>
        
        {/* Secondary Button Rule */}
        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 px-4 py-2 bg-surface-2 text-primary-text border border-border-subtle rounded-lg hover:bg-surface-2 transition-all font-medium text-sm"
        >
          <LogOut size={16} className="text-secondary-text group-hover:text-primary-text transition-colors" />
          Çıkış
        </button>
      </header>

      {/* Camera View */}
      <main className="flex-1 relative bg-background flex items-center justify-center pt-20 pb-4 px-4 z-10">
        <div className="w-full h-full max-h-[60vh] max-w-5xl mx-auto bg-surface-1 border border-border-subtle rounded-3xl overflow-hidden shadow-2xl relative">
          {!isStreaming && (
            <div className="absolute inset-0 flex items-center justify-center text-secondary-text z-10 flex-col gap-4 bg-surface-1/80 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-2xl bg-accent-soft flex items-center justify-center border border-border-subtle">
                <Video className="w-8 h-8 text-accent animate-pulse" />
              </div>
              <p className="font-medium text-secondary-text">Kamera başlatılıyor...</p>
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover opacity-90 mix-blend-screen"
          />
          {isStreaming && (
            <svg
              className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none"
              preserveAspectRatio="xMidYMid slice"
              viewBox={`0 0 ${videoDimensions.width} ${videoDimensions.height}`}
            >
              {results.map((res) => {
                const coords = getBoxCoords(res.box);
                if (!coords) return null;
                
                // Sadece plakayı göster, eğer plaka yoksa label oluşturma
                const hasPlate = res.text && res.text.toUpperCase() !== "UNKNOWN" && res.text.trim() !== "";
                const label = hasPlate ? res.text.toUpperCase() : "";

                return (
                  <g key={res.id}>
                    <rect
                      x={coords.x}
                      y={coords.y}
                      width={coords.w}
                      height={coords.h}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      rx="8"
                      className="text-accent drop-shadow-md"
                    />
                    {hasPlate && (
                      <>
                        <rect
                          x={coords.x}
                          y={coords.y - 30}
                          width={Math.max(label.length * 10 + 16, 60)}
                          height="30"
                          fill="currentColor"
                          rx="4"
                          className="text-accent drop-shadow-md"
                        />
                        <text
                          x={coords.x + 8}
                          y={coords.y - 10}
                          fill="#ffffff"
                          fontSize="16"
                          fontWeight="bold"
                          fontFamily="system-ui, sans-serif"
                        >
                          {label}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Subtle overlay to make it fit dark theme better */}
          
        </div>
      </main>

      {/* Results Feed */}
      <div className="relative z-20 container mx-auto px-4 pb-4">
        <PlateFeed results={results} />
      </div>
    </div>
  );
}
