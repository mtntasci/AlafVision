import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { Database, Network, LayoutTemplate, Activity } from "lucide-react";

export default function BareMetalPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-blue-500/30 font-sans overflow-x-hidden flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px]" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8">
            Teknoloji: Bare-Metal
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white max-w-4xl mx-auto leading-tight">
            Sanallaştırmayı Kaldırın, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
              Donanımın Saf Gücünü Hissedin
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Docker, Kubernetes veya Sanal Makineler (VM) olmadan, işletim sisteminin çekirdeğinde çalışan C/C++ ve Go tabanlı servislerimizle donanım israfına son verin.
          </p>
        </section>

        {/* Features Grid */}
        <section className="w-full container mx-auto px-6 py-12 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <Database className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">%100 RAM Verimliliği</h3>
              <p className="text-slate-400 leading-relaxed">
                Konteyner izolasyonu için harcanan yüzlerce megabaytlık RAM ve CPU döngüsünü, doğrudan video çözme (decoding) işlemleri için kullanın.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <Network className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Doğrudan GPU Erişimi</h3>
              <p className="text-slate-400 leading-relaxed">
                Nvidia sürücülerini katmanlar arası (pass-through) taşıma zorunluluğunu kaldırarak, PCI-e veri yolunu doğrudan sömüren yapay zeka hızlandırması.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <LayoutTemplate className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Minimal Sistem Boyutu</h3>
              <p className="text-slate-400 leading-relaxed">
                Gigabaytlarca konteyner imajı yerine, sadece birkaç megabaytlık statik olarak derlenmiş Go (Golang) binary dosyası ile saniyeler içerisinde sistem kurulumu.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <Activity className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Maximum Kararlılık</h3>
              <p className="text-slate-400 leading-relaxed">
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
