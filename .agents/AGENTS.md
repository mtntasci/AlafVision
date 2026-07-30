# Alaf Vision Tasarım ve Mimari Kuralları

1. Renk Paleti ve Tema:
- Ana Arka Plan: Koyu tema zorunludur. Tüm sayfa `bg-slate-950` üzerinde olmalıdır.
- Metin Renkleri: Standart paragraflar `text-slate-400`, vurgulu/okunabilir metinler `text-slate-300`, Başlıklar `text-white`.
- Vurgu ve Marka Rengi: Ana renk mavidir (`blue-500` ve `blue-600`). Butonlarda, aktif durumlarda ve vurgulanacak ikonlarda kullanılmalıdır.
- Gradient Vurgular: Ana başlıktaki kritik kelimeler için `text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400` kullanılmalıdır.
- Seçim Rengi (Selection): Seçilen metinlerde marka rengi hissettirilmelidir (`selection:bg-blue-500/30`).
- Arka Plan Efektleri: Sayfanın arkasında sabit, `pointer-events-none` olan, `bg-blue-900/10` ve `bg-indigo-900/10` renklerinde devasa yuvarlaklar (`blur-[120px]`) olmalıdır. Ayrıca tüm sayfa genelinde opacity 0.02 olan ince CSS grid çizgileri (linear-gradient) bulunmalıdır.

2. Tasarım Elementleri & Glassmorphism:
- Kartlar ve Bölmeler: `bg-slate-900` arka plan, `border-white/5` kenarlık. Hover durumunda kartlar `hover:bg-slate-800/80` olmalı ve kenarlıkları ilgili konseptin rengiyle hafifçe parlamalıdır (örneğin: `hover:border-blue-500/30`).
- İkon Kullanımı: Kart içlerindeki ikonlar; yuvarlak köşeli (`rounded-2xl`) geniş kutular içinde (`w-14 h-14 bg-blue-500/10 text-blue-400`) sergilenmelidir.
- Primary (Ana) Butonlar: `bg-blue-600 text-white hover:bg-blue-500` olmalı. Ekstra olarak gölge efektiyle hafif parlamalıdır (`shadow-[0_0_20px_rgba(37,99,235,0.4)]`).
- Secondary (İkincil) Butonlar: Yarı transparan, `bg-slate-800/50 text-white border border-white/10 hover:bg-slate-800` şeklinde tasarlanmalıdır.
- Badge (Etiket) Kullanımı: Hero section'ın en üstünde ufak bir badge olmalı. İçinde `animate-ping` efekti ile atan ufak mavi bir nokta (pulsing dot) bulunmalı, badge `bg-blue-500/10 border-blue-500/20 text-blue-400` renklerinde olmalıdır.

3. Sayfa Yapısı (5 Ana Bölüm):
- Navbar: Glassmorphism (`backdrop-blur-xl bg-slate-950/80`), altı `border-white/5` ile ayrılmış yapışkan (sticky/relative) menü. Logo solda, menü ortada, CTA giriş butonu sağda.
- Hero Section: En az 90vh yüksekliğinde, dikey ortalanmış. Üstte atan noktalı badge, ortada kocaman bir `<h1>` başlığı (bir kısmı gradient), altında gri tonda açıklayıcı bir alt başlık ve yan yana duran iki adet buton (Biri Primary, biri Secondary).
- Özellikler / Çözümler (Grid Bölümü): `bg-slate-950/50` arkaplan. 2 veya 4 kolonlu grid yapısında kartlar. Her kartın kendine has bir vurgu rengi (mavi, indigo, cyan, turuncu vb.) olmalı.
- Nasıl Çalışır / Akış Bölümü: Yan yana oklarla (ArrowRight) birbirine bağlanan, adım adım süreci anlatan 3'lü kutu dizilimi. Ortadaki veya en önemli adım kutusu, diğerlerinden daha belirgin (glowing border, absolute badge ve mavi arkaplan ile) tasarlanmalı.
- Güven / Kurumsal Vurgu Bölümü: İçinde devasa ve transparan bir ikon barındıran (`absolute -right-10 -bottom-10 text-slate-800/50 pointer-events-none`), `bg-gradient-to-br from-slate-800 to-slate-900` arka plana sahip geniş ve gölgeli tek bir ana kart. Madde işaretleri `emerald-500` (yeşil) ufak yuvarlaklarla listelenmeli.
- Mega Footer: `border-t border-white/10` ile ayrılmış, 4 kolonlu geniş yapı. Marka logosu, açıklaması, site linkleri ve en altta telif hakları ile gizlilik bölümleri.

4. UI & Davranış (UX) Kuralları:
- Aksini belirtmediğim sürece Popup/Modal KULLANILMAYACAKTIR.
- Her türlü yeni işlem/form/görünüm için yeni sayfa (route) yapılarak oluşturulacaktır.
