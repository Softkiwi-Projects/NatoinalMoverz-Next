import { notFound } from "next/navigation";
import ArchiveTemplate from "@/components/templates/ArchiveTemplate";
import { getTags, getTag, getPostsByTag } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getTags().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const term = getTag(slug);
  if (!term) return {};
  return {
    title: `${term.name} Archives`,
    description: term.description || `Articles tagged ${term.name}.`,
    alternates: { canonical: `/tag/${slug}` },
  };
}

export default async function TagPage({ params }) {
  const { slug } = await params;
  const term = getTag(slug);
  if (!term) notFound();
  const posts = getPostsByTag(slug);
  // Suggest a few sibling tags.
  const related = getTags()
    .filter((t) => t.slug !== slug)
    .slice(0, 12);
  return <ArchiveTemplate kind="tag" term={term} posts={posts} related={related} />;
}
