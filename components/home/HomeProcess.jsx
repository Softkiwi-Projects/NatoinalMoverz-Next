import Link from "next/link";
import { HomeHeading } from "./shared";

const steps = [
  { title: "Get a Free Quote", text: "Tell us about your move and receive a fast, transparent estimate." },
  { title: "We Pack & Protect", text: "Our crew packs, wraps, and secures everything for safe transit." },
  { title: "Safe Transport", text: "Your belongings travel in our modern, fully-equipped fleet." },
  { title: "Settle In", text: "We unload, reassemble, and place items exactly where you want." },
];

// Numbered yellow circles joined by a hairline on desktop.
export default function HomeProcess() {
  return (
    <section className="section-bds bg-white">
      <div className="container-bds">
        <HomeHeading
          eyebrow="How It Works"
          title="Your Move in **Four Simple Steps**"
          subtitle="A clear, proven process that keeps your relocation calm and organised."
        />

        <div className="relative">
          <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-slate-200 lg:block" aria-hidden="true" />
          <ol className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="relative flex flex-col items-center text-center">
                <span className="relative z-10 flex size-14 items-center justify-center rounded-full border-4 border-brand/30 bg-brand text-lg font-extrabold text-navy shadow-sm">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-balance text-base font-bold text-navy">{s.title}</h3>
                <p className="mt-2 max-w-[16rem] text-sm leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 text-center">
          <Link href="/quote-form" className="btn-yellow">
            Get a Free Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
