"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Video, UserPlus } from "lucide-react";
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

function calculateIoU(box1?: number[], box2?: number[]) {
  const c1 = getBoxCoords(box1);
  const c2 = getBoxCoords(box2);
  if (!c1 || !c2) return 0;
  
  const xA = Math.max(c1.x, c2.x);
  const yA = Math.max(c1.y, c2.y);
  const xB = Math.min(c1.x + c1.w, c2.x + c2.w);
  const yB = Math.min(c1.y + c1.h, c2.y + c2.h);
  
  const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
  const box1Area = c1.w * c1.h;
  const box2Area = c2.w * c2.h;
  
  return interArea / (box1Area + box2Area - interArea);
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
  const [fightingIds, setFightingIds] = useState<Set<string>>(new Set());
  const [knownMap, setKnownMap] = useState<Record<string, string>>({});
  
  const seenHumansRef = useRef<Set<string>>(new Set());
  const knownFacesRef = useRef<{name: string, customId?: string, descriptor: number[]}[]>([]);
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
        console.log("Face-API models loaded in dashboard!");
      } catch (e) {
        console.error("Model loading error:", e);
      }
    };

    // Firebase'den kayıtlı yüzleri çek
    const fetchKnownFaces = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "known_faces"));
        const faces: {name: string, customId?: string, descriptor: number[]}[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.name && data.descriptor) {
            faces.push({ name: data.name, customId: data.customId, descriptor: data.descriptor });
          }
        });
        knownFacesRef.current = faces;
        console.log(`Loaded ${faces.length} known faces from Firebase.`);
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
              if (isNewPerson || shouldAttemptRecognition) {
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
                  
                  if (isNewPerson) {
                    const dataUrl = cropCanvas.toDataURL("image/jpeg", 0.9);
                    setCapturedSnapshots(prev => [{
                      id: res.text,
                      src: dataUrl,
                      timestamp: now,
                    }, ...prev]);
                  }

                  if (shouldAttemptRecognition) {
                    recognitionAttemptsRef.current[res.text] = attempts + 1;
                    
                    setTimeout(async () => {
                      try {
                        const detection = await faceapi.detectSingleFace(cropCanvas).withFaceLandmarks().withFaceDescriptor();
                        if (detection && knownFacesRef.current.length > 0) {
                          let bestMatch = { name: "", customId: "", distance: 1.0 };
                          for (const known of knownFacesRef.current) {
                            const distance = faceapi.euclideanDistance(detection.descriptor, new Float32Array(known.descriptor));
                            if (distance < bestMatch.distance) {
                              bestMatch = { name: known.name, customId: known.customId || "", distance };
                            }
                          }
                          // Eşik değeri: 0.58 altı (Telefon kamerası açıları için esnekletildi)
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
              }
            }
          }
        });

        if (hasNew) {
          setUniqueHumans(new Set(seenHumansRef.current));
        }

        // Kavga Tespiti (Fight Detection Heuristic)
        const currentFights = new Set<string>();
        for (let i = 0; i < filteredResults.length; i++) {
          for (let j = i + 1; j < filteredResults.length; j++) {
            const iou = calculateIoU(filteredResults[i].box, filteredResults[j].box);
            if (iou > 0.45) { // Eğer iki kutu %45'den fazla iç içe geçerse (boğuşma)
              currentFights.add(filteredResults[i].id);
              currentFights.add(filteredResults[j].id);
            }
          }
        }
        setFightingIds(currentFights);

        setResults(filteredResults);
      } catch (e) {
        console.error("Error parsing message", e);
      }
    };

    socket.onclose = () => setWs(null);

    return () => {
      socket.close();
      seenHumansRef.current.clear();
      knownIdsRef.current.clear();
      recognitionAttemptsRef.current = {};
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
    <div className="h-[100dvh] bg-background flex flex-col relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, backgroundSize: `40px 40px` }} />
      </div>

      {fightingIds.size > 0 && (
        <div className="absolute top-16 left-0 w-full z-40 bg-red-600/90 text-white font-black py-2 px-4 flex items-center justify-center gap-3 animate-pulse shadow-2xl border-b-4 border-red-800">
          <span className="text-2xl">⚠️</span>
          <span className="text-lg tracking-widest">ŞÜPHELİ KAVGA / ARBEDE ALGILANDI</span>
          <span className="text-2xl">⚠️</span>
        </div>
      )}

      <header className="flex-none h-[64px] z-30 flex justify-between items-center px-4 bg-background border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center border border-border-subtle hover:bg-surface-3 transition-colors cursor-pointer mr-1">
            <ArrowLeft className="w-5 h-5 text-secondary-text" />
          </Link>
          <span className="text-xl font-bold tracking-tight text-primary-text hidden sm:inline-block">
            Alaf <span className="text-accent">Vision</span>
          </span>
          <span className="flex items-center gap-1.5 ml-2 px-3 py-1 rounded-full bg-blue-500/10 border border-border-subtle text-blue-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            Kişi Etiketleyip Sayma
          </span>
        </div>
      </header>

      <div className="flex-none w-full max-w-3xl mx-auto px-4 pt-4 pb-2 z-10 flex flex-col gap-3">
        <div className="relative w-full h-[45vh] sm:h-auto sm:aspect-video bg-surface-1 border border-border-subtle rounded-2xl overflow-hidden shadow-lg">
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

                const knownName = knownMap[res.text];
                const label = knownName ? knownName : `ID: ${res.text}`;
                const isFighting = fightingIds.has(res.id);
                const boxColor = isFighting ? "text-red-500" : (knownName ? "text-purple-500" : "text-blue-500");

                return (
                  <g key={res.id}>
                    <rect x={finalX} y={finalY} width={finalW} height={finalH} fill="none" stroke="currentColor" strokeWidth="4" rx="8" className={`${boxColor} drop-shadow-md transition-colors duration-300`} />
                    <rect x={finalX} y={finalY - 30} width={Math.max(label.length * 10 + 16, 60)} height="30" fill="currentColor" rx="4" className={`${boxColor} drop-shadow-md transition-colors duration-300`} />
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

      <div className="flex-1 w-full max-w-3xl mx-auto px-4 pb-4 min-h-0 z-10">
        <div className="w-full h-full bg-surface-1 border border-border-subtle rounded-2xl p-4 shadow-md flex flex-col">
          <h3 className="flex-none text-sm font-bold text-primary-text mb-3 tracking-tight flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            Tespit Edilen Kişiler
          </h3>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-2">
            {capturedSnapshots.length > 0 ? (
              capturedSnapshots.map(snap => {
                const timeString = new Date(snap.timestamp).toLocaleTimeString('tr-TR');
                const isKnown = !!knownMap[snap.id];
                const labelName = knownMap[snap.id] || "YENİ KİŞİ";
                
                return (
                  <div key={`${snap.id}-${snap.timestamp}`} className={`flex items-start gap-4 border rounded-xl p-2 transition-colors shadow-sm ${isKnown ? 'border-purple-500/40 bg-purple-500/5 hover:border-purple-500/80' : 'border-blue-500/40 bg-blue-500/5 hover:border-blue-500/80'}`}>
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-background shrink-0 border border-border-subtle relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={snap.src} alt={`Person ${snap.id}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 justify-center min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <span className={`text-[10px] font-black truncate tracking-wider ${isKnown ? 'text-purple-500' : 'text-blue-500'}`}>
                          {isKnown ? "BİLİNEN KİŞİ" : "YABANCI KİŞİ"}
                        </span>
                        <span className="text-[10px] font-semibold text-secondary-text bg-surface-2 px-1.5 py-0.5 rounded border border-border-subtle shadow-sm whitespace-nowrap shrink-0">
                          {timeString}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-primary-text bg-background px-2 py-0.5 rounded border border-border-subtle shadow-sm truncate">
                          {isKnown ? labelName : `ID: ${snap.id}`}
                        </span>
                        
                        {!isKnown && (
                          <button 
                            onClick={() => {
                              localStorage.setItem("alafvision_register_img", snap.src);
                              router.push("/dashboard/human/register");
                            }}
                            className="flex items-center gap-1 text-[10px] font-bold text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded shadow-sm transition-colors"
                          >
                            <UserPlus size={12} />
                            <span>Tanıt</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-secondary-text opacity-50 pt-8 pb-8">
                <span className="text-sm font-medium">Henüz tespit yok.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
