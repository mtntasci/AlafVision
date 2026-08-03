"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Video } from "lucide-react";
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

type AnomalySnapshot = {
  id: string;
  src: string;
  code: string;
  message: string;
  timestamp: number;
};

export default function IntrusionDashboard() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });
  const [uniqueHumans, setUniqueHumans] = useState<Set<string>>(new Set());
  const [capturedSnapshots, setCapturedSnapshots] = useState<AnomalySnapshot[]>([]);
  const [knownMap, setKnownMap] = useState<Record<string, string>>({});

  const seenHumansRef = useRef<Set<string>>(new Set());
  const triggeredAnomaliesRef = useRef<Set<string>>(new Set());
  const knownFacesRef = useRef<{ name: string, customId?: string, descriptor: number[] }[]>([]);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const recognitionAttemptsRef = useRef<Record<string, number>>({});

  useEffect(() => {
    // Face API Modellerini Yükle
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]);
        console.log("Face-API models loaded in intrusion dashboard!");
      } catch (e) {
        console.error("Model loading error:", e);
      }
    };

    // Firebase'den kayıtlı yüzleri çek
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
        console.log(`Loaded ${faces.length} known faces from Firebase for Intrusion.`);
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

    let socket: WebSocket | null = null;
    let isMounted = true;

    const connectToVision = async () => {
      try {
        const apiUrl = "https://jarvis.alafteknoloji.com/api/node";
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Authorization": "Bearer ISKvoO-tVzlZHFCYYj75DhuMq6xSiwzOO0qISIoxK4Y"
          }
        });

        if (!response.ok) {
          throw new Error(`API Hatası: ${response.status}`);
        }

        const data = await response.json();
        const tunnelUrl = data.tunnelUrl;
        
        if (!isMounted) return;
        
        console.log(`Boşta olan node bulundu: ${tunnelUrl}. Bağlanılıyor...`);

        const appKey = "Av_Xt2hEYiDjqLwy98XzeBdKO5SLZ4ihkt-vd9IK2Vk";
        const wsUrl = `wss://${tunnelUrl}/ws/vision?appKey=${appKey}&token=humanCounter_${token}`;
        
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log("WebSocket connected to", tunnelUrl);
          if (isMounted) setWs(socket);
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
              let isNewPerson = false;
              if (!seenHumansRef.current.has(res.text)) {
                seenHumansRef.current.add(res.text);
                hasNew = true;
                isNewPerson = true;
              }

              const isKnown = knownIdsRef.current.has(res.text);
              const attempts = recognitionAttemptsRef.current[res.text] || 0;
              const shouldAttemptRecognition = !isKnown && attempts < 5;

              if (videoRef.current) {
                const video = videoRef.current;
                const coords = getBoxCoords(res.box);

                if (coords && video.videoWidth > 0 && video.videoHeight > 0) {
                  // --- 1. Yüz Tanıma (En fazla 5 kere dener) ---
                  if (shouldAttemptRecognition) {
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

                      recognitionAttemptsRef.current[res.text] = attempts + 1;

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
                              knownIdsRef.current.add(res.text);
                              const displayName = bestMatch.customId ? `${bestMatch.name} (${bestMatch.customId})` : bestMatch.name;
                              setKnownMap(prev => ({ ...prev, [res.text]: displayName }));
                            }
                          }
                        } catch (e) {
                          console.error("Face matching error:", e);
                        }
                      }, 50);
                    }
                  }

                  // --- 2. Yasak Bölge İhlali (Intrusion) ---
                  const zoneX = video.videoWidth * 0.7; // Right 30%
                  const boxRight = coords.x + coords.w;
                  const overlapW = Math.max(0, Math.min(boxRight, video.videoWidth) - Math.max(coords.x, zoneX));
                  const overlapRatio = overlapW / coords.w;

                  let anomalyTriggered = false;
                  if (overlapRatio >= 0.51) {
                    anomalyTriggered = true;
                  }

                  const anomalyKey = `${res.text}_ZONE_BREACH`;
                  if (anomalyTriggered && !triggeredAnomaliesRef.current.has(anomalyKey)) {
                    triggeredAnomaliesRef.current.add(anomalyKey);

                    // İhlal anında snapshot al
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
                        code: "ZONE_BREACH",
                        message: "⚠️ YASAK BÖLGE İHLALİ",
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

        socket.onclose = () => {
          if (isMounted) setWs(null);
        };
      } catch (err) {
        console.error("Connection error:", err);
      }
    };

    connectToVision();

    return () => {
      isMounted = false;
      if (socket) {
        socket.close();
      }
      seenHumansRef.current.clear();
      triggeredAnomaliesRef.current.clear();
      knownIdsRef.current.clear();
      recognitionAttemptsRef.current = {};
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
          <span className="flex items-center gap-1.5 ml-2 px-3 py-1 rounded-full bg-red-500/10 border border-border-subtle text-red-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            Yasak Bölge İhlali
          </span>
        </div>
      </header>

      <div className="flex-none w-full max-w-3xl mx-auto px-4 pt-4 pb-2 z-10 flex flex-col gap-3">
        <div className="relative w-full aspect-video bg-surface-1 border border-border-subtle rounded-2xl overflow-hidden shadow-lg">
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

                const knownName = knownMap[res.text];
                const label = knownName ? knownName : `ID: ${res.text}`;
                let colorClass = "text-blue-500";

                const zoneX = (videoDimensions.width || 1) * 0.7;
                const boxRight = coords.x + coords.w;
                const overlapW = Math.max(0, Math.min(boxRight, videoDimensions.width || 1) - Math.max(coords.x, zoneX));
                const overlapRatio = overlapW / coords.w;

                if (overlapRatio >= 0.51) {
                  colorClass = "text-red-500";
                } else if (knownName) {
                  colorClass = "text-purple-500";
                }

                return (
                  <g key={res.id}>
                    <rect x={finalX} y={finalY} width={finalW} height={finalH} fill="none" stroke="currentColor" strokeWidth="4" rx="8" className={`${colorClass} drop-shadow-md`} />
                    <rect x={finalX} y={finalY - 30} width={Math.max(label.length * 10 + 16, 60)} height="30" fill="currentColor" rx="4" className={`${colorClass} drop-shadow-md`} />
                    <text x={finalX + 8} y={finalY - 10} fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="system-ui, sans-serif">{label}</text>
                  </g>
                );
              })}
            </svg>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Compact Counters for Mobile */}
        <div className="w-full bg-surface-1 border border-border-subtle rounded-xl p-3 shadow-md flex justify-around items-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-secondary-text tracking-wider">ANLIK</span>
            <span className="text-xl font-black text-primary-text">{results.length}</span>
          </div>
          <div className="h-8 w-px bg-border-subtle"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-secondary-text tracking-wider">BENZERSİZ KİŞİ</span>
            <span className="text-xl font-black text-blue-500 drop-shadow-sm">{uniqueHumans.size}</span>
          </div>
        </div>
      </div>

      <div className="flex-none w-full max-w-3xl mx-auto px-4 pb-4 z-10">
        <div className="w-full bg-surface-1 border border-border-subtle rounded-2xl p-4 shadow-md flex flex-col">
          <h3 className="flex-none text-sm font-bold text-primary-text mb-3 tracking-tight flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            İhlal Listesi
          </h3>

          <div className="overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-2 h-[250px]">
            {capturedSnapshots.length > 0 ? (
              capturedSnapshots.map(snap => {
                const timeString = new Date(snap.timestamp).toLocaleTimeString('tr-TR');
                const isKnown = !!knownMap[snap.id];
                const labelName = knownMap[snap.id] || "BİLİNMEYEN İHLALCİ";

                return (
                  <div key={`${snap.id}-${snap.timestamp}`} className="flex items-start gap-4 border rounded-xl p-2 transition-colors shadow-sm border-red-500/40 bg-red-500/5 hover:border-red-500/80">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-background shrink-0 border border-border-subtle relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={snap.src} alt={`Anomaly ${snap.id}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 justify-center min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[10px] font-black text-red-500 tracking-wider truncate">
                          {snap.message}
                        </span>
                        <span className="text-[10px] font-semibold text-secondary-text bg-surface-2 px-1.5 py-0.5 rounded border border-border-subtle shadow-sm whitespace-nowrap shrink-0">
                          {timeString}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-xs font-bold text-primary-text bg-background px-2 py-0.5 rounded border border-border-subtle shadow-sm truncate max-w-[200px]">
                          {isKnown ? labelName : `ID: ${snap.id}`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-secondary-text opacity-50 pt-8 pb-8">
                <span className="text-sm font-medium">İhlal bulunmuyor.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
