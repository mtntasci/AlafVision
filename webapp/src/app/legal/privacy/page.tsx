import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-blue-500/30 font-sans overflow-x-hidden flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px]" />
      </div>

      <Navbar />

      <main className="flex-1 relative z-10 flex flex-col items-center py-20 px-4">
        <article className="w-full max-w-4xl bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-white/10 pb-6">Gizlilik Politikası</h1>
          
          <div className="space-y-6 text-slate-400 leading-relaxed">
            <p>
              <strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}
            </p>
            
            <p>
              Alaf Teknoloji ("Alaf Vision" olarak anılacaktır), müşteri ve kullanıcılarının gizliliğine en yüksek düzeyde önem vermektedir. 
              Geliştirdiğimiz "Edge AI" (Uç Nokta Yapay Zeka) mimarisi gereği, varsayılan olarak kamera görüntüleri sunucularımıza veya herhangi bir dış bulut ağına <strong>aktarılmamaktadır.</strong>
            </p>

            <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Toplanan Veriler</h2>
            <p>
              Sistemlerimiz, yapılandırıldığı şekliyle yerel sunucularda (on-premise) çalışır. Tarafımıza iletilen veriler yalnızca, cihaz sağlığı (ping/CPU durumu), donanım metrikleri ve lisans/yetkilendirme kontrolü sağlayan (JSON formatındaki) metin tabanlı token'lardan ibarettir.
            </p>
            <p>
              Kişileri teşhis edici (yüz, beden gibi) biometrik ham video verileri sistemlerinizden asla dışarı çıkarılmaz.
            </p>

            <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Verilerin Kullanım Amacı</h2>
            <p>
              Sistemin lisans doğrulaması, olası yazılım hatalarının (crash dump) tespit edilmesi ve size sağlanan müşteri paneli arayüzlerinin sağlıklı bir şekilde sürdürülebilmesi için anonim istatistiki veriler kullanılabilir.
            </p>

            <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Veri Paylaşımı ve Üçüncü Taraflar</h2>
            <p>
              Alaf Teknoloji, topladığı hiçbir teknik veriyi reklam, pazarlama veya ticari kazanç sağlamak amacıyla üçüncü şahıs veya kurumlarla paylaşmaz, satmaz.
            </p>

            <h2 className="text-xl font-bold text-white mt-8 mb-4">4. İletişim</h2>
            <p>
              Gizlilik politikamız ile ilgili soru ve talepleriniz için lütfen <strong>info@alafteknoloji.com</strong> adresi üzerinden bizimle iletişime geçiniz.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
