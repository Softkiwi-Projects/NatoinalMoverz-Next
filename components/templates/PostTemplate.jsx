import Link from "next/link";
import TitleBar from "@/components/layout/TitleBar";
import ContentBlocks from "@/components/sections/ContentBlocks";
import BlogSidebar from "@/components/sections/BlogSidebar";
import CommentForm from "@/components/sections/CommentForm";
import ContactStrip from "@/components/sections/ContactStrip";
import Icon from "@/components/ui/Icon";
import { formatDate } from "@/lib/content";
import { site } from "@/data/site";

// Classic blog-post layout: "Blog" title bar, article + sidebar (search,
// categories, recent posts, tags), date badge on the featured image, tag
// pills + share row, and a Leave a Reply form — mirroring the original site.
export default function PostTemplate({ post }) {
  const category = post.categories?.[0];
  const blocks = post.blocks || [];
  const { day, month } = dateBadge(post.published);
  const postUrl = `${site.url}/${post.slug}`;

  const shareLinks = [
    { icon: "facebook", label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}` },
    { icon: "x", label: "Share on X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}` },
    { icon: "linkedin", label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}` },
  ];

  return (
    <>
      <TitleBar
        title="Blog"
        crumbs={[{ label: "Blog", href: "/blog" }, { label: category?.name || "Article" }]}
        image="/wp-content/uploads/elementor/thumbs/title-bar-new.webp"
        showImage
      />

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ---- Article ---- */}
          <div>
            <article>
              {/* Featured image with date badge */}
              <div className="relative mb-7 overflow-hidden rounded-3xl shadow-card">
                <img src={post.image} alt={post.title} className="w-full object-cover" />
                <span className="absolute left-5 top-5 flex flex-col items-center rounded-xl bg-brand px-3.5 py-2 leading-none text-ink-strong shadow-soft">
                  <b className="text-xl font-extrabold">{day}</b>
                  <span className="mt-0.5 text-[11px] font-bold uppercase tracking-widest">{month}</span>
                </span>
              </div>

              <h1 className="text-2xl font-extrabold leading-tight text-ink-strong md:text-[2.1rem]">
                {post.title}
              </h1>

              {/* Meta row */}
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-surface-border pb-6 text-xs font-bold uppercase tracking-wide text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <Icon name="clock" size={14} /> {formatDate(post.published)}
                </span>
                {(post.categories || []).map((c) => (
                  <span key={c.slug} className="flex items-center gap-3">
                    <span aria-hidden="true" className="text-surface-border">/</span>
                    <Link href={`/category/${c.slug}`} className="hover:text-brand-dark hover:underline">
                      {c.name}
                    </Link>
                  </span>
                ))}
              </div>

              <ContentBlocks blocks={blocks} className="mt-7" />

              {/* Tags + share */}
              <div className="mt-10 space-y-6 border-t border-surface-border pt-7">
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 8).map((t) => (
                      <Link
                        key={t.slug}
                        href={`/tag/${t.slug}`}
                        className="rounded-md bg-brand/15 px-3.5 py-2 text-xs font-bold text-ink-strong transition-colors hover:bg-brand"
                      >
                        {t.name}
                      </Link>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <span className="text-sm font-bold text-ink-strong">Share this post</span>
                  {shareLinks.map((s) => (
                    <a
                      key={s.icon}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-ink-soft transition-colors hover:border-brand hover:bg-brand hover:text-ink-strong"
                    >
                      <Icon name={s.icon} size={15} />
                    </a>
                  ))}
                </div>
              </div>
            </article>

            {/* Comments */}
            <div className="mt-14 border-t border-surface-border pt-10">
              <CommentForm />
            </div>
          </div>

          {/* ---- Sidebar ---- */}
          <BlogSidebar currentSlug={post.slug} />
        </div>
      </section>

      <ContactStrip />
    </>
  );
}

function dateBadge(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: "", month: "" };
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleString("en-NZ", { month: "short" }),
  };
}
