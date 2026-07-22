import Link from "next/link";
import TitleBar from "@/components/layout/TitleBar";
import PostCard from "@/components/sections/PostCard";
import CTA from "@/components/sections/CTA";
import { getAllPosts, getCategories, getPageContent } from "@/lib/content";

export function generateMetadata() {
  const page = getPageContent("blog");
  return {
    title: page?.title || "Blog",
    description: page?.description || "Moving tips, guides, and insights from National Movers.",
    alternates: { canonical: "/blog" },
  };
}

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();
  const [featured, ...rest] = posts;

  return (
    <>
      <TitleBar
        title="Blog"
        crumbs={[{ label: "Blog" }]}
        image="/wp-content/uploads/elementor/thumbs/title-bar-new.webp"
        showImage
      />

      <section className="section">
        <div className="container-page">
          {/* Category filter chips */}
          <div className="mb-10 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-dark px-4 py-2 text-sm font-bold text-white">
              All Posts
            </span>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-brand hover:text-brand-dark"
              >
                {c.name}
              </Link>
            ))}
          </div>

          {/* Featured post */}
          {featured && (
            <Link
              href={`/${featured.slug}`}
              className="group mb-12 grid overflow-hidden rounded-3xl border border-surface-border bg-white shadow-soft transition-shadow hover:shadow-card lg:grid-cols-2"
            >
              <div className="aspect-[16/10] overflow-hidden lg:aspect-auto">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                {featured.categories?.[0] && (
                  <span className="mb-3 w-fit rounded-full bg-brand/15 px-3 py-1 text-xs font-bold uppercase text-brand-dark">
                    {featured.categories[0].name}
                  </span>
                )}
                <h2 className="mb-3 text-2xl font-extrabold text-ink-strong group-hover:text-brand-dark md:text-3xl">
                  {featured.title}
                </h2>
                <p className="text-ink-soft">{featured.description}</p>
              </div>
            </Link>
          )}

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
