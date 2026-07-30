import Link from "next/link";
import { 
  ArrowRight, 
  ChevronDown, 
  ShieldCheck, 
  Eye, 
  Store, 
  Car, 
  Factory, 
  Cpu, 
  Lock, 
  Server, 
  Network,
  Activity,
  FileJson,
  Video
} from "lucide-react";

// Alaf Vision Logo (Kurumsal, teknolojik ve güven veren bir tasarım)
const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className={className}
    fill="none"
  >
    <rect x="20" y="20" width="60" height="60" rx="14" className="stroke-blue-600" strokeWidth="6" />
    <circle cx="50" cy="50" r="16" className="fill-blue-500" />
    <path d="M50 20 L50 34 M50 80 L50 66 M20 50 L34 50 M80 50 L66 50" className="stroke-blue-400" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-blue-500/30 font-sans overflow-x-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
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

      {/* --- NAVBAR --- */}
      <nav className="relative z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-9 h-9" />
            <span className="text-2xl font-bold tracking-tight text-white">
              Alaf <span className="text-blue-500">Vision</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#cozumler" className="hover:text-white transition-colors">Çözümler</a>
            <a href="#edge-ai" className="hover:text-white transition-colors">Edge AI</a>
            <a href="#guvenilirlik" className="hover:text-white transition-colors">Güvenilirlik</a>
          </div>
          <Link 
            href="https://vision.alafteknoloji.com/login" 
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            Müşteri Girişi
          </Link>
        </div>
      </nav>

      {/* --- 1. HERO SECTION --- */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 text-center pb-20 pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Alaf Teknoloji Yapay Zeka Altyapısı
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-white max-w-5xl mx-auto leading-[1.1]">
          Görüntü İşleme ve Yapay Zekanın <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
            Uç Noktası: Alaf Vision
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
          İhtiyacınıza özel eğitilmiş yapay zeka modelleriyle kameralarınızı akıllı sensörlere dönüştürün. Perakendeden savunma sanayisine, veriyi dışarı çıkarmadan yerelde (Edge) analiz eden kaya gibi sağlam sistemler tasarlıyoruz.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="https://vision.alafteknoloji.com/login" 
            className="group relative inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-500 transition-all duration-300 w-full sm:w-auto shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
          >
            Canlı Demo: Plaka ve Araç Tespiti
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#cozumler"
            className="group inline-flex items-center justify-center gap-2 bg-slate-800/50 text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/10 hover:bg-slate-800 transition-all duration-300 w-full sm:w-auto"
          >
            Senaryoları Keşfedin
            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform text-slate-400" />
          </a>
        </div>
      </main>

      {/* --- 2. ÇÖZÜM SENARYOLARIMIZ --- */}
      <section id="cozumler" className="relative z-10 py-24 bg-slate-950/50 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Çözüm Senaryolarımız</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Sektörünüze özel geliştirilmiş, tak-çalıştır ve yüksek doğruluk oranına sahip yapay zeka modülleri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Perakende Analitiği */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                <Store className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Perakende Analitiği</h3>
              <p className="text-slate-400 leading-relaxed">
                Mağazanızın performansını verilerle ölçün. Hassas kişi sayma, sıcaklık/ısı haritası (heatmap) ve reyon bazlı müşteri odak tespiti ile mağaza içi davranışları analiz edin.
              </p>
            </div>

            {/* Mağaza Güvenliği */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-indigo-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Mağaza Güvenliği</h3>
              <p className="text-slate-400 leading-relaxed">
                Güvenlik kameralarınızı proaktif bir bekçiye dönüştürün. Kasa işlem analizleri, anomali tespiti ve eylem tanıma (Action Recognition) ile hırsızlık vakalarını anında önleyin.
              </p>
            </div>

            {/* Akıllı Şehir & Trafik */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-cyan-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
                <Car className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Akıllı Şehir & Trafik</h3>
              <p className="text-slate-400 leading-relaxed">
                Milisaniyelik ALPR (Otomatik Plaka Tanıma Sistemi). Araç marka, model, renk ve hız ihlal tespiti. <span className="text-cyan-400 font-medium">visionapi.alafteknoloji.com</span> altyapısıyla sıfır gecikmeli veri akışı.
              </p>
            </div>

            {/* Endüstriyel Tesisler */}
            <div className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-orange-500/30 transition-all hover:bg-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                <Factory className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Endüstriyel Tesisler</h3>
              <p className="text-slate-400 leading-relaxed">
                İş güvenliğini şansa bırakmayın. Baret/yelek ihlalleri, yetkisiz tehlikeli alan girişleri, makine başı personel takibi ve acil durum algılama sistemleri.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. NEDEN ALAF VISION? (EDGE COMPUTING) --- */}
      <section id="edge-ai" className="relative z-10 py-24 border-y border-white/5 overflow-hidden">
        {/* Subtle background gradient for this section */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/10 to-slate-950 pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Neden Alaf Vision?</h2>
            <p className="text-blue-400 font-medium text-lg mb-2">Merkezi Değil, Uç Nokta (Edge) Mimarisi</p>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Veriyi üretildiği yerde, anında işliyoruz. Buluta devasa videolar göndermek yerine sadece sonuçları iletiyoruz.
            </p>
          </div>

          {/* 3 Step Flow */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-5xl mx-auto mb-20">
            <div className="flex flex-col items-center text-center p-6 bg-slate-900 rounded-2xl border border-white/5 w-full md:w-1/3">
              <Video className="w-12 h-12 text-slate-400 mb-4" />
              <h4 className="text-white font-bold mb-2">1. Kamera Görüntüsü</h4>
              <p className="text-sm text-slate-500">Mevcut IP kameralarınızdan gelen yüksek boyutlu ham video akışı.</p>
            </div>
            
            <div className="hidden md:flex flex-col items-center text-blue-500">
              <ArrowRight className="w-8 h-8" />
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-blue-900/20 rounded-2xl border border-blue-500/30 w-full md:w-1/3 shadow-[0_0_30px_rgba(37,99,235,0.1)] relative">
              <div className="absolute -top-3 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Edge İşlem
              </div>
              <Cpu className="w-12 h-12 text-blue-400 mb-4" />
              <h4 className="text-white font-bold mb-2">2. Yerel Alaf Düğümü</h4>
              <p className="text-sm text-slate-400">Görüntü yereldeki sunucuda işlenir, anonimleştirilir ve anlamlandırılır.</p>
            </div>

            <div className="hidden md:flex flex-col items-center text-blue-500">
              <ArrowRight className="w-8 h-8" />
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-slate-900 rounded-2xl border border-white/5 w-full md:w-1/3">
              <FileJson className="w-12 h-12 text-green-400 mb-4" />
              <h4 className="text-white font-bold mb-2">3. Sadece Anlamlı Veri</h4>
              <p className="text-sm text-slate-500">Merkeze veya buluta sadece KB boyutunda analiz verisi (JSON) gider.</p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="p-6">
              <Lock className="w-8 h-8 text-blue-500 mb-4" />
              <h4 className="text-white font-bold mb-2">KVKK ve GDPR Uyumu</h4>
              <p className="text-sm text-slate-400">Ham görüntüler mağazadan/tesisten asla dışarı çıkmaz, %100 gizlilik sağlar.</p>
            </div>
            <div className="p-6">
              <Activity className="w-8 h-8 text-cyan-500 mb-4" />
              <h4 className="text-white font-bold mb-2">Sıfır İnternet Gecikmesi</h4>
              <p className="text-sm text-slate-400">Bağlantı kopsa bile yerel sistem çalışmaya ve kaydetmeye devam eder.</p>
            </div>
            <div className="p-6">
              <Network className="w-8 h-8 text-purple-500 mb-4" />
              <h4 className="text-white font-bold mb-2">Bant Genişliği Tasarrufu</h4>
              <p className="text-sm text-slate-400">Video aktarımı olmadığı için ağ altyapınızı yormaz, maliyetleri düşürür.</p>
            </div>
            <div className="p-6">
              <Server className="w-8 h-8 text-orange-500 mb-4" />
              <h4 className="text-white font-bold mb-2">Bare-Metal Gücü</h4>
              <p className="text-sm text-slate-400">Sanallaştırmasız, doğrudan donanım üzerinde çalışarak maksimum FPS elde eder.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. GÜVENİLİRLİK (TRUST SECTION) --- */}
      <section id="guvenilirlik" className="relative z-10 py-24 bg-slate-900/80">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-10 md:p-14 border border-white/10 relative overflow-hidden shadow-2xl">
            {/* Background Icon */}
            <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 text-slate-800/50 pointer-events-none" />
            
            <div className="relative z-10 md:w-3/4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/50 border border-slate-700 text-slate-300 text-sm font-medium mb-6">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Askeri Standartlarda Güvenilirlik
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-6 leading-tight">
                Sıfır Hata Toleranslı <br />
                Mühendislik Disiplini
              </h3>
              
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                Savunma sanayi projelerinde ve test altyapılarında edindiğimiz katı mühendislik prensiplerini, ticari ürünlerimize eksiksiz aktarıyoruz. 
                <strong className="text-slate-200 font-semibold"> 7/24 kesintisiz</strong> çalışan, donanım kaynaklarını en verimli kullanan ve dış müdahalelere tamamen kapalı 
                <strong className="text-slate-200 font-semibold"> (Air-Gapped)</strong> sistemler inşa ediyoruz.
              </p>
              
              <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  Air-Gapped Uyumlu
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  %99.9 Uptime
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. MEGA FOOTER --- */}
      <footer className="relative z-10 bg-slate-950 border-t border-white/10 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Sütun 1: Marka */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Logo className="w-8 h-8" />
                <span className="text-xl font-bold tracking-tight text-white">
                  Alaf Vision
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Yapay zeka ve görüntü işleme teknolojileriyle geleceğin otonom ve akıllı sistemlerini inşa eden teknoloji partneriniz.
              </p>
            </div>

            {/* Sütun 2: Çözümler */}
            <div>
              <h4 className="text-white font-bold mb-6">Çözümler</h4>
              <ul className="flex flex-col gap-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Perakende Analitiği</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Trafik ve ALPR Sistemleri</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Endüstriyel İş Güvenliği</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Anomali ve Tehdit Tespiti</a></li>
              </ul>
            </div>

            {/* Sütun 3: Teknoloji */}
            <div>
              <h4 className="text-white font-bold mb-6">Teknoloji</h4>
              <ul className="flex flex-col gap-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Edge AI Mimarisi</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Bare-Metal Performans</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">CGO Entegrasyonları</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">NVIDIA TensorRT Hızlandırma</a></li>
              </ul>
            </div>

            {/* Sütun 4: İletişim */}
            <div>
              <h4 className="text-white font-bold mb-6">Bize Ulaşın</h4>
              <ul className="flex flex-col gap-4 text-sm text-slate-400">
                <li>info@alafteknoloji.com</li>
                <li>Üniversiteler Mah. İhsan Doğramacı Bulvarı</li>
                <li>ODTÜ Teknokent Bilişim İnovasyon Merkezi</li>
                <li>Çankaya / Ankara</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Alaf Teknoloji. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-6 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
              <a href="#" className="hover:text-white transition-colors">KVKK Aydınlatma Metni</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
