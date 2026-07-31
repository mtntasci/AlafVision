"use client";

import { useRouter } from "next/navigation";
import { Camera, LogOut, Users, Car, ShieldAlert, Timer } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();

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
      <header className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-6 py-4 bg-background backdrop-blur-xl border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center border border-border-subtle">
            <Camera className="w-5 h-5 text-accent" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary-text">
            Alaf <span className="text-accent">Vision</span>
          </span>
        </div>
        
        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 px-4 py-2 bg-surface-2 text-primary-text border border-border-subtle rounded-lg hover:bg-surface-2 transition-all font-medium text-sm"
        >
          <LogOut size={16} className="text-secondary-text group-hover:text-primary-text transition-colors" />
          Çıkış
        </button>
      </header>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 mt-20">
        <h2 className="text-3xl font-black text-primary-text mb-8 text-center animate-in slide-in-from-top-4 fade-in duration-500">
          Uygulama Modunu Seçin
        </h2>
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-6 fade-in duration-700">
          
          <Link href="/dashboard/vehicle" className="flex flex-col items-center justify-center gap-6 p-10 bg-surface-1 border border-border-subtle rounded-[2rem] hover:border-accent hover:bg-surface-2 transition-all shadow-xl group text-center cursor-pointer">
            <div className="w-24 h-24 rounded-3xl bg-accent-soft flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Car className="w-12 h-12 text-accent" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-primary-text mb-3">Demo Araç Tanıma</h3>
              <p className="text-secondary-text font-medium leading-relaxed">
                Gelişmiş ALPR motorunu başlatarak plaka, marka ve renk tespiti yapın.
              </p>
            </div>
          </Link>

          <Link href="/dashboard/human" className="flex flex-col items-center justify-center gap-6 p-10 bg-surface-1 border border-border-subtle rounded-[2rem] hover:border-blue-500 hover:bg-surface-2 transition-all shadow-xl group text-center cursor-pointer">
            <div className="w-24 h-24 rounded-3xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-12 h-12 text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-primary-text mb-3">Kişi Etiketleyip Sayma</h3>
              <p className="text-secondary-text font-medium leading-relaxed">
                YOLO motoruyla insanları tespit edin, benzersiz ID'lerle takip edip sayın. (Kamera modülü sade).
              </p>
            </div>
          </Link>

          <Link href="/dashboard/intrusion" className="flex flex-col items-center justify-center gap-6 p-10 bg-surface-1 border border-border-subtle rounded-[2rem] hover:border-red-500 hover:bg-surface-2 transition-all shadow-xl group text-center cursor-pointer">
            <div className="w-24 h-24 rounded-3xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ShieldAlert className="w-12 h-12 text-red-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-primary-text mb-3">Yasak Bölge İhlali</h3>
              <p className="text-secondary-text font-medium leading-relaxed">
                Belirlenen güvenlik ihlal bölgesine (sağ taraf) giren kişileri anında tespit edip fotoğraflarını çekin.
              </p>
            </div>
          </Link>

          <Link href="/dashboard/loitering" className="flex flex-col items-center justify-center gap-6 p-10 bg-surface-1 border border-border-subtle rounded-[2rem] hover:border-orange-500 hover:bg-surface-2 transition-all shadow-xl group text-center cursor-pointer">
            <div className="w-24 h-24 rounded-3xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Timer className="w-12 h-12 text-orange-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-primary-text mb-3">Uzun Bekleme Süresi</h3>
              <p className="text-secondary-text font-medium leading-relaxed">
                20 saniyeden uzun süre kamerada kalan şüpheli kişileri tespit edip kayıt altına alın.
              </p>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}
