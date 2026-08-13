import { ArtMark } from "@/components/Art";
import { Bolt, Check, Live, Phone, Shield, Wallet } from "@/components/Icons";
import {
  Block,
  Btn,
  Bullets,
  CTABand,
  Feature,
  Notice,
  PageHero,
  PhoneMock,
  QuoteBand,
  Section,
  Stat,
  TileGrid,
} from "@/components/ui";

export const metadata = {
  title: "About FairPlay",
  description:
    "Welcome to the FairPlay Official Website — a modern platform bringing Online Sports Betting and Online Casino India together in one place.",
};

const sports = [
  "Cricket Betting India",
  "Football Betting India",
  "Tennis Betting",
  "Kabaddi Betting",
  "Esports Betting",
];

const games = [
  "Aviator Game",
  "Teen Patti Online",
  "Andar Bahar Online",
  "Dragon Tiger Online",
  "Roulette Online",
  "Blackjack Online",
  "Baccarat Online",
  "Online Slots",
];

const features = [
  "Comprehensive Online Sports Betting markets",
  "Live Sports Betting on selected events",
  "Extensive selection of Online Casino Games",
  "Live Casino India with live dealer tables",
  "Simple FairPlay Register process",
  "Secure FairPlay Login",
  "FairPlay App for Android devices",
  "Quick access through FairPlay APK Download",
  "Responsive design for desktop and mobile",
  "Clean, user-friendly interface",
];

const pillars = [
  {
    icon: <Live />,
    title: "One account, two worlds",
    body: "Sportsbook markets and the full casino library sit side by side, with nothing to switch between.",
  },
  {
    icon: <Phone />,
    title: "Built for mobile first",
    body: "A responsive interface on desktop, and the FairPlay App for Android when you're away from one.",
  },
  {
    icon: <Shield />,
    title: "Straightforward accounts",
    body: "A short registration, secure login, and clear account access whenever you come back.",
    lean: "g",
  },
];

const phoneRows = [
  { label: "Cricket · Match winner", value: "Live" },
  { label: "Football · Both to score", value: "Live" },
  { label: "Live casino · Teen Patti", value: "Open" },
  { label: "Slots · Aviator", value: "Open" },
];

