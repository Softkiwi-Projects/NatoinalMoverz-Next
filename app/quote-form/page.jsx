import QuoteForm from "@/components/sections/QuoteForm";
import ServicesGrid from "@/components/sections/ServicesGrid";
import GoogleReviews from "@/components/sections/GoogleReviews";
import LatestNewsBand from "@/components/sections/LatestNewsBand";
import Stats from "@/components/sections/Stats";
import ContactStrip from "@/components/sections/ContactStrip";
import { getPageContent } from "@/lib/content";
import { services } from "@/data/services";

export function generateMetadata() {
  const page = getPageContent("quote-form");
  return {
    title: page?.title || "Get a Free Quote",
    description: page?.description || "Request a fast, free moving quote from National Movers.",
    alternates: { canonical: "/quote-form" },
  };
}

export default function QuoteFormPage() {
  return (
    <>
      {/* HERO — form on light grey + delivery-man figure */}
      <section className="bg-surface-light">
        <div className="container-page grid items-center gap-8 pt-12 md:pt-16 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="pb-12 md:pb-16">
            <span className="mb-3 block text-sm font-extrabold uppercase tracking-[0.2em] text-ink-strong">
              Request a Free Quote
            </span>
            <h1 className="mb-8 font-heading text-3xl font-extrabold leading-tight text-ink-strong md:text-[2.7rem]">
              Getting Movers and Packers Quotes is Easy
            </h1>
            <QuoteForm variant="light" />
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
