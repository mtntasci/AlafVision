"use client";

import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { Cpu, Server, Lock, Zap } from "lucide-react";
import { useBrand } from "../../../lib/brand";

export default function EdgeAIPage() {
  const brand = useBrand();

  return (
    <div className="min-h-screen bg-background text-primary-text selection:bg-accent-soft/30 font-sans overflow-x-hidden flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: `40px 40px`,
          }} 
        />
      </div>

      <Navbar />

      <main className="flex-1 relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border-subtle text-primary-text text-xs font-semibold uppercase tracking-wider mb-8">
            Teknoloji: Edge AI Mimarisi
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-primary-text max-w-4xl mx-auto leading-tight">
            Veriyi Bulutta Değil, <br />
            <span className="text-accent">
              Uç Noktada İşleyin
            </span>
          </h1>
          
          <p className="text-lg text-secondary-text max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Kamera görüntülerini merkeze veya buluta göndermeyin. {brand.edgeText} altyapısı, devasa videoları kaynağında analiz ederek sadece anlamlı olan KB boyutundaki sonuçları ağa aktarır.
          </p>
        </section>

        {/* Technical Advantages */}
        <section className="w-full container mx-auto px-6 py-12 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Tech 1 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mx-auto mb-6 border border-border-subtle">
                <Lock className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3">Tam Gizlilik</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Görüntüler donanım içinde kalır, dış ağa kapalı (air-gapped) mimarilerde dahi sorunsuz çalışır.
              </p>
            </div>

            {/* Tech 2 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mx-auto mb-6 border border-border-subtle">
                <Zap className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3">Sıfır Gecikme</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Bulut sunucularına veri git-gel süresi (latency) ortadan kalkar, kararlar milisaniyeler içerisinde alınır.
              </p>
            </div>
            
            {/* Tech 3 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mx-auto mb-6 border border-border-subtle">
                <Server className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3">Bant Genişliği Tasarrufu</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Ağ üzerinde gigabaytlarca veri trafiği yaratmaz. Sistemin network maliyetlerini minimize eder.
              </p>
            </div>

            {/* Tech 4 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mx-auto mb-6 border border-border-subtle">
                <Cpu className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3">Otonom Çalışma</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                İnternet kopsa dahi edge sistemleri veri analizine ve yerel veritabanına kaydetmeye devam eder.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
