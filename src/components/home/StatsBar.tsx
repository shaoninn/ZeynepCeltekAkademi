"use client";

import { STATS } from "@/lib/constants";
import { EditableText } from "@/components/editor/EditableText";

export interface StatItem {
  value: string;
  label: string;
}

interface StatsBarProps {
  items?: StatItem[];
  scriptText?: string;
}

export function StatsBar({
  items,
  scriptText = "Başarıya giden yolculuğunuzdan anlar",
}: StatsBarProps) {
  const list = items && items.length > 0 ? items : [...STATS];

  return (
    <section className="relative py-14 lg:py-16 bg-marble overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_85%_50%,rgba(201,169,98,0.12),transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-10 lg:gap-8 items-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {list.map((stat, index) => {
              const n = index + 1;
              return (
                <div key={`stat-${n}`} className="min-w-0">
                  <EditableText
                    contentKey={`stat_${n}_value`}
                    value={stat.value}
                    as="p"
                    className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-orange mb-2"
                    help={`İstatistik ${n}`}
                  />
                  <EditableText
                    contentKey={`stat_${n}_label`}
                    value={stat.label}
                    as="p"
                    className="text-[11px] sm:text-xs text-white/55 tracking-[0.14em] uppercase"
                    help={`İstatistik ${n} etiket`}
                  />
                </div>
              );
            })}
          </div>
          <EditableText
            contentKey="stats_script"
            value={scriptText}
            as="p"
            className="font-script text-orange text-2xl sm:text-3xl lg:text-[2.1rem] leading-snug text-left lg:text-right"
            help="İstatistik dekoratif yazı"
          />
        </div>
      </div>
    </section>
  );
}
