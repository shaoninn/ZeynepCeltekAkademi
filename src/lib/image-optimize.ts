/** Prefer pre-baked WebP when we ship a sibling asset for known local paths. */
const LOCAL_WEBP_MAP: Record<string, string> = {
  "/images/hero/hero-academy.jpg": "/images/hero/hero-academy.webp",
  "/images/hero/hero-academy.webp": "/images/hero/hero-academy.webp",
};

const LOCAL_WEBP_SM: Record<string, string> = {
  "/images/hero/hero-academy.jpg": "/images/hero/hero-academy-sm.webp",
  "/images/hero/hero-academy.webp": "/images/hero/hero-academy-sm.webp",
};

export function toWebpSrc(src: string): string {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return src;
  const pathOnly = src.split("?")[0] || src;
  return LOCAL_WEBP_MAP[pathOnly] || src;
}

export function toWebpSrcMobile(src: string): string | null {
  if (!src) return null;
  const pathOnly = src.split("?")[0] || src;
  return LOCAL_WEBP_SM[pathOnly] || null;
}

export function isLocalPublicPath(src: string): boolean {
  return Boolean(src?.startsWith("/") && !src.startsWith("//"));
}
