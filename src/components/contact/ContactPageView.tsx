"use client";

import type { SiteSettingsMap } from "@/lib/site";
import {
  ContactForm,
  type ContactFormCopy,
} from "@/app/(site)/iletisim/ContactForm";
import { EditableText } from "@/components/editor/EditableText";

export type ContactPageData = {
  eyebrow: string;
  title: string;
  intro: string;
  formCopy: ContactFormCopy;
};

export function ContactPageView({
  data,
  settings,
}: {
  data: ContactPageData;
  settings: SiteSettingsMap;
}) {
  return (
    <>
      <section className="page-hero pt-10 sm:pt-14 pb-10 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditableText
            contentKey="contact_eyebrow"
            value={data.eyebrow}
            as="p"
            block
            className="text-[11px] tracking-[0.28em] uppercase text-orange font-semibold mb-3"
            help="İletişim sayfası üst etiket (küçük altın metin)"
          />
          <EditableText
            contentKey="contact_title"
            value={data.title}
            as="h1"
            block
            className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-white tracking-tight max-w-3xl leading-tight break-anywhere"
            help="İletişim sayfası başlığı"
          />
          <EditableText
            contentKey="contact_intro"
            value={data.intro}
            as="p"
            block
            multiline
            className="mt-4 text-white/60 text-sm sm:text-base max-w-2xl leading-relaxed"
            help="İletişim sayfası kısa açıklama"
          />
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm settings={settings} copy={data.formCopy} />
        </div>
      </section>
    </>
  );
}
