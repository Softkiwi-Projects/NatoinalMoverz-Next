import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { formatDate } from "@/lib/content";

export default function PostCard({ post }) {
  const categories = (post.categories || []).map((c) => c.name).join(", ");
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
      {/* Image with overlapping category badge */}
      <div className="relative">
        <Link href={`/${post.slug}`} className="block aspect-[16/10] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {categories && (
          <span className="absolute bottom-0 left-5 max-w-[80%] translate-y-1/2 rounded-md bg-brand px-4 py-2 text-xs font-bold leading-snug text-ink-strong shadow-soft">
            {categories}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 pt-9">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          <Icon name="clock" size={14} />
          {formatDate(post.published)}
        </div>
        <h3 className="mb-2 text-lg font-bold leading-snug text-ink-strong transition-colors group-hover:text-brand-dark">
          <Link href={`/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-soft line-clamp-2">
          {post.description}
        </p>
        <Link
          href={`/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand-dark"
        >
          Read more
          <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
