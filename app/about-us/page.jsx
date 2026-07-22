import TitleBar from "@/components/layout/TitleBar";
import ContentBlocks from "@/components/sections/ContentBlocks";
import { FeatureHighlights } from "@/components/sections/ContentBlocks";
import Stats from "@/components/sections/Stats";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import { getPageContent, getBlocks } from "@/lib/content";

export function generateMetadata() {
  const page = getPageContent("about-us");
  return {
    title: page?.title || "About Us",
    description: page?.description,
    alternates: { canonical: "/about-us" },
  };
}

export default function AboutPage() {
  const blocks = getBlocks("about-us");
  return (
    <>
      <TitleBar
        title="About National Movers"
        subtitle="Your trusted moving partner across New Zealand."
        crumbs={[{ label: "About Us" }]}
      />

      <section className="section">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl shadow-card">
            <img
              src="/wp-content/uploads/2025/01/2149312723.jpg"
              alt="National Movers team"
              className="w-full object-cover"
            />
          </div>
          <div>
            <span className="eyebrow">Who We Are</span>
            <ContentBlocks blocks={blocks.slice(0, 6)} />
          </div>
        </div>
      </section>

      <Stats />

      <section className="section bg-surface-muted">
        <div className="container-page">
          <FeatureHighlights blocks={blocks} icons={["home", "office", "van", "piano"]} />
        </div>
      </section>

      <WhyChooseUs />
      <Testimonials />
      <CTA />
    </>
  );
}
