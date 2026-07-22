import Link from "next/link";
import TitleBar from "@/components/layout/TitleBar";
import BlogGrid from "@/components/sections/BlogGrid";
import CTA from "@/components/sections/CTA";
import Icon from "@/components/ui/Icon";
import { formatDate } from "@/lib/content";

// Shared template for category and tag archive pages.
export default function ArchiveTemplate({ kind, term, posts, related = [] }) {
  const label = kind === "category" ? "Category" : "Tag";
  return (
    <>
      <TitleBar
        title={term.name}
        subtitle={
          term.description ||
          `Browse our latest articles filed under ${term.name}.`
        }
        crumbs={[{ label: "Blog", href: "/blog" }, { label }]}
      />

      <section className="section">
        <div className="container-page">
          <p className="mb-8 text-sm font-semibold uppercase tracking-wide text-ink-soft">
            {posts.length} {posts.length === 1 ? "article" : "articles"} in {label.toLowerCase()}{" "}
            <span className="text-brand-dark">"{term.name}"</span>
          </p>

          {posts.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCardInline key={p.slug} post={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-surface-muted p-10 text-center text-ink-soft">
              No articles here yet — check back soon or{" "}
              <Link href="/blog" className="font-bold text-brand-dark underline">
                browse all posts
              </Link>
              .
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-4 text-xl font-bold text-ink-strong">Related {label}s</h2>
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/${kind}/${r.slug}`}
                    className="rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-brand hover:text-brand-dark"
                  >
                    {r.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}

function PostCardInline({ post }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-soft transition-all hover:-translate-y-1.5 hover:shadow-card">
      <Link href={`/${post.slug}`} className="block aspect-[16/10] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-ink-soft">
          <Icon name="clock" size={14} /> {formatDate(post.published)}
        </div>
        <h3 className="mb-2 text-lg font-bold leading-snug text-ink-strong group-hover:text-brand-dark">
          <Link href={`/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="line-clamp-3 text-sm text-ink-soft">{post.description}</p>
      </div>
    </article>
  );
}
