"use client";

import { Camera, MessageCircle } from "lucide-react";
import { WHATSAPP_URL, INSTAGRAM_ACCOUNTS } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";

/** Vertical social rail — Instagram hesapları + WhatsApp + iletişim */
export function SocialRail() {
  const items = [
    ...INSTAGRAM_ACCOUNTS.map((acc) => ({
      href: acc.href,
      label: acc.handle,
      icon: <Camera size={16} />,
      external: true,
    })),
    {
      href: WHATSAPP_URL,
      label: "WhatsApp",
      icon: <WhatsAppIcon size={16} />,
      external: true,
    },
    {
      href: "/iletisim",
      label: "İletişim",
      icon: <MessageCircle size={16} />,
      external: false,
    },
  ];

  return (
    <aside
      className="animate-social hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-2"
      aria-label="Sosyal medya"
    >
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          className="w-11 h-11 rounded-full border border-orange/40 bg-black/60 backdrop-blur-sm text-orange flex items-center justify-center hover:bg-orange hover:text-black transition-colors"
          aria-label={item.label}
          title={item.label}
        >
          {item.icon}
        </a>
      ))}
    </aside>
  );
}
