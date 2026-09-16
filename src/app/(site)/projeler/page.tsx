import { getActiveProjects } from "@/lib/catalog";
import { parseJsonArray } from "@/lib/utils";
import { getContentMap } from "@/lib/site-content";
import { PageIntro } from "@/components/editor/PageIntro";
import { CatalogAdminHint } from "@/components/editor/CatalogAdminHint";
import { EditableText } from "@/components/editor/EditableText";
import {
  GalleryLightbox,
  type GalleryItem,
} from "@/components/projects/GalleryLightbox";

export const revalidate = 600;

export const metadata = {
  alternates: { canonical: "/projeler" },
  title: "Galeri",
  description: "Eğitim ve atölye galerimizden seçkiler.",
};

function collectGalleryItems(
  projects: Awaited<ReturnType<typeof getActiveProjects>>
): GalleryItem[] {
  const seen = new Set<string>();
  const items: GalleryItem[] = [];
  for (const project of projects) {
    const gallery = parseJsonArray<string>(project.images);
    const sources = [project.image, ...gallery].filter(
      (s): s is string => Boolean(s)
    );
    for (const src of sources) {
      if (seen.has(src)) continue;
      seen.add(src);
      items.push({ src, alt: project.title });
    }
  }
  return items;
}

export default async function ProjectsPage() {
  const [projects, map] = await Promise.all([
    getActiveProjects(),
    getContentMap([
      "projects_eyebrow",
      "projects_title",
      "projects_intro",
      "projects_empty",
    ]),
  ]);

  const items = collectGalleryItems(projects);

  return (
    <section className="pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrowKey="projects_eyebrow"
          titleKey="projects_title"
          introKey="projects_intro"
          eyebrow={map.projects_eyebrow || "Galeri"}
          title={map.projects_title || "Eğitim Galerisi"}
          intro={
            map.projects_intro ||
            "Atölye ve eğitim anlarından kareler. Görsele dokunarak büyütün."
          }
        />

        <CatalogAdminHint
          title="Galeri görselleri"
          adminHref="/admin/projeler"
          adminLabel="Admin → Projeler"
        />

        {items.length === 0 ? (
          <EditableText
            contentKey="projects_empty"
            value={
              map.projects_empty ||
              "Henüz yayınlanmış galeri içeriği yok. Öğrenci çalışmaları yakında eklenecek."
            }
            as="p"
            block
            className="text-muted"
            help="Galeri boşken görünen mesaj"
          />
        ) : (
          <GalleryLightbox items={items} />
        )}
      </div>
    </section>
  );
}
