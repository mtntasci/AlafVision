import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { Search, Flame, Shield, Map } from "lucide-react";

export default function AnomalySolutions() {
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
            İleri Düzey Video Analitiği
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-primary-text max-w-4xl mx-auto leading-tight">
            Tehditleri Gerçekleşmeden <br />
            <span className="text-accent">
              Anında Tespit Edin
            </span>
          </h1>
          
          <p className="text-lg text-secondary-text max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Sadece ne olduğunu değil, ne olabileceğini analiz edin. Gelişmiş eylem tanıma (Action Recognition) modelleri ile güvenlik açıklarını yapay zekaya bırakın.
          </p>
        </section>

        {/* Features Grid */}
        <section className="w-full container mx-auto px-6 py-12 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <Search className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Şüpheli Paket / Bagaj</h3>
              <p className="text-secondary-text leading-relaxed">
                Havalimanları ve AVM'ler gibi kalabalık alanlarda sahipsiz veya unutulmuş bagajları otonom olarak saniyeler içerisinde algılar.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Agresif Davranış ve Kavga</h3>
              <p className="text-secondary-text leading-relaxed">
                İnsan iskelet yapısını (Pose Estimation) analiz ederek, normal dışı el kol hareketleri, fiziksel şiddet veya kavga durumlarını anında bildirir.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <Flame className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Erken Yangın Tespiti</h3>
              <p className="text-secondary-text leading-relaxed">
                Henüz duman sensörlerinin algılamayacağı seviyede olan kıvılcım, alev başlangıcı veya anormal duman yükselişlerini görsel olarak tespit eder.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="group p-8 rounded-3xl bg-surface-1 border border-border-subtle hover:border-border-subtle transition-all hover:bg-surface-2">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
                <Map className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary-text mb-3">Çevre Güvenliği</h3>
              <p className="text-secondary-text leading-relaxed">
                Askeri tesisler, sınır güvenliği veya özel mülkler için sanal çit (Virtual Fencing) oluşturarak sızma girişimlerini hatasız yakalar.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
