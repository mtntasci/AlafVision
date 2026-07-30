# Alaf Vision Tasarım ve Mimari Kuralları

1. Tasarım Sistemi (Design System):
- Kurumsal renkler, tipografi ve tasarım tokenları (CSS Variables) hakkında detaylı kurallar `docs/design-system.md` dosyasında bulunmaktadır.
- Ana renk artık mavi DEĞİL, kurumsal turuncudur (`--color-accent` veya `bg-accent`).
- Arka planlar için `slate-950` veya `blue-900/10` gibi spesifik değerler YERİNE, `bg-background`, `bg-surface-1`, `bg-surface-2`, `bg-surface-3` tokenları kullanılmalıdır.

2. Component Standartları:
- Buton, kart, form ve badge standartları `docs/component-standards.md` içerisinde detaylandırılmıştır.
- Her türlü yeni UI elementi bu standartlara sıkı sıkıya uymalıdır. "Glassmorphism" mantığı bırakılmış, "Solid Surface" mantığına geçilmiştir. Kartların kenarlıkları sadece ince `border-border-subtle` olmalıdır.

3. Sayfa Yapısı ve Responsive Davranış:
- Responsive kurallar ve grid yapısı `docs/responsive-guidelines.md` içerisinde yer almaktadır.
- Ana sayfada 5 ana bölüm (Navbar, Hero, Özellikler, Akış, Kurumsal Vurgu, Mega Footer) konsepti devam etmektedir ancak görsel dil olarak yeni tasarım tokenları kullanılmalıdır.

4. UI & Davranış (UX) Kuralları:
- Aksini belirtmediğim sürece Popup/Modal KULLANILMAYACAKTIR.
- Her türlü yeni işlem/form/görünüm için yeni sayfa (route) yapılarak oluşturulacaktır.
