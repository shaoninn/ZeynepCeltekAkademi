import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { StoreProvider } from "@/store/StoreProvider";
import { getNavLinks, getSiteSettings } from "@/lib/site";
import { getContentMap } from "@/lib/site-content";
import {
  getActiveCategories,
  getMenuNavPosts,
  getMenuNavProjects,
} from "@/lib/catalog";

/** ISR: 5 dk — admin kaydı revalidatePath ile anında yeniler. */
export const revalidate = 300;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, navLinks, content, categories, projects, posts] =
    await Promise.all([
      getSiteSettings(),
      getNavLinks(),
      getContentMap(["footer_blurb"]),
      getActiveCategories(),
      getMenuNavProjects(),
      getMenuNavPosts(),
    ]);

  const menuCategories = categories.map((c) => ({
    href: `/hizmetler/${c.slug}`,
    label: c.name,
  }));
  const menuProjects = projects.map((p) => ({
    href: `/projeler/${p.slug}`,
    label: p.title,
  }));
  const menuPosts = posts.map((p) => ({
    href: `/blog/${p.slug}`,
    label: p.title,
  }));

  return (
    <StoreProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-orange focus:text-black focus:px-3 focus:py-2"
      >
        İçeriğe geç
      </a>
      <Header
        settings={settings}
        navLinks={navLinks}
        categories={menuCategories}
        projects={menuProjects}
        blogPosts={menuPosts}
      />
      <main id="main-content" className="min-h-screen pt-[4.25rem] lg:pt-[4.75rem] pb-[max(5.5rem,env(safe-area-inset-bottom))] md:pb-0 overflow-x-clip">
        {children}
      </main>
      <Footer
        settings={settings}
        navLinks={navLinks}
        footerBlurb={content.footer_blurb}
      />
      <FloatingContact
        phone={settings.phone}
        whatsappUrl={settings.whatsappUrl}
      />
    </StoreProvider>
  );
}
