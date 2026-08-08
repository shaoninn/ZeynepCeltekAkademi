"use client";

import { useRef } from "react";
import { SiteLink } from "@/components/ui/SiteLink";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";
import { toWebpSrc, toWebpSrcMobile } from "@/lib/image-optimize";
import type { CategoryListItem } from "@/lib/catalog";

interface CategoriesGridProps {
  categories: CategoryListItem[];
  title?: string;
  titleStyle?: string;
}

export function CategoriesGrid({
  categories,
  title,
  titleStyle,
}: CategoriesGridProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const items = categories.slice(0, 12);

  function scrollByCard(dir: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-cat-card]");
    const step = (card?.offsetWidth ?? 240) + 24;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <section id="egitimler" className="relative bg-cream-section pt-20 sm:pt-24 lg:pt-28 pb-16 lg:pb-20">
      <div className="cream-wave absolute -top-10 left-0 right-0 h-12 pointer-events-none" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 lg:mb-12">
          <div className="max-w-2xl">
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#a67c52] font-semibold mb-3">
              Eğitim programlarımız
            </p>
            <EditableText
              contentKey="services_section_title"
              value={title || "Kariyerinizi güzelleştiren eğitimler"}
              as="h2"
              block
              className="font-display text-2xl sm:text-3xl lg:text-[2.35rem] font-semibold text-ink tracking-tight leading-tight break-anywhere"
              help="Eğitimler bölüm başlığı"
              textStyle={titleStyle}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                className="w-11 h-11 rounded-full flex items-center justify-center border border-ink/15 text-ink hover:border-orange hover:text-orange transition-colors"
                aria-label="Önceki"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                className="w-11 h-11 rounded-full flex items-center justify-center border border-ink/15 text-ink hover:border-orange hover:text-orange transition-colors"
                aria-label="Sonraki"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <SiteLink
              href="/hizmetler"
              className="inline-flex items-center gap-2 min-h-11 px-5 py-2.5 rounded-full border border-ink/20 text-ink text-[11px] font-semibold tracking-[0.14em] uppercase hover:border-orange hover:text-orange transition-colors"
            >
              Tüm Eğitimleri Gör
              <ArrowRight size={14} />
            </SiteLink>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((cat, index) => {
            const num = String(index + 1).padStart(2, "0");
            const imgSrc = cat.image
              ? toWebpSrcMobile(cat.image) || toWebpSrc(cat.image)
              : null;
            return (
              <SiteLink
                key={cat.id}
                href={`/hizmetler/${cat.slug}`}
                data-cat-card
                className="group snap-start shrink-0 w-[min(70vw,16.25rem)] sm:w-56"
              >
                <div className="arch-frame relative aspect-[3/4.2] bg-[#2a2420] mb-5 shadow-[0_16px_40px_rgba(26,22,18,0.12)]">
                  {imgSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgSrc}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 640px) 70vw, 224px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <span className="font-display text-sm text-orange/40 uppercase text-center">
                        {cat.name}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 font-display text-3xl text-white/25 font-semibold">
                    {num}
                  </span>
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-orange text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <ArrowRight size={16} />
                  </span>
                </div>
                <h3 className="font-display text-sm font-semibold text-ink uppercase tracking-[0.12em] text-center group-hover:text-orange transition-colors line-clamp-2 px-1">
                  {cat.name}
                </h3>
              </SiteLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
