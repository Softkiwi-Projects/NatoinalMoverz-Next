import HomeHero from "@/components/home/HomeHero";
import HomeAbout from "@/components/home/HomeAbout";
import HomeServices from "@/components/home/HomeServices";
import HomeWhy from "@/components/home/HomeWhy";
import HomeFeatures from "@/components/home/HomeFeatures";
import HomeProcess from "@/components/home/HomeProcess";
import HomeQuality from "@/components/home/HomeQuality";
import HomeBlog from "@/components/home/HomeBlog";
import HomeQuoteCta from "@/components/home/HomeQuoteCta";
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

// Homepage styled after bdsmovers.co.nz (navy/red palette, Plus Jakarta Sans),
// using National Movers' own copy. Components live in components/home so the
// shared section components used by other pages are untouched.
export default function HomePage() {
  const recent = getRecentPosts(3);
  return (
    <div className="home-bds">
      <HomeHero />
      <HomeAbout />
      <HomeServices services={homeServices} />
      <HomeWhy />
      <HomeFeatures />
      <HomeProcess />
      <HomeQuality />
      <HomeBlog posts={recent} />
      <HomeQuoteCta />
    </div>
  );
}
