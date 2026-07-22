"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

// Accordion copy lifted verbatim from the original nationalmovers.co.nz
// "Why National Movers?" section.
const defaultItems = [
  {
    title: "Tailored Moving Solutions",
    text: "We provide fully customized moving and packing services to meet the unique needs of both residential and commercial clients. No matter your requirements, we adapt to deliver a seamless experience.",
  },
  {
    title: "Clear Communication and Transparency",
    text: "Stay informed every step of the way! Our transparent process ensures you always know the location and status of your belongings during the move.",
  },
  {
    title: "Affordable and Fair Pricing",
    text: "As trusted local movers in Palmerston North, we offer competitive rates and charge only for the services you choose. Quality services without hidden fees.",
  },
  {
    title: "Expert Movers You Can Trust",
    text: "Our team consists of experienced professionals trained to industry standards. Whether handling fragile antiques or bulky furniture, we ensure your items are managed with utmost care.",
  },
  {
    title: "Secure and Detailed Documentation",
    text: "Every move is backed by proper documentation to guarantee the safe handling of your belongings. Our commitment to transparency builds trust and avoids misunderstandings.",
  },
  {
    title: "Extensive Fleet of Modern Vehicles",
    text: "Our large fleet of trucks and vans is equipped to accommodate moves of any size, from small household items to substantial commercial goods. Fully equipped for safety and efficiency during long or short distances.",
  },
];

// "Why National Movers?" — delivery-man photo on the left (flush with the
// section's bottom edge on desktop), heading + FAQ-style accordion on the right.
export default function WhyNationalMovers({
  eyebrow = "Why Choose Us",
  items = defaultItems,
  image = "/wp-content/uploads/2018/12/Quote-img.png",
}) {
  const [open, setOpen] = useState(-1);

  return (
    <section className="overflow-hidden bg-surface-light pt-16 md:pt-24">
      <div className="container-page grid items-end gap-0 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Image — bottom-aligned so the figure sits on the section edge */}
        <div className="order-1 self-end">
          {/* Fixed height so opening/closing accordion items never rescales the figure */}
          <img
            src={image}
            alt="National Movers delivery man with packed boxes"
            className="mx-auto h-[420px] w-auto object-contain object-bottom lg:mx-0 lg:h-[560px]"
          />
        </div>

        {/* Heading + accordion */}
        <div className="order-2 pb-16 pt-8 lg:pt-0 md:pb-24">
          <span className="mb-3 block text-sm font-extrabold uppercase tracking-[0.18em] text-ink-strong">
            {eyebrow}
          </span>
          <h2 className="font-heading text-3xl leading-tight text-ink-strong md:text-[2.6rem]">
            <span className="font-light">Why </span>
            <strong className="font-extrabold">National Movers?</strong>
          </h2>

          <div className="mt-8 divide-y divide-ink-strong/10 border-y border-ink-strong/10">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <div key={it.title}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className={`flex w-full items-center justify-between gap-4 py-5 text-left transition-colors ${isOpen ? "bg-brand px-4" : "px-0"}`}
                  >
                    <span className="text-base font-bold tracking-wide text-ink-strong md:text-lg">
                      {it.title}
                    </span>
                    <Icon
                      name="chevron"
                      size={20}
                      strokeWidth={2.5}
                      className={`shrink-0 text-ink-strong transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 pr-8 leading-relaxed text-ink-soft">{it.text}</p>
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
