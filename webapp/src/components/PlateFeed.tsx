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
  const listRef = useRef<HTMLUListElement>(null);

  return (
    <div className="w-full h-72 md:h-80 bg-surface-1 border border-border-subtle rounded-xl p-6 shadow-xl flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary-text flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center border border-border-subtle">
            <Fingerprint className="w-5 h-5 text-accent" />
          </div>
          Canlı Tespit Akışı
        </h2>
        <span className="text-xs text-accent font-bold bg-accent-soft border border-border-subtle px-3 py-1.5 rounded-full uppercase tracking-wide">
          {results.length} Araç
        </span>
      </div>

      <ul
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar pb-4"
      >
        {results.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-secondary-text space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center border border-border-subtle">
              <Car size={32} className="text-secondary-text" />
            </div>
            <p className="text-sm font-medium">Veri akışı bekleniyor...</p>
          </div>
        ) : (
          results.map((res) => (
            <li
              key={res.id}
              className="group bg-surface-2 border border-border-subtle rounded-xl p-4 flex flex-col gap-3 transform transition-colors hover:border-accent animate-in slide-in-from-top-2 fade-in duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Plate Badge matching the hero badge style but customized for plates */}
                  <div className="bg-accent-soft border border-border-subtle text-accent px-4 py-1.5 rounded-xl font-mono font-bold text-xl tracking-widest transition-colors">
                    {res.text}
                  </div>
                </div>
                <span className="text-xs font-medium text-secondary-text">
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
                    <div className="flex items-center gap-2 text-primary-text bg-surface-3 border border-border-subtle px-3 py-1.5 rounded-lg">
                      <Car size={14} className="text-secondary-text" />
                      {res.make} {res.model}
                    </div>
                  )}
                  {res.color && (
                    <div className="flex items-center gap-2 text-primary-text bg-surface-3 border border-border-subtle px-3 py-1.5 rounded-lg">
                      <Palette size={14} className="text-secondary-text" />
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
