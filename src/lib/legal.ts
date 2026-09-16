/**
 * Shared legal page copy helpers for Zeynep Çeltek Güzellik Akademi.
 * Not a substitute for lawyer review — update with counsel when needed.
 */
import {
  ADDRESS,
  LEGAL_ENTITY_NAME,
  PHONE,
  SITE_NAME,
} from "@/lib/constants";

export const LEGAL_UPDATED = "8 Ağustos 2026";

export const COMPANY = {
  /** Marka adı (vitrin) */
  brand: SITE_NAME,
  /** Ticaret unvanı — yalnızca yasal metinlerde (mesafeli satış vb.) */
  name: LEGAL_ENTITY_NAME,
  address: ADDRESS,
  email: "",
  phone: PHONE,
  site: legalSiteUrl(),
};

function legalSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "") ||
    "";
  if (fromEnv && !/localhost|127\.0\.0\.1/i.test(fromEnv)) return fromEnv;
  return "https://zeynepceltekakademi.com";
}
