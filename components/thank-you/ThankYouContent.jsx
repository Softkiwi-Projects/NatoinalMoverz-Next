"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { site } from "@/data/site";
import ConfettiEffect from "./ConfettiEffect";

const TIMELINE_STEPS = [
  {
    step: "01",
    title: "Quote Received",
    subtitle: "Complete",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    description:
      "Your move details have been sent directly to our dispatch team and logged in our system.",
    icon: (
      <svg className="size-6 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "We Review & Respond",
    subtitle: "In Progress",
    badgeColor: "bg-brand/20 text-navy border-brand/40",
    description:
      "Our team calculates the optimal truck size, timing, and rate. Expect a call or email within 2 hours during business hours.",
    icon: (
      <svg className="size-6 text-brand-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Your Move is Booked",
    subtitle: "Next Step",
    badgeColor: "bg-slate-100 text-slate-600 border-slate-200",
    description:
      "Once you approve your quote, we confirm your booking date, assign your professional movers, and take care of the rest.",
    icon: (
      <svg className="size-6 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
];

const TRUST_POINTS = [
  {
    title: "Fully Insured",
    description: "Every move covered. Your belongings are in safe, experienced hands from pickup to delivery.",
    icon: (
      <svg className="size-6 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "1,000+ Moves Completed",
    description: "From studios to 5-bedroom family homes, office relocations, and nationwide long-haul moves.",
    icon: (
      <svg className="size-6 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: "5-Star Rated Movers",
    description: "Consistently rated 5 stars for care, friendly communication, and punctual delivery across New Zealand.",
    icon: (
      <svg className="size-6 text-brand" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

const REVIEWS = [
  {
    quote:
      "Absolutely faultless from start to finish. The team arrived right on time, were very careful with our furniture, and made moving stress-free.",
    name: "Sarah M.",
    location: "Tauranga",
  },
  {
    quote:
      "National Movers made our Wellington to Auckland move seamless. Great communication, zero damages, and very reasonable transparent pricing.",
    name: "James K.",
    location: "Hamilton",
  },
  {
    quote:
      "Friendly, punctual, and super efficient crew. Handled our heavy piano and fragile boxes with complete ease. Highly recommended!",
    name: "Priya T.",
    location: "Auckland",
  },
];

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const rawName = searchParams.get("name") || "";
  const category = searchParams.get("category") || "";

  // Clean customer name if passed
  const customerName = rawName.trim();

  return (
    <div className="home-bds relative min-h-screen bg-slate-50 text-slate-800">
      <ConfettiEffect />

      {/* ============================================================== */}
      {/* HERO SECTION — BDS Theme Navy with Brand Yellow Highlights   */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-[#0b1f4d] py-16 text-white sm:py-24 lg:py-28">
        {/* Ambient background glow orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 size-96 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 size-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
        </div>

        <div className="container-bds relative mx-auto max-w-4xl text-center">
          {/* Animated Success Checkmark Icon */}
          <div className="relative mx-auto mb-6 flex size-24 items-center justify-center">
            {/* Pulsing outer aura ring */}
            <span className="absolute inset-0 animate-ping rounded-full bg-brand/20 opacity-75 [animation-duration:2.5s]" />
            <span className="absolute inset-1 rounded-full bg-brand/30 blur-sm" />
            
            {/* Solid icon disc */}
            <div className="relative flex size-20 items-center justify-center rounded-full bg-brand text-navy shadow-xl shadow-brand/20 transition-transform duration-300 hover:scale-105">
              <svg
                className="size-10 text-navy drop-shadow-sm"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" className="animate-[stroke_0.6s_ease-out_forwards]" />
              </svg>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand">
              Quote Request Received
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Thank you{customerName ? `, ${customerName}` : ""} — we&apos;ve got your details!
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-slate-200 sm:text-lg lg:text-xl">
            Our team is reviewing your {category ? `${category.toLowerCase()} ` : ""}move requirements. We will be in touch with a fair, accurate quote{" "}
            <strong className="font-bold text-brand">within 2 hours</strong> during business hours.
          </p>

          {/* Quick Contact Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
            <a
              href={site.phone.href}
              className="btn-yellow group w-full sm:w-auto shadow-xl hover:-translate-y-0.5"
            >
              <svg className="size-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.6 9.8a16 16 0 0 0 6 6l1.4-1.5a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
              </svg>
              <span>Call {site.phone.label}</span>
            </a>

            <a
              href={`mailto:${site.email}`}
              className="btn-glass group w-full sm:w-auto hover:-translate-y-0.5"
            >
              <svg className="size-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>{site.email}</span>
            </a>
          </div>

          {/* Business hours reassurance */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-300">
            <svg className="size-4 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Operating hours: {site.hours}</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 2: WHAT HAPPENS NEXT (3-Step Animated Timeline)       */}
      {/* ============================================================== */}
      <section className="section-bds relative bg-white border-b border-slate-200/80">
        <div className="container-bds">
          <div className="mx-auto max-w-2xl text-center">
            <span className="pill-yellow mb-3 inline-block">Simple & Transparent</span>
            <h2 className="h2-bds">What happens next?</h2>
            <p className="mt-3 text-pretty text-slate-600 sm:text-lg">
              Here is exactly what you can expect from our team while we prepare your moving plan.
            </p>
          </div>

          <div className="relative mt-12 grid gap-8 md:grid-cols-3">
            {TIMELINE_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/60 hover:shadow-xl"
              >
                {/* Step indicator header */}
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 shadow-inner group-hover:bg-brand/20 transition-colors">
                    {step.icon}
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${step.badgeColor}`}>
                    {step.subtitle}
                  </span>
                </div>

                <div className="mt-6">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    Step {step.step}
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-navy">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>

                {/* Progress bar line accent */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Phase {idx + 1} of 3</span>
                  <span className="font-semibold text-navy">
                    {idx === 0 ? "Done" : idx === 1 ? "Active" : "Upcoming"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 3: TRUST SIGNALS & WHY CHOOSE US                     */}
      {/* ============================================================== */}
      <section className="section-bds bg-slate-50">
        <div className="container-bds">
          <div className="mx-auto max-w-2xl text-center">
            <span className="pill-yellow mb-3 inline-block">Peace of Mind</span>
            <h2 className="h2-bds">Why New Zealand trusts National Movers</h2>
            <p className="mt-3 text-pretty text-slate-600 sm:text-lg">
              We treat your furniture and household items as if they were our own.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST_POINTS.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-brand/50 hover:shadow-md"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy text-brand shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 4: SOCIAL PROOF / CUSTOMER TESTIMONIALS               */}
      {/* ============================================================== */}
      <section className="section-bds bg-white border-t border-slate-200/80">
        <div className="container-bds">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-1 text-star">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="size-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3 6.5 7 .8-5.2 4.7 1.4 6.9L12 17.5 5.8 21l1.4-6.9L2 9.3l7-.8L12 2z" />
                </svg>
              ))}
            </div>
            <h2 className="h2-bds mt-3">What our customers say</h2>
            <p className="mt-3 text-pretty text-slate-600 sm:text-lg">
              Real reviews from Kiwis who moved with National Movers.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {REVIEWS.map((review, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-brand/40 hover:bg-white hover:shadow-lg"
              >
                <div>
                  <div className="flex gap-1 text-star">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <svg key={idx} className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2l3 6.5 7 .8-5.2 4.7 1.4 6.9L12 17.5 5.8 21l1.4-6.9L2 9.3l7-.8L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="mt-4 text-sm leading-relaxed text-slate-700 italic">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-slate-200/70 pt-4">
                  <div className="flex size-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-navy">{review.name}</div>
                    <div className="text-xs text-slate-500">{review.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 5: FINAL CTA / NAVIGATION HELP                        */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-navy py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-brand" />
          <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-brand" />
        </div>

        <div className="container-bds relative mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
            Got questions while you wait?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-slate-300">
            Our friendly customer support team is ready to answer any questions about packing, scheduling, or special handling.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="btn-yellow shadow-lg shadow-brand/20 hover:-translate-y-0.5"
            >
              <span>Back to Home</span>
            </Link>

            <a
              href={site.phone.href}
              className="btn-glass hover:-translate-y-0.5"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.6 9.8a16 16 0 0 0 6 6l1.4-1.5a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
              </svg>
              <span>Call Us: {site.phone.label}</span>
            </a>

            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <span>Contact Page</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
