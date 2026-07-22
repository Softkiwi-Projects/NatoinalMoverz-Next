import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-7xl font-extrabold text-brand">404</p>
        <h1 className="mt-4 text-3xl font-extrabold text-ink-strong">Page not found</h1>
        <p className="mt-3 max-w-md text-ink-soft">
          The page you're looking for may have moved. Let's get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/">Back to Home</Button>
          <Link href="/quote-form" className="btn-outline">
            Get a Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
