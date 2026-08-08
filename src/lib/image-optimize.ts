/**
 * Prefer pre-baked WebP (and mobile -sm) for local public assets.
 * Hostinger serves these as static files — no runtime /_next/image resize.
 */

function pathOnly(src: string): string {
  return (src.split("?")[0] || src).trim();
}

function toWebpPath(path: string): string {
  if (/\.webp$/i.test(path)) return path;
  return path.replace(/\.(jpe?g|png)$/i, ".webp");
}

function toSmWebpPath(path: string): string {
  const webp = toWebpPath(path);
  if (/-sm\.webp$/i.test(webp)) return webp;
  return webp.replace(/\.webp$/i, "-sm.webp");
}

const LOCAL_WEBP_MAP: Record<string, string> = {
  "/images/hero/hero-academy.jpg": "/images/hero/hero-academy.webp",
  "/images/hero/hero-academy.webp": "/images/hero/hero-academy.webp",
  "/images/logo/logo-nobg.png": "/images/logo/logo-header.webp",
  "/images/logo/logo.png": "/images/logo/logo-header.webp",
  "/images/logo/logo.webp": "/images/logo/logo-header.webp",
};

const LOCAL_WEBP_SM: Record<string, string> = {
  "/images/hero/hero-academy.jpg": "/images/hero/hero-academy-sm.webp",
  "/images/hero/hero-academy.webp": "/images/hero/hero-academy-sm.webp",
};

export function toWebpSrc(src: string): string {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return src;
  const p = pathOnly(src);
  if (LOCAL_WEBP_MAP[p]) return LOCAL_WEBP_MAP[p];
  if (p.startsWith("/images/") && /\.(jpe?g|png|webp)$/i.test(p)) {
    return toWebpPath(p);
  }
  return src;
}

export function toWebpSrcMobile(src: string): string | null {
  if (!src) return null;
  const p = pathOnly(src);
  if (LOCAL_WEBP_SM[p]) return LOCAL_WEBP_SM[p];
  if (p.startsWith("/images/") && /\.(jpe?g|png|webp)$/i.test(p)) {
    if (p.includes("/logo/")) return null;
    return toSmWebpPath(p);
  }
  return null;
}

export function isLocalPublicPath(src: string): boolean {
  return Boolean(src?.startsWith("/") && !src.startsWith("//"));
}
