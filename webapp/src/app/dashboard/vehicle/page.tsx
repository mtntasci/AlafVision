"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Video } from "lucide-react";
import { PlateFeed, PlateResult } from "../../../components/PlateFeed";
import Link from "next/link";

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

export default function VehicleDashboard() {
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

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://visionapi.alafteknoloji.com/stream";
    const socket = new WebSocket(`${socketUrl}?token=vehicle_${token}`);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        let items: any[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data.plates && Array.isArray(data.plates)) {
          items = data.plates;
        } else if (data.text || data.make || data.model) {
          items = [data];
        }

        const filteredResults: PlateResult[] = items
          .map((item) => {
            const resolvedId = item.id || Date.now().toString() + Math.random().toString(36).substring(7);
            return {
              id: resolvedId,
              text: item.text || "UNKNOWN",
              make: item.make || item.car?.make || "",
              model: item.model || item.car?.model || "",
              color: item.color || item.car?.color || "",
              type: item.type || item.car?.type || item.class || "",
              box: item.car?.warpedBox || item.warpedBox || item.box || [],
              timestamp: Date.now(),
            } as PlateResult;
          })
          .filter((res) => {
            const makeLower = (res.make || "").trim().toLowerCase();
            const modelLower = (res.model || "").trim().toLowerCase();
            const textLower = (res.text || "").trim().toLowerCase();

            const hasValidMake = makeLower !== "" && makeLower !== "unknown" && makeLower !== "null";
            const hasValidModel = modelLower !== "" && modelLower !== "unknown" && modelLower !== "null";
            const hasValidText = textLower !== "" && textLower !== "unknown" && textLower !== "null";

            return hasValidMake || hasValidModel || hasValidText;
          });

        setResults(filteredResults);
      } catch (e) {
        console.error("Error parsing message", e);
      }
    };

    socket.onclose = () => setWs(null);

    return () => socket.close();
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
          <span className="hidden md:inline-flex items-center gap-1.5 ml-4 px-3 py-1 rounded-full bg-accent-soft border border-border-subtle text-accent text-xs font-semibold uppercase tracking-wider">
            Demo Araç Tanıma
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

                const hasLabel = Boolean(res.text && res.text.toUpperCase() !== "UNKNOWN" && res.text.trim() !== "");
                const label = hasLabel ? res.text.toUpperCase() : "";

                return (
                  <g key={res.id}>
                    <rect x={finalX} y={finalY} width={finalW} height={finalH} fill="none" stroke="currentColor" strokeWidth="4" rx="8" className="text-accent drop-shadow-md" />
                    {hasLabel && (
                      <>
                        <rect x={finalX} y={finalY - 30} width={Math.max(label.length * 10 + 16, 60)} height="30" fill="currentColor" rx="4" className="text-accent drop-shadow-md" />
                        <text x={finalX + 8} y={finalY - 10} fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="system-ui, sans-serif">{label}</text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </main>

      <div className="relative z-20 container mx-auto px-4 pb-4">
        <PlateFeed results={results} />
      </div>
    </div>
  );
}
