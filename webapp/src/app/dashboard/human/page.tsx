"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Video } from "lucide-react";
import Link from "next/link";

function getBoxCoords(box?: number[]) {
  if (!box || box.length === 0) return null;
  if (box.length === 4) {
    return { x: box[0], y: box[1], w: box[2], h: box[3] };
  }
  return null;
}

type Snapshot = {
  id: string;
  src: string;
  timestamp: number;
};

export default function HumanDashboard() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });
  const [uniqueHumans, setUniqueHumans] = useState<Set<string>>(new Set());
  const [capturedSnapshots, setCapturedSnapshots] = useState<Snapshot[]>([]);
  const seenHumansRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem("alafvision_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://visionapi.alafteknoloji.com/stream";
    const socket = new WebSocket(`${socketUrl}?token=humanCounter_${token}`);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        let items: any[] = Array.isArray(data) ? data : [data];

        const filteredResults = items
          .map((item) => ({
            id: item.id || Date.now().toString(),
            text: item.id || "UNKNOWN",
            box: item.box || [],
          }))
          .filter((res) => res.box && res.box.length > 0);

        let hasNew = false;
        const now = Date.now();
        filteredResults.forEach((res) => {
          if (!seenHumansRef.current.has(res.text)) {
            seenHumansRef.current.add(res.text);
            hasNew = true;

            if (videoRef.current) {
              const video = videoRef.current;
              const coords = getBoxCoords(res.box);
              
              if (coords && video.videoWidth > 0 && video.videoHeight > 0) {
                const cropCanvas = document.createElement("canvas");
                const padding = 20;

                const cropX = Math.max(0, coords.x - padding);
                const cropY = Math.max(0, coords.y - padding);
                const cropW = Math.min(video.videoWidth - cropX, coords.w + padding * 2);
                const cropH = Math.min(video.videoHeight - cropY, coords.h + padding * 2);

                cropCanvas.width = cropW;
                cropCanvas.height = cropH;
                const cropCtx = cropCanvas.getContext("2d");

                if (cropCtx) {
                  cropCtx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
                  const dataUrl = cropCanvas.toDataURL("image/jpeg", 0.9);

                  setCapturedSnapshots(prev => [{
                    id: res.text,
                    src: dataUrl,
                    timestamp: now,
                  }, ...prev]);
                }
              }
            }
          }
        });

        if (hasNew) {
          setUniqueHumans(new Set(seenHumansRef.current));
        }

        setResults(filteredResults);
      } catch (e) {
        console.error("Error parsing message", e);
      }
    };

    socket.onclose = () => setWs(null);

    return () => {
      socket.close();
      seenHumansRef.current.clear();
      setCapturedSnapshots([]);
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
            if (blob) ws.send(blob);
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

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, backgroundSize: `40px 40px` }} />
      </div>

      <header className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-6 py-4 bg-background backdrop-blur-xl border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center border border-border-subtle hover:bg-surface-3 transition-colors cursor-pointer mr-2">
            <ArrowLeft className="w-5 h-5 text-secondary-text" />
          </Link>
          <span className="text-xl font-bold tracking-tight text-primary-text">
            Alaf <span className="text-accent">Vision</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 ml-4 px-3 py-1 rounded-full bg-blue-500/10 border border-border-subtle text-blue-500 text-xs font-semibold uppercase tracking-wider">
            Kişi Etiketleyip Sayma
          </span>
        </div>
      </header>

      <main className="flex-1 relative bg-background flex flex-col items-center justify-center pt-24 pb-4 px-4 z-10">
        <div className="relative w-full aspect-video min-h-[400px] max-h-[60vh] max-w-5xl mx-auto bg-surface-1 border border-border-subtle rounded-3xl overflow-hidden shadow-2xl">
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
            className="absolute inset-0 w-full h-full object-contain opacity-90 mix-blend-screen"
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setVideoDimensions({ width: videoRef.current.videoWidth, height: videoRef.current.videoHeight });
                setIsStreaming(true);
              }
            }}
          />
          {isStreaming && (
            <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" viewBox={`0 0 ${videoDimensions.width} ${videoDimensions.height}`} preserveAspectRatio="xMidYMid meet">
              {results.map((res) => {
                const coords = getBoxCoords(res.box);
                if (!coords || !videoRef.current) return null;

                let finalX = coords.x;
                const finalY = coords.y;
                const finalW = coords.w;
                const finalH = coords.h;

                const style = window.getComputedStyle(videoRef.current);
                const isMirrored = style.transform.includes("matrix(-1") || style.transform.includes("scaleX(-1)");
                if (isMirrored) {
                  finalX = (videoDimensions.width || 1) - finalX - finalW;
                }

                const label = `ID: ${res.text}`;

                return (
                  <g key={res.id}>
                    <rect x={finalX} y={finalY} width={finalW} height={finalH} fill="none" stroke="currentColor" strokeWidth="4" rx="8" className="text-blue-500 drop-shadow-md" />
                    <rect x={finalX} y={finalY - 30} width={Math.max(label.length * 10 + 16, 60)} height="30" fill="currentColor" rx="4" className="text-blue-500 drop-shadow-md" />
                    <text x={finalX + 8} y={finalY - 10} fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="system-ui, sans-serif">{label}</text>
                  </g>
                );
              })}
            </svg>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </main>

      <div className="relative z-20 container mx-auto px-4 pb-4">
        <div className="flex flex-col gap-4">
          {/* Compact Counters for Mobile */}
          <div className="w-full h-auto bg-surface-1 border border-border-subtle rounded-2xl p-4 shadow-md flex flex-col gap-3 animate-in fade-in duration-500">
            <div className="flex justify-between items-center px-2">
              <span className="text-sm font-bold text-secondary-text tracking-wide">ANLIK (TAKİP EDİLEN)</span>
              <span className="text-2xl font-black text-primary-text">{results.length}</span>
            </div>
            <div className="w-full h-px bg-border-subtle"></div>
            <div className="flex justify-between items-center px-2">
              <span className="text-sm font-bold text-secondary-text tracking-wide">BENZERSİZ KİŞİ</span>
              <span className="text-2xl font-black text-blue-500 drop-shadow-sm">{uniqueHumans.size}</span>
            </div>
          </div>

          {/* Captured Snapshots Gallery */}
          {capturedSnapshots.length > 0 && (
            <div className="w-full bg-surface-1 border border-border-subtle rounded-2xl p-4 shadow-md animate-in slide-in-from-bottom-4 fade-in duration-700">
              <h3 className="text-base font-bold text-primary-text mb-4 tracking-tight px-1 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                Tespit Edilen Kişiler
              </h3>
              <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {capturedSnapshots.map(snap => {
                  const timeString = new Date(snap.timestamp).toLocaleTimeString('tr-TR');
                  return (
                    <div key={`${snap.id}-${snap.timestamp}`} className="flex items-start gap-4 border rounded-xl p-3 transition-colors shadow-sm border-blue-500/40 bg-blue-500/5 hover:border-blue-500/80">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-background shrink-0 border border-border-subtle">
                        <img src={snap.src} alt={`Person ${snap.id}`} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-blue-500 tracking-wider">
                            YENİ KİŞİ TESPİTİ
                          </span>
                          <span className="text-xs font-semibold text-secondary-text bg-surface-2 px-2 py-0.5 rounded border border-border-subtle shadow-sm">
                            {timeString}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-primary-text bg-background px-2 py-1 rounded border border-border-subtle shadow-sm">
                            ID: {snap.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
