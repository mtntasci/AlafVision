"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Video, Activity, Map, ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";

function getBoxCoords(box?: number[]) {
  if (!box || box.length === 0) return null;
  if (box.length === 4) {
    return { x: box[0], y: box[1], w: box[2], h: box[3] };
  }
  return null;
}

export default function StoreDashboard() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const heatmapCanvasRef = useRef<HTMLCanvasElement>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  // Tripwire (Sanal Çizgi) state
  const tripwireY = videoDimensions.height / 2; // Çizgi her zaman ekranın ortasında yatay

  // Sayaçlar
  const [enteredCount, setEnteredCount] = useState(0);
  const [exitedCount, setExitedCount] = useState(0);
  
  // Geçiş takibi için önceki pozisyonlar
  const previousPositionsRef = useRef(new Map<string, number>());

  useEffect(() => {
    const token = localStorage.getItem("alafvision_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://visionapi.alafteknoloji.com/stream";
    const socket = new WebSocket(`${socketUrl}?token=store_${token}`);

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
            box: item.box || [],
          }))
          .filter((res) => res.box && res.box.length > 0);

        // Sanal Kapı / Çizgi (Tripwire) Analizi
        filteredResults.forEach(res => {
          const coords = getBoxCoords(res.box);
          if (coords) {
            const centerY = coords.y + coords.h / 2;
            const prevY = previousPositionsRef.current.get(res.id);
            
            if (prevY !== undefined) {
              // Yukarıdan aşağıya geçiş (Giren)
              if (prevY < tripwireY && centerY >= tripwireY) {
                setEnteredCount(prev => prev + 1);
              }
              // Aşağıdan yukarıya geçiş (Çıkan)
              else if (prevY >= tripwireY && centerY < tripwireY) {
                setExitedCount(prev => prev + 1);
              }
            }
            previousPositionsRef.current.set(res.id, centerY);

            // Heatmap Çizimi
            if (heatmapCanvasRef.current && showHeatmap) {
              const ctx = heatmapCanvasRef.current.getContext("2d");
              if (ctx) {
                const centerX = coords.x + coords.w / 2;
                
                // Opaklık bazlı yığılma (Isı Haritası efekti)
                const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
                gradient.addColorStop(0, "rgba(255, 0, 0, 0.05)");
                gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        });

        setResults(filteredResults);
      } catch (e) {
        console.error("Error parsing message", e);
      }
    };

    socket.onclose = () => setWs(null);

    return () => socket.close();
  }, [router, tripwireY, showHeatmap]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const clearHeatmap = () => {
    if (heatmapCanvasRef.current) {
      const ctx = heatmapCanvasRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, heatmapCanvasRef.current.width, heatmapCanvasRef.current.height);
    }
  };

  return (
    <div className="h-[100dvh] bg-background flex flex-col relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, backgroundSize: `40px 40px` }} />
      </div>

      <header className="flex-none h-[64px] z-30 flex justify-between items-center px-4 bg-background border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center border border-border-subtle hover:bg-surface-3 transition-colors cursor-pointer mr-1">
            <ArrowLeft className="w-5 h-5 text-secondary-text" />
          </Link>
          <span className="text-xl font-bold tracking-tight text-primary-text hidden sm:inline-block">
            Alaf <span className="text-accent">Vision</span>
          </span>
          <span className="flex items-center gap-1.5 ml-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-border-subtle text-emerald-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            Mağaza İstatistikleri
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              if (showHeatmap) clearHeatmap();
              setShowHeatmap(!showHeatmap);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs sm:text-sm transition-colors ${showHeatmap ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg' : 'bg-surface-2 text-secondary-text border-border-subtle hover:bg-surface-3'}`}
          >
            <Map size={16} />
            <span className="hidden sm:inline">{showHeatmap ? "Haritayı Gizle" : "Isı Haritası"}</span>
          </button>
        </div>
      </header>

      <div className="flex-none w-full max-w-3xl mx-auto px-4 pt-4 pb-2 z-10 flex flex-col gap-3">
        <div className="relative w-full aspect-video bg-surface-1 border border-border-subtle rounded-2xl overflow-hidden shadow-lg">
          {!isStreaming && (
            <div className="absolute inset-0 flex items-center justify-center text-secondary-text z-10 flex-col gap-4 bg-surface-1/80 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-border-subtle">
                <Video className="w-8 h-8 text-emerald-500 animate-pulse" />
              </div>
              <p className="font-medium text-secondary-text">Kamera başlatılıyor...</p>
            </div>
          )}
          
          {/* Kamera Akışı */}
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
          
          {/* Isı Haritası (Heatmap) Katmanı */}
          <canvas 
            ref={heatmapCanvasRef}
            width={videoDimensions.width}
            height={videoDimensions.height}
            className={`absolute inset-0 w-full h-full z-10 pointer-events-none transition-opacity duration-500 ${showHeatmap ? 'opacity-80' : 'opacity-0'}`} 
            style={{ mixBlendMode: 'screen' }}
          />

          {/* Kutu ve Çizgi Çizimleri */}
          {isStreaming && (
            <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" viewBox={`0 0 ${videoDimensions.width} ${videoDimensions.height}`} preserveAspectRatio="xMidYMid meet">
              {/* Tripwire (Sanal Kapı) */}
              <line x1="0" y1={tripwireY} x2={videoDimensions.width} y2={tripwireY} stroke="#10b981" strokeWidth="4" strokeDasharray="10, 10" className="drop-shadow-lg opacity-80 animate-pulse" />
              <text x={10} y={tripwireY - 10} fill="#10b981" fontSize="18" fontWeight="black" className="drop-shadow-md">SANAL KAPI (Tripwire)</text>
              
              {/* Kişi Kutuları */}
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

                // Kişi kutusunu çizerken, ısı haritası aktifse kutuları daha şeffaf yap
                const boxOpacity = showHeatmap ? 0.3 : 1;
                
                return (
                  <g key={res.id} opacity={boxOpacity}>
                    <rect x={finalX} y={finalY} width={finalW} height={finalH} fill="none" stroke="#10b981" strokeWidth="3" rx="8" />
                    <circle cx={finalX + finalW/2} cy={finalY + finalH/2} r="4" fill="#ffffff" />
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Mağaza İstatistikleri (Kompakt Sayaç) */}
        <div className="w-full bg-surface-1 border border-border-subtle rounded-xl p-3 shadow-md flex justify-around items-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-emerald-500 tracking-wider flex items-center gap-1"><ArrowDown size={12}/> İÇERİ GİREN</span>
            <span className="text-2xl font-black text-emerald-500 drop-shadow-sm">{enteredCount}</span>
          </div>
          <div className="h-10 w-px bg-border-subtle"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-orange-500 tracking-wider flex items-center gap-1"><ArrowUp size={12}/> DIŞARI ÇIKAN</span>
            <span className="text-2xl font-black text-orange-500 drop-shadow-sm">{exitedCount}</span>
          </div>
          <div className="h-10 w-px bg-border-subtle"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-secondary-text tracking-wider flex items-center gap-1"><Activity size={12}/> AKTİF</span>
            <span className="text-2xl font-black text-primary-text">{results.length}</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 pb-4 min-h-0 z-10">
        <div className="w-full h-full bg-surface-1 border border-border-subtle rounded-2xl p-6 shadow-md flex flex-col justify-center items-center text-center">
          <Activity size={48} className="text-emerald-500/50 mb-4" />
          <h3 className="text-xl font-bold text-primary-text mb-2">Canlı Analiz Aktif</h3>
          <p className="text-sm text-secondary-text max-w-sm">
            Kamera üzerindeki yeşil kesik çizgi sanal bir kapı görevi görür. Kişilerin merkez noktası bu çizgiyi geçtiğinde giriş-çıkış sayaçları güncellenir.
          </p>
        </div>
      </div>
      
    </div>
  );
}
