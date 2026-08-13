import { Geist, Geist_Mono, Sora, Instrument_Serif } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";

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
  title: {
    default: "FairPlay Official Website – Online Sports Betting & Online Casino in India",
    template: "%s | FairPlay",
  },
  description:
    "FairPlay brings Online Sports Betting and Online Casino India together on one platform — cricket, football, tennis, kabaddi, esports, live dealer tables and the FairPlay App.",
  applicationName: "FairPlay",
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
  robots: { index: true, follow: true },
  openGraph: {
    title: "FairPlay Official Website – Online Sports Betting & Online Casino in India",
    description: "Experience Online Sports Betting and Casino Games with FairPlay.",
    siteName: "FairPlay",
    type: "website",
    locale: "en_IN",
  },
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
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>

        <span className="grain" aria-hidden="true" />
        <ScrollProgress />
        <Preloader />
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
