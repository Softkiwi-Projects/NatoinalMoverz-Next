import { notFound } from "next/navigation";
import ArchiveTemplate from "@/components/templates/ArchiveTemplate";
import { getCategories, getCategory, getPostsByCategory } from "@/lib/content";
import { site } from "@/data/site";
import {
  cleanTitle,
  getCanonicalUrl,
  DEFAULT_ROBOTS,
  buildBreadcrumbJsonLd,
} from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const term = getCategory(slug);
  if (!term) return {};

  const title = cleanTitle(`${term.name} Archives`);
  const description =
    term.description ||
    `Browse our articles, tips, and professional moving advice for ${term.name} across New Zealand.`;
  const canonicalUrl = getCanonicalUrl(`category/${slug}`);
  const ogImage = `${site.url}/wp-content/uploads/2025/01/40330.jpg`;

  return {
    title,
    description,
    robots: DEFAULT_ROBOTS,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      title: `${title} | ${site.name}`,
      description,
      url: canonicalUrl,
      siteName: site.name,
      locale: "en_NZ",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [ogImage],
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const term = getCategory(slug);
  if (!term) notFound();

  const posts = getPostsByCategory(slug);
  const related = getCategories().filter((c) => c.slug !== slug);

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Blog", item: "/blog/" },
    { name: term.name, item: `/category/${slug}/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <ArchiveTemplate kind="category" term={term} posts={posts} related={related} />
    </>
  );
}
