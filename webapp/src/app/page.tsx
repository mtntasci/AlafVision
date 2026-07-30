import Link from "next/link";
import { 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Camera,
  Server,
  Network,
  ArrowRight,
  MonitorSmartphone,
  Eye,
  Activity,
  Users
} from "lucide-react";

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className={className}
    fill="none"
  >
    <circle cx="50" cy="50" r="40" className="stroke-blue-500" strokeWidth="8" />
    <circle cx="50" cy="50" r="20" className="fill-purple-500" />
    <circle cx="20" cy="50" r="8" className="fill-pink-500" />
    <circle cx="80" cy="50" r="8" className="fill-blue-400" />
    <circle cx="50" cy="20" r="8" className="fill-indigo-400" />
    <circle cx="50" cy="80" r="8" className="fill-purple-400" />
    <path d="M26 50 Q50 20 74 50" className="stroke-blue-500" strokeWidth="4" />
    <path d="M26 50 Q50 80 74 50" className="stroke-purple-500" strokeWidth="4" />
    <path d="M50 26 Q80 50 50 74" className="stroke-indigo-500" strokeWidth="4" />
    <path d="M50 26 Q20 50 50 74" className="stroke-pink-500" strokeWidth="4" />
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-purple-500/30 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: `40px 40px`,
            maskImage: `linear-gradient(to bottom, transparent, black, transparent)`
          }} 
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10 animate-pulse" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Alaf Plate
          </span>
        </div>
        <Link 
          href="/login" 
          className="relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors hover:bg-slate-900">
            Sisteme Giriş
          </span>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 pb-16 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Akıllı Görüntü Analizi Sistemi Aktif
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white max-w-4xl mx-auto leading-tight">
          Alaf Plate ile <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
            Sınırları Aşan Yapay Zeka
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Kamera ile çekilen görüntüde özelleşmiş aramalar yapan yeni nesil sistem. 
          Şu an demo olarak Plaka, Araç, Marka ve Model tanıma hizmeti sunarken; 
          yakında Yüz Tanıma, Kişi Sayma, Odak Ölçme ve AI tabanlı Anomali Tespiti gibi devrimsel özelliklerle gücüne güç katıyor.
        </p>
        
        <Link 
          href="/login" 
          className="group relative inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-8 py-3.5 rounded-full font-semibold text-lg hover:bg-slate-200 transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
        >
          Canlı Demoyu Başlat
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </main>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="group p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-colors backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
              <Camera className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Çoklu Kamera</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Farklı noktalardaki kameraları tek bir merkeze bağlayarak geniş çaplı ve eşzamanlı izleme, analiz yeteneği.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 transition-colors backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Kişi Sayma & Yüz Tanıma</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Etkinlikler ve alanlar için hassas kişi sayma ile birlikte gelişmiş yüz tanıma sistemi.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-purple-500/30 transition-colors backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
              <Eye className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Odak Ölçme</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              AVM içi dükkanlar ve reyonlar için müşteri odak ölçümü ve ısı haritaları oluşturma.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-pink-500/30 transition-colors backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6">
              <Activity className="w-7 h-7 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Anomali Tespiti</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Yapay zeka ile hırsızlık, silah/kesici alet algılama, madde etkisinde olma durumu veya agresiflik tespiti.
            </p>
          </div>

          {/* Card 5 */}
          <div className="group p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-orange-500/30 transition-colors backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
              <Server className="w-7 h-7 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Bare-Metal Performans</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Docker gibi sanallaştırma katmanlarını ortadan kaldırarak, donanımın tüm gücünü doğrudan işletim sistemi üzerinden kullanır.
            </p>
          </div>
          
          {/* Card 6 */}
          <div className="group p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-cyan-500/30 transition-colors backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">TensorRT Hızlandırması</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              CUDA çekirdeklerinin gücüyle donanımsal hızlandırma. Milisaniyeler seviyesinde kesintisiz canlı veri akışı.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative z-10 py-16 bg-slate-900/30 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Nasıl Çalışır?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Görüntünün işlenip size ulaşma süreci.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-slate-800/40 rounded-2xl border border-white/5 w-full md:w-1/5 shadow-lg">
              <div className="w-14 h-14 rounded-full bg-slate-700/50 flex items-center justify-center mb-4 text-blue-400">
                <Camera size={26} />
              </div>
              <h4 className="text-white font-medium mb-2">Kamera</h4>
              <p className="text-xs text-slate-400">Görüntü kaynağı (Mobil, IP vb.)</p>
            </div>

            <ArrowRight className="hidden md:block text-slate-600 w-8 h-8" />

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-slate-800/40 rounded-2xl border border-white/5 w-full md:w-1/5 shadow-lg">
              <div className="w-14 h-14 rounded-full bg-slate-700/50 flex items-center justify-center mb-4 text-indigo-400">
                <Network size={26} />
              </div>
              <h4 className="text-white font-medium mb-2">Tünelleme</h4>
              <p className="text-xs text-slate-400">Cloudflare WSS aktarımı</p>
            </div>

            <ArrowRight className="hidden md:block text-slate-600 w-8 h-8" />

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-slate-800/40 rounded-2xl border border-purple-500/30 w-full md:w-1/5 shadow-[0_0_30px_rgba(139,92,246,0.15)] relative">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20 blur-sm"></div>
              <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <Cpu size={26} />
              </div>
              <h4 className="text-white font-medium mb-2">Alaf Plate AI</h4>
              <p className="text-xs text-slate-400">Yapay Zeka Motoru</p>
            </div>

            <ArrowRight className="hidden md:block text-slate-600 w-8 h-8" />

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center p-6 bg-slate-800/40 rounded-2xl border border-white/5 w-full md:w-1/5 shadow-lg">
              <div className="w-14 h-14 rounded-full bg-slate-700/50 flex items-center justify-center mb-4 text-pink-400">
                <MonitorSmartphone size={26} />
              </div>
              <h4 className="text-white font-medium mb-2">Dashboard</h4>
              <p className="text-xs text-slate-400">Canlı sonuç gösterimi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-auto">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6 grayscale opacity-50" />
            <span className="text-slate-500 text-sm font-medium">Alaf Plate</span>
          </div>
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Alaf Teknoloji. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
            <Link href="#" className="hover:text-white transition-colors">Kullanım Şartları</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
