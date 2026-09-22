"use client";

import { useRef } from "react";
import Link from "next/link";
import { Counter, useInView } from "@/components/sections/Stats";
import { CheckDot, Emphasis } from "./shared";

const stats = [
  { value: "1200+", label: "Happy Customers" },
  { value: "5+", label: "Years of Experience" },
  { value: "10+", label: "Location Served" },
  { value: "95%", label: "Satisfaction Rate" },
];

const points = [
  "Trained, background-checked movers",
  "Premium packing & protective materials",
  "Transparent pricing — no hidden fees",
];

// Navy band: "Focused on Quality" copy + photo, with an animated stats row.
export default function HomeQuality() {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <section ref={ref} className="section-bds bg-navy">
      <div className="container-bds">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="pill-yellow">Focused on Quality</span>
            <h2 className="h2-bds mt-4 text-white">
              <Emphasis text="We take care of your belongings **like they're our own.**" className="text-brand" />
            </h2>
            <p className="mt-6 text-pretty leading-relaxed text-white/75">
              From the first box to the last, our team treats every item with the attention it deserves. Careful
              handling, quality materials, and a genuine commitment to getting your move right — that&apos;s the
              National Movers difference.
            </p>
            <ul className="mt-6 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm font-semibold text-white">
                  <CheckDot />
                  {p}
                </li>
              ))}
            </ul>
            <Link href="/quote-form" className="btn-yellow mt-8">
              Get a Free Quote
            </Link>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
            <img
              src="/wp-content/uploads/2023/10/img-02.jpg"
              alt="National Movers mover carrying a packed box"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-center">
              <p className="text-4xl font-extrabold tabular-nums text-white md:text-5xl">
                <Counter value={s.value} run={inView} />
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-brand">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
