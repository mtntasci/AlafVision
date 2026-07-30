import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";

export default function KvkkPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-white/10 pb-6">KVKK Aydınlatma Metni</h1>
          
          <div className="space-y-6 text-slate-400 leading-relaxed">
            <p>
              <strong>Kişisel Verilerin Korunması Kanunu (KVKK) Kapsamında Aydınlatma Metni</strong>
            </p>
            
            <p>
              Alaf Teknoloji (Veri Sorumlusu), 6698 sayılı Kişisel Verilerin Korunması Kanunu ("Kanun") uyarınca, sizlere sunduğu ürün ve hizmetler kapsamında elde edilen kişisel verilerin korunmasına özel önem vermektedir.
            </p>

            <h2 className="text-xl font-bold text-white mt-8 mb-4">1. İşlenen Kişisel Veriler ve İşlenme Amaçları</h2>
            <p>
              Web sitemizi ziyaret etmeniz veya ürünlerimizi (Alaf Vision sistemleri) kullanmanız dolayısıyla;
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>Kurumsal Bilgileriniz:</strong> Şirket unvanı, iletişim bilgileri, e-posta adresiniz vb. müşteri panelinize giriş ve lisans doğrulaması amacıyla işlenmektedir.
              </li>
              <li>
                <strong>Görüntü İşleme Metadataları:</strong> Kameralardan elde edilen görüntüler Alaf Vision Edge teknolojisi sayesinde merkeze aktarılmadan <strong>lokal donanım üzerinde (On-Premise) işlenir.</strong> Görüntülerin kendisi (video kayıtları veya fotoğraflar) sunucularımıza iletilmez. Sunucularımıza sadece işlenmiş sonuç verileri (Örn: "Bir kişi tespit edildi") metin olarak anonimleştirilmiş halde ulaşabilir.
              </li>
            </ul>

            <h2 className="text-xl font-bold text-white mt-8 mb-4">2. İşlenen Kişisel Verilerin Aktarımı</h2>
            <p>
              Alaf Teknoloji, sunucularına ulaşan herhangi bir kişisel veriyi, yasal zorunluluklar haricinde yurt içi veya yurt dışındaki üçüncü şahıs şirketlere pazarlama, analiz veya ticari amaçlarla <strong>kesinlikle aktarmaz.</strong>
            </p>

            <h2 className="text-xl font-bold text-white mt-8 mb-4">3. İlgili Kişinin Hakları (Kanun Madde 11)</h2>
            <p>
              Kişisel veri sahipleri; kişisel veri işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme haklarına sahiptir.
            </p>
            
            <p className="mt-8 pt-6 border-t border-white/10 text-sm">
              Haklarınızı kullanmak ve detaylı bilgi almak için <strong>info@alafteknoloji.com</strong> adresi üzerinden Veri Sorumlusu sıfatıyla şirketimize başvurabilirsiniz.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
