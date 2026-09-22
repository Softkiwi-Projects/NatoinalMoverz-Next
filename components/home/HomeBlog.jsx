import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { formatDate } from "@/lib/content";
import { HomeHeading } from "./shared";

// Latest posts as rounded cards with a yellow category chip over the image.
export default function HomeBlog({ posts = [] }) {
  if (!posts.length) return null;
  return (
    <section className="section-bds bg-soft">
      <div className="container-bds">
        <HomeHeading eyebrow="Latest Update" title="Let's Checkout our All **Latest News**" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => {
            const category = p.categories?.[0]?.name;
            return (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200 transition hover:shadow-xl hover:ring-brand"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {category && (
                    <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-bold text-navy shadow">
                      {category}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <Icon name="clock" size={13} /> {formatDate(p.published)}
                  </p>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-navy decoration-brand decoration-2 underline-offset-4 group-hover:underline">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed line-clamp-2">{p.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-navy underline decoration-brand decoration-2 underline-offset-4">
                    Read more <Icon name="arrow" size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/blog" className="btn-navy-outline">
            View All Posts <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
