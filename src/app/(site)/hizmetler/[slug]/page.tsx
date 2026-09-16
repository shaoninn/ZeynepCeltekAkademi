import { notFound } from "next/navigation";
import Image from "next/image";
import { SiteLink } from "@/components/ui/SiteLink";
import { prisma } from "@/lib/db";
import { getCategoryBySlug } from "@/lib/catalog";
import { categoryTitleFromSlug } from "@/lib/catalog-fallback";
import { CatalogProductGrid } from "@/components/shop/CatalogProductGrid";
import { EditableCategoryField } from "@/components/editor/EditableCategoryField";
import { CatalogAdminHint } from "@/components/editor/CatalogAdminHint";
import { ProductConfigurator } from "@/components/shop/ProductConfigurator";
import { CourseStickyBar } from "@/components/shop/CourseStickyBar";
import { getSiteSettings } from "@/lib/site";
import { WHATSAPP_URL } from "@/lib/constants";
import { formatPrice, parseJsonObject } from "@/lib/utils";
import { parseProductSpecs } from "@/lib/catalog-meta";
import { breadcrumbJsonLd } from "@/lib/seo";
import { TrackedContactLink } from "@/components/ads/TrackedContactLink";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import type { ProductSpecs } from "@/types";

export const revalidate = 600;

interface Props {
  params: Promise<{ slug: string }>;
}

/** No DB in metadata — cuts parallel pool pressure with page render. */
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const name = categoryTitleFromSlug(slug);
  if (!name) {
    return {
      alternates: { canonical: `/hizmetler/${slug}` },
      title: "Eğitim",
    };
  }
  return {
    alternates: { canonical: `/hizmetler/${slug}` },
    title: name,
    description: `Adana’da ${name} — süre, belge ve kayıt.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const [category, settings] = await Promise.all([
    getCategoryBySlug(slug),
    getSiteSettings(),
  ]);
  if (!category || !category.isActive) notFound();

  const products = await (async () => {
    if (category.id.startsWith("fallback-")) return [];
    try {
      return await prisma.product.findMany({
        where: { categoryId: category.id, isActive: true },
        orderBy: { sortOrder: "asc" },
        include: { category: true },
      });
    } catch (error) {
      console.error("[hizmetler/slug] products failed:", error);
      return [];
    }
  })();

  const desc = category.description || "";
  const waUrl = settings.whatsappUrl || WHATSAPP_URL;
  const single = products.length === 1 ? products[0] : null;
  const specFlags = single ? parseProductSpecs(single.specs) : null;
  const specs = single
    ? parseJsonObject<ProductSpecs>(single.specs, {})
    : {};
  const unitPrice = single
    ? single.badgeSale && single.salePrice != null
      ? single.salePrice
      : single.price
    : 0;
  const waText = single
    ? encodeURIComponent(
        `Merhaba, ${single.name} eğitimi hakkında bilgi ve kayıt istiyorum.`
      )
    : "";

  return (
    <section className={`py-16 lg:py-24 ${single ? "pb-28 md:pb-16" : ""}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Ana Sayfa", path: "/" },
              { name: "Eğitimler", path: "/hizmetler" },
              { name: category.name, path: `/hizmetler/${category.slug}` },
            ])
          ),
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
          <span className="mx-2">/</span>
          <span className="text-white">{category.name}</span>
        </nav>

        <CatalogAdminHint
          title="Eğitim kartları / fiyat"
          adminHref="/admin/urunler"
          adminLabel="Admin → Eğitimler"
        />

        <div className="mb-8">
          <EditableCategoryField
            categoryId={category.id}
            slug={category.slug}
            name={category.name}
            description={desc}
            field="name"
            as="h1"
            block
            className="font-display text-3xl sm:text-4xl font-bold text-white mb-2"
            help="Kategori adı (fiyatlar Admin → Eğitimler’de)"
          />
          <EditableCategoryField
            categoryId={category.id}
            slug={category.slug}
            name={category.name}
            description={desc}
            field="description"
            as="p"
            block
            multiline
            className="text-muted max-w-2xl"
            help="Kategori sayfası açıklama metni"
          />
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted">Bu kategoride henüz eğitim bulunmuyor.</p>
            <SiteLink
              href="/iletisim"
              className="inline-block mt-4 text-orange text-sm hover:underline"
            >
              Kayıt için iletişime geçin
            </SiteLink>
          </div>
        ) : single ? (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-card">
              {single.image ? (
                <Image
                  src={single.image}
                  alt={single.name}
                  fill
                  className="object-cover object-[center_28%]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : null}
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-orange mb-2">
                {formatPrice(unitPrice)}
              </p>
              <p className="text-xs text-muted mb-4">
                Sabit eğitim ücreti; kayıt WhatsApp veya ön kayıt ile netleşir.
              </p>
              <ul className="text-sm text-muted space-y-1 mb-6">
                {specFlags?.montaj ? <li>Süre: {specFlags.montaj}</li> : null}
                {specFlags?.garanti ? <li>Belge: {specFlags.garanti}</li> : null}
                {specFlags?.teslimat ? (
                  <li>Program: {specFlags.teslimat}</li>
                ) : null}
                {Object.keys(specs).length === 0 && single.shortDesc ? (
                  <li>{single.shortDesc}</li>
                ) : null}
              </ul>
              <TrackedContactLink
                href={`${waUrl}?text=${waText}`}
                method="whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 w-full min-h-11 hidden md:inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-white font-semibold text-sm"
              >
                <WhatsAppIcon size={18} />
                WhatsApp ile kayıt
              </TrackedContactLink>
              <ProductConfigurator product={single} />
              <SiteLink
                href={`/egitim/${single.slug}`}
                className="mt-4 inline-block text-sm text-orange hover:underline"
              >
                Eğitim detayına git
              </SiteLink>
            </div>
          </div>
        ) : (
          <CatalogProductGrid products={products} />
        )}
      </div>
      {single ? (
        <CourseStickyBar whatsappUrl={waUrl} courseName={single.name} />
      ) : null}
    </section>
  );
}
