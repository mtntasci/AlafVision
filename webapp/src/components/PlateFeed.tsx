import { useRef } from "react";
import { Car, Palette, Fingerprint } from "lucide-react";

export interface PlateResult {
  id: string;
  text: string;
  make?: string;
  model?: string;
  color?: string;
  box?: number[];
  timestamp: number;
}

interface PlateFeedProps {
  results: PlateResult[];
}

export function PlateFeed({ results }: PlateFeedProps) {
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full h-full bg-surface-1 border border-border-subtle rounded-2xl p-4 shadow-md flex flex-col">
      <h3 className="flex-none text-sm font-bold text-primary-text mb-3 tracking-tight flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
        </span>
        Canlı Tespit Akışı
      </h3>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar"
      >
        {results.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-secondary-text opacity-50 pt-8 pb-8">
             <span className="text-sm font-medium">Veri akışı bekleniyor...</span>
          </div>
        ) : (
          results.map((res) => (
            <div
              key={res.id}
              className="group bg-surface-2 border border-border-subtle rounded-xl p-3 flex flex-col gap-2 transform transition-colors hover:border-accent animate-in slide-in-from-top-2 fade-in duration-300 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-accent-soft border border-border-subtle text-accent px-3 py-1 rounded-lg font-mono font-bold text-sm tracking-widest transition-colors">
                    {res.text}
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-secondary-text bg-surface-1 px-1.5 py-0.5 rounded border border-border-subtle shadow-sm">
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
                    <div className="flex items-center gap-1.5 text-primary-text bg-surface-3 border border-border-subtle px-2 py-1 rounded-md shadow-sm">
                      <Car size={12} className="text-secondary-text" />
                      {res.make} {res.model}
                    </div>
                  )}
                  {res.color && (
                    <div className="flex items-center gap-1.5 text-primary-text bg-surface-3 border border-border-subtle px-2 py-1 rounded-md shadow-sm">
                      <Palette size={12} className="text-secondary-text" />
                      {res.color}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
