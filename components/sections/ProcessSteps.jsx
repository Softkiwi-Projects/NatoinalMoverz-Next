import Icon from "@/components/ui/Icon";
import SectionHeading from "./SectionHeading";

const steps = [
  { icon: "clipboard", title: "Get a Free Quote", text: "Tell us about your move and receive a fast, transparent estimate." },
  { icon: "box", title: "We Pack & Protect", text: "Our crew packs, wraps, and secures everything for safe transit." },
  { icon: "truck", title: "Safe Transport", text: "Your belongings travel in our modern, fully-equipped fleet." },
  { icon: "home", title: "Settle In", text: "We unload, reassemble, and place items exactly where you want." },
];

export default function ProcessSteps() {
  return (
    <section className="section bg-brand-dark text-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="How It Works"
          title="Your Move in Four Simple Steps"
          subtitle="A clear, proven process that keeps your relocation calm and organised."
          light
          className="mb-14"
        />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
                <Icon name={s.icon} size={34} className="text-brand" />
                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-ink-strong">
                  {i + 1}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">{s.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
