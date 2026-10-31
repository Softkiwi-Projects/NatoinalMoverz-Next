import { Suspense } from "react";
import ThankYouContent from "@/components/thank-you/ThankYouContent";
import { site } from "@/data/site";
import { DEFAULT_ROBOTS, getCanonicalUrl } from "@/lib/seo";

export const metadata = {
  title: `Quote Received — Thank You | ${site.name}`,
  description: `Thank you for requesting a moving quote from ${site.name}. Our team will review your details and be in touch within 2 hours.`,
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: getCanonicalUrl("thank-you"),
  },
  openGraph: {
    title: `Quote Received — Thank You | ${site.name}`,
    description: `Thank you for requesting a moving quote from ${site.name}. Our team will be in touch shortly.`,
    url: `${site.url}/thank-you`,
    siteName: site.name,
    locale: "en_NZ",
    type: "website",
  },
};

function ThankYouFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#0b1f4d] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        <p className="text-sm font-semibold tracking-wider uppercase text-slate-300">
          Loading confirmation...
        </p>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <main>
      <Suspense fallback={<ThankYouFallback />}>
        <ThankYouContent />
      </Suspense>
    </main>
  );
}
