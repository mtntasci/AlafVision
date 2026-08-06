"use client";

import Link from "next/link";

// Alaf Vision Logo Component
export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className={className}
    fill="none"
  >
    <rect x="20" y="20" width="60" height="60" rx="14" className="stroke-accent" strokeWidth="6" />
    <circle cx="50" cy="50" r="16" className="fill-accent" />
    <path d="M50 20 L50 34 M50 80 L50 66 M20 50 L34 50 M80 50 L66 50" className="stroke-accent-hover" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Logo className="w-9 h-9 transition-transform group-hover:scale-105" />
          <span className="text-2xl font-extrabold tracking-tight text-primary-text">
            Alaf <span className="text-accent drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">Vision</span>
          </span>
        </Link>
        
        <Link 
          href="/login" 
          className="px-6 py-2.5 text-sm font-bold text-background bg-accent hover:bg-sky-400 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.35)] hover:shadow-[0_0_25px_rgba(0,240,255,0.7)] transition-all duration-300"
        >
          Müşteri Girişi
        </Link>
      </div>
    </nav>
  );
}
