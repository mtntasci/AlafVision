# Alaf Teknoloji - Component Standartları

Alaf Node ve yeni geliştirilecek projelerde kod tekrarını önlemek ve tutarlılığı korumak adına tüm UI bileşenleri aşağıdaki standart Tailwind sınıfları kullanılarak inşa edilmelidir.

## 1. Buton Standartları (Button)

Alaf sisteminde butonlar net, kenarları hafif yuvarlatılmış (rounded-md) ve okunaklı olmalıdır. Transition süresi genellikle default (150ms) tutulmalıdır (`transition-colors`).

### Primary Button
- **Kullanım:** Login, Kaydet, Yeni Ekle gibi ana aksiyonlar.
- **Stil:** `bg-accent hover:bg-accent-hover text-background font-bold py-2 px-4 rounded-md transition-colors`
- *(Not: Üzerindeki metin, zıtlığı sağlamak adına arka plan rengi olan `#070707` tonlarında veya direkt `text-background` olmalıdır.)*

### Secondary Button (Ghost/Surface)
- **Kullanım:** İptal, Geri Dön, İkincil eylemler veya Login with Google gibi sağlayıcı butonları.
- **Stil:** `bg-surface-2 hover:bg-surface-3 text-primary-text font-medium py-2 px-4 rounded-md transition-colors`

### Seçenekler (Sizes)
- **Small:** `py-1.5 px-3 text-sm`
- **Medium (Default):** `py-2 px-4`
- **Large:** `py-3 px-6 text-lg`

## 2. Kart Standartları (Card)

Kartlar sitenin temel yapı taşlarıdır. Bilgiyi gruplamak için "Surface" renkleri ve çok ince border kullanılır. Kesinlikle iç tarafa koyu bir border veya shadow blur karmaşası verilmemelidir.

### Standart İçerik Kartı (Listing / Grid Node Card)
- **Kullanım:** Dashboard grid görünümleri (Örn: Node listesi, Ürün listesi).
- **Stil:** `bg-surface-1 border border-border-subtle rounded-xl p-6 relative overflow-hidden group-hover:border-accent transition-colors`
- **Davranış:** Kart bir Link (veya `group`) içerisinde sarılır, hover durumunda çerçevenin ince çizgisi `border-accent` rengine dönerek interaktif bir tepki verir.

### Form / Modal / Odak Kartı
- **Kullanım:** Login ekranı, Setting panelleri, modal arka planı.
- **Stil:** `bg-surface-2 border border-border-subtle rounded-2xl shadow-xl p-8 sm:p-10`
- **Fark:** Arka plan `surface-2` (daha açık/farklı bir siyah) yapılarak Body'den ayrılır. Border radius daha geniştir (`rounded-2xl`).

## 3. Form Elemanları (Inputs)

- **Label:** `text-sm font-medium text-secondary-text mb-1 block`
- **Input Field:** `w-full bg-background border border-border-subtle rounded-md px-4 py-2 text-primary-text focus:outline-none focus:border-accent transition-colors`
- **Davranış:** Input tıklandığında focus halkası (`ring`) yerine, doğrudan border rengi `focus:border-accent` ile ana marka rengine döner.

## 4. Etiketler ve Status Badges

Durum bildiren ufak etiketlerde "Soft" (yarı saydam) zeminler kullanılır.

- **Status (Online/Aktif):** `px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`
- **Tag / Category (Sabit Bilgi):** `text-[10px] px-1.5 py-0.5 rounded-md border border-border-subtle bg-surface-3 text-secondary-text font-medium uppercase tracking-wider`

## 5. Divider (Ayraçlar)

- İçerik bloklarını veya "veya" gibi metinleri ayırmak için: `border-t border-border-subtle`.
- Örnek kullanım (Login OR seperator): `flex items-center before:flex-1 before:border-t before:border-border-subtle after:flex-1 ...`

## 6. Feedback & Uyarılar (Alerts)

- **Error Alert:** `bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md mb-4 text-sm`
- **Empty State:** `bg-surface-1 border border-border-subtle rounded-xl p-8 text-center text-secondary-text`
