import { useRef } from "react";
import { Car, Palette } from "lucide-react";

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

  // Auto-scroll is not strictly needed if new items are added at the top,
  // but we can animate the entrance of new items.

  return (
    <div className="w-full h-64 md:h-80 bg-slate-900/80 backdrop-blur-md rounded-t-3xl border-t border-x border-white/10 p-4 overflow-hidden flex flex-col shadow-2xl">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Detections
        </h2>
        <span className="text-xs text-slate-400 font-medium bg-slate-800 px-2 py-1 rounded-full">
          {results.length} Scanned
        </span>
      </div>

      <ul
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar pb-10"
      >
        {results.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
            <Car size={32} className="opacity-20" />
            <p className="text-sm">Waiting for vehicles...</p>
          </div>
        ) : (
          results.map((res) => (
            <li
              key={res.id}
              className="bg-slate-800/60 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 transform transition-all animate-in slide-in-from-top-2 fade-in duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-3 py-1 rounded-lg font-mono font-bold text-lg tracking-wider shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                    {res.text}
                  </div>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(res.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>

              {(res.make || res.model || res.color) && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {res.make && (
                    <div className="flex items-center gap-1.5 text-slate-300 bg-slate-700/50 px-2.5 py-1 rounded-md">
                      <Car size={14} className="text-blue-400" />
                      {res.make} {res.model}
                    </div>
                  )}
                  {res.color && (
                    <div className="flex items-center gap-1.5 text-slate-300 bg-slate-700/50 px-2.5 py-1 rounded-md">
                      <Palette size={14} className="text-purple-400" />
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
