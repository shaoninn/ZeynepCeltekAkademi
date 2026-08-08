import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat, Great_Vibes } from "next/font/google";
import "./globals.css";
import { getSiteUrl, localBusinessJsonLd, siteNavigationJsonLd, webSiteJsonLd } from "@/lib/seo";
import { Analytics } from "@/components/Analytics";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: true,
  preload: false,
});

/** Script font — used on home hero/stats; keep light (no preload). */
const greatVibes = Great_Vibes({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
  adjustFontFallback: true,
  preload: false,
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Zeynep Çeltek Güzellik Akademi | Adana Güzellik Eğitimi",
    template: "%s | Zeynep Çeltek Güzellik Akademi",
  },
  description:
    "Adana'da güzellik akademisi eğitimleri. Protez tırnak, kalıcı makyaj, ipek kirpik, cilt bakımı ve daha fazlası. Uygulamalı eğitim ve sertifika.",
  keywords: [
    "zeynep çeltek akademi",
    "adana güzellik akademisi",
    "protez tırnak eğitimi",
    "kalıcı makyaj eğitimi",
    "ipek kirpik eğitimi",
    "cilt bakımı eğitimi",
    "güzellik uzmanlığı",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico?v=5", sizes: "any" },
      { url: "/favicon.png?v=5", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-icon.png?v=5", sizes: "180x180" }],
    shortcut: "/favicon.ico?v=5",
  },
  openGraph: {
    title: "Zeynep Çeltek Güzellik Akademi | Adana Güzellik Eğitimi",
    description: "Güzelliği bilimle, sanata dönüştürüyoruz.",
    locale: "tr_TR",
    type: "website",
    url: siteUrl,
    siteName: "Zeynep Çeltek Güzellik Akademi",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 763,
        height: 117,
        alt: "Zeynep Çeltek Güzellik Akademi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeynep Çeltek Güzellik Akademi | Adana",
    description: "Güzelliği bilimle, sanata dönüştürüyoruz.",
    images: ["/images/logo/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [localBusinessJsonLd(), webSiteJsonLd(), siteNavigationJsonLd()];

  return (
    <html
      lang="tr"
      className={`${montserrat.variable} ${cormorant.variable} ${greatVibes.variable}`}
    >
      <body className="antialiased font-sans">
        {jsonLd.map((data, index) => (
          <script
            key={`ld-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
