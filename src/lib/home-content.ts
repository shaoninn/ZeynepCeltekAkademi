import { getContentMap } from "@/lib/site-content";
import {
  getActiveCategories,
  getFeaturedProjects,
} from "@/lib/catalog";
import { getSiteSettings } from "@/lib/site";
import { buildStats } from "@/lib/page-content";
import { FEATURE_BAR } from "@/lib/constants";
import { styleContentKey } from "@/lib/text-style";
import { toWebpSrc } from "@/lib/image-optimize";

const DEFAULT_HERO_IMAGE = "/images/hero/hero-academy.webp";
const DEFAULT_HERO_TITLE = "Güzelliği bilimle, sanata dönüştürüyoruz.";
const DEFAULT_HERO_SUBTITLE = "";

/** Only keys consumed by the current homepage composition. */
const HOME_CONTENT_KEYS = [
  "hero_title",
  "hero_subtitle",
  "hero_body",
  "hero_image",
  "services_section_title",
  "feature_bar_1_title",
  "feature_bar_1_desc",
  "feature_bar_1_icon",
  "feature_bar_1_icon_size",
  "feature_bar_2_title",
  "feature_bar_2_desc",
  "feature_bar_2_icon",
  "feature_bar_2_icon_size",
  "feature_bar_3_title",
  "feature_bar_3_desc",
  "feature_bar_3_icon",
  "feature_bar_3_icon_size",
  "feature_bar_4_title",
  "feature_bar_4_desc",
  "feature_bar_4_icon",
  "feature_bar_4_icon_size",
  "cta_title",
  "cta_button_label",
  "cta_banner_1",
  "cta_banner_2",
  "cta_banner_3",
  "cta_banner_4",
  "stat_1_value",
  "stat_1_label",
  "stat_2_value",
  "stat_2_label",
  "stat_3_value",
  "stat_3_label",
  "stat_4_value",
  "stat_4_label",
] as const;

const STYLE_BASE_KEYS = [
  "hero_title",
  "hero_subtitle",
  "hero_body",
  "services_section_title",
  "cta_title",
  "cta_button_label",
  "feature_bar_1_title",
  "feature_bar_1_desc",
  "feature_bar_2_title",
  "feature_bar_2_desc",
  "feature_bar_3_title",
  "feature_bar_3_desc",
  "feature_bar_4_title",
  "feature_bar_4_desc",
] as const;

const HOME_KEYS = [
  ...HOME_CONTENT_KEYS,
  ...STYLE_BASE_KEYS.map((k) => styleContentKey(k)),
] as const;

function pickStyles(
  map: Record<string, string>,
  keys: readonly string[]
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of keys) {
    const sk = styleContentKey(k);
    if (map[sk]) out[k] = map[sk]!;
  }
  return out;
}

const emptyHome = {
  heroTitle: DEFAULT_HERO_TITLE,
  heroSubtitle: DEFAULT_HERO_SUBTITLE,
  heroBody: undefined as string | undefined,
  heroImage: undefined as string | undefined,
  servicesTitle: undefined as string | undefined,
  ctaTitle: undefined as string | undefined,
  ctaButtonLabel: undefined as string | undefined,
  ctaBanners: ["", "", "", ""] as string[],
  featureBarItems: undefined as
    | {
        title: string;
        desc: string;
        iconUrl?: string;
        iconSize?: number;
      }[]
    | undefined,
  stats: buildStats({}),
  styles: {} as Record<string, string>,
  sectionCategoriesOffset: "0",
  sectionCtaOffset: "0",
  sectionFeatureBarOffset: "0",
  projects: [] as Awaited<ReturnType<typeof getFeaturedProjects>>,
  categories: [] as Awaited<ReturnType<typeof getActiveCategories>>,
};

export async function loadHomePageData() {
  try {
    const [map, projects, settings, categories] = await Promise.all([
      getContentMap([...HOME_KEYS]),
      getFeaturedProjects(),
      getSiteSettings(),
      getActiveCategories(),
    ]);

    const featureBarItems = FEATURE_BAR.map((_, i) => {
      const n = i + 1;
      const sizeRaw = map[`feature_bar_${n}_icon_size`];
      const iconSize = sizeRaw ? Number(sizeRaw) : undefined;
      return {
        title: map[`feature_bar_${n}_title`] || "",
        desc: map[`feature_bar_${n}_desc`] || "",
        iconUrl: map[`feature_bar_${n}_icon`] || undefined,
        iconSize:
          iconSize && Number.isFinite(iconSize) ? iconSize : undefined,
      };
    });

    return {
      heroTitle: map.hero_title || DEFAULT_HERO_TITLE,
      heroSubtitle: map.hero_subtitle || DEFAULT_HERO_SUBTITLE,
      heroBody: map.hero_body || undefined,
      heroImage: toWebpSrc(map.hero_image || DEFAULT_HERO_IMAGE),
      servicesTitle: map.services_section_title || undefined,
      ctaTitle: map.cta_title || undefined,
      ctaButtonLabel: map.cta_button_label || undefined,
      ctaBanners: [1, 2, 3, 4].map((n) =>
        toWebpSrc(map[`cta_banner_${n}`] || "")
      ),
      featureBarItems,
      stats: buildStats(map),
      styles: pickStyles(map, STYLE_BASE_KEYS),
      sectionCategoriesOffset: settings.sectionCategoriesOffset,
      sectionCtaOffset: settings.sectionCtaOffset,
      sectionFeatureBarOffset: settings.sectionFeatureBarOffset,
      projects,
      categories,
    };
  } catch (error) {
    console.error("loadHomePageData failed:", error);
    return emptyHome;
  }
}
