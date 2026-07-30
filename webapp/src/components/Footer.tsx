"use client";

import Link from "next/link";
import { Logo } from "./Navbar";

export function Footer() {
  return (
    <footer className="relative z-10 bg-slate-950 border-t border-white/10 pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Sütun 1: Marka */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight text-white">
                Alaf Vision
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Yapay zeka ve görüntü işleme teknolojileriyle geleceğin otonom ve akıllı sistemlerini inşa eden teknoloji partneriniz.
            </p>
          </div>

          {/* Sütun 2: Çözümler */}
          <div>
            <h4 className="text-white font-bold mb-6">Çözümler</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li><Link href="/solutions/retail" className="hover:text-blue-400 transition-colors">Perakende Analitiği</Link></li>
              <li><Link href="/solutions/traffic" className="hover:text-blue-400 transition-colors">Trafik ve ALPR Sistemleri</Link></li>
              <li><Link href="/solutions/industrial" className="hover:text-blue-400 transition-colors">Endüstriyel İş Güvenliği</Link></li>
              <li><Link href="/solutions/anomaly" className="hover:text-blue-400 transition-colors">Anomali ve Tehdit Tespiti</Link></li>
            </ul>
          </div>

          {/* Sütun 3: Teknoloji */}
          <div>
            <h4 className="text-white font-bold mb-6">Teknoloji</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li><Link href="/technology/edge-ai" className="hover:text-blue-400 transition-colors">Edge AI Mimarisi</Link></li>
              <li><Link href="/technology/bare-metal" className="hover:text-blue-400 transition-colors">Bare-Metal Performans</Link></li>
              <li><Link href="/technology/cgo" className="hover:text-blue-400 transition-colors">CGO Entegrasyonları</Link></li>
              <li><Link href="/technology/tensorrt" className="hover:text-blue-400 transition-colors">NVIDIA TensorRT Hızlandırma</Link></li>
            </ul>
          </div>

          {/* Sütun 4: İletişim */}
          <div>
            <h4 className="text-white font-bold mb-6">Bize Ulaşın</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li>info@alafteknoloji.com</li>
              <li>Üniversiteler Mah. İhsan Doğramacı Bulvarı</li>
              <li>ODTÜ Teknokent Bilişim İnovasyon Merkezi</li>
              <li>Çankaya / Ankara</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Alaf Teknoloji. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <Link href="/legal/privacy" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
            <Link href="/legal/kvkk" className="hover:text-white transition-colors">KVKK Aydınlatma Metni</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
