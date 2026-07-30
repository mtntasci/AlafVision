# Alaf Teknoloji - Responsive (Duyarlı Tasarım) Kuralları

Bu doküman, yeni geliştirilecek olan Alaf ürünlerinin mobil, tablet ve masaüstü platformlarında sergileyeceği yapısal davranışları (grid, spacing, container) standartlaştırmak amacıyla Alaf Node baz alınarak hazırlanmıştır.

## 1. Breakpoint Standartları (Tailwind Defaults)

Özel bir grid sistemi tanımlamak yerine, sistemin genel TailwindCSS breakpoint'leri referans alınmalıdır:
- **Mobil (Default):** `< 640px` (Örn: `grid-cols-1`, `p-4`)
- **sm (Büyük Mobil / Küçük Tablet):** `640px`
- **md (Tablet):** `768px`
- **lg (Desktop):** `1024px`
- **xl (Geniş Ekran):** `1280px`

## 2. Container ve Sayfa Düzeni

Sistem genellikle yönetim paneli (dashboard) odaklı olduğu için tam ekran genişlik (Fluid) yaklaşımı benimsenmiştir.
- **Root Layout:** `min-h-screen flex flex-col bg-background text-primary-text`
- **Main Content:** Genellikle padding değerleri cihaz boyutuna göre değişir.
  - Mobil: `p-4` veya `p-6`
  - Tablet/Masaüstü: `p-8` veya `p-10`

*(Örnek Login Form kısıtlaması: `w-full max-w-md mx-auto p-8 sm:p-10`. Formlar çok fazla esnetilmemeli, max-w ile sınırlandırılmalıdır.)*

## 3. Grid ve Kart Dizilimleri

Dashboard üzerindeki istatistik veya liste kartları (Node List gibi) aşağıdaki düzende kırılmalıdır:
- **Mobil (`default`):** 1 Kolon (`grid-cols-1`)
- **Tablet (`md`):** 2 Kolon (`md:grid-cols-2`)
- **Masaüstü (`lg`):** 3 veya 4 Kolon (`lg:grid-cols-3`, duruma göre `lg:grid-cols-4`)
- **Gap (Boşluk):** Standart olarak `gap-6` kullanılır (24px).

## 4. Spacing (Kenar Boşlukları ve Padding)

Alaf tasarım dilinde çok dar kutular tercih edilmez. İçerik nefes almalıdır.
- Standart Kart Padding'i: `p-6`
- Geniş Kart / Odak Formu: `p-8 sm:p-10`
- Section'lar arası dikey boşluk: `space-y-4` veya `space-y-6`

## 5. Mobil Navigasyon ve Gizlenen Öğeler

- **Mobile Gizleme:** Masaüstünde görünen kompleks filtreler, hover-aktif olan araç ipuçları (tooltip) veya büyük ikonlar mobilde gizlenmelidir (`hidden md:block` veya `hidden lg:flex`).
- **Dokunma Hedefi (Touch Target):** Mobildeki aksiyon butonları (`button`, `a`, `input`) asla çok dar (Örn: `py-1`) olmamalıdır. En az `py-2 px-4` standardı korunarak parmakla kolay tıklanabilir yükseklik sağlanmalıdır.

## 6. Tipografi Ölçeklemesi (Responsive Typography)

Aşırı büyük başlıkların mobilde ekranı kaplaması önlenmelidir. 
- Masaüstü için `text-2xl` olan başlıklar mobilde de kullanılabilir. Daha büyük "Display" başlıkları varsa (`text-4xl`), bunlar mobilde `text-3xl` seviyesine çekilmelidir. 
- Standart paragraf ve açıklama metinleri `text-sm` boyutunu korumalıdır. `text-xs` altına (badge'ler haricinde) inilmemelidir.
