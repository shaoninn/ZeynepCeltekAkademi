import { notFound } from "next/navigation";
import { cache } from "react";
import { SiteLink } from "@/components/ui/SiteLink";
import { prisma } from "@/lib/db";
import { memoryCache } from "@/lib/memory-cache";
import { formatPrice, parseJsonArray, parseJsonObject } from "@/lib/utils";
import { ProductConfigurator } from "@/components/shop/ProductConfigurator";
import { SimilarProducts } from "@/components/shop/SimilarProducts";
import { TrackProductView } from "@/components/shop/TrackProductView";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import type { ProductSpecs } from "@/types";
import { MapPin, Check } from "lucide-react";
import { CatalogAdminHint } from "@/components/editor/CatalogAdminHint";
import { ProductBadges } from "@/components/shop/ProductBadges";
import { CourseStickyBar } from "@/components/shop/CourseStickyBar";
import { getSiteSettings } from "@/lib/site";
import { WHATSAPP_URL } from "@/lib/constants";
import { parseProductSpecs, SPEC_FIELD_LABELS } from "@/lib/catalog-meta";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { TrackedContactLink } from "@/components/ads/TrackedContactLink";

export const revalidate = 600;


interface Props {
  params: Promise<{ slug: string }>;
}

const getProductBySlug = cache(async (slug: string) => {
  return memoryCache(
    `catalog:product:${slug}`,
    () =>
      prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      }),
    { ttlMs: 60_000, skipEmpty: true }
  );
});

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      alternates: { canonical: `/egitim/${slug}` },
      title: "Eğitim bulunamadı",
    };
  }
  const description =
    product.shortDesc ||
    `Adana’da ${product.name}. Uygulamalı program, belge ve kayıt.`;
  return {
    alternates: { canonical: `/egitim/${slug}` },
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image ? [product.image] : ["/images/og.jpg"],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product || !product.isActive) notFound();

  const specs = parseJsonObject<ProductSpecs>(product.specs, {});
  const specFlags = parseProductSpecs(product.specs);
  const gallery = parseJsonArray<string>(product.images);
  const images =
    gallery.length > 0
      ? gallery
      : product.image
        ? [product.image]
        : [];

  const unitPrice =
    product.badgeSale && product.salePrice != null
      ? product.salePrice
      : product.price;

  const similar = await memoryCache(
    `catalog:similar:${product.categoryId}:${product.id}`,
    async () => {
      try {
        return await prisma.product.findMany({
          where: {
            categoryId: product.categoryId,
            isActive: true,
            id: { not: product.id },
          },
          include: { category: true },
          orderBy: { sortOrder: "asc" },
          take: 4,
        });
      } catch {
        return [];
      }
    },
    { ttlMs: 120_000, skipEmpty: true }
  );

  const waUrl = settings.whatsappUrl || WHATSAPP_URL;
  const waText = encodeURIComponent(
    `Merhaba, ${product.name} eğitimi hakkında bilgi ve kayıt istiyorum.`
  );
  const crumbs = [
    { name: "Ana Sayfa", path: "/" },
    { name: "Eğitimler", path: "/hizmetler" },
    ...(product.category
      ? [
          {
            name: product.category.name,
            path: `/hizmetler/${product.category.slug}`,
          },
        ]
      : []),
    { name: product.name, path: `/egitim/${product.slug}` },
  ];

  return (
    <section className="py-16 lg:py-24 pb-28 md:pb-16">
      <TrackProductView
        productId={product.id}
        name={product.name}
        price={unitPrice}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productJsonLd({
              ...product,
              price: unitPrice,
              inStock: product.inStock,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(crumbs)),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="text-xs text-muted mb-6">
          <SiteLink href="/" className="hover:text-orange">
            Anasayfa
          </SiteLink>
          <span className="mx-2">/</span>
          <SiteLink href="/hizmetler" className="hover:text-orange">
            Eğitimler
          </SiteLink>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <SiteLink
                href={`/hizmetler/${product.category.slug}`}
                className="hover:text-orange"
              >
                {product.category.name}
              </SiteLink>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <CatalogAdminHint
          title="Bu eğitim sayfasının tamamı"
          adminHref="/admin/urunler"
          adminLabel="Admin → Eğitimler"
          detail="ad, fiyat, süre ve görseller eğitim kaydında girilir; canlı editörden düzenlenmez."
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative">
            <ProjectGallery title={product.name} images={images} />
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              <ProductBadges
                badgeNew={product.badgeNew}
                badgeBestseller={product.badgeBestseller}
                badgeSale={product.badgeSale}
                inStock={product.inStock}
              />
            </div>
          </div>

          <div>
            {product.category && (
              <SiteLink
                href={`/hizmetler/${product.category.slug}`}
                className="text-xs text-orange uppercase tracking-wider hover:underline"
              >
                {product.category.name}
              </SiteLink>
            )}
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">
              {product.name}
            </h1>
            <div className="mb-2 flex items-baseline gap-3">
              <p className="font-display text-3xl font-bold text-orange">
                {formatPrice(unitPrice)}
              </p>
              {product.badgeSale &&
                product.salePrice != null &&
                product.salePrice < product.price && (
                  <p className="text-muted line-through text-lg">
                    {formatPrice(product.price)}
                  </p>
                )}
            </div>
            <p className="text-xs text-muted mb-6">
              Sabit eğitim ücreti; kayıt WhatsApp veya ön kayıt ile netleşir.
              {specFlags.montaj ? ` Süre: ${specFlags.montaj}.` : ""}
              {specFlags.garanti ? ` Belge: ${specFlags.garanti}.` : ""}
            </p>

            {product.shortDesc && (
              <p className="text-muted mb-6">{product.shortDesc}</p>
            )}

            {Object.keys(specs).length > 0 && (
              <div className="mb-6 p-4 bg-card border border-border rounded-xl">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
                  Program
                </h3>
                <dl className="space-y-2">
                  {Object.entries(specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4 text-sm"
                    >
                      <dt className="text-muted capitalize shrink-0">
                        {SPEC_FIELD_LABELS[key] || key}
                      </dt>
                      <dd className="text-white sm:text-right break-words">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted">
                <Check size={16} className="text-orange" />
                Ücretsiz ön görüşme
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Check size={16} className="text-orange" />
                Uygulamalı eğitim ve belge desteği
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <MapPin size={16} className="text-orange" />
                Seyhan / Cemalpaşa, Adana
              </div>
            </div>

            <TrackedContactLink
              href={`${waUrl}?text=${waText}`}
              method="whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 w-full min-h-11 hidden md:inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-white font-semibold text-sm hover:brightness-110 transition-colors"
            >
              <WhatsAppIcon size={18} />
              WhatsApp ile kayıt
            </TrackedContactLink>

            <ProductConfigurator product={product} />

            {product.description && (
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
                  Eğitim İçeriği
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <SimilarProducts products={similar} />
      </div>
      <CourseStickyBar whatsappUrl={waUrl} courseName={product.name} />
    </section>
  );
}
