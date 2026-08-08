import { CATEGORIES } from "@/lib/constants";
import { COURSES } from "../../prisma/courses-data";

const DESCRIPTIONS: Record<string, string> = Object.fromEntries(
  COURSES.map((c) => [c.slug, c.shortDesc])
);

const IMAGES: Record<string, string> = Object.fromEntries(
  COURSES.map((c) => [c.slug, c.image])
);

export type FallbackCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: { products: number };
};

/** Used when MySQL is unreachable so /hizmetler is never a blank page. */
export function getFallbackCategories(): FallbackCategory[] {
  const now = new Date(0);
  return CATEGORIES.map((c, i) => ({
    id: `fallback-${c.slug}`,
    name: c.name,
    slug: c.slug,
    description: DESCRIPTIONS[c.slug] ?? null,
    icon: c.icon,
    image: IMAGES[c.slug] ?? null,
    sortOrder: i,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    _count: { products: 1 },
  }));
}

export function getFallbackCategoryBySlug(slug: string) {
  return getFallbackCategories().find((c) => c.slug === slug) ?? null;
}

export function categoryTitleFromSlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? null;
}
