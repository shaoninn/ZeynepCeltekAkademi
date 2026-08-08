import dynamic from "next/dynamic";
import { preload } from "react-dom";
import { Hero, DEFAULT_HERO_IMAGE } from "@/components/home/Hero";
import { heroPreloadHrefs } from "@/components/home/HeroMedia";
import { HomeCategoriesSection } from "@/components/home/HomeCategoriesSection";
import { FeatureBar } from "@/components/home/FeatureBar";
import { loadHomePageData } from "@/lib/home-content";

const StatsBar = dynamic(() =>
  import("@/components/home/StatsBar").then((m) => m.StatsBar)
);
const FacilitySection = dynamic(() =>
  import("@/components/home/FacilitySection").then((m) => m.FacilitySection)
);
const ProcessSteps = dynamic(() =>
  import("@/components/home/ProcessSteps").then((m) => m.ProcessSteps)
);
const Testimonials = dynamic(() =>
  import("@/components/home/Testimonials").then((m) => m.Testimonials)
);
const FaqSection = dynamic(() =>
  import("@/components/home/FaqSection").then((m) => m.FaqSection)
);
const CTASection = dynamic(() =>
  import("@/components/home/CTASection").then((m) => m.CTASection)
);

export async function HomePageView() {
  const data = await loadHomePageData();
  const heroSrc = data.heroImage || DEFAULT_HERO_IMAGE;
  const { mobile, desktop } = heroPreloadHrefs(heroSrc);

  preload(desktop, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet:
      mobile === desktop ? desktop : `${mobile} 960w, ${desktop} 1600w`,
    imageSizes: "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw",
  });

  return (
    <>
      <Hero
        title={data.heroTitle}
        subtitle={data.heroSubtitle}
        body={data.heroBody}
        image={heroSrc}
        styles={data.styles}
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
      <StatsBar items={data.stats} />
      <FacilitySection projects={data.projects} />
      <ProcessSteps
        sectionTitle={data.processTitle}
        sectionDesc={data.processDesc}
        sectionEyebrow={data.processEyebrow}
        steps={data.processSteps}
        styles={data.styles}
      />
      <Testimonials
        googleReviewsUrl={data.googleReviewsUrl}
        sectionTitle={data.testimonialTitle}
        sectionDesc={data.testimonialDesc}
        sectionEyebrow={data.testimonialEyebrow}
        googleLinkLabel={data.googleReviewsLinkLabel}
        items={data.testimonials}
        styles={data.styles}
      />
      <FaqSection
        sectionTitle={data.faqTitle}
        sectionEyebrow={data.faqEyebrow}
        items={data.faqs}
        styles={data.styles}
      />
      <CTASection
        title={data.ctaTitle}
        buttonLabel={data.ctaButtonLabel}
        bannerImages={data.ctaBanners}
        sectionOffset={data.sectionCtaOffset}
        styles={data.styles}
      />
    </>
  );
}
