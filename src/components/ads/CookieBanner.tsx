"use client";

import { useEffect, useState } from "react";
import { SiteLink } from "@/components/ui/SiteLink";
import { readAdsConsent, writeAdsConsent } from "@/lib/ads";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readAdsConsent() == null);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed z-[60] left-3 right-3 bottom-[max(6.25rem,calc(env(safe-area-inset-bottom)+5.5rem))] sm:left-auto sm:right-4 sm:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:max-w-md rounded-xl border border-border bg-card/95 backdrop-blur-md p-4 shadow-2xl">
      <p className="text-sm text-white mb-1 font-semibold">Çerezler</p>
      <p className="text-xs text-muted leading-relaxed mb-3">
        Zorunlu çerezler siteyi çalıştırır. Analitik ve reklam (Google / Meta)
        çerezleri yalnızca onayınızla yüklenir.{" "}
        <SiteLink href="/cerez-politikasi" className="text-orange hover:underline">
          Çerez politikası
        </SiteLink>
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          className="min-h-11 px-4 rounded-lg bg-orange text-black text-sm font-semibold"
          onClick={() => {
            writeAdsConsent({ analytics: true, marketing: true });
            setVisible(false);
          }}
        >
          Tümünü kabul et
        </button>
        <button
          type="button"
          className="min-h-11 px-4 rounded-lg border border-border text-sm text-muted hover:text-white"
          onClick={() => {
            writeAdsConsent({ analytics: false, marketing: false });
            setVisible(false);
          }}
        >
          Yalnızca gerekli
        </button>
      </div>
    </div>
  );
}
