import Link from "next/link";
import PostCard from "./PostCard";

export default function BlogGrid({
  posts = [],
  eyebrow = "Latest Update",
  title = "Let's Checkout our All **Latest News**",
  showHeading = true,
  showCta = true,
  background = false,
}) {
  if (!posts.length) return null;
  return (
    <section className={`section ${background ? "bg-surface-muted" : ""}`}>
      <div className="container-page">
        {showHeading && (
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-block border-b-2 border-brand pb-2 text-sm font-extrabold uppercase tracking-[0.2em] text-ink-strong">
                {eyebrow}
              </span>
              <h2 className="mt-6 max-w-xl text-3xl font-normal leading-tight text-ink-strong md:text-[2.6rem]">
                {emphasise(title)}
              </h2>
            </div>
            {showCta && (
              <Link
                href="/quote-form"
                className="w-fit shrink-0 bg-brand-dark px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-ink-strong"
              >
                Get a Free Quote
              </Link>
            )}
          </div>
        )}
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Renders **bold** spans within the heading.
function emphasise(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-extrabold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
