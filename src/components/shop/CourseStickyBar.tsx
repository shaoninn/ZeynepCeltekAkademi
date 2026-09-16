"use client";

import { SiteLink } from "@/components/ui/SiteLink";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { ShoppingCart } from "lucide-react";
import { trackContact, utmPrefillSuffix } from "@/lib/ads";

export function CourseStickyBar({
  whatsappUrl,
  courseName,
}: {
  whatsappUrl: string;
  courseName: string;
}) {
  const baseText = `Merhaba, ${courseName} eğitimi hakkında bilgi ve kayıt istiyorum.`;

  return (
    <div className="fixed z-30 md:hidden left-0 right-0 bottom-0 border-t border-border bg-card/95 backdrop-blur-md pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 px-3">
      <div className="flex gap-2">
        <a
          href={`${whatsappUrl}?text=${encodeURIComponent(baseText)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            trackContact("whatsapp");
            const extra = utmPrefillSuffix();
            if (!extra) return;
            e.preventDefault();
            window.open(
              `${whatsappUrl}?text=${encodeURIComponent(baseText + extra)}`,
              "_blank",
              "noopener,noreferrer"
            );
          }}
          className="flex-1 min-h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider"
        >
          <WhatsAppIcon size={16} />
          WhatsApp
        </a>
        <SiteLink
          href="/sepet"
          className="flex-1 min-h-11 inline-flex items-center justify-center gap-2 rounded-lg border border-orange/60 text-orange text-xs font-semibold uppercase tracking-wider"
        >
          <ShoppingCart size={16} />
          Kayıt
        </SiteLink>
      </div>
    </div>
  );
}
