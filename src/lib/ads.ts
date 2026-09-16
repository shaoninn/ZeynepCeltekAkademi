"use client";

export type AdsConsent = {
  analytics: boolean;
  marketing: boolean;
};

const CONSENT_KEY = "zca_consent";

export function readAdsConsent(): AdsConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdsConsent;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeAdsConsent(consent: AdsConsent): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  window.dispatchEvent(new Event("zca-consent"));
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const fn = window.gtag;
  if (typeof fn === "function") fn(...args);
}

function fbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const fn = window.fbq;
  if (typeof fn === "function") fn(...args);
}

function sendToAds(sendTo: string | undefined) {
  if (!sendTo) return;
  gtag("event", "conversion", { send_to: sendTo });
}

export function trackLead(value?: number) {
  const params: Record<string, unknown> = { currency: "TRY" };
  if (value != null) params.value = value;
  gtag("event", "generate_lead", params);
  fbq("track", "Lead", params);
  sendToAds(process.env.NEXT_PUBLIC_AW_SEND_TO);
}

export function trackContact(method: "whatsapp" | "phone") {
  gtag("event", "contact", { method });
  fbq("track", "Contact", { content_category: method });
  sendToAds(process.env.NEXT_PUBLIC_AW_CONTACT_SEND_TO);
}

export function trackViewContent(input: {
  id: string;
  name: string;
  price: number;
}) {
  const params = {
    content_ids: [input.id],
    content_name: input.name,
    content_type: "product",
    value: input.price,
    currency: "TRY",
  };
  gtag("event", "view_item", {
    items: [{ item_id: input.id, item_name: input.name, price: input.price }],
    value: input.price,
    currency: "TRY",
  });
  fbq("track", "ViewContent", params);
}

export function trackAddToCart(input: {
  id: string;
  name: string;
  price: number;
}) {
  gtag("event", "add_to_cart", {
    items: [{ item_id: input.id, item_name: input.name, price: input.price }],
    value: input.price,
    currency: "TRY",
  });
  fbq("track", "AddToCart", {
    content_ids: [input.id],
    content_name: input.name,
    value: input.price,
    currency: "TRY",
  });
}

export function utmPrefillSuffix(): string {
  if (typeof window === "undefined") return "";
  const p = new URLSearchParams(window.location.search);
  const source = p.get("utm_source");
  if (!source) return "";
  const medium = p.get("utm_medium");
  return `\n(Kaynak: ${source}${medium ? ` / ${medium}` : ""})`;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
