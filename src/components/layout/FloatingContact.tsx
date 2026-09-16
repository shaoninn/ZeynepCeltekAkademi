"use client";

import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { TrackedContactLink } from "@/components/ads/TrackedContactLink";

interface FloatingContactProps {
  phone: string;
  whatsappUrl: string;
}

function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+9${digits}`;
  return `tel:+90${digits}`;
}

function hideFabOnPath(pathname: string): boolean {
  const path = pathname.replace(/^\/duzenle/, "") || "/";
  if (path.startsWith("/egitim/") || path.startsWith("/urun/")) return true;
  if (/^\/hizmetler\/[^/]+\/?$/.test(path)) return true;
  return false;
}

export function FloatingContact({ phone, whatsappUrl }: FloatingContactProps) {
  const pathname = usePathname() || "/";
  const waText = encodeURIComponent(
    "Merhaba, eğitim programlarınız hakkında bilgi almak istiyorum."
  );

  if (hideFabOnPath(pathname)) return null;

  return (
    <div className="fixed z-40 flex flex-col gap-2.5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))]">
      <TrackedContactLink
        href={telHref(phone)}
        method="phone"
        className="w-12 h-12 min-h-11 min-w-11 flex items-center justify-center rounded-full bg-card border border-border text-orange hover:border-orange transition-colors md:hidden shadow-lg"
        aria-label={`Ara: ${phone}`}
      >
        <Phone size={20} />
      </TrackedContactLink>
      <TrackedContactLink
        href={`${whatsappUrl}?text=${waText}`}
        method="whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 sm:w-16 sm:h-16 min-h-11 min-w-11 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:brightness-110 transition-colors shadow-[0_8px_28px_rgba(37,211,102,0.45)]"
        aria-label="WhatsApp ile yazın"
      >
        <WhatsAppIcon size={32} />
      </TrackedContactLink>
    </div>
  );
}
