import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { Factory, HardHat, ShieldCheck, AlertTriangle } from "lucide-react";

export default function IndustrialSolutions() {
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
            İş Güvenliği Çözümleri
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white max-w-4xl mx-auto leading-tight">
            Endüstriyel Tesislerde <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
              Gözetimsiz İş Güvenliği
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            İş kazalarını önceden tespit edin. Personel güvenliğini otonom yapay zeka kameralarıyla 7/24 denetleyerek riskleri sıfıra indirin.
          </p>
        </section>

        {/* Features Grid */}
        <section className="w-full container mx-auto px-6 py-12 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <HardHat className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">KKD İhlal Tespiti</h3>
              <p className="text-slate-400 leading-relaxed">
                Baret, fosforlu yelek, iş gözlüğü veya emniyet kemeri takmayan personeli anında tespit ederek ilgili departmanlara uyarı gönderir.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <ShieldCheck className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Tehlikeli Alan Kontrolü</h3>
              <p className="text-slate-400 leading-relaxed">
                Yetkisiz personelin girmesinin yasak olduğu bölgelere veya çalışan makinelerin güvenlik bariyerlerine yapılan ihlalleri saniyesinde algılar.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <AlertTriangle className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Düşme ve Kaza Algılama</h3>
              <p className="text-slate-400 leading-relaxed">
                Yere düşen veya uzun süre hareketsiz kalan personeli (Man Down Detection) tespit edip, ilk yardım ekiplerini otonom olarak yönlendirir.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
