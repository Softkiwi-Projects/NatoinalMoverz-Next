"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

// Per-page intro for location pages: delivery-man figure on the left,
// dynamic heading + paragraphs + accordion (with yellow active header)
// on the right. Content comes from each page's extracted blocks.
export default function LocationIntro({
  eyebrow = "National Movers",
  city = "",
  title,
  paragraphs = [],
  items = [],
  image = "/wp-content/uploads/2018/12/Quote-img.png",
}) {
  const [open, setOpen] = useState(0);
  const heading = title || `Leading Movers in ${city}`;

  return (
    <section className="overflow-hidden bg-white pt-16 md:pt-24">
      <div className="container-page grid items-end gap-0 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Figure — fixed height, flush with the section's bottom edge */}
        <div className="order-1 self-end">
          <img
            src={image}
            alt={`National Movers — professional movers in ${city}`}
            className="mx-auto h-[420px] w-auto object-contain object-bottom lg:mx-0 lg:h-[600px]"
          />
        </div>

        {/* Dynamic content */}
        <div className="order-2 pb-16 pt-8 md:pb-24 lg:pt-0">
          <span className="mb-3 block text-sm font-extrabold uppercase tracking-[0.18em] text-ink-strong">
            {eyebrow}
          </span>
          <h2 className="font-heading text-3xl leading-tight text-ink-strong md:text-[2.6rem]">
            {emphasiseCity(heading, city)}
          </h2>

          <div className="mt-6 space-y-5 leading-relaxed text-ink-soft">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Accordion — active header highlighted in theme yellow */}
          <div className="mt-8 space-y-3">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <div key={it.title}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className={`flex w-full items-center justify-between gap-4 rounded-md px-5 py-4 text-left transition-colors ${
                      isOpen
                        ? "bg-brand text-ink-strong"
                        : "border border-surface-border bg-surface-muted text-ink-strong"
                    }`}
                  >
                    <span className="text-base font-bold tracking-wide md:text-lg">{it.title}</span>
                    <Icon
                      name="chevron"
                      size={20}
                      strokeWidth={2.5}
                      className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-2 pt-4 leading-relaxed text-ink-soft">{it.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Bolds the city name wherever it appears in the heading; the rest stays light.
function emphasiseCity(title, city) {
  if (!city || !title.includes(city)) return <span className="font-light">{title}</span>;
  const parts = title.split(city);
  return parts.map((part, i) => (
    <span key={i} className="font-light">
      {part}
      {i < parts.length - 1 && <strong className="font-extrabold">{city}</strong>}
    </span>
  ));
}
