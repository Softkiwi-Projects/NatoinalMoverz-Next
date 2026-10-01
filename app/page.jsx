import HomeHero from "@/components/home/HomeHero";
import HomeAbout from "@/components/home/HomeAbout";
import HomeServices from "@/components/home/HomeServices";
import HomeWhy from "@/components/home/HomeWhy";
import HomeFeatures from "@/components/home/HomeFeatures";
import HomeProcess from "@/components/home/HomeProcess";
import HomeQuality from "@/components/home/HomeQuality";
import HomeBlog from "@/components/home/HomeBlog";
import HomeQuoteCta from "@/components/home/HomeQuoteCta";
import SplashTransition from "@/components/intro/SplashTransition";
import { homeServices } from "@/data/services";
import { getPageContent, getRecentPosts } from "@/lib/content";
import { site } from "@/data/site";
import { DEFAULT_ROBOTS, getCanonicalUrl } from "@/lib/seo";

export function generateMetadata() {
  const page = getPageContent("");
  const title = page?.title || "Moving Company | Movers New Zealand | National Movers";
  const description =
    page?.description ||
    "National Movers is New Zealand's leading delivery, packing, and moving company. Specialising in seamless house moving, packing, and storage services.";
  const canonicalUrl = getCanonicalUrl("");
  const ogImage = `${site.url}/wp-content/uploads/2025/01/40330.jpg`;

  return {
    title: {
      absolute: title,
    },
    description,
    robots: DEFAULT_ROBOTS,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: site.name,
      locale: "en_NZ",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "National Movers Moving Company New Zealand",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// Homepage styled after bdsmovers.co.nz (navy/red palette, Plus Jakarta Sans),
// using National Movers' own copy. Components live in components/home so the
// shared section components used by other pages are untouched.
export default function HomePage() {
  const recent = getRecentPosts(3);
  return (
    <SplashTransition>
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
    </SplashTransition>
  );
}
