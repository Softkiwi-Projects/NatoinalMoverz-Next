import { site } from "@/data/site";
import { serviceSlugs } from "@/data/services";
import { citySlugs } from "@/data/cities";
import { getAllPosts, getCategories } from "@/lib/content";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap() {
  const now = new Date();

  // Core static landing pages
  const coreRoutes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "about-us", priority: 0.8, changeFrequency: "monthly" },
    { path: "contacts", priority: 0.8, changeFrequency: "monthly" },
    { path: "quote-form", priority: 0.9, changeFrequency: "monthly" },
    { path: "blog", priority: 0.8, changeFrequency: "weekly" },
  ];

  // High-value service landing pages
  const serviceRoutes = serviceSlugs.map((slug) => ({
    url: getCanonicalUrl(slug),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Targeted city/location landing pages
  const cityRoutes = citySlugs.map((slug) => ({
    url: getCanonicalUrl(slug),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Blog articles
  const postRoutes = getAllPosts().map((post) => {
    let lastMod = now;
    if (post.modified) {
      const parsed = new Date(post.modified);
      if (!isNaN(parsed)) lastMod = parsed;
    } else if (post.published) {
      const parsed = new Date(post.published);
      if (!isNaN(parsed)) lastMod = parsed;
    }
    return {
      url: getCanonicalUrl(post.slug),
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  // Category archive pages (4 curated categories, distinct from 47 duplicate tag archives)
  const categoryRoutes = getCategories().map((cat) => ({
    url: getCanonicalUrl(`category/${cat.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...coreRoutes.map((r) => ({
      url: getCanonicalUrl(r.path),
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...serviceRoutes,
    ...cityRoutes,
    ...postRoutes,
    ...categoryRoutes,
  ];
}
