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
  site: "https://zeynepceltekakademi.local",
};
