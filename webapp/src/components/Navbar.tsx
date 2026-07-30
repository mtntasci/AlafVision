"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Alaf Vision Logo Component
export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className={className}
    fill="none"
  >
    <rect x="20" y="20" width="60" height="60" rx="14" className="stroke-blue-600" strokeWidth="6" />
    <circle cx="50" cy="50" r="16" className="fill-blue-500" />
    <path d="M50 20 L50 34 M50 80 L50 66 M20 50 L34 50 M80 50 L66 50" className="stroke-blue-400" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="relative z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="w-9 h-9" />
          <span className="text-2xl font-bold tracking-tight text-white">
            Alaf <span className="text-blue-500">Vision</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          {isHome ? (
            <>
              <a href="#cozumler" className="hover:text-white transition-colors">Çözümler</a>
              <a href="#edge-ai" className="hover:text-white transition-colors">Edge AI</a>
              <a href="#guvenilirlik" className="hover:text-white transition-colors">Güvenilirlik</a>
            </>
          ) : (
            <>
              <Link href="/#cozumler" className="hover:text-white transition-colors">Çözümler</Link>
              <Link href="/#edge-ai" className="hover:text-white transition-colors">Edge AI</Link>
              <Link href="/#guvenilirlik" className="hover:text-white transition-colors">Güvenilirlik</Link>
            </>
          )}
        </div>
        
        <Link 
          href="/login" 
          className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        >
          Müşteri Girişi
        </Link>
      </div>
    </nav>
  );
}
