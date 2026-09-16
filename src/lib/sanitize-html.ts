/**
 * Allowlisted HTML sanitize for blog bodies (no dependency).
 * Permits: p, h2, h3, ul, ol, li, strong, em, a[href], br.
 */
const ALLOWED_TAGS = new Set([
  "p",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "a",
  "br",
]);

function sanitizeHref(href: string): string | null {
  const t = href.trim();
  if (/^https?:\/\//i.test(t) || t.startsWith("/") || t.startsWith("#")) {
    return t.replace(/"/g, "");
  }
  return null;
}

export function sanitizeBlogHtml(input: string): string {
  if (!input) return "";
  let html = input
    .replace(/<\s*script[\s\S]*?>[\s\S]*?<\s*\/\s*script\s*>/gi, "")
    .replace(/<\s*style[\s\S]*?>[\s\S]*?<\s*\/\s*style\s*>/gi, "")
    .replace(/on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");

  html = html.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (full, rawTag: string, attrs: string) => {
    const tag = rawTag.toLowerCase();
    const closing = full.startsWith("</");
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (closing) return `</${tag}>`;
    if (tag === "br") return "<br />";
    if (tag === "a") {
      const hrefMatch = attrs.match(/href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const rawHref = hrefMatch?.[2] || hrefMatch?.[3] || hrefMatch?.[4] || "";
      const safe = sanitizeHref(rawHref);
      if (!safe) return "";
      return `<a href="${safe}" rel="noopener noreferrer">`;
    }
    return `<${tag}>`;
  });

  return html;
}
