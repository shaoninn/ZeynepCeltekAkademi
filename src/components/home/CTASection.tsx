"use client";

import Image from "next/image";
import { ArrowRight, Mail, MapPin, Phone, Clock } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";
import { EditableSectionShift } from "@/components/editor/EditableSectionShift";
import { SiteLink } from "@/components/ui/SiteLink";
import { PHONE, PHONE_RAW, EMAIL, ADDRESS, WORK_HOURS } from "@/lib/constants";

interface CTASectionProps {
  title?: string;
  buttonLabel?: string;
  bannerImages?: string[];
  sectionOffset?: string;
  styles?: Record<string, string>;
}

export function CTASection({
  title,
  buttonLabel,
  bannerImages,
  sectionOffset = "0",
  styles,
}: CTASectionProps) {
  const consultImg =
    bannerImages?.[0] || "/images/gallery/gallery-2.webp";

  return (
    <EditableSectionShift
      settingKey="section_cta_offset"
      value={sectionOffset}
      label="CTA kaydır"
    >
      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto rounded-[1.75rem] border border-white/10 overflow-hidden bg-[#12100e]">
          <div className="grid lg:grid-cols-[1fr_0.85fr_1fr]">
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
              <EditableText
                contentKey="cta_title"
                value={title || "Kariyerinize bir adım önde başlayın"}
                as="h2"
                block
                className="font-display text-2xl sm:text-3xl font-semibold text-white mb-4 tracking-tight uppercase leading-tight"
                help="CTA başlık"
                textStyle={styles?.cta_title}
              />
              <p className="text-white/55 text-sm mb-8 max-w-sm leading-relaxed">
                Ücretsiz danışmanlık için bize ulaşın; size uygun eğitim
                programını birlikte planlayalım.
              </p>
              <SiteLink
                href="/iletisim"
                className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-orange text-black px-6 py-3.5 text-[11px] font-bold tracking-[0.14em] uppercase hover:bg-orange-dark transition-colors"
              >
                <EditableText
                  contentKey="cta_button_label"
                  value={buttonLabel || "Ücretsiz Danışmanlık Al"}
                  as="span"
                  help="CTA buton"
                  textStyle={styles?.cta_button_label}
                />
                <ArrowRight size={16} />
              </SiteLink>
            </div>

            <div className="relative min-h-[220px] lg:min-h-0 border-y lg:border-y-0 lg:border-x border-white/10">
              <Image
                src={consultImg}
                alt="Danışmanlık"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 28vw"
                loading="lazy"
              />
            </div>

            <div className="p-8 sm:p-10 lg:p-12 space-y-5 bg-black/25">
              <h3 className="font-display text-[11px] font-semibold tracking-[0.2em] uppercase text-orange mb-1">
                İletişim
              </h3>
              <a
                href={`tel:+${PHONE_RAW}`}
                className="flex items-start gap-3 text-sm text-white/85 hover:text-orange transition-colors"
              >
                <Phone size={16} className="mt-0.5 text-orange shrink-0" />
                {PHONE}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-start gap-3 text-sm text-white/85 hover:text-orange transition-colors break-all"
              >
                <Mail size={16} className="mt-0.5 text-orange shrink-0" />
                {EMAIL}
              </a>
              <p className="flex items-start gap-3 text-sm text-white/85">
                <MapPin size={16} className="mt-0.5 text-orange shrink-0" />
                <span>{ADDRESS}</span>
              </p>
              <p className="flex items-start gap-3 text-sm text-white/85">
                <Clock size={16} className="mt-0.5 text-orange shrink-0" />
                <span>
                  {WORK_HOURS.weekdays}
                  <br />
                  {WORK_HOURS.sunday}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </EditableSectionShift>
  );
}
