import dynamic from "next/dynamic";
import { preload } from "react-dom";
import { Hero, DEFAULT_HERO_IMAGE } from "@/components/home/Hero";
import { heroPreloadHrefs } from "@/components/home/HeroMedia";
import { loadHomePageData } from "@/lib/home-content";
import { GOOGLE_BUSINESS_URL } from "@/lib/constants";
import { faqPageJsonLd } from "@/lib/seo";
import { HOME_FAQS } from "@/lib/home-faq";

const FeatureBar = dynamic(() =>
  import("@/components/home/FeatureBar").then((m) => m.FeatureBar)
);
const HomeCategoriesSection = dynamic(() =>
  import("@/components/home/HomeCategoriesSection").then(
    (m) => m.HomeCategoriesSection
  )
);
const StatsBar = dynamic(() =>
  import("@/components/home/StatsBar").then((m) => m.StatsBar)
);
const FacilitySection = dynamic(() =>
  import("@/components/home/FacilitySection").then((m) => m.FacilitySection)
);
const CTASection = dynamic(() =>
  import("@/components/home/CTASection").then((m) => m.CTASection)
);
const ProcessSteps = dynamic(() =>
  import("@/components/home/ProcessSteps").then((m) => m.ProcessSteps)
);
const FeaturedProducts = dynamic(() =>
  import("@/components/home/FeaturedProducts").then((m) => m.FeaturedProducts)
);
const Testimonials = dynamic(() =>
  import("@/components/home/Testimonials").then((m) => m.Testimonials)
);
const FaqSection = dynamic(() =>
  import("@/components/home/FaqSection").then((m) => m.FaqSection)
);

export async function HomePageView() {
  const data = await loadHomePageData();
  const heroSrc = data.heroImage || DEFAULT_HERO_IMAGE;
  const { mobile, desktop } = heroPreloadHrefs(heroSrc);

  preload(desktop, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet:
      mobile === desktop ? desktop : `${mobile} 640w, ${desktop} 1100w`,
    imageSizes: "(max-width: 1024px) 92vw, 50vw",
  });

  return (
    <>
      <Hero
        title={data.heroTitle}
        subtitle={data.heroSubtitle}
        body={data.heroBody}
        image={heroSrc}
        styles={data.styles}
        whatsappUrl={data.contact.whatsappUrl}
      />
      <FeatureBar
        items={data.featureBarItems}
        sectionOffset={data.sectionFeatureBarOffset}
        styles={data.styles}
      />
      <HomeCategoriesSection
        categories={data.categories}
        title={data.servicesTitle}
        offset={data.sectionCategoriesOffset}
        titleStyle={data.styles?.["services_section_title"]}
      />
      <ProcessSteps sectionTitle={data.processTitle} styles={data.styles} />
      <FeaturedProducts
        products={data.featuredProducts}
        title={data.featuredTitle}
      />
      <StatsBar items={data.stats} />
      <FacilitySection projects={data.projects} />
      <Testimonials googleReviewsUrl={GOOGLE_BUSINESS_URL} />
      <FaqSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd([...HOME_FAQS])),
        }}
      />
      <CTASection
        title={data.ctaTitle}
        buttonLabel={data.ctaButtonLabel}
        bannerImages={data.ctaBanners}
        sectionOffset={data.sectionCtaOffset}
        styles={data.styles}
        phone={data.contact.phone}
        phoneRaw={data.contact.phoneRaw}
        address={data.contact.address}
        workHoursWeekdays={data.contact.workHoursWeekdays}
        workHoursSunday={data.contact.workHoursSunday}
      />
    </>
  );
}
