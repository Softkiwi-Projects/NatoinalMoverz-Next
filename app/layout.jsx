import { Nunito, Nunito_Sans, Biryani, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import FloatingQuoteTab from "@/components/layout/FloatingQuoteTab";
import QuoteJourneyProvider from "@/components/quote-journey/QuoteJourneyProvider";
import { DEFAULT_ROBOTS, buildGlobalLocalBusinessJsonLd } from "@/lib/seo";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-nunito-sans",
  display: "swap",
});
const biryani = Biryani({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-biryani",
  display: "swap",
});

// Homepage typeface (bdsmovers.co.nz look & feel).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const defaultOgImage = `${site.url}/wp-content/uploads/2025/01/40330.jpg`;

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Moving Company New Zealand`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  robots: DEFAULT_ROBOTS,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: site.favicon,
    apple: site.appleIcon,
  },
  openGraph: {
    title: `${site.name} | Moving Company New Zealand`,
    description: site.description,
    url: `${site.url}/`,
    siteName: site.name,
    locale: "en_NZ",
    type: "website",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${site.name} Moving Company New Zealand`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Moving Company New Zealand`,
    description: site.description,
    images: [defaultOgImage],
  },
};

export default function RootLayout({ children }) {
  const globalSchema = buildGlobalLocalBusinessJsonLd();

  return (
    <html
      lang="en-NZ"
      className={`${nunito.variable} ${nunitoSans.variable} ${biryani.variable} ${jakarta.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <QuoteJourneyProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
          <FloatingQuoteTab />
        </QuoteJourneyProvider>
      </body>
    </html>
  );
}
