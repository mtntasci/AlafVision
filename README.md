# Alaf Plate (Akıllı Görüntü Analizi Sistemi)

**Alaf Plate**, kameralardan alınan video akışları üzerinde özelleşmiş aramalar ve analizler yapabilen yüksek performanslı bir yapay zeka sistemidir.

Şu anda demo aşamasında **Plaka, Araç, Marka ve Model Tanıma** işlemlerini başarıyla gerçekleştirirken, mimarisi gereği çok daha geniş bir vizyona hizmet edecek şekilde tasarlanmıştır.

## 🌟 Vizyon ve Gelecek Özellikler

Alaf Plate, standart bir ALPR (Otomatik Plaka Tanıma) sisteminden çok daha fazlasıdır. Sistem, yakın gelecekte aşağıdaki hizmetleri sunabilecek kapasitede geliştirilmektedir:

- **Çoklu Kamera Entegrasyonu:** Farklı noktalardaki kameraların tek merkezden eş zamanlı analizi.
- **Yüz Tanıma ve Kişi Sayma:** Etkinlik alanları, giriş/çıkış noktaları için yüksek doğruluklu biyometrik analiz.
- **Odak Ölçme ve Isı Haritaları:** Özellikle AVM'ler ve dükkanlar için reyon odaklanma sürelerinin ölçümü ve müşteri davranış analizleri.
- **AI Tabanlı Anomali Tespiti:**
  - Hırsızlık ve şüpheli davranış algılama
  - Madde veya alkol etkisi altındaki anormal hareketlerin tespiti
  - Agresiflik seviyesi ve fiziksel kavga algılama
  - Silah, kesici ve delici alet tespiti

---

## 🏗 Mimari

Sistem mimarimiz, maksimum performans ve düşük gecikme süresi elde etmek amacıyla iki ana parçaya bölünmüştür:

1. **Backend (Go + CGO):** 
   - **Altyapı:** Docker kullanılmadan, doğrudan **bare-metal Ubuntu** sunucular üzerinde yüksek performansla çalışır.
   - **AI Motoru:** Yüksek hızlı TensorRT ve CGO entegrasyonu ile sıfır kopyalamalı bellek yönetimi kullanır.
   - **Bağlantı:** `8080` portunda çalışan bir WebSocket sunucusu barındırır. İstemciden (veya kameralardan) gelen binary video frame'lerini alır ve işlenen sonuçları JSON formatında anında geri döndürür.

2. **Frontend (Next.js):**
   - **Altyapı:** Vercel üzerinde barındırılan, **Next.js (App Router)** ile geliştirilmiş modern bir arayüzdür.
   - **İşlev:** Kullanıcıya modern bir Landing Page (Tanıtım Sayfası) ve Dashboard sunar. Demo sürümünde cihaz kamerasını açarak görüntüleri işlenmesi için WebSocket üzerinden backend'e iletir.

## 🔒 İletişim ve Güvenlik

- **Ağ ve Tünelleme:** İstemci ile Sunucu arasındaki gerçek zamanlı haberleşme **Cloudflare Tunnels** üzerinden sağlanmaktadır.
- **Yetkilendirme:** WebSocket bağlantısının güvenliği, bağlantı sırasında iletilen izole bir **Bearer Token** yapısı ile doğrulanmaktadır.

## 🗄 Veritabanı ve Yönetim

- **Firebase:** Kullanıcı kimlik doğrulama, oturum yönetimi ve veritabanı kayıt işlemleri Firebase altyapısı üzerinden gerçekleştirilmektedir.

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda veya sunucuda ayağa kaldırmak için aşağıdaki adımları izleyebilirsiniz.

### 1. Backend'i Başlatma (Go)

Öncelikle Ubuntu sunucunuzda gerekli C++ bağımlılıklarının ayarlanmış olduğundan emin olun.

```bash
# Backend dizinine geçin
cd backend

# Projeyi derleyip çalıştırmak için make komutunu kullanın
make run
```

### 2. Frontend'i Başlatma (Next.js)

```bash
# Webapp dizinine geçin
cd webapp

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```
Uygulama `http://localhost:3000` adresinde çalışmaya başlayacaktır. Sisteme giriş yaparak canlı demoyu test edebilirsiniz.
