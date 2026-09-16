"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackContact, utmPrefillSuffix } from "@/lib/ads";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  method: "whatsapp" | "phone";
  children: ReactNode;
};

export function TrackedContactLink({ href, method, children, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      href={href}
      onClick={(e) => {
        trackContact(method);
        onClick?.(e);
        if (method !== "whatsapp" || e.defaultPrevented) return;
        const extra = utmPrefillSuffix();
        if (!extra || !href.includes("wa.me")) return;
        try {
          const url = new URL(href);
          const text = url.searchParams.get("text") || "";
          if (text.includes("Kaynak:")) return;
          url.searchParams.set("text", `${text}${extra}`);
          e.preventDefault();
          window.open(url.toString(), rest.target || "_blank", "noopener,noreferrer");
        } catch {
          /* keep default href */
        }
      }}
    >
      {children}
    </a>
  );
}
