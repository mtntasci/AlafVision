"use client";

import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useBrand } from "../lib/brand";
import {
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Eye,
  Store,
  Car,
  Factory,
  Cpu,
  Lock,
  Server,
  Network,
  Activity,
  FileJson,
  Video
} from "lucide-react";

export default function Home() {
  const brand = useBrand();

  return (
    <div className="min-h-screen bg-background text-primary-text selection:bg-accent-soft/30 font-sans overflow-x-hidden">

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: `40px 40px`,
          }}
        />
      </div>

      {/* --- NAVBAR --- */}
      <Navbar />

      {/* --- 1. HERO SECTION --- */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 text-center pb-20 pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-8 military-badge-glow">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {brand.infraTag} (MIL-STD Grade)
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-primary-text max-w-5xl mx-auto leading-[1.1]">
          Yapay Zeka ile Görüntü İşlemenin <br />
          <span className="text-accent drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]">
            Uç Noktası
          </span>
        </h1>

        <p className="text-lg md:text-xl text-secondary-text max-w-3xl mx-auto mb-10 leading-relaxed font-light">
          İhtiyacınıza özel eğitilmiş yapay zeka modelleriyle kameralarınızı akıllı sensörlere dönüştürün. Perakendeden savunma sanayisine, veriyi dışarı çıkarmadan yerelde analiz eden sağlam sistemler tasarlıyoruz.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center gap-2 bg-accent text-background font-bold px-8 py-4 rounded-xl text-lg shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:bg-sky-400 transition-all duration-300 w-full sm:w-auto"
          >
            Canlı Demo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#cozumler"
            className="group inline-flex items-center justify-center gap-2 glass-panel text-primary-text px-8 py-4 rounded-xl font-medium text-lg border border-white/15 hover:border-accent/50 hover:bg-white/5 transition-all duration-300 w-full sm:w-auto"
          >
            Senaryoları Keşfedin
            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform text-secondary-text" />
          </a>
        </div>
      </main>

      {/* --- 2. ÇÖZÜM SENARYOLARIMIZ --- */}
      <section id="cozumler" className="relative z-10 py-24 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary-text mb-4">Çözüm Senaryolarımız</h2>
            <p className="text-secondary-text max-w-2xl mx-auto text-lg font-light">
              Sektörünüze özel geliştirilmiş, tak-çalıştır ve yüksek doğruluk oranına sahip yapay zeka modülleri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Perakende Analitiği */}
            <div className="group glass-card p-8 rounded-2xl border border-white/10 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-accent/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Store className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Perakende Analitiği</h3>
              <p className="text-secondary-text leading-relaxed font-light">
                Mağazanızın performansını verilerle ölçün. Hassas kişi sayma, sıcaklık/ısı haritası (heatmap) ve reyon bazlı müşteri odak tespiti ile mağaza içi davranışları analiz edin.
              </p>
            </div>

            {/* Mağaza Güvenliği */}
            <div className="group glass-card p-8 rounded-2xl border border-white/10 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-accent/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Eye className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Mağaza Güvenliği</h3>
              <p className="text-secondary-text leading-relaxed font-light">
                Güvenlik kameralarınızı proaktif bir bekçiye dönüştürün. Kasa işlem analizleri, anomali tespiti ve eylem tanıma (Action Recognition) ile hırsızlık vakalarını anında önleyin.
              </p>
            </div>

            {/* Akıllı Şehir & Trafik */}
            <div className="group glass-card p-8 rounded-2xl border border-white/10 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-accent/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Car className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Akıllı Şehir & Trafik</h3>
              <p className="text-secondary-text leading-relaxed font-light">
                Milisaniyelik ALPR (Otomatik Plaka Tanıma Sistemi). Araç marka, model, renk ve hız ihlal tespiti. <span className="text-accent font-medium">{brand.domain}</span> altyapısıyla sıfır gecikmeli veri akışı.
              </p>
            </div>

            {/* Endüstriyel Tesisler */}
            <div className="group glass-card p-8 rounded-2xl border border-white/10 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-accent/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Factory className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Endüstriyel Tesisler</h3>
              <p className="text-secondary-text leading-relaxed font-light">
                İş güvenliğini şansa bırakmayın. Baret/yelek ihlalleri, yetkisiz tehlikeli alan girişleri, makine başı personel takibi ve acil durum algılama sistemleri.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. NEDEN ALAF/SOM VISION? (EDGE COMPUTING) --- */}
      <section id="edge-ai" className="relative z-10 py-24 border-y border-white/10 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary-text mb-4">Neden {brand.fullName}?</h2>
            <p className="text-accent font-mono text-sm uppercase tracking-widest mb-2 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">Merkezi Değil, Uç Nokta (Edge) Mimarisi</p>
            <p className="text-secondary-text max-w-2xl mx-auto font-light">
              Veriyi üretildiği yerde, anında işliyoruz. Buluta devasa videolar göndermek yerine sadece sonuçları iletiyoruz.
            </p>
          </div>

          {/* 3 Step Flow */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-5xl mx-auto mb-20">
            <div className="flex flex-col items-center text-center p-6 glass-card rounded-2xl border border-white/10 w-full md:w-1/3">
              <Video className="w-12 h-12 text-secondary-text mb-4" />
              <h4 className="text-primary-text font-bold mb-2">1. Kamera Görüntüsü</h4>
              <p className="text-sm text-secondary-text font-light">Mevcut IP kameralarınızdan gelen yüksek boyutlu ham video akışı.</p>
            </div>

            <div className="hidden md:flex flex-col items-center text-accent drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
              <ArrowRight className="w-8 h-8" />
            </div>

            <div className="flex flex-col items-center text-center p-6 glass-panel rounded-2xl border border-accent/40 shadow-[0_0_25px_rgba(0,240,255,0.15)] w-full md:w-1/3 relative">
              <div className="absolute -top-3 bg-accent text-background text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                Edge İşlem
              </div>
              <Cpu className="w-12 h-12 text-accent mb-4 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
              <h4 className="text-primary-text font-bold mb-2">2. {brand.nodeName}</h4>
              <p className="text-sm text-secondary-text font-light">Görüntü yereldeki sunucuda işlenir, anonimleştirilir ve anlamlandırılır.</p>
            </div>

            <div className="hidden md:flex flex-col items-center text-accent drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
              <ArrowRight className="w-8 h-8" />
            </div>

            <div className="flex flex-col items-center text-center p-6 glass-card rounded-2xl border border-white/10 w-full md:w-1/3">
              <FileJson className="w-12 h-12 text-emerald-400 mb-4 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <h4 className="text-primary-text font-bold mb-2">3. Sadece Anlamlı Veri</h4>
              <p className="text-sm text-secondary-text font-light">Merkeze veya buluta sadece KB boyutunda analiz verisi (JSON) gider.</p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="p-6 glass-card rounded-2xl border border-white/10">
              <Lock className="w-8 h-8 text-accent mb-4 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]" />
              <h4 className="text-primary-text font-bold mb-2">KVKK ve GDPR Uyumu</h4>
              <p className="text-sm text-secondary-text font-light">Ham görüntüler mağazadan/tesisten asla dışarı çıkmaz, %100 gizlilik sağlar.</p>
            </div>
            <div className="p-6 glass-card rounded-2xl border border-white/10">
              <Activity className="w-8 h-8 text-accent mb-4 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]" />
              <h4 className="text-primary-text font-bold mb-2">Sıfır İnternet Gecikmesi</h4>
              <p className="text-sm text-secondary-text font-light">Bağlantı kopsa bile yerel sistem çalışmaya ve kaydetmeye devam eder.</p>
            </div>
            <div className="p-6 glass-card rounded-2xl border border-white/10">
              <Network className="w-8 h-8 text-accent mb-4 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]" />
              <h4 className="text-primary-text font-bold mb-2">Bant Genişliği Tasarrufu</h4>
              <p className="text-sm text-secondary-text font-light">Video aktarımı olmadığı için ağ altyapınızı yormaz, maliyetleri düşürür.</p>
            </div>
            <div className="p-6 glass-card rounded-2xl border border-white/10">
              <Server className="w-8 h-8 text-accent mb-4 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]" />
              <h4 className="text-primary-text font-bold mb-2">Bare-Metal Gücü</h4>
              <p className="text-sm text-secondary-text font-light">Sanallaştırmasız, doğrudan donanım üzerinde çalışarak maksimum FPS elde eder.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. GÜVENİLİRLİK (TRUST SECTION) --- */}
      <section id="guvenilirlik" className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-10 md:p-14 border border-emerald-500/30 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.1)]">
            {/* Background Icon */}
            <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 text-emerald-500/10 pointer-events-none" />

            <div className="relative z-10 md:w-3/4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono uppercase mb-6 military-badge-glow">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Askeri Standartlarda Güvenilirlik (MIL-STD-810)
              </div>

              <h3 className="text-3xl font-extrabold text-primary-text mb-6 leading-tight">
                Sıfır Hata Toleranslı <br />
                Mühendislik Disiplini
              </h3>

              <p className="text-lg text-secondary-text leading-relaxed mb-8 font-light">
                Savunma sanayi projelerinde ve test altyapılarında edindiğimiz katı mühendislik prensiplerini, ticari ürünlerimize eksiksiz aktarıyoruz.
                <strong className="text-primary-text font-semibold"> 7/24 kesintisiz</strong> çalışan, donanım kaynaklarını en verimli kullanan ve dış müdahalelere tamamen kapalı
                <strong className="text-primary-text font-semibold"> (Air-Gapped)</strong> sistemler inşa ediyoruz.
              </p>

              <div className="flex items-center gap-4 text-sm font-mono font-medium text-primary-text">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  Air-Gapped Uyumlu
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  %99.9 Uptime
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. MEGA FOOTER --- */}
      <Footer />
    </div>
  );
}