export default function AboutPage() {
  return (
    <main id="main" className="about-page">
      <PageHero
        route={<span>About</span>}
        kicker="Welcome to FairPlay Official Website"
        title="About FairPlay"
        sub="Your trusted destination for Online Sports Betting and Online Casino India entertainment."
        art={<ArtMark data-spin data-spin-duration="120" />}
        actions={
          <>
            <Btn href="/#register" variant="primary" magnetic>
              FairPlay Register
            </Btn>
            <Btn href="/#download" variant="ghost">
              Get the app
            </Btn>
          </>
        }
      />

      <Section tight>
        <div className="split--even grid">
          <div className="prose prose--lede" data-anim="up">
            <p>
              Welcome to the FairPlay Official Website, your trusted destination for Online Sports
              Betting and Online Casino India entertainment. FairPlay brings together a wide range of
              sports betting markets and engaging casino games on a single, easy-to-use platform,
              making it simple for users to enjoy their favourite activities from anywhere.
            </p>
          </div>
          <div className="prose prose--lede" data-anim="up" data-delay="0.08">
            <p>
              Designed with convenience and accessibility in mind, FairPlay offers a seamless
              experience across desktop and mobile devices. Whether you&apos;re following live
              sporting events or exploring exciting casino games, our platform provides a smooth,
              intuitive, and user-friendly environment.
            </p>
          </div>
        </div>
      </Section>

      <Section tight>
        <div className="stat-row" data-anim="stagger" data-stagger="0.09">
          <Stat value={5} label="Sports covered" />
          <Stat value={8} label="Popular casino games" />
          <Stat value={10} label="Platform features" />
          <Stat text="18+" label="Legal age applies" />
        </div>
      </Section>

      <Section band="raise" shell>
        <Block index="01" eyebrow="Who we are" title="A platform built around one account">
          <div className="prose">
            <p>
              FairPlay is committed to delivering a modern online entertainment platform that
              combines sports betting and casino gaming in one convenient place. Our goal is to
              provide users with an enjoyable experience through an easy-to-navigate interface,
              reliable performance, and access to a diverse selection of sports and casino games.
            </p>
            <p>
              We continuously work to improve our platform so users can easily discover new betting
              opportunities, enjoy popular casino titles, and manage their accounts with confidence.
            </p>
          </div>
          <div className="grid cols-3" data-anim="stagger" style={{ marginTop: "var(--sp-5)" }}>
            {pillars.map((pillar) => (
              <Feature key={pillar.title} {...pillar} />
            ))}
          </div>
        </Block>
      </Section>

      <Section>
        <Block index="02" eyebrow="What we offer" title="What FairPlay Offers">
          <div className="prose">
            <p>
              FairPlay brings together a comprehensive selection of sports betting markets and casino
              games, allowing users to enjoy multiple forms of entertainment without leaving the
              platform.
            </p>
          </div>

          <div className="grid cols-2" style={{ "--gap": "var(--sp-6)" }}>
            <article className="card stack" data-tilt="4">
              <span className="eyebrow eyebrow--bare index">Sportsbook</span>
              <h3 className="t-h3">Online Sports Betting</h3>
              <p className="t-small">
                As a leading Sportsbook India platform, FairPlay covers a variety of popular sports
                and major tournaments throughout the year. Users can explore betting markets across:
              </p>
              <Bullets items={sports} cols={2} />
              <p className="t-small">
                In addition to pre-match markets, Live Sports Betting lets users follow the action in
                real time with betting options available during selected events.
              </p>
            </article>

            <article className="card stack" data-tilt="4">
              <span className="eyebrow eyebrow--bare index">Casino</span>
              <h3 className="t-h3">Online Casino Games</h3>
              <p className="t-small">
                Alongside sports betting, FairPlay offers an exciting Online Casino India experience
                with a growing collection of Online Casino Games suitable for different playing
                styles. Popular games include:
              </p>
              <Bullets items={games} cols={2} />
              <p className="t-small">
                Players looking for a more immersive experience can also enjoy Live Casino India,
                where professional live dealer tables recreate the excitement of a real casino
                environment.
              </p>
            </article>
          </div>
        </Block>
      </Section>

      <Section band="raise">
        <div className="app-block">
          <div className="app-block__device" data-speed="0.94">
            <PhoneMock rows={phoneRows} cta="Open FairPlay" />
          </div>
          <div className="stack">
            <span className="eyebrow" data-anim="fade">
              <span className="index index--brand">03</span> Mobile
            </span>
            <h2 className="t-h2" data-anim="split">
              FairPlay App
            </h2>
            <div className="prose" data-anim="up">
              <p>
                The FairPlay App allows users to access sports betting and casino games wherever they
                are. Android users can install the latest version through the FairPlay APK Download
                for quick and convenient mobile access.
              </p>
              <p>
                New users can complete the FairPlay Register process in just a few simple steps,
                while existing members can securely access their accounts using FairPlay Login.
              </p>
            </div>
            <div className="row">
              <Btn href="/#download" variant="primary" magnetic>
                <Wallet width={15} height={15} /> FairPlay APK Download
              </Btn>
            </div>
          </div>
        </div>
      </Section>

      <QuoteBand wide>
        Our mission is to create a reliable platform that delivers quality sports betting and casino
        entertainment through an <em>intuitive, user-focused</em> experience.
      </QuoteBand>

      <Section>
        <Block index="04" eyebrow="Our mission" title="Built to keep improving">
          <div className="prose">
            <p>
              We strive to provide a platform that is easy to navigate, performs smoothly across
              devices, and continues to evolve to meet the needs of our users.
            </p>
          </div>
        </Block>

        <Block index="05" eyebrow="Highlights" title="Why Choose FairPlay?">
          <div className="prose">
            <p>
              FairPlay is built to offer a convenient and enjoyable experience by combining sports
              betting and casino gaming in one place. Key features include:
            </p>
          </div>
          <TileGrid items={features} cols={5} compact />
        </Block>
      </Section>

      <Section band="raise">
        <Notice title="Responsible Play">
          <p>
            FairPlay believes that sports betting and casino gaming should always be enjoyed
            responsibly. We encourage users to participate for entertainment, set personal limits,
            and make informed decisions while using the platform. Responsible play helps create a
            safer and more enjoyable experience for everyone.
          </p>
          <div className="row" style={{ marginTop: "var(--sp-2)" }}>
            <span className="tag">
              <Check width={12} height={12} /> Set your own limits
            </span>
            <span className="tag">
              <Bolt width={12} height={12} /> Take regular breaks
            </span>
          </div>
        </Notice>
      </Section>

      <CTABand
        index="06"
        eyebrow="Join us"
        title="Join FairPlay Today"
        body="Whether you're interested in Online Sports Betting, exploring Online Casino India, or experiencing Live Casino India, FairPlay brings together sports and casino entertainment in one convenient destination. Complete your FairPlay Register, access your account through FairPlay Login, download the FairPlay App with the latest FairPlay APK Download, and discover everything FairPlay has to offer."
        actions={
          <>
            <Btn href="/#register" variant="primary" size="lg" magnetic>
              FairPlay Register
            </Btn>
            <Btn href="/casino" variant="ghost" size="lg">
              Explore the casino
            </Btn>
          </>
        }
      />
    </main>
  );
}
