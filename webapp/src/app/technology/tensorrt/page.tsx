import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { Cpu, Zap, Maximize, Clock } from "lucide-react";

export default function TensorRtPage() {
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
            Teknoloji: NVIDIA TensorRT
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-primary-text max-w-4xl mx-auto leading-tight">
            Yapay Zekada <br />
            <span className="text-accent">
              Maksimum Çıkarım (Inference) Hızı
            </span>
          </h1>
          
          <p className="text-lg text-secondary-text max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Eğitilmiş Pytorch veya TensorFlow modellerimizi, doğrudan NVIDIA GPU'ların çekirdeklerine hitap edecek şekilde optimize (Quantization) ederek performansı %300 artırıyoruz.
          </p>
        </section>

        {/* Features Grid */}
        <section className="w-full container mx-auto px-6 py-12 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mx-auto mb-6 border border-border-subtle">
                <Maximize className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3">Model Optimizasyonu</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                FP32'den FP16 veya INT8 formatına kayıpsız dönüştürme işlemiyle modellerin kapladığı alanı ve RAM tüketimini küçültüyoruz.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mx-auto mb-6 border border-border-subtle">
                <Zap className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3">Daha Yüksek FPS</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Düşük donanımlı Edge cihazlarında (Jetson Nano, Orin) bile gerçek zamanlı (30+ FPS) nesne tespiti sağlayan katman birleştirme teknolojisi.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mx-auto mb-6 border border-border-subtle">
                <Clock className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3">Sıfır Gecikme (Latency)</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Milisaniyelik karar mekanizmaları gerektiren otoyol ALPR veya acil durdurma sistemlerinde hayati önem taşıyan tepki süresi.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mx-auto mb-6 border border-border-subtle">
                <Cpu className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3">Donanıma Özel Derleme</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Modelin çalıştırılacağı GPU mimarisine (Ampere, Ada Lovelace vb.) tam uyumlu motor dosyaları (engine file) üreterek %100 uyum sağlarız.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
