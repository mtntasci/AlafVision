"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import * as faceapi from "face-api.js";
import { db } from "../../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function RegisterFace() {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [customId, setCustomId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Load models
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]);
        console.log("Face-API models loaded!");
      } catch (e) {
        console.error("Model loading error:", e);
      }
    };
    loadModels();

    // Get image from localStorage (passed from human dashboard)
    const storedImg = localStorage.getItem("alafvision_register_img");
    if (storedImg) {
      setImageSrc(storedImg);
    } else {
      setError("Kaydedilecek fotoğraf bulunamadı. Lütfen Kişi Sayma ekranına dönüp bir kişinin fotoğrafına tıklayın.");
    }
  }, []);

  const handleRegister = async () => {
    if (!name.trim()) {
      setError("Lütfen kişinin adını girin.");
      return;
    }
    if (!imgRef.current) return;

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Detect face and compute descriptor
      const detection = await faceapi.detectSingleFace(imgRef.current).withFaceLandmarks().withFaceDescriptor();
      
      if (!detection) {
        setError("Fotoğrafta net bir yüz tespit edilemedi. Lütfen daha belirgin, önden çekilmiş bir yüz fotoğrafı kullanın.");
        setIsProcessing(false);
        return;
      }

      // 2. Convert Float32Array to standard array for Firestore
      const descriptorArray = Array.from(detection.descriptor);

      // 3. Save to Firebase
      await addDoc(collection(db, "known_faces"), {
        name: name.trim(),
        customId: customId.trim(),
        descriptor: descriptorArray,
        photoBase64: imageSrc,
        createdAt: new Date().toISOString()
      });

      setSuccess(true);
      
      // Temizle
      localStorage.removeItem("alafvision_register_img");
      
      // 2 saniye sonra geri dön
      setTimeout(() => {
        router.push("/dashboard/human");
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setError("Yüz kaydı sırasında bir hata oluştu: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative font-sans">
      <header className="flex-none h-[64px] z-30 flex items-center px-4 bg-background border-b border-border-subtle">
        <Link href="/dashboard/human" className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center border border-border-subtle hover:bg-surface-3 transition-colors mr-3">
          <ArrowLeft className="w-5 h-5 text-secondary-text" />
        </Link>
        <h1 className="text-xl font-bold text-primary-text tracking-tight">Kişiyi Sisteme Tanıt</h1>
      </header>

      <main className="flex-1 w-full max-w-xl mx-auto p-6 flex flex-col gap-6 mt-4">
        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            <h2 className="text-2xl font-bold text-emerald-500">Kişi Başarıyla Tanıtıldı!</h2>
            <p className="text-secondary-text font-medium">
              Sistem artık bu yüzü gördüğünde mor renkte işaretleyip ismini gösterecek. Yönlendiriliyorsunuz...
            </p>
          </div>
        ) : (
          <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-border-subtle flex flex-col items-center bg-surface-2/50">
              {imageSrc ? (
                <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-border-subtle shadow-md bg-background relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img ref={imgRef} src={imageSrc} alt="Register face" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
              ) : (
                <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-border-subtle flex items-center justify-center bg-background">
                  <span className="text-secondary-text text-sm">Fotoğraf Yok</span>
                </div>
              )}
              <p className="mt-4 text-sm text-secondary-text text-center font-medium max-w-xs">
                Kişinin yüz hatlarının (göz, burun, ağız) belirgin olduğuna emin olun.
              </p>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-red-500">{error}</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary-text ml-1">Kişinin Adı Soyadı</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Mehmet Yılmaz"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border-subtle text-primary-text font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  disabled={isProcessing}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary-text ml-1">Özel ID (Opsiyonel)</label>
                <input
                  type="text"
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value)}
                  placeholder="Örn: MT-1001 veya EMP450"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border-subtle text-primary-text font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  disabled={isProcessing}
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={isProcessing || !imageSrc}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent text-white font-bold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5"></span>
                    <span>Yüz Analiz Ediliyor...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Sisteme Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
