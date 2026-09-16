import { notFound } from "next/navigation";
import Image from "next/image";
import { SiteLink } from "@/components/ui/SiteLink";
import { getPostBySlug } from "@/lib/catalog";
import { sanitizeBlogHtml } from "@/lib/sanitize-html";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { WHATSAPP_URL } from "@/lib/constants";
import { TrackedContactLink } from "@/components/ads/TrackedContactLink";

export const revalidate = 600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.isPublished) {
    return { title: "Blog" };
  }
  return {
    alternates: { canonical: `/blog/${post.slug}` },
    title: post.title,
    description: post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.isPublished) notFound();

  const html = sanitizeBlogHtml(post.content);

  return (
    <section className="py-16 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: post.title,
              excerpt: post.excerpt,
              image: post.image,
              slug: post.slug,
              publishedAt: post.publishedAt,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Ana Sayfa", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ])
          ),
        }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        <nav className="text-xs text-muted mb-6">
          <SiteLink href="/" className="hover:text-orange">
            Anasayfa
          </SiteLink>
          <span className="mx-2">/</span>
          <SiteLink href="/blog" className="hover:text-orange">
            Blog
          </SiteLink>
          <span className="mx-2">/</span>
          <span className="text-white">{post.title}</span>
        </nav>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
          {post.title}
        </h1>

        {post.publishedAt && (
          <p className="text-sm text-muted mb-8">
            {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {post.image && (
          <div className="relative aspect-video mb-8 border border-border overflow-hidden bg-card rounded-xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div
          className="prose-dark space-y-4 overflow-x-auto break-anywhere [&_img]:max-w-full [&_pre]:overflow-x-auto [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-white/75 [&_a]:text-orange [&_a]:underline [&_p]:text-white/75 [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="mt-10 rounded-xl border border-orange/40 bg-card p-6">
          <p className="font-display text-lg font-semibold text-white mb-2">
            Bu konuda eğitim almak ister misiniz?
          </p>
          <p className="text-sm text-muted mb-4">
            Program, süre ve kayıt için eğitimleri inceleyin veya WhatsApp’tan
            yazın.
          </p>
          <div className="flex flex-wrap gap-3">
            <SiteLink
              href="/hizmetler"
              className="inline-flex items-center min-h-11 rounded-lg bg-orange text-black px-5 py-2.5 text-sm font-semibold hover:bg-orange-dark"
            >
              Eğitimleri incele
            </SiteLink>
            <TrackedContactLink
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(
                `Merhaba, “${post.title}” yazısı hakkında eğitim ve kayıt istiyorum.`
              )}`}
              method="whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-11 rounded-lg border border-[#25D366]/60 text-[#25D366] px-5 py-2.5 text-sm font-semibold hover:bg-[#25D366]/10"
            >
              WhatsApp
            </TrackedContactLink>
          </div>
        </div>
      </div>
    </section>
  );
}
