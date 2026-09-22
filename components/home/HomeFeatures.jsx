import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { HomeHeading } from "./shared";

const features = [
  {
    title: "Efficient and Affordable",
    text: "We understand that every move is unique, so we offer a range of services to fit your requirements.",
    icon: "box",
    href: "/quote-form",
  },
  {
    title: "Timely and Safe Delivery",
    text: "Our movers ensure that your items are picked up and delivered on time, with no delays or damages.",
    icon: "truck",
    href: "/house-moving-service",
  },
  {
    title: "Experienced Movers",
    text: "Our team of experienced movers are trained to handle every aspect of your relocation.",
    icon: "home",
    href: "/about-us",
  },
  {
    title: "Security and Safety",
    text: "Our skilled team ensures every step meets safety protocols for secure transport.",
    icon: "shield",
    href: "/about-us",
  },
];

// Four white feature cards on the soft background.
export default function HomeFeatures() {
  return (
    <section className="section-bds bg-soft">
      <div className="container-bds">
        <HomeHeading eyebrow="Why National Movers" title="Safe and **Reliable Moving.**" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group flex flex-col rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl hover:ring-brand"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-brand/25 text-navy transition-colors group-hover:bg-brand">
                <Icon name={f.icon} size={26} />
              </span>
              <h3 className="mt-5 text-lg font-extrabold text-navy">{f.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed">{f.text}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-navy underline decoration-brand decoration-2 underline-offset-4">
                Read More <Icon name="arrow" size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
