import Link from "next/link";
import TitleBar from "@/components/layout/TitleBar";
import ContentBlocks from "@/components/sections/ContentBlocks";
import BlogGrid from "@/components/sections/BlogGrid";
import CTA from "@/components/sections/CTA";
import Icon from "@/components/ui/Icon";
import { getRelatedPosts, formatDate } from "@/lib/content";

export default function PostTemplate({ post }) {
  const related = getRelatedPosts(post, 3);
  const category = post.categories?.[0];
  // Skip a leading heading that merely repeats the post title.
  const blocks = post.blocks || [];

  return (
    <>
      <TitleBar
        title={post.title}
        crumbs={[{ label: "Blog", href: "/blog" }, { label: category?.name || "Article" }]}
      />

      <article className="section">
        <div className="container-page max-w-3xl">
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-ink-soft">
            <span className="flex items-center gap-2">
              <Icon name="clock" size={16} /> {formatDate(post.published)}
            </span>
            {category && (
              <Link
                href={`/category/${category.slug}`}
                className="rounded-full bg-brand/15 px-3 py-1 text-brand-dark hover:bg-brand/30"
              >
                {category.name}
              </Link>
            )}
          </div>

          <div className="mb-8 overflow-hidden rounded-3xl shadow-card">
            <img src={post.image} alt={post.title} className="w-full object-cover" />
          </div>

          <p className="mb-8 border-l-4 border-brand pl-5 text-lg font-medium italic text-ink-soft">
            {post.description}
          </p>

          <ContentBlocks blocks={blocks} />

          {post.tags?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-surface-border pt-6">
              {post.tags.slice(0, 10).map((t) => (
                <Link
                  key={t.slug}
                  href={`/tag/${t.slug}`}
                  className="rounded-full border border-surface-border px-3 py-1 text-xs font-semibold text-ink-soft transition-colors hover:border-brand hover:text-brand-dark"
                >
                  #{t.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <BlogGrid
          posts={related}
          eyebrow="Keep Reading"
          title="Related **Articles**"
          showCta={false}
          background
        />
      )}
      <CTA />
    </>
  );
}
