"use client";

import { EditableText } from "@/components/editor/EditableText";

/** Shared dark page intro — matches academy mockup language across routes. */
export function PageIntro({
  eyebrowKey,
  titleKey,
  introKey,
  eyebrow,
  title,
  intro,
}: {
  eyebrowKey: string;
  titleKey: string;
  introKey: string;
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="page-hero -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-10 sm:pb-12 mb-10 lg:mb-12 border-b border-white/5">
      <EditableText
        contentKey={eyebrowKey}
        value={eyebrow}
        as="p"
        block
        className="text-[11px] tracking-[0.28em] uppercase text-orange font-semibold mb-3"
        help="Sayfa üst etiketi (küçük altın metin)"
      />
      <EditableText
        contentKey={titleKey}
        value={title}
        as="h1"
        block
        className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-white tracking-tight max-w-3xl leading-tight"
        help="Sayfa ana başlığı"
      />
      <EditableText
        contentKey={introKey}
        value={intro}
        as="p"
        block
        multiline
        className="mt-4 text-white/60 text-sm sm:text-base max-w-2xl leading-relaxed"
        help="Sayfa kısa açıklama metni"
      />
    </div>
  );
}
