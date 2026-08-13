import Image from "next/image";
import Link from "next/link";
import { Btn } from "./ui";

const COLUMNS = [
  {
    title: "Sportsbook",
    links: [
      ["Online Sports Betting", "/#sports"],
      ["Cricket Betting India", "/cricket-betting"],
      ["Football Betting India", "/football-betting"],
      ["Tennis Betting Online", "/tennis-betting"],
      ["Basketball Betting Online", "/basketball-betting"],
      ["Betting Odds Explained", "/betting-odds"],
      ["Live Sports Betting", "/#sports"],
    ],
  },
  {
    title: "Casino",
    links: [
      ["Online Casino India", "/casino"],
      ["Live Casino Games", "/casino"],
      ["Online Slots", "/casino"],
      ["Roulette & Blackjack", "/casino"],
    ],
  },
  {
    title: "FairPlay",
    links: [
      ["About FairPlay", "/about"],
      ["Frequently Asked Questions", "/faq"],
      ["FairPlay App Download", "/#download"],
      ["FairPlay Login", "/#login"],
      ["FairPlay Register", "/#register"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div className="stack">
            <Link className="brand" href="/" aria-label="FairPlay — home">
              <Image src="/fairplay-logo.png" alt="FairPlay" width={122} height={50} quality={100} />
            </Link>
            <p className="t-small" style={{ maxWidth: "34ch" }}>
              Online sports betting and casino games on one platform — cricket, football, live
              tables and the FairPlay App for Android.
            </p>
            <div className="row">
              <Btn href="/#register" variant="primary">
                Register
              </Btn>
              <Btn href="/#download" variant="ghost">
                Get the app
              </Btn>
            </div>
          </div>

          <div className="footer-cols">
            {COLUMNS.map((column) => (
              <div className="footer-col" key={column.title}>
                <span className="footer-col__title">{column.title}</span>
                {column.links.map(([label, href]) => (
                  <Link key={label + href} href={href}>
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Two stacked copies of the same word: an outline, plus a gradient
            fill revealed through a mask that follows the pointer. */}
        <div className="footer-word" data-pointer-light>
          <span className="wordmark" data-anim="clip" aria-hidden="true">
            <span className="wordmark__outline">FAIRPLAY</span>
            <span className="wordmark__glow">FAIRPLAY</span>
          </span>
        </div>

        <div className="footer-legal">
          <span className="footer-age" aria-hidden="true">
            18+
          </span>
          <p>
            Betting and casino games involve financial risk and are entertainment, not a source of
            income. Only take part where it is legally permitted in your location, set your own
            limits, and never stake money you cannot afford to lose.
          </p>
          <p className="index">© {new Date().getFullYear()} FairPlay</p>
        </div>
      </div>
    </footer>
  );
}
