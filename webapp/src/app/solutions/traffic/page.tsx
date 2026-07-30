import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { Car, Zap, ShieldAlert, Cpu } from "lucide-react";

export default function TrafficSolutions() {
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
            Akıllı Şehir Teknolojileri
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-primary-text max-w-4xl mx-auto leading-tight">
            Geleceğin Akıllı <br />
            <span className="text-accent">
              Trafik Sistemleri
            </span>
          </h1>
          
          <p className="text-lg text-secondary-text max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Gelişmiş ALPR (Otomatik Plaka Tanıma) motorumuzla araçları milisaniyeler içerisinde tanıyın, marka ve model analizi yapın.
          </p>
        </section>

        {/* Features Grid */}
        <section className="w-full container mx-auto px-6 py-12 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <Car className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Kapsamlı ALPR Analizi</h3>
              <p className="text-secondary-text leading-relaxed">
                Sadece plaka değil, aracın markası, modeli ve rengini yüksek doğrulukla tespit edin. Otoyol gişeleri ve otopark girişleri için kusursuz entegrasyon.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <Zap className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Sıfır Gecikme (Zero Latency)</h3>
              <p className="text-secondary-text leading-relaxed">
                <span className="text-accent font-medium">visionapi.alafteknoloji.com</span> altyapısı ve Edge mimarisi sayesinde internet kopmalarından etkilenmeden, sıfır gecikmeli veri akışı.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <ShieldAlert className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">İhlal ve Hız Tespiti</h3>
              <p className="text-secondary-text leading-relaxed">
                Kırmızı ışık ihlalleri, ters yön girişleri ve ortalama hız aşımlarını otonom olarak tespit edip raporlayarak şehir içi güvenliği maksimize edin.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <Cpu className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Yüksek Hızlı Otoyol Desteği</h3>
              <p className="text-secondary-text leading-relaxed">
                200 km/s hızla seyreden araçlarda dahi keskin ve net görüntü analizi. Gelişmiş TensorRT algoritmalarıyla bulanıklaşma (motion blur) etkisi sıfırlanır.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
