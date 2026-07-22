import { Nunito, Nunito_Sans, Biryani } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import FloatingQuoteTab from "@/components/layout/FloatingQuoteTab";

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

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Moving Company New Zealand`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  icons: {
    icon: site.favicon,
    apple: site.appleIcon,
  },
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_NZ",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-NZ"
      className={`${nunito.variable} ${nunitoSans.variable} ${biryani.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
        <FloatingQuoteTab />
      </body>
    </html>
  );
}
