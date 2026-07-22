import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

// Full-width call-to-action band, reused at the bottom of most pages.
export default function CTA({
  title = "Planning a move? Let's make it easy.",
  subtitle = "Get a free, no-obligation quote today and let our experts handle the heavy lifting.",
}) {
  return (
    <section className="section">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-brand-dark px-6 py-14 text-center text-white md:px-16">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url(/wp-content/uploads/2023/10/bg-new-05.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold md:text-4xl">{title}</h2>
            <p className="mt-4 text-white/80">{subtitle}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/quote-form" withArrow>
                Get a Free Quote
              </Button>
              <a href={site.phone.href} className="btn-outline">
                <Icon name="phone" size={18} /> {site.phone.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
