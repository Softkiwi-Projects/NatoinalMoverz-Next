import Link from "next/link";
import Icon from "@/components/ui/Icon";
import {
  getCategories,
  getTags,
  getRecentPosts,
  getPostsByCategory,
  formatDate,
} from "@/lib/content";

// Blog sidebar: search, categories (with post counts), recent posts, tag cloud.
// Server component — all data comes from the extracted content at build time.
export default function BlogSidebar({ currentSlug = null }) {
  const categories = getCategories();
  const tags = getTags();
  const recent = getRecentPosts(4, currentSlug);

  return (
    <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
      {/* Search */}
      <div className="rounded-2xl border border-surface-border bg-surface-muted p-5">
        <form action="/blog" className="flex overflow-hidden rounded-full border border-surface-border bg-white focus-within:border-brand">
          <input
            type="search"
            name="q"
            placeholder="Search…"
            aria-label="Search the blog"
            className="w-full bg-transparent px-5 py-3 text-sm text-ink focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex items-center bg-brand px-4 text-ink-strong transition-colors hover:bg-brand-light"
          >
            <Icon name="arrow" size={16} />
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-soft">
        <SidebarHeading>Categories</SidebarHeading>
        <ul className="divide-y divide-surface-border">
          {categories.map((c) => {
            const count = getPostsByCategory(c.slug).length;
            return (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="group flex items-center justify-between py-2.5 text-sm font-semibold capitalize text-ink-soft transition-colors hover:text-ink-strong"
                >
                  <span className="group-hover:underline">{c.name}</span>
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand/15 px-1.5 text-xs font-bold text-ink-strong">
                    {count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Recent posts */}
      <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-soft">
        <SidebarHeading>Recent Posts</SidebarHeading>
        <ul className="space-y-5">
          {recent.map((p) => (
            <li key={p.slug}>
              <Link href={`/${p.slug}`} className="group flex gap-4">
                <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-light">
                  {p.image && (
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </span>
                <span>
                  <span className="line-clamp-2 text-sm font-bold leading-snug text-ink-strong group-hover:underline">
                    {p.title}
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    {formatDate(p.published)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-soft">
        <SidebarHeading>Tags</SidebarHeading>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Link
              key={t.slug}
              href={`/tag/${t.slug}`}
              className="rounded-md bg-surface-light px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-brand hover:text-ink-strong"
            >
              {t.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

function SidebarHeading({ children }) {
  return (
    <h3 className="mb-4 border-b-2 border-brand pb-2 text-lg font-extrabold text-ink-strong">
      {children}
    </h3>
  );
}
