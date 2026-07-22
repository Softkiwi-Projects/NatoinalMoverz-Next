import Hero from "@/components/sections/Hero";
import FeatureStrip from "@/components/sections/FeatureStrip";
import ServicesGrid from "@/components/sections/ServicesGrid";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Stats from "@/components/sections/Stats";
import QualityFocus from "@/components/sections/QualityFocus";
import PlanMove from "@/components/sections/PlanMove";
import BlogGrid from "@/components/sections/BlogGrid";
import WhyNationalMovers from "@/components/sections/WhyNationalMovers";
import CTA from "@/components/sections/CTA";
import { homeServices } from "@/data/services";
import { getPageContent, getRecentPosts } from "@/lib/content";

export function generateMetadata() {
  const page = getPageContent("");
  return {
    title: page?.title || "Moving Company New Zealand",
    description: page?.description,
    alternates: { canonical: "/" },
  };
}

export default function HomePage() {
  const recent = getRecentPosts(3);
  return (
    <>
      <Hero />
      <FeatureStrip />
      <ServicesGrid services={homeServices} />
      <WhyChooseUs />
      <Stats />
      <QualityFocus />
      <PlanMove />
      <BlogGrid posts={recent} eyebrow="Latest Update" title="Let's Checkout our All **Latest News**" />
      <WhyNationalMovers />
      {/* <CTA /> */}
    </>
  );
}
