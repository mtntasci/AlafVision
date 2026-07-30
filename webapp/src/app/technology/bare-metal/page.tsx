import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { Database, Network, LayoutTemplate, Activity } from "lucide-react";

export default function BareMetalPage() {
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
            Teknoloji: Bare-Metal
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-primary-text max-w-4xl mx-auto leading-tight">
            Sanallaştırmayı Kaldırın, <br />
            <span className="text-accent">
              Donanımın Saf Gücünü Hissedin
            </span>
          </h1>
          
          <p className="text-lg text-secondary-text max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Docker, Kubernetes veya Sanal Makineler (VM) olmadan, işletim sisteminin çekirdeğinde çalışan C/C++ ve Go tabanlı servislerimizle donanım israfına son verin.
          </p>
        </section>

        {/* Features Grid */}
        <section className="w-full container mx-auto px-6 py-12 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <Database className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">%100 RAM Verimliliği</h3>
              <p className="text-secondary-text leading-relaxed">
                Konteyner izolasyonu için harcanan yüzlerce megabaytlık RAM ve CPU döngüsünü, doğrudan video çözme (decoding) işlemleri için kullanın.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <Network className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Doğrudan GPU Erişimi</h3>
              <p className="text-secondary-text leading-relaxed">
                Nvidia sürücülerini katmanlar arası (pass-through) taşıma zorunluluğunu kaldırarak, PCI-e veri yolunu doğrudan sömüren yapay zeka hızlandırması.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <LayoutTemplate className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Minimal Sistem Boyutu</h3>
              <p className="text-secondary-text leading-relaxed">
                Gigabaytlarca konteyner imajı yerine, sadece birkaç megabaytlık statik olarak derlenmiş Go (Golang) binary dosyası ile saniyeler içerisinde sistem kurulumu.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <Activity className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Maximum Kararlılık</h3>
              <p className="text-secondary-text leading-relaxed">
                Askeri (Defense) standartlarda test edilmiş native işletim sistemi entegrasyonu sayesinde aylarca kapanmadan stabil hizmet veren sistemler.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
