import {
  ADDRESS,
  GOOGLE_BUSINESS_URL,
  INSTAGRAM_ACCOUNTS,
  PHONE_RAW,
  SITE_NAME,
  SITE_TAGLINE,
  WORK_HOURS,
} from "@/lib/constants";
import { toWebpSrc } from "@/lib/image-optimize";

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

function absUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localBusinessJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": `${url}/#business`,
    name: SITE_NAME,
    description: SITE_TAGLINE,
    url,
    telephone: `+${PHONE_RAW}`,
    image: `${url}/images/og.jpg`,
    logo: `${url}/images/logo/logo-nobg.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS,
      addressLocality: "Cemalpaşa",
      addressRegion: "Adana",
      postalCode: "01120",
      addressCountry: "TR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Adana",
    },
    sameAs: [
      ...INSTAGRAM_ACCOUNTS.map((a) => a.href),
      GOOGLE_BUSINESS_URL,
    ].filter(Boolean),
    priceRange: "$$",
  };
}

export function siteNavigationJsonLd() {
  const url = getSiteUrl();
  const items = [
    { name: "Eğitimler", path: "/hizmetler" },
    { name: "Galeri", path: "/projeler" },
    { name: "Hakkımızda", path: "/hakkimizda" },
    { name: "Blog", path: "/blog" },
    { name: "İletişim", path: "/iletisim" },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: item.name,
      url: `${url}${item.path}`,
    })),
  };
}

export function webSiteJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url,
    inLanguage: "tr-TR",
    publisher: { "@id": `${url}/#business` },
  };
}

export function faqPageJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function articleJsonLd(post: {
  title: string;
  excerpt?: string | null;
  image?: string | null;
  slug: string;
  publishedAt?: Date | string | null;
}) {
  const url = `${getSiteUrl()}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.image ? absUrl(post.image) : undefined,
    url,
    datePublished: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : undefined,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@id": `${getSiteUrl()}/#business` },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${url}${item.path}`,
    })),
  };
}

export function productJsonLd(product: {
  name: string;
  description?: string | null;
  image?: string | null;
  slug: string;
  price: number;
  inStock?: boolean;
}) {
  const url = `${getSiteUrl()}/egitim/${product.slug}`;
  const image = product.image ? absUrl(toWebpSrc(product.image)) : undefined;
  const available = product.inStock !== false;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: product.name,
    description: product.description || undefined,
    image,
    url,
    provider: { "@id": `${getSiteUrl()}/#business` },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: product.price,
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
      url,
      category: "EducationEvent",
    },
  };
}

export { ADDRESS, WORK_HOURS };
