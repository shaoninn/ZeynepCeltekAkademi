"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SiteLink } from "@/components/ui/SiteLink";
import { HeaderClient } from "./HeaderClient";
import { Logo } from "@/components/brand/Logo";
import { PRIMARY_NAV_LINKS } from "@/lib/constants";
import type { NavLinkItem, SiteSettingsMap } from "@/lib/site";
import type { MenuCategoryItem, MenuLinkItem } from "@/components/layout/SiteMenu";

interface HeaderProps {
  settings: SiteSettingsMap;
  navLinks: NavLinkItem[];
  categories?: MenuCategoryItem[];
  projects?: MenuLinkItem[];
  blogPosts?: MenuLinkItem[];
}

function publicPath(href: string): string {
  return href.replace(/^\/duzenle/, "") || "/";
}

function resolvePrimaryNav(navLinks: NavLinkItem[]): NavLinkItem[] {
  const byPublic = new Map<string, NavLinkItem>();
  for (const link of navLinks) {
    byPublic.set(publicPath(link.href), link);
  }
  return PRIMARY_NAV_LINKS.map((item) => {
    const fromDb = byPublic.get(item.href);
    if (fromDb) {
      return { href: fromDb.href, label: fromDb.label || item.label };
    }
    return { href: item.href, label: item.label };
  });
}

function NavDropdown({
  label,
  href,
  items,
}: {
  label: string;
  href: string;
  items: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <SiteLink
        href={href}
        className="inline-flex items-center gap-1 px-3 py-2 text-[11px] font-medium tracking-[0.16em] text-white/75 hover:text-orange transition-colors uppercase whitespace-nowrap"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          size={12}
          className={`opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </SiteLink>
      {open && items.length > 0 ? (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50">
          <div className="min-w-[14rem] rounded-xl border border-white/10 bg-[#12100e]/98 backdrop-blur-md shadow-2xl py-2">
            {items.slice(0, 8).map((item) => (
              <SiteLink
                key={item.href}
                href={item.href}
                className="block px-4 py-2.5 text-xs text-white/70 hover:text-orange hover:bg-white/5 transition-colors"
              >
                {item.label}
              </SiteLink>
            ))}
            <SiteLink
              href={href}
              className="block px-4 py-2.5 text-xs font-semibold text-orange border-t border-white/5 mt-1"
            >
              Tümünü gör →
            </SiteLink>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Header({
  settings,
  navLinks,
  categories = [],
  projects = [],
  blogPosts = [],
}: HeaderProps) {
  const primaryNav = resolvePrimaryNav(navLinks);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top,0px)]">
      <div className="bg-black/55 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-[4.25rem] lg:h-[4.75rem]">
            <div className="min-w-0 shrink-0 max-w-[9rem] sm:max-w-none">
              <Logo size="md" />
            </div>

            <nav
              className="hidden lg:flex items-center justify-center gap-0.5 flex-1 min-w-0"
              aria-label="Ana menü"
            >
              {primaryNav.map((link) => {
                const path = publicPath(link.href);
                if (path === "/hizmetler" && categories.length > 0) {
                  return (
                    <NavDropdown
                      key={link.href}
                      label={link.label}
                      href={link.href}
                      items={categories}
                    />
                  );
                }
                if (path === "/projeler" && projects.length > 0) {
                  return (
                    <NavDropdown
                      key={link.href}
                      label={link.label}
                      href={link.href}
                      items={projects}
                    />
                  );
                }
                return (
                  <SiteLink
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 text-[11px] font-medium tracking-[0.16em] text-white/75 hover:text-orange transition-colors uppercase whitespace-nowrap"
                  >
                    {link.label}
                  </SiteLink>
                );
              })}
            </nav>

            <HeaderClient
              navLinks={navLinks}
              categories={categories}
              projects={projects}
              blogPosts={blogPosts}
              phone={settings.phone}
              phoneRaw={settings.phoneRaw}
              whatsappUrl={settings.whatsappUrl}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
