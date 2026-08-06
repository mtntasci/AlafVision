"use client";

import Link from "next/link";
import { Logo } from "./Navbar";
import { useBrand } from "../lib/brand";

export function Footer() {
  const brand = useBrand();

  return (
    <footer className="relative z-10 bg-background border-t border-border-subtle pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Sütun 1: Marka */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight text-primary-text">
                {brand.fullName}
              </span>
            </Link>
            <p className="text-secondary-text text-sm leading-relaxed font-light">
              Yapay zeka ve görüntü işleme teknolojileriyle geleceğin otonom ve akıllı sistemlerini inşa eden teknoloji partneriniz.
            </p>
          </div>

          {/* Sütun 2: Çözümler */}
          <div>
            <h4 className="text-primary-text font-bold mb-6">Çözümler</h4>
            <ul className="flex flex-col gap-4 text-sm text-secondary-text font-light">
              <li><Link href="/solutions/retail" className="hover:text-accent transition-colors">Perakende Analitiği</Link></li>
              <li><Link href="/solutions/traffic" className="hover:text-accent transition-colors">Trafik ve ALPR Sistemleri</Link></li>
              <li><Link href="/solutions/industrial" className="hover:text-accent transition-colors">Endüstriyel İş Güvenliği</Link></li>
              <li><Link href="/solutions/anomaly" className="hover:text-accent transition-colors">Anomali ve Tehdit Tespiti</Link></li>
            </ul>
          </div>

          {/* Sütun 3: Teknoloji */}
          <div>
            <h4 className="text-primary-text font-bold mb-6">Teknoloji</h4>
            <ul className="flex flex-col gap-4 text-sm text-secondary-text font-light">
              <li><Link href="/technology/edge-ai" className="hover:text-accent transition-colors">Edge AI Mimarisi</Link></li>
              <li><Link href="/technology/bare-metal" className="hover:text-accent transition-colors">Bare-Metal Performans</Link></li>
              <li><Link href="/technology/cgo" className="hover:text-accent transition-colors">CGO Entegrasyonları</Link></li>
              <li><Link href="/technology/tensorrt" className="hover:text-accent transition-colors">NVIDIA TensorRT Hızlandırma</Link></li>
            </ul>
          </div>

          {/* Sütun 4: İletişim */}
          <div>
            <h4 className="text-primary-text font-bold mb-6">Bize Ulaşın</h4>
            <ul className="flex flex-col gap-4 text-sm text-secondary-text font-light">
              <li className="font-mono text-accent">{brand.email}</li>
              <li>{brand.addressLine1}</li>
              <li>{brand.addressLine2}</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary-text text-sm font-light">
            &copy; {new Date().getFullYear()} {brand.companyName}. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6 text-sm font-medium text-secondary-text">
            <Link href="/legal/privacy" className="hover:text-primary-text transition-colors">Gizlilik Politikası</Link>
            <Link href="/legal/kvkk" className="hover:text-primary-text transition-colors">KVKK Aydınlatma Metni</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
