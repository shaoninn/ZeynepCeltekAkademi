"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SiteLink } from "@/components/ui/SiteLink";
import { EditableText } from "@/components/editor/EditableText";
import { EditableImage } from "@/components/editor/EditableImage";
import type { ProjectListItem } from "@/lib/catalog";

interface FacilitySectionProps {
  projects: ProjectListItem[];
  title?: string;
  body?: string;
}

export function FacilitySection({
  projects,
  title = "Modern, konforlu ve profesyonel ortam",
  body = "Uygulamalı eğitimlerimizi modern sınıflarda, hijyenik ve konforlu bir akademi atmosferinde gerçekleştiriyoruz. Canlı manken uygulamaları ve birebir eğitmen desteğiyle kariyerinize sağlam bir temel atın.",
}: FacilitySectionProps) {
  const main =
    projects[0]?.image || "/images/facility/facility-1.webp";
  const sideA =
    projects[1]?.image || "/images/facility/facility-2.webp";
  const sideB =
    projects[2]?.image || "/images/facility/facility-3.webp";

  return (
    <section className="bg-cream-section py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <EditableText
              contentKey="facility_title"
              value={title}
              as="h2"
              block
              className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold text-ink mb-4 tracking-tight leading-tight uppercase"
              help="Akademi ortamı başlığı"
            />
            <EditableText
              contentKey="facility_body"
              value={body}
              as="p"
              multiline
              block
              className="text-ink/65 text-sm sm:text-[15px] leading-relaxed mb-8 max-w-lg"
              help="Akademi ortamı açıklaması"
            />
            <SiteLink
              href="/hakkimizda"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-ink/20 text-ink text-[11px] font-semibold tracking-[0.14em] uppercase hover:border-orange hover:text-orange transition-colors"
            >
              Akademiyi İncele
              <ArrowRight size={14} />
            </SiteLink>
          </div>

          <div className="relative grid grid-cols-[1.4fr_1fr] gap-3 sm:gap-4">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-ink/10">
              <EditableImage
                contentKey="facility_image_1"
                value={main}
                fallback="/images/facility/facility-1.webp"
                alt="Akademi ortamı"
                fill
                sizes="(max-width: 1024px) 60vw, 30vw"
                imgClassName="object-cover"
                help="Akademi ana görsel"
              />
              <div className="absolute bottom-4 right-4 w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 rounded-full border-2 border-orange bg-ink text-orange flex items-center justify-center text-center px-2 shadow-xl">
                <span className="font-display text-[9px] sm:text-[10px] font-semibold uppercase leading-tight tracking-wider">
                  Uluslararası
                  <br />
                  Standart
                </span>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-3 sm:gap-4">
              <div className="relative rounded-2xl overflow-hidden border border-ink/10 min-h-0">
                <Image
                  src={sideA}
                  alt="Eğitim"
                  fill
                  className="object-cover"
                  sizes="25vw"
                  loading="lazy"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-ink/10 min-h-0">
                <Image
                  src={sideB}
                  alt="Akademi detay"
                  fill
                  className="object-cover"
                  sizes="25vw"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
