# AlafVision Failover (Replika) Sunucu Kurulum Rehberi

Bu belge, Ubuntu 22.04/24.04 (veya benzeri Debian tabanlı sistemler) üzerinde sıfırdan bir AlafVision Failover (Yedek) sunucusu kurmak için gerekli olan tüm kopyalanabilir komutları adım adım içermektedir.

Bu sunucu, ana sunucunuz çöktüğünde hemen devreye alabileceğiniz, uygulamanın (Go backend + Next.js frontend) tamamen çalışır durumda olduğu aktif bir kopya olacaktır.

---

## 1. Sistem Güncelleme ve Temel Bağımlılıklar

Öncelikle sunucunuzu güncelleyin ve temel derleme araçlarını (build-essential, git, nginx vs.) kurun:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential pkg-config git curl wget unzip nginx
```

## 2. OpenCV 4 Kurulumu

Backend kodlarında (`main.go` içerisinde) CGO ile `pkg-config: opencv4` bağımlılığı bulunduğundan OpenCV kurulu olmalıdır:

```bash
sudo apt install -y libopencv-dev
```

## 3. Go (Golang) Kurulumu

Projeniz Go gerektirdiği için resmi Go sürümünü kuruyoruz. (Eğer sürüm uyuşmazlığı olursa indirme linkini değiştirebilirsiniz):

```bash
# Go'yu indir ve kur
wget https://go.dev/dl/go1.22.4.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.22.4.linux-amd64.tar.gz
rm go1.22.4.linux-amd64.tar.gz

# Path ayarlarına ekle
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

# Kurulumu doğrula
go version
```

## 4. Node.js ve PM2 Kurulumu (Next.js Webapp İçin)

Frontend için Node.js'i ve arka planda sürekli çalışmasını sağlamak için PM2 yöneticisini kuruyoruz:

```bash
# Node.js 20.x kur
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 yöneticisini global olarak kur
sudo npm install -g pm2
```

## 5. Projenin Sunucuya Çekilmesi

GitHub/GitLab veya farklı bir platformdan projenizi sunucuya çekin:

```bash
# SSH veya HTTP linkinizle projeyi klonlayın
git clone <PROJENIZIN_GIT_URL> alafvision
cd alafvision
```

> **Not:** Firebase kullanıyorsanız (package.json içinde Firebase görünüyor), `.env.local` veya Firebase Config dosyalarınızı manuel olarak bu sunucuya da kopyalamayı unutmayın.

## 6. Doubango / ultimateALPR SDK Kurulumu

Backend kısmında `lultimateALPR-SDK` kullanımı mevcut. Bu SDK standart paket yöneticilerinde bulunmadığı için manuel kurulması veya kopyalanması gerekiyor:

```bash
# Eğer SDK dosyalarınız projenin içinde "libs" veya benzeri bir klasördeyse
# kütüphaneleri sistem klasörüne atıp ldconfig komutunu çalıştırmalısınız.
# ÖRNEK:
# sudo cp /yol/ultimateALPR-SDK/bin/*.so /usr/local/lib/
# sudo ldconfig
```

## 7. Backend (Go) Servisinin Derlenmesi ve Ayarlanması

Go servisini derleyip Systemd ile her yeniden başlatmada otomatik ayağa kalkacak şekilde ayarlıyoruz.
*(Aşağıdaki komutlarda `/root/alafvision` yolunu projeyi indirdiğiniz yola göre değiştirebilirsiniz. Örn: `/home/ubuntu/alafvision`)*

```bash
cd ~/alafvision/backend
go mod tidy
make build

# Servis dosyasını oluştur
sudo tee /etc/systemd/system/alafvision-backend.service > /dev/null << 'EOF'
[Unit]
Description=AlafVision Go Backend
After=network.target

[Service]
User=root
WorkingDirectory=/root/alafvision/backend
ExecStart=/root/alafvision/backend/alafvision-backend
Restart=always
Environment="PATH=/usr/local/go/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
Environment="LD_LIBRARY_PATH=/usr/local/lib"

[Install]
WantedBy=multi-user.target
EOF

# Servisi başlat ve etkinleştir
sudo systemctl daemon-reload
sudo systemctl enable alafvision-backend
sudo systemctl start alafvision-backend
sudo systemctl status alafvision-backend
```

## 8. Webapp (Next.js) Servisinin Derlenmesi ve Çalıştırılması

Frontend'i derleyip, PM2 ile production (üretim) modunda ayağa kaldırıyoruz:

```bash
cd ~/alafvision/webapp
npm install
npm run build

# PM2 ile projeyi başlat
pm2 start npm --name "alafvision-webapp" -- run start

# PM2 servislerinin sunucu her yeniden başladığında açılmasını sağla
pm2 save
pm2 startup
# (pm2 startup komutu size bir sudo komutu verecektir, onu kopyalayıp çalıştırın)
```

## 9. Nginx Reverse Proxy Ayarları (Trafiği Yönlendirme)

Tek bir IP (veya Domain) üzerinden hem Next.js (Port 3000) hem de Go WebSocket (Port 8080) hizmeti vermek için Nginx yapılandırıyoruz:

```bash
sudo tee /etc/nginx/sites-available/alafvision > /dev/null << 'EOF'
server {
    listen 80;
    server_name yedek.sirketiniz.com; # Veya sunucunun IP adresi

    # Next.js Frontend Yönlendirmesi
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Go Backend WebSocket ve API Yönlendirmesi
    location /ws/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /stream {
        proxy_pass http://localhost:8080/stream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Konfigürasyonu aktifleştir ve Nginx'i yeniden başlat
sudo ln -s /etc/nginx/sites-available/alafvision /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 10. Failover Yönlendirmesi (DNS / Load Balancer)

Tüm sistem hazır olduğunda failover geçişini sağlamak için 2 temel yöntem vardır:
1. **Manuel DNS Değişikliği:** Ana sunucu çöktüğünde Cloudflare vb. panelinizden DNS IP'sini bu yedek sunucuya yönlendirebilirsiniz.
2. **Otomatik Load Balancer:** AWS ELB, Cloudflare Load Balancer veya HAProxy gibi bir servis aracılığıyla ana sunucuya ping atılır, yanıt alınamazsa trafik otomatik olarak bu kurduğunuz yedek sunucuya (replica) yönlendirilir.

> **Uyarı:** Projeniz Firebase kullandığından, yeni bir veritabanı yedeğine ihtiyacınız yoktur. Yedek sunucudaki kodlar aynı Firebase ortamına bağlanacak ve sistem kaldığı yerden verileri okuyabilecektir.
