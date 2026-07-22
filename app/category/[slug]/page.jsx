import { notFound } from "next/navigation";
import ArchiveTemplate from "@/components/templates/ArchiveTemplate";
import { getCategories, getCategory, getPostsByCategory } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const term = getCategory(slug);
  if (!term) return {};
  return {
    title: `${term.name} Archives`,
    description: term.description || `Articles about ${term.name}.`,
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const term = getCategory(slug);
  if (!term) notFound();
  const posts = getPostsByCategory(slug);
  const related = getCategories().filter((c) => c.slug !== slug);
  return <ArchiveTemplate kind="category" term={term} posts={posts} related={related} />;
}
