"use client";

import {
  GraduationCap,
  Award,
  Users,
  Headphones,
} from "lucide-react";
import { FEATURE_BAR } from "@/lib/constants";
import { EditableText } from "@/components/editor/EditableText";
import { EditableSectionShift } from "@/components/editor/EditableSectionShift";
import { EditableIconBox } from "@/components/editor/EditableIconBox";

const iconMap = {
  search: GraduationCap,
  design: Award,
  production: Users,
  support: Headphones,
} as const;

type FeatureBarItem = {
  title: string;
  desc: string;
  iconUrl?: string;
  iconSize?: number;
};

export function FeatureBar({
  items,
  sectionOffset = "0",
  styles,
}: {
  items?: FeatureBarItem[];
  sectionOffset?: string;
  styles?: Record<string, string>;
} = {}) {
  const list = FEATURE_BAR.map((d, i) => ({
    title: items?.[i]?.title || d.title,
    desc: items?.[i]?.desc || d.desc,
    icon: d.icon,
    iconUrl: items?.[i]?.iconUrl,
    iconSize: items?.[i]?.iconSize || 24,
  }));

  return (
    <EditableSectionShift
      settingKey="section_feature_bar_offset"
      value={sectionOffset}
      label="Özellik çubuğu"
    >
      <section className="relative z-30 -mt-8 sm:-mt-16 lg:-mt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-[1.75rem] border border-white/10 bg-[#141210]/95 backdrop-blur-xl shadow-[0_24px_70px_rgba(0,0,0,0.5)] px-5 sm:px-8 py-7 sm:py-8 lg:py-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {list.map((item, index) => {
              const n = index + 1;
              const Icon =
                iconMap[item.icon as keyof typeof iconMap] || GraduationCap;
              return (
                <div
                  key={`fb-${n}`}
                  className="flex flex-col items-center text-center gap-3 px-2"
                >
                  <div className="text-orange mb-1">
                    <EditableIconBox
                      contentKey={`feature_bar_${n}_icon`}
                      sizeKey={`feature_bar_${n}_icon_size`}
                      iconUrl={item.iconUrl}
                      iconSize={item.iconSize}
                      FallbackIcon={Icon}
                      alt={`Özellik ${n}`}
                      help={`Özellik ${n} ikon`}
                    />
                  </div>
                  <EditableText
                    contentKey={`feature_bar_${n}_title`}
                    value={item.title}
                    as="h3"
                    className="font-display text-[13px] font-semibold text-white tracking-wide uppercase break-anywhere leading-snug"
                    help={`Özellik ${n} başlık`}
                    textStyle={styles?.[`feature_bar_${n}_title`]}
                  />
                  <EditableText
                    contentKey={`feature_bar_${n}_desc`}
                    value={item.desc}
                    as="p"
                    multiline
                    className="text-[11px] text-muted leading-relaxed max-w-[14rem]"
                    help={`Özellik ${n} açıklama`}
                    textStyle={styles?.[`feature_bar_${n}_desc`]}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </EditableSectionShift>
  );
}
