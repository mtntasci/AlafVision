import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { Code2, GitMerge, FileCode2, Layers } from "lucide-react";

export default function CgoPage() {
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
            Teknoloji: CGO Entegrasyonları
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white max-w-4xl mx-auto leading-tight">
            Go'nun Sadeliği, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
              C++'ın Saf Gücü
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Görüntü işleme iş yüklerini C/C++ motorlarına devrederken, web tabanlı iletişimleri ve API katmanlarını Go (Golang) ile yönettiğimiz melez mimari.
          </p>
        </section>

        {/* Features Grid */}
        <section className="w-full container mx-auto px-6 py-12 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <Code2 className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Yüksek Performanslı Köprü</h3>
              <p className="text-slate-400 leading-relaxed">
                Opencv ve TensorRT gibi sistemlerin yerel C++ kütüphanelerini, CGO arayüzü sayesinde bellek kopyalaması (zero-copy) olmadan Go üzerinde kullanıyoruz.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <GitMerge className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Eşzamanlı (Concurrent) Yapı</h3>
              <p className="text-slate-400 leading-relaxed">
                Go'nun eşsiz Goroutine yapısı ile yüzlerce kamera akışını aynı anda karşılarken, analiz işlemini C++ thread'lerine asenkron olarak aktarıyoruz.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <Layers className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Mikroservis Uyumluluğu</h3>
              <p className="text-slate-400 leading-relaxed">
                Ağır C++ backend'lerini monolithic yapılardan çıkarıp, Go ile sarmalanmış modern REST ve gRPC mikroservislerine dönüştürüyoruz.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <FileCode2 className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Güvenli Bellek Yönetimi</h3>
              <p className="text-slate-400 leading-relaxed">
                C++ tarafında yaşanabilecek bellek sızıntılarını (memory leaks) özel pointer yönetimi ve Go'nun Garbage Collector'u (GC) ile izole ederek engelliyoruz.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
