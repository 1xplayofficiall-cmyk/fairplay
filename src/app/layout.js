import { Geist, Geist_Mono, Sora, Instrument_Serif } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import { JsonLd, SITE, graph, organizationSchema, websiteSchema } from "@/lib/seo";

/* Three voices, one system: Sora sets the display tone, Geist carries the
   body, Geist Mono handles labels and figures, and a single italic serif is
   held back for accents. */
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

/* Runs before first paint. It is the only thing that lets the site hide
   content for animation without risking a blank page: no JS or reduced motion
   means no `.motion` class, which means nothing is ever hidden.
   Because it writes to <html> ahead of hydration, <html> is marked
   suppressHydrationWarning. */
const MOTION_FLAG = `try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion')}}catch(e){}`;

export const metadata = {
  /* Everything URL-shaped below — canonicals, og:url, og:image — is written as
     a relative path and resolved against this. Without it Next cannot build
     absolute URLs and silently drops them. */
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: "%s | FairPlay",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "FairPlay",
    "Online Sports Betting",
    "Online Casino India",
    "Cricket Betting India",
    "Live Sports Betting",
    "FairPlay App",
    "FairPlay Login",
    "FairPlay APK Download",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: "/",
    siteName: SITE.name,
    type: "website",
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  category: "Sports betting",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${sora.variable} ${geistSans.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG }} />
        {/* Site-wide nodes, emitted once. Every page's own @graph references
            these two by @id rather than repeating them. */}
        <JsonLd schema={graph(organizationSchema(), websiteSchema())} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>

        <span className="grain" aria-hidden="true" />
        <ScrollProgress />
        
        <Header />

        {/* ScrollSmoother drives this pair. Both exist unconditionally so the
            page still renders correctly when JS never runs. */}
        <div id="smooth-wrapper">
          <div id="smooth-content">
            {children}
            <Footer />
          </div>
        </div>

        <MotionProvider />
      </body>
    </html>
  );
}
