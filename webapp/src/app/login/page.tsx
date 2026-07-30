"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      // Use the hardcoded token that backend expects
      localStorage.setItem("alafvision_token", "admin_token_123");
      router.push("/dashboard");
    } else {
      setError("Girdiğiniz bilgiler hatalı.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-accent-soft/30 overflow-hidden relative">
      
      {/* Background Effects matching AGENTS.md */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        
        
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: `40px 40px`,
          }} 
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Kartlar ve Bölmeler Rule: bg-surface-1, border-border-subtle, hover:border-border-subtle (if interactive, but here it's static) */}
        <div className="bg-surface-1 border border-border-subtle rounded-3xl p-10 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-10 flex flex-col items-center">
            {/* Logo placeholder icon styled per AGENTS.md */}
            <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-6 border border-border-subtle">
              <Lock className="w-7 h-7 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-primary-text mb-2 tracking-tight">
              Alaf <span className="text-accent">Vision</span>
            </h1>
            <p className="text-secondary-text">Yönetim Paneli Girişi</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-text group-focus-within:text-accent transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Kullanıcı Adı"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-background border border-border-subtle rounded-xl text-primary-text placeholder-secondary-text focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent transition-all hover:bg-background"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-text group-focus-within:text-accent transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-background border border-border-subtle rounded-xl text-primary-text placeholder-secondary-text focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent transition-all hover:bg-background"
                />
              </div>
            </div>

            {error && (
              <div className="text-accent text-sm text-center font-medium bg-accent-soft py-3 rounded-xl border border-border-subtle">
                {error}
              </div>
            )}

            {/* Primary Button Rule */}
            <button
              type="submit"
              className="group w-full py-3.5 px-4 bg-accent hover:bg-accent-soft text-primary-text rounded-xl font-semibold flex items-center justify-center gap-2 shadow-xl transition-all duration-300 active:scale-[0.98]"
            >
              Giriş Yap
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
        
        <p className="text-center text-secondary-text text-sm mt-8">
          Alaf Teknoloji &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
