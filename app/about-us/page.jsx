import Link from "next/link";
import QuoteForm from "@/components/sections/QuoteForm";
import GoogleReviews from "@/components/sections/GoogleReviews";
import ServicesGrid from "@/components/sections/ServicesGrid";
import Stats from "@/components/sections/Stats";
import WhyNationalMovers from "@/components/sections/WhyNationalMovers";
import ContactStrip from "@/components/sections/ContactStrip";
import Icon from "@/components/ui/Icon";
import { getPageContent, getBlocks } from "@/lib/content";
import { services } from "@/data/services";

export function generateMetadata() {
  const page = getPageContent("about-us");
  return {
    title: page?.title || "About Us",
    description: page?.description,
    alternates: { canonical: "/about-us" },
  };
}

// "What We Do" checklist — from the original About page's two lists.
const whatWeDo = [
  { label: "House Moving", href: "/house-moving-service" },
  { label: "Office Relocations", href: "/office-relocation-service" },
  { label: "Long Distance Move", href: "/quote-form" },
  { label: "2 Man With A Van", href: "/two-men-and-a-van-tauranga" },
  { label: "Piano Movers", href: "/piano-moving-service" },
  { label: "Winz Moving Quote", href: "/quote-form" },
];

export default function AboutPage() {
  const blocks = getBlocks("about-us");
  // Intro paragraph(s) following "We are a New Zealand based top Mover company".
  const introParas = extractParas(blocks, "We are a New Zealand");

  return (
    <>
      {/* HERO — yellow card + multi-step quote form (same treatment as service pages) */}
      <section
        id="quote"
        className="relative scroll-mt-24 bg-cover bg-center"
        style={{ backgroundImage: "url(/wp-content/uploads/2025/01/2149312723.jpg)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/75 via-brand-dark/25 to-brand-dark/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/40 via-transparent to-brand-dark/40" />
        <div className="container-page relative py-12 md:py-16">
          <div className="mx-auto max-w-3xl rounded-3xl bg-brand px-6 py-9 text-center shadow-card md:px-12 md:py-11">
            <span className="mb-2 block text-sm font-extrabold uppercase tracking-[0.2em] text-ink-strong/70">
              National Movers
            </span>
            <h1 className="font-heading text-3xl font-normal text-ink-strong md:text-4xl">
              Your Trusted <strong className="font-extrabold">Moving</strong> Partner
            </h1>
            <h2 className="mb-5 mt-6 text-2xl font-extrabold text-ink-strong">Get a Free Quote</h2>
            <QuoteForm variant="yellow" />
          </div>
        </div>
      </section>

      {/* WHO WE ARE + WHAT WE DO */}
      <section className="section">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">National Movers</span>
            <h2 className="font-heading text-3xl font-normal leading-tight text-ink-strong md:text-[2.6rem]">
              We are a <strong className="font-extrabold">New Zealand</strong> based top{" "}
              <strong className="font-extrabold">Mover</strong> company
            </h2>
            <div className="mt-6 space-y-5 leading-relaxed text-ink-soft">
              {introParas.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8 overflow-hidden rounded-3xl shadow-soft">
              <img
                src="/wp-content/uploads/2023/10/img-01-1.jpg"
                alt="Happy customers with their packed boxes"
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="overflow-hidden rounded-3xl shadow-card">
              <img
                src="/wp-content/uploads/2023/10/img-05.jpg"
                alt="Couple planning their move with National Movers"
                className="w-full object-cover"
              />
            </div>
            <div className="rounded-3xl border border-surface-border bg-white p-8 shadow-soft">
              <h3 className="mb-5 text-xl font-extrabold text-ink-strong">What We Do</h3>
              <ul className="grid gap-3.5 sm:grid-cols-2">
                {whatWeDo.map((w) => (
                  <li key={w.label}>
                    <Link
                      href={w.href}
                      className="group flex items-center gap-3 font-semibold text-ink transition-colors hover:text-ink-strong"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-ink-strong">
                        <Icon name="check" size={14} strokeWidth={3.5} />
                      </span>
                      <span className="group-hover:underline">{w.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT TESTIMONIALS — heading + Google reviews strip */}
      <section className="pt-4">
        <div className="container-page mb-2 text-center">
          <span className="mb-4 inline-block text-sm font-extrabold uppercase tracking-[0.2em] text-ink-strong">
            What Our Customers Are Saying
          </span>
          <h2 className="mb-10 text-3xl font-normal text-ink-strong md:text-[2.5rem]">
            Client <strong className="font-extrabold">Testimonials</strong>
          </h2>
        </div>
        <GoogleReviews />
      </section>

      {/* OUR QUALITY SERVICES — existing grid */}
      <ServicesGrid services={services} />

      {/* GET A FREE QUOTE TODAY — yellow panel + full form */}
      <section className="section pt-16">
        <div className="container-page grid overflow-hidden rounded-3xl shadow-card lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          <div className="flex flex-col justify-center bg-brand p-10 md:p-12">
            <span className="mb-3 block text-sm font-extrabold uppercase tracking-[0.2em] text-ink-strong/70">
              National Movers
            </span>
            <h2 className="font-heading text-3xl font-normal leading-tight text-ink-strong md:text-[2.5rem]">
              Get a <strong className="font-extrabold">free Quote</strong> Today.
            </h2>
            <p className="mt-5 font-medium leading-relaxed text-ink-strong/75">
              Tell us a few details about your move and our team will come back with a fast,
              no-obligation quote — local or nationwide.
            </p>
          </div>
          <div className="bg-white p-8 md:p-10">
            <QuoteForm variant="panel" />
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS AT A GLANCE */}
      <Stats
        variant="light"
        title={
          <>
            Thousands of Happy <strong className="font-extrabold">Clients</strong>, Years of{" "}
            <strong className="font-extrabold">Expertise</strong>, and{" "}
            <strong className="font-extrabold">Successful</strong> Moves Completed
          </>
        }
        stats={[
          { value: "1,200+", label: "Moves Completed", icon: "truck" },
          { value: "95%", label: "Happy Customers", icon: "box" },
          { value: "5+", label: "Years of Experience", icon: "star" },
        ]}
      />

      {/* WHY NATIONAL MOVERS — image + accordion */}
      <WhyNationalMovers />

      {/* CONTACT STRIP */}
      <ContactStrip />
    </>
  );
}

// Paragraphs that immediately follow the heading containing `headingStart`.
function extractParas(blocks, headingStart) {
  const i = blocks.findIndex(
    (b) => (b.type === "h2" || b.type === "h3") && b.text?.startsWith(headingStart),
  );
  if (i === -1)
    return [
      "With experience in the industry, our house moving experts know how to handle your valuable possessions with the utmost care and respect. From packing and loading to transportation and unpacking, we've got you covered every step of the way.",
    ];
  const paras = [];
  for (let j = i + 1; j < blocks.length && blocks[j].type === "p"; j += 1) {
    paras.push(blocks[j].text);
  }
  return paras.length
    ? paras
    : ["With experience in the industry, our house moving experts know how to handle your valuable possessions with the utmost care and respect."];
}
