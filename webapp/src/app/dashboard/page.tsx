"use client";

import { useRouter } from "next/navigation";
import { Camera, LogOut, Users, Car, ShieldAlert, Timer } from "lucide-react";
import Link from "next/link";

import { useBrand } from "../../lib/brand";

export default function Dashboard() {
  const router = useRouter();
  const brand = useBrand();

  const handleLogout = () => {
    localStorage.removeItem("alafvision_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden font-sans">

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: `40px 40px`,
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-30 flex justify-between items-center px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center border border-accent/30 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <Camera className="w-5 h-5 text-accent" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-primary-text">
            {brand.brandNamePrefix} <span className="text-accent drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">{brand.brandNameSuffix}</span>
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 px-4 py-2 glass-panel text-primary-text border border-white/15 rounded-xl hover:border-accent/50 hover:bg-white/5 transition-all duration-300 font-medium text-sm"
        >
          <LogOut size={16} className="text-secondary-text group-hover:text-primary-text transition-colors" />
          Çıkış
        </button>
      </header>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 mt-12 mb-12">
        <h2 className="text-3xl font-extrabold text-primary-text mb-8 text-center animate-in slide-in-from-top-4 fade-in duration-500">
          Uygulama Modunu Seçin
        </h2>
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-6 fade-in duration-700">

          <Link href="/dashboard/vehicle" className="glass-card flex flex-col items-center justify-center gap-6 p-8 border border-white/10 rounded-2xl hover:border-accent/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:-translate-y-1 transition-all duration-300 group text-center cursor-pointer">
            <div className="w-20 h-20 rounded-2xl bg-accent-soft flex items-center justify-center border border-accent/30 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Car className="w-10 h-10 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-text mb-2">Araç Tanıma</h3>
              <p className="text-secondary-text text-sm font-light leading-relaxed">
                Gelişmiş ALPR motorunu başlatarak plaka, marka ve renk tespiti yapın.
              </p>
            </div>
          </Link>

          <Link href="/dashboard/human" className="glass-card flex flex-col items-center justify-center gap-6 p-8 border border-white/10 rounded-2xl hover:border-accent/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:-translate-y-1 transition-all duration-300 group text-center cursor-pointer">
            <div className="w-20 h-20 rounded-2xl bg-accent-soft flex items-center justify-center border border-accent/30 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Users className="w-10 h-10 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-text mb-2">Yüz Tanıma & Kavga Tespiti</h3>
              <p className="text-secondary-text text-sm font-light leading-relaxed">
                YOLO ve Face-API ile tanımlı kişileri (Personel/Yabancı) ayırın, şüpheli fiziksel arbedeleri anında yakalayın.
              </p>
            </div>
          </Link>

          <Link href="/dashboard/intrusion" className="glass-card flex flex-col items-center justify-center gap-6 p-8 border border-white/10 rounded-2xl hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:-translate-y-1 transition-all duration-300 group text-center cursor-pointer">
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/30 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="w-10 h-10 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-text mb-2">Yasak Bölge İhlali</h3>
              <p className="text-secondary-text text-sm font-light leading-relaxed">
                Belirlenen güvenlik ihlal bölgesine (sağ taraf) giren kişileri anında tespit edip fotoğraflarını çekin.
              </p>
            </div>
          </Link>

          <Link href="/dashboard/loitering" className="glass-card flex flex-col items-center justify-center gap-6 p-8 border border-white/10 rounded-2xl hover:border-accent/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:-translate-y-1 transition-all duration-300 group text-center cursor-pointer">
            <div className="w-20 h-20 rounded-2xl bg-accent-soft flex items-center justify-center border border-accent/30 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Timer className="w-10 h-10 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-text mb-2">Uzun Bekleme Süresi</h3>
              <p className="text-secondary-text text-sm font-light leading-relaxed">
                20 saniyeden uzun süre kamerada kalan şüpheli kişileri tespit edip kayıt altına alın.
              </p>
            </div>
          </Link>

          <Link href="/dashboard/store" className="glass-card flex flex-col items-center justify-center gap-6 p-8 border border-white/10 rounded-2xl hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-all duration-300 group text-center cursor-pointer">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/40 group-hover:scale-110 transition-transform duration-300 military-badge-glow">
              <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-text mb-2">Mağaza İstatistikleri</h3>
              <p className="text-secondary-text text-sm font-light leading-relaxed">
                Sanal kapıdan (çizgiden) giren/çıkan müşteri sayısını hesaplayın, videonun üzerinde Isı Haritası (Heatmap) oluşturun.
              </p>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}
