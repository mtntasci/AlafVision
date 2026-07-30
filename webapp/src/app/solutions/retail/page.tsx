import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { Store, Users, Eye, Activity, Target } from "lucide-react";

export default function RetailSolutions() {
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
            Perakende Çözümleri
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white max-w-4xl mx-auto leading-tight">
            Mağazanızı Verilerle <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
              Yönetin ve Büyütün
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Ziyaretçi alışkanlıklarını analiz edin, mağaza içi dönüşüm oranlarını artırın ve personel verimliliğini Alaf Vision yapay zekasıyla zirveye taşıyın.
          </p>
        </section>

        {/* Features Grid */}
        <section className="w-full container mx-auto px-6 py-12 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <Users className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Hassas Kişi Sayma</h3>
              <p className="text-slate-400 leading-relaxed">
                Mağazanıza giren ve çıkan kişi sayısını %99'un üzerinde doğruluk oranıyla ölçün. Kapı trafiğini ve dönüşüm oranlarını net verilerle görün.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <Activity className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Sıcaklık ve Isı Haritası</h3>
              <p className="text-slate-400 leading-relaxed">
                Müşterilerinizin en çok hangi reyonlarda vakit geçirdiğini ısı haritaları (heatmap) üzerinden analiz edin, ürün yerleşimlerini optimize edin.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <Target className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Müşteri Odak Tespiti</h3>
              <p className="text-slate-400 leading-relaxed">
                Müşterilerinizin hangi vitrin veya reklamlara ne kadar süre odaklandığını ölçerek pazarlama materyallerinizin performansını A/B testi ile ölçün.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
