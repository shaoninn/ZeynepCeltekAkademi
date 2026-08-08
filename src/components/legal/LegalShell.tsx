import type { ReactNode } from "react";
import { LEGAL_UPDATED } from "@/lib/legal";

export function LegalShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="page-hero pt-10 sm:pt-14 pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] tracking-[0.28em] uppercase text-orange font-semibold mb-3">
            Kurumsal
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight break-anywhere">
            {title}
          </h1>
          <p className="text-xs text-white/45 mt-3">
            Son güncelleme: {LEGAL_UPDATED}
          </p>
        </div>
      </section>
      <section className="pb-16 lg:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose-dark">
          {children}
        </div>
      </section>
    </>
  );
}
