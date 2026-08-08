import { SiteLink } from "@/components/ui/SiteLink";

/** Shared dark page intro — matches academy mockup language across routes. */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: { href: string; label: string }[];
}) {
  return (
    <section className="page-hero pt-10 sm:pt-14 pb-10 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {crumbs && crumbs.length > 0 ? (
          <nav className="flex flex-wrap items-center gap-2 text-[11px] tracking-wider uppercase text-muted mb-5">
            <SiteLink href="/" className="hover:text-orange transition-colors">
              Ana Sayfa
            </SiteLink>
            {crumbs.map((c) => (
              <span key={c.href} className="inline-flex items-center gap-2">
                <span className="text-white/20">/</span>
                <SiteLink
                  href={c.href}
                  className="hover:text-orange transition-colors"
                >
                  {c.label}
                </SiteLink>
              </span>
            ))}
          </nav>
        ) : null}
        {eyebrow ? (
          <p className="text-[11px] tracking-[0.28em] uppercase text-orange font-semibold mb-3">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-white tracking-tight max-w-3xl leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-white/60 text-sm sm:text-base max-w-2xl leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
