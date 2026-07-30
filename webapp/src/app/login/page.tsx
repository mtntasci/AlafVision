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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-blue-500/30 overflow-hidden relative">
      
      {/* Background Effects matching AGENTS.md */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px]" />
        
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
        {/* Kartlar ve Bölmeler Rule: bg-slate-900, border-white/5, hover:border-blue-500/30 (if interactive, but here it's static) */}
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-10 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-10 flex flex-col items-center">
            {/* Logo placeholder icon styled per AGENTS.md */}
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
              <Lock className="w-7 h-7 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Alaf <span className="text-blue-500">Vision</span>
            </h1>
            <p className="text-slate-400">Yönetim Paneli Girişi</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Kullanıcı Adı"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-white/5 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-slate-950"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-white/5 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-slate-950"
                />
              </div>
            </div>

            {error && (
              <div className="text-blue-400 text-sm text-center font-medium bg-blue-500/10 py-3 rounded-xl border border-blue-500/20">
                {error}
              </div>
            )}

            {/* Primary Button Rule */}
            <button
              type="submit"
              className="group w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 active:scale-[0.98]"
            >
              Giriş Yap
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
        
        <p className="text-center text-slate-500 text-sm mt-8">
          Alaf Teknoloji &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
