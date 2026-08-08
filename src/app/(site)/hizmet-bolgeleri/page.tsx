import type { Metadata } from "next";
import { SiteLink } from "@/components/ui/SiteLink";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Eğitim Bölgeleri",
  description:
    "Zeynep Çeltek Güzellik Akademi eğitim bölgesi: Adana ve çevresi güzellik eğitimleri.",
  alternates: { canonical: "/hizmet-bolgeleri" },
};

const AREAS = [
  {
    title: "Adana Merkez",
    desc: "Akademimiz Adana’da. Yüz yüze eğitim, danışmanlık ve kayıt görüşmeleri.",
  },
  {
    title: "Çukurova & Seyhan",
    desc: "Çukurova ve Seyhan bölgelerinden kolay ulaşım ile eğitim programları.",
  },
  {
    title: "Yüreğir & Sarıçam",
    desc: "Yüreğir ve Sarıçam’dan gelen öğrenciler için eğitim ve kariyer desteği.",
  },
  {
    title: "Çevre İlçeler",
    desc: "Adana çevre ilçelerinden katılım için kontenjan ve program bilgisi sunuyoruz.",
  },
];

export default function ServiceAreasPage() {
  return (
    <>
      <section className="page-hero pt-10 sm:pt-14 pb-10 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] tracking-[0.28em] uppercase text-orange font-semibold mb-3">
            Eğitim bölgeleri
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-white tracking-tight max-w-3xl leading-tight">
            Adana’da güzellik eğitimi
          </h1>
          <p className="mt-4 text-white/60 text-sm sm:text-base max-w-2xl leading-relaxed">
            Zeynep Çeltek Güzellik Akademi, Adana merkez ve çevre bölgelerden
            gelen öğrenciler için uygulamalı eğitim programları sunar. Program
            detayları için eğitimler sayfasına bakın veya iletişime geçin.
          </p>
        </div>
      </section>

      <section className="pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            {AREAS.map((area) => (
              <div
                key={area.title}
                className="rounded-2xl border border-white/10 bg-[#141210] p-6 hover:border-orange/35 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <MapPin size={18} className="text-orange shrink-0 mt-0.5" />
                  <h2 className="font-display text-lg font-semibold text-white">
                    {area.title}
                  </h2>
                </div>
                <p className="text-sm text-white/55 leading-relaxed pl-7">
                  {area.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/hizmetler" variant="primary">
              Eğitimleri İncele
            </Button>
            <SiteLink
              href="/iletisim"
              className="inline-flex items-center justify-center h-11 px-6 rounded-full border border-orange/60 text-orange text-[11px] font-semibold tracking-[0.14em] uppercase hover:bg-orange hover:text-black transition-colors"
            >
              İletişime Geç
            </SiteLink>
          </div>
        </div>
      </section>
    </>
  );
}
