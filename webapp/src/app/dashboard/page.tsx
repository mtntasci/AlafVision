"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, LogOut, Video, Users, Car } from "lucide-react";
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

type AnomalySnapshot = {
  id: string;
  src: string;
  code: string;
  message: string;
  timestamp: number;
  type: 'intrusion' | 'loitering';
};

export default function Dashboard() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [results, setResults] = useState<PlateResult[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });
  const [mode, setMode] = useState<"selection" | "vehicle" | "human">("selection");
  const [anomalyMode, setAnomalyMode] = useState<"none" | "intrusion" | "loitering">("none");
  const [uniqueHumans, setUniqueHumans] = useState<Set<string>>(new Set());
  const [capturedSnapshots, setCapturedSnapshots] = useState<AnomalySnapshot[]>([]);
  const seenHumansRef = useRef<Set<string>>(new Set());
  const humanFirstSeenRef = useRef<Record<string, number>>({});
  const triggeredAnomaliesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    humanFirstSeenRef.current = {};
    triggeredAnomaliesRef.current.clear();
    setCapturedSnapshots([]);
  }, [anomalyMode]);

  useEffect(() => {
    if (mode === "selection") return;

    const token = localStorage.getItem("alafvision_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Initialize WebSocket
    const prefix = mode === "vehicle" ? "vehicle_" : "humanCounter_";
    const socketToken = `${prefix}${token}`;
    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://visionapi.alafteknoloji.com/stream";
    const socket = new WebSocket(`${socketUrl}?token=${socketToken}`);

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
            const resolvedId = item.id || Date.now().toString() + Math.random().toString(36).substring(7);
            return {
              id: resolvedId,
              text: mode === "human" ? resolvedId : (item.text || "UNKNOWN"),
              make: item.make || item.car?.make || "",
              model: item.model || item.car?.model || "",
              color: item.color || item.car?.color || "",
              type: item.type || item.car?.type || item.class || "", // class veya type olabilir
              box: item.car?.warpedBox || item.warpedBox || item.box || [],
              timestamp: Date.now(),
            } as PlateResult & { type?: string };
          })
          .filter((res) => {
            if (mode === "human") {
              return res.box && res.box.length > 0;
            }

            const makeLower = (res.make || "").trim().toLowerCase();
            const modelLower = (res.model || "").trim().toLowerCase();
            const textLower = (res.text || "").trim().toLowerCase();

            // Plaka, marka veya modelden en az biri geçerli (boş veya unknown değilse) olmalı
            const hasValidMake = makeLower !== "" && makeLower !== "unknown" && makeLower !== "null";
            const hasValidModel = modelLower !== "" && modelLower !== "unknown" && modelLower !== "null";
            const hasValidText = textLower !== "" && textLower !== "unknown" && textLower !== "null";

            return hasValidMake || hasValidModel || hasValidText;
          });

        if (mode === "human") {
          let hasNew = false;
          const now = Date.now();

          filteredResults.forEach((res) => {
            if (!seenHumansRef.current.has(res.text)) {
              seenHumansRef.current.add(res.text);
              hasNew = true;
            }

            if (!humanFirstSeenRef.current[res.text]) {
              humanFirstSeenRef.current[res.text] = now;
            }

            const firstSeen = humanFirstSeenRef.current[res.text];
            const durationMs = now - firstSeen;

            let anomalyTriggered = false;
            let anomalyType = "";
            let anomalyCode = "";
            let anomalyMessage = "";

            if (videoRef.current) {
              const video = videoRef.current;
              const coords = getBoxCoords(res.box);

              if (coords) {
                // Determine Anomaly
                if (anomalyMode === "intrusion") {
                  const zoneX = video.videoWidth * 0.7; // Right 30%
                  if (coords.x + coords.w > zoneX) {
                    anomalyTriggered = true;
                    anomalyType = "intrusion";
                    anomalyCode = "ZONE_BREACH";
                    anomalyMessage = "⚠️ YASAK BÖLGE İHLALİ";
                  }
                } else if (anomalyMode === "loitering") {
                  if (durationMs > 10000) {
                    anomalyTriggered = true;
                    anomalyType = "loitering";
                    anomalyCode = "TIME_EXCEED";
                    anomalyMessage = "⚠️ ŞÜPHELİ BEKLEME";
                  }
                }

                // Capture snapshot for anomaly
                const anomalyKey = `${res.text}_${anomalyCode}`;
                if (anomalyTriggered && !triggeredAnomaliesRef.current.has(anomalyKey)) {
                  triggeredAnomaliesRef.current.add(anomalyKey);

                  if (video.videoWidth > 0 && video.videoHeight > 0) {
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
                        code: anomalyCode,
                        message: anomalyMessage,
                        timestamp: now,
                        type: anomalyType as 'intrusion' | 'loitering'
                      }, ...prev]);
                    }
                  }
                }
              }
            }
          });

          if (hasNew) {
            setUniqueHumans(new Set(seenHumansRef.current));
          }
        }

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
      seenHumansRef.current.clear();
      setCapturedSnapshots([]);
    };
  }, [router, mode]);

  useEffect(() => {
    if (mode === "selection") return;

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
  }, [ws, mode]);

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
            Canlı Demo
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

      {mode === "selection" ? (
        <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 mt-20">
          <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              onClick={() => setMode("vehicle")}
              className="flex flex-col items-center justify-center gap-6 p-12 bg-surface-1 border border-border-subtle rounded-[2rem] hover:border-accent hover:bg-surface-2 transition-all shadow-xl group text-center"
            >
              <div className="w-24 h-24 rounded-3xl bg-accent-soft flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Car className="w-12 h-12 text-accent" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-primary-text mb-3">Demo Araç Tanıma</h3>
                <p className="text-secondary-text font-medium leading-relaxed">
                  Gelişmiş ALPR motorunu başlatarak plaka, marka ve renk tespiti yapın.
                </p>
              </div>
            </button>

            <button
              onClick={() => setMode("human")}
              className="flex flex-col items-center justify-center gap-6 p-12 bg-surface-1 border border-border-subtle rounded-[2rem] hover:border-blue-500 hover:bg-surface-2 transition-all shadow-xl group text-center"
            >
              <div className="w-24 h-24 rounded-3xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-12 h-12 text-blue-500" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-primary-text mb-3">Kişi Etiketleyip Sayma</h3>
                <p className="text-secondary-text font-medium leading-relaxed">
                  Çoklu model akışını başlatarak insanları tespit edin ve benzersiz ID'lerle sayın.
                </p>
              </div>
            </button>
          </div>
        </main>
      ) : (
        <>
          {/* Camera View */}
          <main className="flex-1 relative bg-background flex flex-col items-center justify-center pt-24 pb-4 px-4 z-10">
            {mode === "human" && (
              <div className="mb-6 w-full max-w-5xl mx-auto flex justify-center animate-in slide-in-from-top-4 fade-in duration-500">
                <div className="bg-surface-1/80 backdrop-blur-md border border-border-subtle rounded-2xl p-1 inline-flex shadow-lg overflow-x-auto custom-scrollbar">
                  <button 
                    onClick={() => setAnomalyMode("none")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${anomalyMode === "none" ? "bg-accent text-background shadow-sm" : "text-secondary-text hover:text-primary-text hover:bg-surface-2"}`}
                  >
                    Kapalı
                  </button>
                  <button 
                    onClick={() => setAnomalyMode("intrusion")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${anomalyMode === "intrusion" ? "bg-red-500 text-white shadow-sm" : "text-secondary-text hover:text-red-400 hover:bg-surface-2"}`}
                  >
                    Yasak Bölge İhlali
                  </button>
                  <button 
                    onClick={() => setAnomalyMode("loitering")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${anomalyMode === "loitering" ? "bg-orange-500 text-white shadow-sm" : "text-secondary-text hover:text-orange-400 hover:bg-surface-2"}`}
                  >
                    Uzun Bekleme Süresi
                  </button>
                </div>
              </div>
            )}
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
                    setVideoDimensions({
                      width: videoRef.current.videoWidth,
                      height: videoRef.current.videoHeight,
                    });
                    setIsStreaming(true);
                  }
                }}
              />
              {isStreaming && (
                <svg
                  className="absolute inset-0 w-full h-full z-20 pointer-events-none"
                  viewBox={`0 0 ${videoDimensions.width} ${videoDimensions.height}`}
                  preserveAspectRatio="xMidYMid meet"
                >
                  {anomalyMode === "intrusion" && mode === "human" && (
                    <rect
                      x={videoDimensions.width * 0.7}
                      y={0}
                      width={videoDimensions.width * 0.3}
                      height={videoDimensions.height}
                      fill="rgba(239, 68, 68, 0.15)"
                      stroke="rgba(239, 68, 68, 0.6)"
                      strokeWidth="4"
                      strokeDasharray="10, 10"
                    />
                  )}
                  
                  {results.map((res) => {
                    const coords = getBoxCoords(res.box);
                    if (!coords || !videoRef.current) return null;

                    let finalX = coords.x;
                    const finalY = coords.y;
                    const finalW = coords.w;
                    const finalH = coords.h;

                    // CSS transform check for mirroring
                    const style = window.getComputedStyle(videoRef.current);
                    const isMirrored = style.transform.includes("matrix(-1") || style.transform.includes("scaleX(-1)");

                    if (isMirrored) {
                      finalX = (videoDimensions.width || 1) - finalX - finalW;
                    }

                    let hasLabel = false;
                    let label = "";
                    let colorClass = "text-accent";

                    if (mode === "human") {
                      hasLabel = true;
                      label = `ID: ${res.text}`;
                      colorClass = "text-blue-500";

                      const firstSeen = humanFirstSeenRef.current[res.text] || Date.now();
                      const durationMs = Date.now() - firstSeen;

                      if (anomalyMode === "intrusion") {
                        const zoneX = (videoDimensions.width || 1) * 0.7;
                        if (coords.x + coords.w > zoneX) {
                          colorClass = "text-red-500";
                        }
                      } else if (anomalyMode === "loitering") {
                        if (durationMs > 10000) {
                          colorClass = "text-orange-500";
                        }
                      }
                    } else {
                      hasLabel = Boolean(res.text && res.text.toUpperCase() !== "UNKNOWN" && res.text.trim() !== "");
                      label = hasLabel ? res.text.toUpperCase() : "";
                      colorClass = "text-accent";
                    }

                    return (
                      <g key={res.id}>
                        <rect
                          x={finalX}
                          y={finalY}
                          width={finalW}
                          height={finalH}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          rx="8"
                          className={`${colorClass} drop-shadow-md`}
                        />
                        {hasLabel && (
                          <>
                            <rect
                              x={finalX}
                              y={finalY - 30}
                              width={Math.max(label.length * 10 + 16, 60)}
                              height="30"
                              fill="currentColor"
                              rx="4"
                              className={`${colorClass} drop-shadow-md`}
                            />
                            <text
                              x={finalX + 8}
                              y={finalY - 10}
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
            {mode === "human" ? (
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

                {/* Security Log Gallery */}
                {capturedSnapshots.length > 0 && (
                  <div className="w-full bg-surface-1 border border-border-subtle rounded-2xl p-4 shadow-md animate-in slide-in-from-bottom-4 fade-in duration-700">
                    <h3 className="text-base font-bold text-primary-text mb-4 tracking-tight px-1 flex items-center gap-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      Güvenlik Olay Günlüğü
                    </h3>
                    <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                      {capturedSnapshots.map(snap => {
                        const isIntrusion = snap.type === 'intrusion';
                        const colorClass = isIntrusion ? "border-red-500/40 bg-red-500/5 hover:border-red-500/80" : "border-orange-500/40 bg-orange-500/5 hover:border-orange-500/80";
                        const textColor = isIntrusion ? "text-red-500" : "text-orange-500";
                        const timeString = new Date(snap.timestamp).toLocaleTimeString('tr-TR');
                        
                        return (
                          <div key={`${snap.id}-${snap.timestamp}`} className={`flex items-start gap-4 border rounded-xl p-3 transition-colors shadow-sm ${colorClass}`}>
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-background shrink-0 border border-border-subtle">
                              <img src={snap.src} alt={`Anomaly ${snap.id}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                              <div className="flex justify-between items-center">
                                <span className={`text-xs font-black ${textColor} tracking-wider`}>
                                  {snap.message}
                                </span>
                                <span className="text-xs font-semibold text-secondary-text bg-surface-2 px-2 py-0.5 rounded border border-border-subtle shadow-sm">
                                  {timeString}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-xs font-bold text-primary-text bg-background px-2 py-1 rounded border border-border-subtle shadow-sm">
                                  ID: {snap.id}
                                </span>
                                <span className="text-xs font-semibold text-secondary-text bg-background px-2 py-1 rounded border border-border-subtle shadow-sm">
                                  KOD: {snap.code}
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
            ) : (
              <PlateFeed results={results} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
