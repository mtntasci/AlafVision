import { useRef } from "react";
import { Car, Palette, Fingerprint } from "lucide-react";

export interface PlateResult {
  id: string;
  text: string;
  make?: string;
  model?: string;
  color?: string;
  timestamp: number;
}

interface PlateFeedProps {
  results: PlateResult[];
}

export function PlateFeed({ results }: PlateFeedProps) {
  const listRef = useRef<HTMLUListElement>(null);

  return (
    <div className="w-full h-72 md:h-80 bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Fingerprint className="w-5 h-5 text-blue-400" />
          </div>
          Canlı Tespit Akışı
        </h2>
        <span className="text-xs text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full uppercase tracking-wide">
          {results.length} Araç
        </span>
      </div>

      <ul
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar pb-4"
      >
        {results.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-white/5">
              <Car size={32} className="text-slate-600" />
            </div>
            <p className="text-sm font-medium">Veri akışı bekleniyor...</p>
          </div>
        ) : (
          results.map((res) => (
            <li
              key={res.id}
              className="group bg-slate-900 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 transform transition-all hover:bg-slate-800/80 hover:border-blue-500/30 animate-in slide-in-from-top-2 fade-in duration-300 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Plate Badge matching the hero badge style but customized for plates */}
                  <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-xl font-mono font-bold text-xl tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] transition-shadow">
                    {res.text}
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {new Date(res.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>

              {(res.make || res.model || res.color) && (
                <div className="flex flex-wrap gap-2 text-xs font-medium mt-1">
                  {res.make && (
                    <div className="flex items-center gap-2 text-slate-300 bg-slate-800/80 border border-white/5 px-3 py-1.5 rounded-lg group-hover:border-white/10 transition-colors">
                      <Car size={14} className="text-slate-400" />
                      {res.make} {res.model}
                    </div>
                  )}
                  {res.color && (
                    <div className="flex items-center gap-2 text-slate-300 bg-slate-800/80 border border-white/5 px-3 py-1.5 rounded-lg group-hover:border-white/10 transition-colors">
                      <Palette size={14} className="text-slate-400" />
                      {res.color}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
