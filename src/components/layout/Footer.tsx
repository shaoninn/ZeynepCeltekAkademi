import { SiteLink } from "@/components/ui/SiteLink";
import { Camera, MapPin, Mail, Phone } from "lucide-react";
import {
  SITE_NAME,
  CATEGORIES,
  LEGAL_LINKS,
  PRIMARY_NAV_LINKS,
} from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";
import { FooterBlurb } from "@/components/layout/FooterBlurb";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import type { NavLinkItem, SiteSettingsMap } from "@/lib/site";

interface FooterProps {
  settings: SiteSettingsMap;
  navLinks: NavLinkItem[];
  footerBlurb?: string;
}

export function Footer({ settings, navLinks, footerBlurb }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const quick =
    navLinks.length > 0
      ? navLinks.filter((l) => !l.href.includes("sepet"))
      : [...PRIMARY_NAV_LINKS];

  return (
    <footer className="bg-[#0c0b0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="mb-5">
              <Logo size="lg" />
            </div>
            <FooterBlurb value={footerBlurb} />
            <div className="flex items-center gap-2.5 mt-5">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-muted hover:text-orange hover:border-orange transition-colors"
                aria-label="Instagram"
              >
                <Camera size={15} />
              </a>
              <a
                href={settings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-muted hover:text-[#25D366] hover:border-[#25D366] transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={15} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-display text-[11px] font-semibold tracking-[0.2em] text-white uppercase mb-4">
              Hızlı Linkler
            </h3>
            <ul className="space-y-2.5">
              {quick.map((link) => (
                <li key={link.href}>
                  <SiteLink
                    href={link.href}
                    className="text-muted text-sm hover:text-orange transition-colors"
                  >
                    {link.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-display text-[11px] font-semibold tracking-[0.2em] text-white uppercase mb-4">
              Eğitimlerimiz
            </h3>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <SiteLink
                    href={`/hizmetler/${cat.slug}`}
                    className="text-muted text-sm hover:text-orange transition-colors"
                  >
                    {cat.name}
                  </SiteLink>
                </li>
              ))}
              <li>
                <SiteLink
                  href="/hizmetler"
                  className="text-orange text-sm font-semibold hover:text-orange-dark transition-colors"
                >
                  Tüm eğitimler →
                </SiteLink>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-display text-[11px] font-semibold tracking-[0.2em] text-white uppercase mb-4">
              İletişim
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="text-orange shrink-0 mt-0.5" />
                <a
                  href={`tel:+${settings.phoneRaw}`}
                  className="text-orange text-sm font-semibold hover:underline"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="text-orange shrink-0 mt-0.5" />
                <a
                  href={`mailto:${settings.email}`}
                  className="text-muted text-sm hover:text-orange transition-colors break-all"
                >
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-orange shrink-0 mt-0.5" />
                <span className="text-muted text-sm leading-relaxed">
                  {settings.address}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted text-xs">
            © {currentYear} {SITE_NAME}. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {LEGAL_LINKS.slice(0, 4).map((link) => (
              <SiteLink
                key={link.href}
                href={link.href}
                className="text-muted text-xs hover:text-orange transition-colors"
              >
                {link.label}
              </SiteLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
