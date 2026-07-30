# Alaf Teknoloji - Ortak Tasarım Sistemi (Design System)

Bu doküman, AlafNode projesinden referans alınarak oluşturulmuş, tüm yeni Alaf ürünlerinde kullanılabilecek temel "Tasarım Sistemi" kurallarını içermektedir.

## 1. Tasarım Tokenları (Design Tokens)

Sistem, Tailwind CSS v4 kurallarına (`@theme inline`) entegre edilecek CSS değişkenlerinden oluşmaktadır. 

### CSS Değişkenleri (Variables)

```css
:root {
  /* Core */
  --background: #070707;
  --foreground: #F5F5F5;

  /* Surfaces / Cards */
  --color-surface-1: #0D0D0D;
  --color-surface-2: #111111;
  --color-surface-3: #171717;
  
  /* Text */
  --color-primary-text: #F5F5F5;
  --color-secondary-text: #A3A3A3;
  
  /* Borders */
  --color-border-subtle: rgba(255, 255, 255, 0.08);
  
  /* Brand / Interactive (Ortak Marka Rengi - Orange) */
  --color-accent: #FF6B1A;
  --color-accent-hover: #FF7A2F;
  --color-accent-soft: rgba(255, 107, 26, 0.12);
  
  /* Typography */
  --font-sans: var(--font-geist-sans), Inter, sans-serif;
  --font-mono: var(--font-geist-mono), monospace;
}
```

## 2. Renk Paleti Kullanım Amacı

Tasarımda siyah ağırlıklı (Dark Mode Native) bir yapı mevcuttur.

- **Background (`#070707`):** Sayfanın en alt katmanı (Body).
- **Surface 1 (`#0D0D0D`):** İçerik kartları, ürün blokları.
- **Surface 2 (`#111111`):** Form containerları (Örn: Login kutusu), popover'lar.
- **Surface 3 (`#171717`):** Küçük interaktif etiketler, hover efektleri veya secondary butonlar.
- **Primary Text (`#F5F5F5`):** Başlıklar, buton yazıları ve okunması gereken temel metinler.
- **Secondary Text (`#A3A3A3`):** Açıklama satırları, form labelleri, breadcrumb metinleri.
- **Border Subtle (`rgba(255, 255, 255, 0.08)`):** Tüm kart çerçeveleri, input kenarlıkları ve divider (ayraç) çizgileri.
- **Accent (`#FF6B1A`):** Primary buton arka planı, focus state'ler, hover state'ler ve kritik marka vurguları.

## 3. Durum (Status) Renkleri

Yeni ürüne göre özel olarak ayarlanabilecek olsa da genel yapı şöyledir:
- **Success / Online:** Emerald tonları (`bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`).
- **Warning / Degraded:** Accent tonları (`bg-accent-soft text-accent border border-accent/20`).
- **Error / Offline:** Red tonları (`bg-red-500/10 text-red-500 border border-red-500/50`).

## 4. Tipografi Hiyerarşisi (Typography)

Font Ailesi: **Geist Sans / Inter** (Birincil) ve **Geist Mono** (Kod / Terminal metinleri).

- **H1 / Display:** `text-3xl` veya `text-4xl`, `font-bold`, `text-primary-text`
- **H2 (Section Header):** `text-2xl`, `font-bold`, `text-primary-text` (Örn: Login başlığı)
- **H3 (Card Header):** `text-lg`, `font-semibold`, `text-primary-text`
- **Body Large:** `text-base`, `font-normal`
- **Body Default:** `text-sm`, `font-normal`, `text-secondary-text`
- **Caption / Label:** `text-xs`, `font-medium`, `text-secondary-text`
- **Micro / Badge:** `text-[10px]`, `uppercase`, `tracking-wider`, `font-medium`

## 5. İkon ve Görsel Dil

- **İkon Kütüphanesi:** Lucide React.
- **İkon Boyutları:** Standart metin yanında `w-4 h-4` veya `w-5 h-5`, Vurgulu alanlarda `w-7 h-7`.
- **Gölge ve Glow (Görsel Karakter):** Glow efektleri çok kısıtlıdır. Kartlarda genellikle ince border (subtle) ve solid/opak arka planlar kullanılır. Login form gibi yerlerde `shadow-xl` eklenerek derinlik katılır. Modül kartları üzerinde `group-hover:border-accent` ile marka rengine (turuncuya) dönen net ve keskin bir hover tepkisi (transition-colors) vardır.

## 6. Yeni Ürüne Aktarım Kuralları
Bu renk hiyerarşisi (Surface-1, Surface-2, Border-subtle mantığı) olduğu gibi yeni ürüne taşınmalıdır. Eğer yeni ürünün farklı bir vurgu rengi varsa, **sadece** `--color-accent` değişkeni ilgili renge (örneğin maviye veya yeşile) dönüştürülmeli; geriye kalan tüm siyah/gri (surface/background) ve border tonları aynen korunmalıdır.
