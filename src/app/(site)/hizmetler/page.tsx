import { SiteLink } from "@/components/ui/SiteLink";
import { getActiveCategories } from "@/lib/catalog";
import { getContentMap } from "@/lib/site-content";
import { PageIntro } from "@/components/editor/PageIntro";
import { CatalogAdminHint } from "@/components/editor/CatalogAdminHint";
import Image from "next/image";
import { ArrowRight, GraduationCap } from "lucide-react";

export const revalidate = 600;

export const metadata = {
  alternates: { canonical: "/hizmetler" },
  title: "Eğitimler | Zeynep Çeltek Güzellik Akademi",
  description:
    "Adana’da güzellik eğitimleri: protez tırnak, kalıcı makyaj, ipek kirpik, cilt bakımı ve daha fazlası.",
};

export default async function ServicesPage() {
  const [categories, map] = await Promise.all([
    getActiveCategories(),
    getContentMap([
      "services_page_eyebrow",
      "services_page_title",
      "services_page_intro",
    ]),
  ]);

  return (
    <section className="pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrowKey="services_page_eyebrow"
          titleKey="services_page_title"
          introKey="services_page_intro"
          eyebrow={map.services_page_eyebrow || "Eğitimler"}
          title={map.services_page_title || "Güzellik Eğitim Programlarımız"}
          intro={
            map.services_page_intro ||
            "Uygulamalı eğitimlerle mesleğe hazırlanın. Program içerikleri, süreler ve kontenjan için eğitim detaylarına göz atın."
          }
        />

        <CatalogAdminHint
          title="Eğitimler"
          adminHref="/admin/urunler"
          adminLabel="Admin → Eğitimler"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {categories.map((category) => (
            <SiteLink
              key={category.id}
              href={`/hizmetler/${category.slug}`}
              className="group"
            >
              <div className="arch-frame relative aspect-[3/4] bg-[#2a2420] mb-4 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-orange/40">
                    <GraduationCap size={40} strokeWidth={1.25} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-orange text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight size={16} />
                </span>
              </div>
              <h2 className="font-display text-sm font-semibold text-white uppercase tracking-[0.12em] text-center group-hover:text-orange transition-colors">
                {category.name}
              </h2>
              {category.description ? (
                <p className="mt-2 text-xs text-muted text-center line-clamp-2 px-2">
                  {category.description}
                </p>
              ) : null}
              <p className="mt-2 text-[11px] text-orange text-center tracking-wider uppercase">
                {category._count.products} eğitim
              </p>
            </SiteLink>
          ))}
        </div>
      </div>
    </section>
  );
}
