"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";
import { EditableImage } from "@/components/editor/EditableImage";
import { useEditor } from "@/components/editor/EditorProvider";
import { HeroMedia } from "@/components/home/HeroMedia";
import { SocialRail } from "@/components/home/SocialRail";
import { SiteLink } from "@/components/ui/SiteLink";

interface HeroProps {
  title: string;
  subtitle: string;
  body?: string;
  image?: string;
  styles?: Record<string, string>;
}

export const DEFAULT_HERO_IMAGE = "/images/hero/hero-academy.webp";
const DEFAULT_BODY =
  "Uluslararası standartlarda uygulamalı eğitimler; canlı manken üzerinde birebir pratik ve belgelendirme ile kariyerinize sağlam temel.";

export function Hero({ title, subtitle, body, image, styles }: HeroProps) {
  const { enabled } = useEditor();
  const bg = image || DEFAULT_HERO_IMAGE;

  const commaIdx = title.indexOf(",");
  const before =
    commaIdx >= 0 ? title.slice(0, commaIdx).trim() : title.trim();
  const after =
    commaIdx >= 0 ? title.slice(commaIdx + 1).trim() : "sanata dönüştürüyoruz.";

  const words = before.split(/\s+/).filter(Boolean);
  const highlight = words.length > 1 ? words[words.length - 1]! : "";
  const lead = words.length > 1 ? words.slice(0, -1).join(" ") : before;

  return (
    <section className="relative overflow-hidden bg-marble max-lg:min-h-0 lg:min-h-[calc(100svh-4.75rem-env(safe-area-inset-top,0px))] flex flex-col">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(201,169,98,0.14),transparent_55%)]" />

      <div className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 lg:pt-12 pb-12 sm:pb-20 lg:pb-28 flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 xl:gap-12 items-stretch lg:min-h-[min(72svh,38rem)]">
          <div className="relative z-10 order-1 min-w-0 max-w-xl flex flex-col justify-center">
            {subtitle ? (
              <EditableText
                contentKey="hero_subtitle"
                value={subtitle}
                as="p"
                block
                className="animate-hero font-sans text-orange/90 text-[11px] tracking-[0.2em] sm:tracking-[0.28em] uppercase mb-4 sm:mb-5 break-anywhere"
                help="Hero üst etiket"
                textStyle={styles?.hero_subtitle}
              />
            ) : null}

            <h1 className="animate-hero-delay mb-4 sm:mb-6">
              <EditableText
                contentKey="hero_title"
                value={title}
                as="span"
                block
                className="block"
                help='Örn: "Güzelliği bilimle, sanata dönüştürüyoruz."'
                textStyle={styles?.hero_title}
              >
                <span className="block font-display text-[clamp(1.85rem,7.5vw,2.4rem)] sm:text-5xl lg:text-[3.35rem] xl:text-[3.6rem] leading-[1.08] font-semibold tracking-tight uppercase break-anywhere">
                  <span className="text-white">{lead} </span>
                  <span className="text-orange">{highlight}</span>
                  <span className="text-white">,</span>
                </span>
                <span className="mt-2 block font-script text-white text-[clamp(1.5rem,6vw,1.85rem)] sm:text-4xl lg:text-[2.85rem] leading-tight normal-case font-normal break-anywhere">
                  {after}
                </span>
              </EditableText>
            </h1>

            <EditableText
              contentKey="hero_body"
              value={body || DEFAULT_BODY}
              as="p"
              block
              multiline
              className="animate-hero-delay-2 font-sans text-white/65 text-sm sm:text-[15px] max-w-md mb-6 sm:mb-8 leading-relaxed"
              help="Hero açıklama"
              textStyle={styles?.hero_body}
            />

            <div className="animate-hero-delay-2">
              <SiteLink
                href="/hakkimizda"
                className="inline-flex items-center gap-2.5 min-h-11 rounded-full border border-orange/70 px-6 py-3.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-orange hover:bg-orange hover:text-black transition-colors"
              >
                Akademiyi Keşfet
                <ArrowRight size={16} />
              </SiteLink>
            </div>
          </div>

          <div className="relative order-2 min-w-0 w-full">
            <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:absolute lg:inset-0 lg:h-full rounded-2xl sm:rounded-[1.75rem] overflow-hidden border border-white/10 bg-[#12100e] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              {enabled ? (
                <EditableImage
                  contentKey="hero_image"
                  value={bg}
                  fallback={DEFAULT_HERO_IMAGE}
                  alt="Zeynep Çeltek Güzellik Akademi"
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 50vw"
                  imgClassName="object-cover object-[center_28%] sm:object-[center_30%] lg:object-center"
                  help="Hero sağ panel — kurucu / akademi görseli"
                />
              ) : (
                <HeroMedia
                  src={bg}
                  alt="Zeynep Çeltek Güzellik Akademi"
                  className="object-cover object-[center_28%] sm:object-[center_30%] lg:object-center"
                  sizes="(max-width: 1024px) 92vw, 50vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10 pointer-events-none" />
            </div>
            <div
              className="absolute -inset-8 -z-10 rounded-[2.5rem] opacity-60 blur-3xl pointer-events-none hidden sm:block"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(201,169,98,0.35), transparent 65%)",
              }}
            />
          </div>
        </div>
      </div>

      <a
        href="#egitimler"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-2 text-white/45 hover:text-orange transition-colors"
      >
        <span className="text-[10px] tracking-[0.28em] uppercase">
          Aşağı kaydır
        </span>
        <ArrowDown size={16} className="animate-float" />
      </a>

      <SocialRail />
    </section>
  );
}
