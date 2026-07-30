import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { Code2, GitMerge, FileCode2, Layers } from "lucide-react";

export default function CgoPage() {
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
            Teknoloji: CGO Entegrasyonları
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-primary-text max-w-4xl mx-auto leading-tight">
            Go'nun Sadeliği, <br />
            <span className="text-accent">
              C++'ın Saf Gücü
            </span>
          </h1>
          
          <p className="text-lg text-secondary-text max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Görüntü işleme iş yüklerini C/C++ motorlarına devrederken, web tabanlı iletişimleri ve API katmanlarını Go (Golang) ile yönettiğimiz melez mimari.
          </p>
        </section>

        {/* Features Grid */}
        <section className="w-full container mx-auto px-6 py-12 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <Code2 className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Yüksek Performanslı Köprü</h3>
              <p className="text-secondary-text leading-relaxed">
                Opencv ve TensorRT gibi sistemlerin yerel C++ kütüphanelerini, CGO arayüzü sayesinde bellek kopyalaması (zero-copy) olmadan Go üzerinde kullanıyoruz.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <GitMerge className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Eşzamanlı (Concurrent) Yapı</h3>
              <p className="text-secondary-text leading-relaxed">
                Go'nun eşsiz Goroutine yapısı ile yüzlerce kamera akışını aynı anda karşılarken, analiz işlemini C++ thread'lerine asenkron olarak aktarıyoruz.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <Layers className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Mikroservis Uyumluluğu</h3>
              <p className="text-secondary-text leading-relaxed">
                Ağır C++ backend'lerini monolithic yapılardan çıkarıp, Go ile sarmalanmış modern REST ve gRPC mikroservislerine dönüştürüyoruz.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <FileCode2 className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Güvenli Bellek Yönetimi</h3>
              <p className="text-secondary-text leading-relaxed">
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
