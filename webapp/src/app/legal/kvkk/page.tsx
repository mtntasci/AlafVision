import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";

export default function KvkkPage() {
  return (
    <div className="min-h-screen bg-background text-primary-text selection:bg-accent-soft/30 font-sans overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="flex-1 relative z-10 flex flex-col items-center py-20 px-4">
        <article className="w-full max-w-4xl bg-surface-1/50 backdrop-blur-xl border border-border-subtle rounded-3xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-text mb-8 border-b border-border-subtle pb-6">KVKK Aydınlatma Metni</h1>
          
          <div className="space-y-6 text-secondary-text leading-relaxed">
            <p>
              <strong>Kişisel Verilerin Korunması Kanunu (KVKK) Kapsamında Aydınlatma Metni</strong>
            </p>
            
            <p>
              Alaf Teknoloji (Veri Sorumlusu), 6698 sayılı Kişisel Verilerin Korunması Kanunu ("Kanun") uyarınca, sizlere sunduğu ürün ve hizmetler kapsamında elde edilen kişisel verilerin korunmasına özel önem vermektedir.
            </p>

            <h2 className="text-xl font-bold text-primary-text mt-8 mb-4">1. İşlenen Kişisel Veriler ve İşlenme Amaçları</h2>
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

            <h2 className="text-xl font-bold text-primary-text mt-8 mb-4">2. İşlenen Kişisel Verilerin Aktarımı</h2>
            <p>
              Alaf Teknoloji, sunucularına ulaşan herhangi bir kişisel veriyi, yasal zorunluluklar haricinde yurt içi veya yurt dışındaki üçüncü şahıs şirketlere pazarlama, analiz veya ticari amaçlarla <strong>kesinlikle aktarmaz.</strong>
            </p>

            <h2 className="text-xl font-bold text-primary-text mt-8 mb-4">3. İlgili Kişinin Hakları (Kanun Madde 11)</h2>
            <p>
              Kişisel veri sahipleri; kişisel veri işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme haklarına sahiptir.
            </p>
            
            <p className="mt-8 pt-6 border-t border-border-subtle text-sm">
              Haklarınızı kullanmak ve detaylı bilgi almak için <strong>info@alafteknoloji.com</strong> adresi üzerinden Veri Sorumlusu sıfatıyla şirketimize başvurabilirsiniz.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
