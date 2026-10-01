import QuoteForm from "@/components/sections/QuoteForm";
import ServicesGrid from "@/components/sections/ServicesGrid";
import GoogleReviews from "@/components/sections/GoogleReviews";
import LatestNewsBand from "@/components/sections/LatestNewsBand";
import Stats from "@/components/sections/Stats";
import ContactStrip from "@/components/sections/ContactStrip";
import { getPageContent } from "@/lib/content";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { cleanTitle, getCanonicalUrl, DEFAULT_ROBOTS, buildBreadcrumbJsonLd } from "@/lib/seo";

export function generateMetadata() {
  const page = getPageContent("quote-form");
  const title = cleanTitle(page?.title, "Get a Free Quote");
  const description =
    page?.description ||
    "Request a fast, free moving quote from National Movers. Affordable household, office, and furniture relocations across New Zealand.";
  const canonicalUrl = getCanonicalUrl("quote-form");
  const ogImage = `${site.url}/wp-content/uploads/2018/12/Quote-img.png`;

  return {
    title,
    description,
    robots: DEFAULT_ROBOTS,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: canonicalUrl,
      siteName: site.name,
      locale: "en_NZ",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 800,
          height: 600,
          alt: "Get a Free Moving Quote from National Movers",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [ogImage],
    },
  };
}

export default function QuoteFormPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Get a Quote", item: "/quote-form/" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {/* HERO — form on light grey + delivery-man figure */}
      <section className="bg-surface-light">
        <div className="container-page grid items-center gap-8 pt-12 md:pt-16 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="pb-12 md:pb-16">
            <span className="quote-stagger-subtitle mb-3 block text-sm font-extrabold uppercase tracking-[0.2em] text-ink-strong">
              Request a Free Quote
            </span>
            <h1 className="quote-stagger-title mb-4 font-heading text-3xl font-extrabold leading-tight text-ink-strong md:text-[2.7rem]">
              Get Your Free Quote
            </h1>
            <p className="quote-stagger-subtitle mb-8 text-base text-ink-soft max-w-xl">
              Tell us about your upcoming move and our team will get in touch shortly with a tailored estimate.
            </p>
            <div className="quote-stagger-form">
              <QuoteForm variant="light" />
            </div>
          </div>

          {/* Figure — flush with the section's bottom edge */}
          <div className="hidden self-end lg:block">
            <img
              src="/wp-content/uploads/2018/12/Quote-img.png"
              alt="National Movers delivery professional with packed boxes"
              className="mx-auto h-[440px] w-auto object-contain object-bottom"
            />
          </div>
        </div>
      </section>

      {/* WHY NATIONAL MOVERS — services grid */}
      <ServicesGrid
        services={services}
        eyebrow="Why National Movers"
        title="We give you complete **better services** ."
      />

      {/* TESTIMONIALS */}
      <section className="pt-16">
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

      {/* LATEST NEWS BAND */}
      <LatestNewsBand />

      {/* ACHIEVEMENTS */}
      <Stats
        variant="light"
        eyebrow=""
        title=""
        stats={[
          { value: "1,200+", label: "Moves Completed", icon: "truck" },
          { value: "95%", label: "Happy Customers", icon: "box" },
          { value: "5+", label: "Years of Experience", icon: "star" },
          { value: "287", label: "Happy Clients", icon: "users" },
        ]}
      />

      {/* CONTACT STRIP */}
      <ContactStrip />
    </>
  );
}
