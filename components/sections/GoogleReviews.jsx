import Icon from "@/components/ui/Icon";

// Compact Google-style review strip: "EXCELLENT ★★★★★ based on N reviews"
// badge on the left, review cards on the right. Mirrors the embedded Google
// reviews widget on the original service pages.

const defaultReviews = [
  {
    name: "Harley Couper",
    when: "2 months ago",
    text: "Awesome, super easy to deal with and careful with everything. Highly recommend.",
  },
  {
    name: "Carl Basham",
    when: "3 months ago",
    text: "Amazing efficient service. The team went above and beyond — nothing was a problem.",
  },
  {
    name: "Jeremy Burgess",
    when: "4 months ago",
    text: "Just the best I've had. Careful, quick and great communication throughout the move.",
  },
];

const GoogleG = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.3h6.6c-.1 1.1-.9 2.8-2.5 3.9l3.8 2.9c2.3-2.1 3.6-5.2 3.6-8.8z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.9-5.1l-3.9 3C3.2 21.3 7.3 24 12 24z" />
    <path fill="#FBBC05" d="M5.1 14.3c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3l-3.9-3C.4 8.3 0 10.1 0 12s.4 3.7 1.2 5.3l3.9-3z" />
    <path fill="#EA4335" d="M12 4.7c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.7l3.9 3c1-3 3.7-5 6.9-5z" />
  </svg>
);

const Stars = ({ size = 15 }) => (
  <span className="flex gap-0.5" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d="M12 2l3 6.5 7 .8-5.2 4.7 1.4 6.9L12 17.5 5.8 21l1.4-6.9L2 9.3l7-.8L12 2z" fill="#FBBC05" />
      </svg>
    ))}
  </span>
);

export default function GoogleReviews({ reviews = defaultReviews, count = 27 }) {
  return (
    <section className="border-y border-surface-border bg-surface-muted py-12">
      <div className="container-page grid items-center gap-8 lg:grid-cols-[230px_1fr]">
        {/* Badge */}
        <div className="flex flex-col items-center gap-1.5 text-center lg:items-start lg:text-left">
          <span className="text-xl font-extrabold tracking-wide text-ink-strong">EXCELLENT</span>
          <Stars size={20} />
          <span className="text-sm text-ink-soft">
            Based on <b className="text-ink-strong">{count} reviews</b>
          </span>
          <span className="mt-1 flex items-center gap-1.5 text-sm font-bold text-ink-soft">
            <GoogleG /> Google
          </span>
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="flex flex-col gap-2 rounded-2xl bg-white p-5 shadow-soft">
              <figcaption className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand font-extrabold text-ink-strong">
                  {r.name.charAt(0)}
                </span>
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate text-sm font-bold text-ink-strong">{r.name}</span>
                  <span className="block text-xs text-ink-soft">{r.when}</span>
                </span>
                <GoogleG size={18} />
              </figcaption>
              <Stars />
              <blockquote className="text-sm leading-relaxed text-ink-soft">{r.text}</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
