"use client";

import { Package, Clock, Users, Sparkles } from "lucide-react";
import { StatsBar, type StatItem } from "@/components/home/StatsBar";
import { EditableText } from "@/components/editor/EditableText";
import { EditableImage } from "@/components/editor/EditableImage";

const DEFAULT_IMAGES = [
  "/images/about/about-1.webp",
  "/images/about/about-2.webp",
  "/images/about/about-3.webp",
  "/images/about/about-4.webp",
];

const VALUE_ICONS = [Package, Clock, Users, Sparkles] as const;

export type AboutPageData = {
  headline: string;
  intro: string;
  philosophy: string;
  mission: string;
  vision: string;
  values: { key: string; title: string; desc: string }[];
  images: string[];
  stats?: StatItem[];
};

export function AboutPageView({ data }: { data: AboutPageData }) {
  return (
    <>
      <section className="page-hero pt-10 sm:pt-14 pb-12 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] tracking-[0.28em] uppercase text-orange font-semibold mb-3">
              Akademi
            </p>
            <EditableText
              contentKey="about_headline"
              value={data.headline}
              as="h1"
              block
              multiline
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-white mb-5 whitespace-pre-line tracking-tight leading-tight break-anywhere"
              help="Hakkımızda ana başlık. Satır kırmak için Enter kullanın."
            />
            <EditableText
              contentKey="about_intro"
              value={data.intro}
              as="p"
              block
              multiline
              className="text-white/60 text-sm sm:text-base leading-relaxed whitespace-pre-line max-w-2xl"
              help="Hakkımızda giriş paragrafı"
            />
          </div>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {DEFAULT_IMAGES.map((fallback, i) => {
              const n = i + 1;
              const src = data.images[i] || fallback;
              return (
                <EditableImage
                  key={`about-img-${n}`}
                  contentKey={`about_image_${n}`}
                  value={src}
                  fallback={fallback}
                  alt={`Zeynep Çeltek Güzellik Akademi ${n}`}
                  aspectClass="aspect-[4/5]"
                  imgClassName="object-cover object-center"
                  className="border border-white/10 overflow-hidden bg-card rounded-2xl"
                  help={`Hakkımızda galeri görseli ${n}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      <StatsBar items={data.stats} />

      <section className="bg-cream-section py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#a67c52] font-semibold mb-3">
              Değerlerimiz
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold text-ink mb-4 tracking-tight">
              Felsefemiz / Çalışma İlkelerimiz
            </h2>
            <EditableText
              contentKey="about_philosophy"
              value={data.philosophy}
              as="p"
              block
              multiline
              className="text-ink/65 max-w-2xl mx-auto text-sm sm:text-base"
              help="Çalışma ilkeleri açıklaması"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.values.map((value, index) => {
              const Icon = VALUE_ICONS[index % VALUE_ICONS.length];
              return (
                <div
                  key={value.key}
                  className="p-6 rounded-2xl bg-white/70 border border-ink/8 hover:border-orange/40 transition-colors"
                >
                  <Icon size={28} className="text-orange mb-4" strokeWidth={1.5} />
                  <EditableText
                    contentKey={value.key}
                    value={value.title}
                    editField="title"
                    pairedContent={value.desc}
                    as="h3"
                    block
                    className="font-display text-base font-semibold text-ink mb-2 tracking-wide"
                    help={`Değer ${index + 1} başlığı`}
                  />
                  <EditableText
                    contentKey={value.key}
                    value={value.desc}
                    as="p"
                    block
                    multiline
                    className="text-sm text-ink/60 leading-relaxed"
                    help={`Değer ${index + 1} açıklaması`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-marble">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
            <div className="rounded-2xl border border-white/10 bg-[#141210] p-8 sm:p-10">
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-orange mb-4 tracking-tight">
                Misyonumuz
              </h2>
              <EditableText
                contentKey="mission"
                value={data.mission}
                as="p"
                block
                multiline
                className="text-white/65 leading-relaxed text-sm sm:text-base"
                help="Misyon metni"
              />
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#141210] p-8 sm:p-10">
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-orange mb-4 tracking-tight">
                Vizyonumuz
              </h2>
              <EditableText
                contentKey="vision"
                value={data.vision}
                as="p"
                block
                multiline
                className="text-white/65 leading-relaxed text-sm sm:text-base"
                help="Vizyon metni"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
