import { site } from "@/data/site";
import { serviceSlugs } from "@/data/services";
import { citySlugs } from "@/data/cities";
import { getAllPosts, getCategories, getTags } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap() {
  const base = site.url;
  const staticRoutes = ["", "about-us", "contacts", "quote-form", "blog"];
  const now = new Date();

  const entries = [
    ...staticRoutes.map((r) => ({ url: `${base}/${r}`, lastModified: now })),
    ...serviceSlugs.map((s) => ({ url: `${base}/${s}`, lastModified: now })),
    ...citySlugs.map((s) => ({ url: `${base}/${s}`, lastModified: now })),
    ...getAllPosts().map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: p.modified || p.published,
    })),
    ...getCategories().map((c) => ({ url: `${base}/category/${c.slug}`, lastModified: now })),
    ...getTags().map((t) => ({ url: `${base}/tag/${t.slug}`, lastModified: now })),
  ];
  return entries;
}
