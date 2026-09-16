import { parseJsonObject } from "@/lib/utils";
import type { ProductSpecs } from "@/types";

export type SpecFlags = {
  malzeme: string;
  garanti: string;
  montaj: string;
  teslimat: string;
};

export function parseProductSpecs(specsJson: string | null | undefined): SpecFlags {
  const specs = parseJsonObject<ProductSpecs>(specsJson || "{}", {});
  const extra = specs as ProductSpecs & {
    duration?: string;
    certificate?: string;
    schedule?: string;
  };
  return {
    malzeme: (specs.malzeme || "").trim(),
    garanti: (specs.garanti || extra.certificate || "").trim(),
    montaj: (specs.montaj || extra.duration || "").trim(),
    teslimat: (specs.teslimat || extra.schedule || "").trim(),
  };
}

export const SPEC_FIELD_LABELS: Record<string, string> = {
  malzeme: "İçerik",
  garanti: "Belge",
  montaj: "Süre",
  teslimat: "Program",
  duration: "Süre",
  certificate: "Belge",
  schedule: "Program",
};

export function productSeoScore(input: {
  name: string;
  slug: string;
  shortDesc: string | null;
  description: string | null;
  image: string | null;
  specs: string;
}): { score: number; tips: string[] } {
  const tips: string[] = [];
  let score = 0;

  if (input.name.length >= 8) score += 15;
  else tips.push("Eğitim adı en az 8 karakter olmalı");

  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) score += 15;
  else tips.push("Slug küçük harf ve tire ile olmalı");

  if ((input.shortDesc || "").length >= 40) score += 15;
  else tips.push("Kısa açıklama en az ~40 karakter");

  if ((input.description || "").length >= 120) score += 20;
  else tips.push("Detay açıklama en az ~120 karakter");

  if (input.image) score += 15;
  else tips.push("Kapak görseli ekleyin");

  const specs = parseJsonObject<Record<string, string>>(input.specs || "{}", {});
  const filled = Object.values(specs).filter((v) => (v || "").trim().length > 0).length;
  if (filled >= 2) score += 20;
  else tips.push("En az 2 özellik (eğitim içeriği, belge…) doldurun");

  return { score: Math.min(100, score), tips };
}
