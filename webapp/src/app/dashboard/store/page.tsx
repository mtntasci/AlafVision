"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Video, Activity, Map, ArrowRight, ArrowLeft as ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import * as faceapi from "face-api.js";
import { db } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heatmapCanvasRef = useRef<HTMLCanvasElement>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  // Snapshots for crossings
  type CrossingSnapshot = { id: string; src: string; type: "ENTER" | "EXIT"; timestamp: number; name?: string };
  const [capturedSnapshots, setCapturedSnapshots] = useState<CrossingSnapshot[]>([]);

  // Tripwire (Sanal Çizgi) state
  const tripwireX = videoDimensions.width * 0.7; // Dik çizgi, ekranın sağ %30'luk kısmında

  // Sayaçlar
  const [enteredCount, setEnteredCount] = useState(0);
  const [exitedCount, setExitedCount] = useState(0);

  // Geçiş takibi için önceki pozisyonlar
  const previousPositionsRef = useRef<Record<string, number>>({});

  // Yüz Tanıma state'leri
  const [knownMap, setKnownMap] = useState<Record<string, string>>({});
  const knownFacesRef = useRef<{ name: string, customId?: string, descriptor: number[] }[]>([]);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const recognitionAttemptsRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]);
        console.log("Face-API models loaded in store dashboard!");
      } catch (e) {
        console.error("Model loading error:", e);
      }
    };

    const fetchKnownFaces = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "known_faces"));
        const faces: { name: string, customId?: string, descriptor: number[] }[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.name && data.descriptor) {
            faces.push({ name: data.name, customId: data.customId, descriptor: data.descriptor });
          }
        });
        knownFacesRef.current = faces;
      } catch (e) {
        console.error("Firebase fetch error:", e);
      }
    };

    loadModels();
    fetchKnownFaces();
  }, []);

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
            id: item.text || item.id || Date.now().toString(),
            box: item.box || [],
          }))
          .filter((res) => res.box && res.box.length > 0);

        // Sanal Kapı / Çizgi (Tripwire) Analizi
        filteredResults.forEach(res => {
          const coords = getBoxCoords(res.box);

          const isKnown = knownIdsRef.current.has(res.id);
          const attempts = recognitionAttemptsRef.current[res.id] || 0;
          const shouldAttemptRecognition = !isKnown && attempts < 5;

          if (coords) {
            const centerX = coords.x + coords.w / 2;
            const centerY = coords.y + coords.h / 2;
            const prevX = previousPositionsRef.current[res.id];

            if (prevX !== undefined) {
              // Soldan sağa geçiş (Giren)
              if (prevX < tripwireX && centerX >= tripwireX) {
                setEnteredCount(prev => prev + 1);
                if (videoRef.current && videoRef.current.videoWidth > 0) {
                  takeSnapshot(res.id, coords, videoRef.current, "ENTER");
                }
              }
              // Sağdan sola geçiş (Çıkan)
              else if (prevX >= tripwireX && centerX < tripwireX) {
                setExitedCount(prev => prev + 1);
                if (videoRef.current && videoRef.current.videoWidth > 0) {
                  takeSnapshot(res.id, coords, videoRef.current, "EXIT");
                }
              }
            }
            previousPositionsRef.current[res.id] = centerX;

            // Heatmap Çizimi
            if (heatmapCanvasRef.current && showHeatmap) {
              const ctx = heatmapCanvasRef.current.getContext("2d");
              if (ctx) {
                const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
                gradient.addColorStop(0, "rgba(255, 0, 0, 0.05)");
                gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
                ctx.fill();
              }
            }

            // --- Yüz Tanıma ---
            if (shouldAttemptRecognition && videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
              const video = videoRef.current;
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

                recognitionAttemptsRef.current[res.id] = attempts + 1;

                setTimeout(async () => {
                  try {
                    const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.1 });
                    const detection = await faceapi.detectSingleFace(cropCanvas, options).withFaceLandmarks().withFaceDescriptor();
                    if (detection && knownFacesRef.current.length > 0) {
                      let bestMatch = { name: "", customId: "", distance: 1.0 };
                      for (const known of knownFacesRef.current) {
                        const distance = faceapi.euclideanDistance(detection.descriptor, new Float32Array(known.descriptor));
                        if (distance < bestMatch.distance) {
                          bestMatch = { name: known.name, customId: known.customId || "", distance };
                        }
                      }
                      if (bestMatch.distance < 0.58) {
                        knownIdsRef.current.add(res.id);
                        const displayName = bestMatch.customId ? `${bestMatch.name} (${bestMatch.customId})` : bestMatch.name;
                        setKnownMap(prev => ({ ...prev, [res.id]: displayName }));
                      }
                    }
                  } catch (e) {
                    console.error("Face matching error:", e);
                  }
                }, 50);
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

    return () => {
      socket.close();
      knownIdsRef.current.clear();
      recognitionAttemptsRef.current = {};
    };
  }, [router, tripwireX, showHeatmap]);

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
      if (stream) stream.getTracks().forEach((track) => track.stop());
      clearInterval(intervalId);
    };
  }, [ws]);

  const takeSnapshot = (id: string, coords: any, video: HTMLVideoElement, type: "ENTER" | "EXIT") => {
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
        id, src: dataUrl, type, timestamp: Date.now()
      }, ...prev].slice(0, 50));
    }
  };

  const clearHeatmap = () => {
    if (heatmapCanvasRef.current) {
      const ctx = heatmapCanvasRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, heatmapCanvasRef.current.width, heatmapCanvasRef.current.height);
    }
  };

  return (
    <div className="h-[100dvh] bg-background flex flex-col relative overflow-y-auto overflow-x-hidden font-sans">
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
          />

          <canvas ref={canvasRef} className="hidden" />

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
              <line x1={tripwireX} y1="0" x2={tripwireX} y2={videoDimensions.height} stroke="#10b981" strokeWidth="4" strokeDasharray="10, 10" className="drop-shadow-lg opacity-80 animate-pulse" />
              <text x={tripwireX + 10} y={30} fill="#10b981" fontSize="18" fontWeight="black" className="drop-shadow-md">SANAL KAPI</text>

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

                const knownName = knownMap[res.id];
                const label = knownName ? knownName : `ID: ${res.id}`;
                const colorHex = knownName ? "#a855f7" : "#10b981"; // Bilinen kişi ise mor, değilse zümrüt yeşili

                return (
                  <g key={res.id} opacity={boxOpacity}>
                    <rect x={finalX} y={finalY} width={finalW} height={finalH} fill="none" stroke={colorHex} strokeWidth="3" rx="8" />
                    <rect x={finalX} y={finalY - 30} width={Math.max(label.length * 10 + 16, 60)} height="30" fill={colorHex} rx="4" className="drop-shadow-md" />
                    <text x={finalX + 8} y={finalY - 10} fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="system-ui, sans-serif">{label}</text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Mağaza İstatistikleri (Kompakt Sayaç) */}
        <div className="w-full bg-surface-1 border border-border-subtle rounded-xl p-3 shadow-md flex justify-around items-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-emerald-500 tracking-wider flex items-center gap-1"><ArrowRight size={12} /> İÇERİ GİREN</span>
            <span className="text-2xl font-black text-emerald-500 drop-shadow-sm">{enteredCount}</span>
          </div>
          <div className="h-10 w-px bg-border-subtle"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-orange-500 tracking-wider flex items-center gap-1"><ArrowLeftIcon size={12} /> DIŞARI ÇIKAN</span>
            <span className="text-2xl font-black text-orange-500 drop-shadow-sm">{exitedCount}</span>
          </div>
          <div className="h-10 w-px bg-border-subtle"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-secondary-text tracking-wider flex items-center gap-1"><Activity size={12} /> AKTİF</span>
            <span className="text-2xl font-black text-primary-text">{results.length}</span>
          </div>
        </div>
      </div>

      <div className="flex-none w-full max-w-3xl mx-auto px-4 pb-4 z-10 flex flex-col">
        <div className="w-full bg-surface-1 border border-border-subtle rounded-2xl p-4 shadow-md flex flex-col min-h-0">
          <h3 className="text-sm font-bold text-primary-text mb-3 flex items-center gap-2 flex-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Canlı Geçiş Listesi
          </h3>
          <div className="overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-2 h-[250px]">
            {capturedSnapshots.length > 0 ? (
              capturedSnapshots.map(snap => {
                const timeString = new Date(snap.timestamp).toLocaleTimeString('tr-TR');
                const isKnown = !!knownMap[snap.id];
                const labelName = knownMap[snap.id] || `ID: ${snap.id}`;
                const isEnter = snap.type === "ENTER";
                const badgeColor = isEnter ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : "bg-orange-500/10 text-orange-500 border-orange-500/30";

                return (
                  <div key={`${snap.id}-${snap.timestamp}`} className="flex items-start gap-4 border rounded-xl p-2 transition-colors shadow-sm border-border-subtle bg-surface-2 hover:bg-surface-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-background shrink-0 border border-border-subtle relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={snap.src} alt={`Cross ${snap.id}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 justify-center min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <span className={`text-[10px] font-black tracking-wider truncate px-1.5 py-0.5 rounded border ${badgeColor}`}>
                          {isEnter ? "İÇERİ GİRDİ" : "DIŞARI ÇIKTI"}
                        </span>
                        <span className="text-[10px] font-semibold text-secondary-text bg-background px-1.5 py-0.5 rounded border border-border-subtle shadow-sm whitespace-nowrap shrink-0">
                          {timeString}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs font-bold ${isKnown ? 'text-purple-500' : 'text-primary-text'} truncate max-w-[200px]`}>
                          {labelName}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center opacity-50 py-8">
                <Activity size={32} className="text-secondary-text mb-3" />
                <p className="text-sm text-secondary-text max-w-[200px]">
                  Kamera üzerindeki dik çizgiden geçişler burada listelenecek.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
