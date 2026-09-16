"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { toWebpSrc, toWebpSrcMobile } from "@/lib/image-optimize";

export type GalleryItem = {
  src: string;
  alt: string;
};

function gallerySrc(src: string): string {
  return toWebpSrcMobile(src) || toWebpSrc(src);
}

export function GalleryLightbox({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(() => {
    setOpenIndex((i) =>
      i == null ? null : (i - 1 + items.length) % items.length
    );
  }, [items.length]);
  const next = useCallback(() => {
    setOpenIndex((i) => (i == null ? null : (i + 1) % items.length));
  }, [items.length]);

  useEffect(() => {
    if (openIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, prev, next]);

  if (items.length === 0) return null;

  const active = openIndex != null ? items[openIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {items.map((item, i) => (
          <button
            key={`${item.src}-${i}`}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            aria-label={`${item.alt} — büyüt`}
          >
            <Image
              src={gallerySrc(item.src)}
              alt={item.alt}
              fill
              className="object-cover object-[center_28%] transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {active && openIndex != null ? (
        <div
          className="fixed inset-0 z-[80] bg-black/92 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Galeri görseli"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 w-11 h-11 rounded-full border border-white/20 text-white hover:text-orange hover:border-orange flex items-center justify-center"
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
          {items.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-3 sm:left-6 w-11 h-11 rounded-full border border-white/20 text-white hover:text-orange hover:border-orange flex items-center justify-center"
                aria-label="Önceki"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-3 sm:right-6 w-11 h-11 rounded-full border border-white/20 text-white hover:text-orange hover:border-orange flex items-center justify-center"
                aria-label="Sonraki"
              >
                <ChevronRight size={22} />
              </button>
            </>
          ) : null}
          <div
            className="relative w-full max-w-4xl aspect-[4/5] sm:aspect-[3/4] max-h-[85svh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={gallerySrc(active.src)}
              alt={active.alt}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
            />
          </div>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60">
            {openIndex + 1} / {items.length}
          </p>
        </div>
      ) : null}
    </>
  );
}
