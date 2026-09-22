"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { HomeHeading } from "./shared";

const items = [
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

const image = "/wp-content/uploads/2025/09/WhatsApp-Image-2025-06-24-at-13.01.41-e1756786317436.jpeg";

// "Why National Movers?" — sticky photo on the left, reasons list on the right
// where the open reason expands into a navy panel.
export default function HomeWhy() {
  const [open, setOpen] = useState(0);

  return (
    <section id="why-choose-us" className="section-bds bg-white">
      <div className="container-bds">
        <HomeHeading eyebrow="Why Choose Us" title="Why **National Movers?**" />

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative hidden overflow-hidden rounded-3xl bg-soft lg:sticky lg:top-28 lg:block">
            <div className="relative aspect-[4/4.5] w-full">
              <img src={image} alt="National Movers team caring for your belongings" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute bottom-5 left-5 rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy shadow-lg">
                {open >= 0 ? open + 1 : 1} of {items.length} reasons
              </div>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-slate-200">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <button
                  key={it.title}
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className={`group w-full rounded-xl px-5 py-4 text-left transition-all duration-200 ${
                    isOpen ? "my-1 bg-navy shadow-md" : "hover:bg-soft"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className={`text-sm font-bold uppercase tracking-wide ${isOpen ? "text-white" : "text-navy"}`}>
                      {it.title}
                    </span>
                    <Icon
                      name="chevron"
                      size={18}
                      strokeWidth={2.5}
                      className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-white/70" : "text-navy/60"}`}
                    />
                  </div>
                  <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="mt-3 text-sm leading-relaxed text-white/80">{it.text}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
