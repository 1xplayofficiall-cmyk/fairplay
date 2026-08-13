import HeroStage from "@/components/HeroStage";
import Accordion from "@/components/Accordion";
import { ArtStumps, ArtPitch } from "@/components/Art";
import { Bolt, Download, Live, Phone, Shield, Wallet } from "@/components/Icons";
import {
  Btn,
  CTABand,
  Callout,
  Feature,
  Head,
  PhoneMock,
  Section,
  Stat,
  Steps,
  TextLink,
  Ticker,
  TileGrid,
} from "@/components/ui";

const sports = [
  "Cricket Betting India",
  "Online Cricket Betting",
  "Live Cricket Betting",
  "IPL Betting",
  "Football Betting India",
  "Live Football Betting",
  "Tennis Betting",
  "Kabaddi Betting",
  "Esports Betting",
];

const games = [
  { name: "Aviator Game", glyph: "✈", meta: "Fast-paced multiplier" },
  { name: "Teen Patti Online", glyph: "♠", meta: "Three-card classic" },
  { name: "Andar Bahar Online", glyph: "♦", meta: "Quick card rounds" },
  { name: "Dragon Tiger Online", glyph: "♥", meta: "Two-side showdown" },
  { name: "Roulette Online", glyph: "◉", meta: "Classic wheel table" },
  { name: "Blackjack Online", glyph: "♣", meta: "Dealer table favourite" },
  { name: "Baccarat Online", glyph: "✦", meta: "Player or banker" },
  { name: "Online Slots", glyph: "★", meta: "Instant-play reels" },
  { name: "Slot Games India", glyph: "❖", meta: "Popular reel library" },
];

const confidence = [
  {
    icon: <Shield />,
    title: "Protected access",
    body: "Sign-in and account controls stay clear and easy to find.",
  },
  {
    icon: <Wallet />,
    title: "Payment clarity",
    body: "Deposit and withdrawal guidance is presented before you play.",
  },
  {
    icon: <Phone />,
    title: "Mobile ready",
    body: "The sportsbook and casino experience adapts across compatible devices.",
  },
  {
    icon: <Live />,
    title: "Responsible by design",
    body: "18+ guidance and financial-risk reminders remain prominent.",
  },
];

const highlights = [
  "Online Sports Betting across multiple sports",
  "Live Sports Betting markets",
  "Online Casino India with live dealer games",
  "Wide selection of casino games",
  "FairPlay App for Android users",
  "Easy FairPlay Login and Registration",
  "Fast deposits and withdrawals",
  "User-friendly interface",
  "Secure account access",
];

const appSteps = [
  "Complete your FairPlay Register.",
  "Download the latest FairPlay APK.",
  "Install the application.",
  "Complete FairPlay Login.",
  "Start exploring sports betting and casino games.",
];

const payments = [
  {
    icon: <Wallet />,
    title: "UPI Betting Site support",
    body: "Deposit using the UPI apps you already use, without extra steps.",
  },
  {
    icon: <Bolt />,
    title: "Fast Deposit Betting Site",
    body: "Top up quickly so you can get to the market you came for.",
  },
  {
    icon: <Shield />,
    title: "Instant Withdrawal Betting Site",
    body: "Withdraw your balance with a clear, straightforward process.",
    lean: "g",
  },
];

const faqs = [
  {
    q: "What is FairPlay?",
    a: "FairPlay is an online platform offering sports betting and casino games, including cricket, football, live casino tables, and popular casino titles.",
  },
  {
    q: "How do I access my account?",
    a: "Existing users can complete their FairPlay Login through the website or the FairPlay App using their registered credentials.",
  },
  {
    q: "How can I download the FairPlay App?",
    a: "Android users can install the latest version using the FairPlay APK Download available through the FairPlay Download section.",
  },
  {
    q: "Which sports are available?",
    a: "FairPlay covers Cricket Betting India, Football Betting India, Tennis Betting, Kabaddi Betting, Esports Betting, and a variety of Live Sports Betting markets.",
  },
  {
    q: "What casino games can I play?",
    a: "The platform offers Online Casino Games including Aviator Game, Teen Patti Online, Andar Bahar Online, Dragon Tiger Online, Roulette Online, Blackjack Online, Baccarat Online, and Online Slots.",
  },
];

const phoneRows = [
  { label: "Cricket · Match winner", value: "Live" },
  { label: "Football · Over / Under", value: "Live" },
  { label: "Tennis · Set betting", value: "Open" },
  { label: "Live casino · Roulette", value: "Open" },
];

export default function Home() {
  return (
    <main id="main">
      {/* ======================================================= HERO ==== */}
      <HeroStage />

      {/* ===================================================== TICKER ==== */}
      <Ticker items={[...sports, ...games.map((game) => game.name)]} />

      <Section tight className="hero-intro">
        <span className="eyebrow eyebrow--o" data-anim="fade">
          One platform. Every kind of play.
        </span>
        <p className="hero-intro__copy" data-anim="up">
          Welcome to the FairPlay Official Website, where sports fans and casino players can enjoy
          a complete online gaming experience from one platform. Follow live cricket, football,
          tennis and kabaddi, or move from the match into popular casino games with one simple,
          easy-to-use account.
        </p>
      </Section>

      {/* ====================================================== STATS ==== */}
      <Section tight>
        <div className="stat-row" data-anim="stagger" data-stagger="0.09">
          <Stat value={9} label="Sports & markets" />
          <Stat value={9} label="Popular casino games" />
          <Stat value={5} label="Steps to get started" />
          <Stat text="18+" label="Legal age applies" />
        </div>

        <div className="confidence" data-anim="stagger" data-stagger="0.07">
          <div className="confidence__intro">
            <span className="eyebrow eyebrow--o">Built for confidence</span>
            <p>Clear information at every important step.</p>
          </div>
          {confidence.map((item) => (
            <article className="confidence__item" key={item.title}>
              <span className="confidence__icon" aria-hidden="true">
                {item.icon}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* =================================================== PLATFORM ==== */}
      <Section band="raise">
        <div className="split--even grid">
          <div className="prose prose--lede" data-anim="up">
            <p>
              The platform brings together Online Sports Betting, Live Sports Betting, and an
              extensive collection of Online Casino Games for players across India. From major
              cricket tournaments and football leagues to live dealer tables and classic casino
              games, FairPlay makes it simple to enjoy your favourite games{" "}
              <span className="t-editorial t-o">whenever you want</span>.
            </p>
          </div>
          <div className="prose prose--lede" data-anim="up" data-delay="0.1">
            <p>
              If you&apos;re new to the platform, you can complete your FairPlay Register in just a
              few minutes. Existing users can access their accounts through FairPlay Login, while
              Android users can install the latest FairPlay App using the FairPlay APK Download for
              quick access on mobile devices.
            </p>
            <TextLink href="/#register">Create your account</TextLink>
          </div>
        </div>
      </Section>

      {/* ===================================================== SPORTS ==== */}
      <Section id="sports">
        <Head
          index="01"
          eyebrow="Sportsbook India"
          title="Online Sports Betting"
          aside="Pre-match and in-play markets across cricket, football, tennis, kabaddi and esports — updated throughout the day."
        />

        <div className="split--even grid" style={{ marginBottom: "var(--sp-8)" }}>
          <p className="t-body" data-anim="up">
            Sports betting continues to grow in popularity as more fans enjoy following matches in
            real time. FairPlay offers betting markets across a wide range of sporting events,
            making it a preferred destination for users looking for an Online Betting Site India.
          </p>
          <p className="t-body" data-anim="up" data-delay="0.08">
            As a modern Sportsbook India, FairPlay covers both pre-match and Live Sports Betting
            markets, allowing users to follow the action as games unfold. Whether you enjoy cricket,
            football, tennis, kabaddi, or esports, you&apos;ll find multiple betting options
            throughout the day.
          </p>
        </div>

        <h3 className="eyebrow eyebrow--o" style={{ marginBottom: "var(--sp-5)" }}>
          Sports Covered on FairPlay
        </h3>
        <TileGrid items={sports} />
      </Section>

      {/* ================================================ CRICKET/FOOT ==== */}
      <div className="duo">
        <article className="duo__panel duo__panel--o">
          <ArtStumps className="duo__art duo__art--stumps" data-speed="1.08" />
          <span className="eyebrow">
            <span className="index index--brand">02</span> Cricket
          </span>
          <h2 className="t-h2" data-anim="split">
            Cricket Betting India
          </h2>
          <div className="prose" data-anim="up">
            <p>
              Cricket is one of the biggest attractions for sports fans in India, and FairPlay
              provides betting markets for domestic and international matches throughout the year.
            </p>
            <p>
              Users can enjoy Online Cricket Betting on bilateral series, ICC tournaments, T20
              leagues, and IPL Betting. During live matches, Live Cricket Betting offers changing
              odds and multiple betting markets, creating a more engaging match-day experience.
            </p>
          </div>
          <div className="duo__foot">
            <TextLink href="/cricket-betting">Explore cricket betting</TextLink>
          </div>
        </article>

        <article className="duo__panel duo__panel--g">
          <ArtPitch className="duo__art duo__art--pitch" data-speed="1.08" />
          <span className="eyebrow">
            <span className="index index--brand">03</span> Football
          </span>
          <h2 className="t-h2" data-anim="split">
            Football Betting India
          </h2>
          <div className="prose" data-anim="up">
            <p>
              Football fans can explore betting markets covering international tournaments, European
              leagues, domestic competitions, and club football.
            </p>
            <p>
              With Live Football Betting, users can place bets while matches are in progress, with
              markets updating throughout the game.
            </p>
          </div>
          <div className="duo__foot">
            <TextLink href="/football-betting">Explore football betting</TextLink>
          </div>
        </article>
      </div>

      {/* ===================================================== CASINO ==== */}
      <Section id="casino" className="section--flush-bottom">
        <Head
          index="04"
          eyebrow="Live casino"
          title="Online Casino India"
          aside="Classic tables, live dealer studios and modern casino favourites, all in the same account."
        />
        <div className="split--even grid">
          <p className="t-body" data-anim="up">
            In addition to sports betting, FairPlay offers an extensive Online Casino India
            experience featuring classic table games, live dealer games, and modern casino
            favourites.
          </p>
          <p className="t-body" data-anim="up" data-delay="0.08">
            Players looking for Casino Games Online can explore a growing library that combines
            traditional casino entertainment with live interactive gameplay.
          </p>
        </div>
      </Section>

      {/* Horizontal strip: pinned and scrubbed on desktop, swipeable on touch. */}
      <div className="section section--tight panels" data-pin-x>
        <div className="panels__track" data-pin-track>
          {games.map((game, i) => (
            <article className="panel" key={game.name}>
              <div className="panel__top">
                <span className="panel__index">{String(i + 1).padStart(2, "0")}</span>
                <span className="panel__status">Featured</span>
              </div>
              <div className="panel__visual" aria-hidden="true">
                <span className="panel__orbit panel__orbit--outer" />
                <span className="panel__orbit panel__orbit--inner" />
                <span className="panel__glyph">{game.glyph}</span>
                <span className="panel__pulse" />
              </div>
              <div className="panel__body">
                <span className="tag">Casino</span>
                <h3 className="panel__name">{game.name}</h3>
                <p className="panel__meta">{game.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Section tight>
        <Callout>
          For players who enjoy real-time gaming, Live Casino India features professional dealers,
          high-quality streaming, and familiar table games, bringing the atmosphere of a casino
          directly to your device.
        </Callout>
        <div className="row" style={{ marginTop: "var(--sp-5)" }} data-anim="fade">
          <TextLink href="/casino">See all casino games</TextLink>
        </div>
      </Section>

      {/* ======================================================== APP ==== */}
      <Section id="download" band="raise">
        <div className="app-block">
          <div className="app-block__device" data-speed="0.94">
            <PhoneMock rows={phoneRows} cta="Open FairPlay" />
          </div>

          <div className="stack">
            <span className="eyebrow" data-anim="fade">
              <span className="index index--brand">05</span> Mobile
            </span>
            <h2 className="t-h2" data-anim="split">
              FairPlay App Download
            </h2>
            <p className="t-body" data-anim="up">
              The FairPlay App allows users to enjoy sports betting and casino games from anywhere.
              Android users can install the latest version through the FairPlay APK Download and
              enjoy a fast, mobile-friendly experience.
            </p>
            <p className="eyebrow eyebrow--bare">Getting started is simple</p>
            <Steps items={appSteps} />
            <div className="row">
              <Btn href="/#download" variant="primary" magnetic>
                <Download width={15} height={15} /> FairPlay APK Download
              </Btn>
            </div>
          </div>
        </div>
      </Section>

      {/* =================================================== PAYMENTS ==== */}
      <Section>
        <Head
          index="06"
          eyebrow="Payments"
          title="Fast Deposits & Secure Withdrawals"
          aside="FairPlay supports convenient payment methods designed to make transactions simple and efficient."
        />
        <div className="grid cols-3" data-anim="stagger">
          {payments.map((item) => (
            <Feature key={item.title} {...item} />
          ))}
        </div>
        <p className="t-body" style={{ marginTop: "var(--sp-6)" }} data-anim="up">
          These payment options help players manage deposits and withdrawals quickly while focusing
          on their gaming experience.
        </p>
      </Section>

      {/* ================================================ WHY FAIRPLAY ==== */}
      <Section band="raise">
        <Head
          index="07"
          eyebrow="Highlights"
          title="Why Choose FairPlay?"
          aside="FairPlay combines sports betting, casino entertainment, and mobile access into a single platform designed for convenience."
        />
        <TileGrid items={highlights} compact />
      </Section>

      {/* ==================================================== ACCOUNT ==== */}
      <Section id="login" tight>
        <div className="grid cols-2">
          <article className="card" data-anim="up" data-tilt="4">
            <span className="eyebrow eyebrow--bare index">New here</span>
            <h3 className="t-h3" style={{ margin: "var(--sp-3) 0 var(--sp-4)" }}>
              FairPlay Register
            </h3>
            <p className="t-small" style={{ marginBottom: "var(--sp-5)" }}>
              Create an account in a few minutes and get access to sports markets and the full
              casino library.
            </p>
            <Btn href="/#register" variant="primary">
              Register
            </Btn>
          </article>

          <article className="card" data-anim="up" data-delay="0.08" data-tilt="4">
            <span className="eyebrow eyebrow--bare index">Returning</span>
            <h3 className="t-h3" style={{ margin: "var(--sp-3) 0 var(--sp-4)" }}>
              FairPlay Login
            </h3>
            <p className="t-small" style={{ marginBottom: "var(--sp-5)" }}>
              Already registered? Sign in through the website or the FairPlay App with your existing
              credentials.
            </p>
            <Btn href="/#login" variant="ghost">
              <Live width={15} height={15} /> Login
            </Btn>
          </article>
        </div>
      </Section>

      {/* ======================================================== FAQ ==== */}
      <Section>
        <div className="split">
          <div className="stack">
            <span className="eyebrow" data-anim="fade">
              <span className="index index--brand">08</span> Answers
            </span>
            <h2 className="t-h2" data-anim="split">
              Frequently Asked Questions
            </h2>
            <p className="t-small" style={{ maxWidth: "30ch" }}>
              Still unsure about something? Start with the basics below.
            </p>
          </div>
          <div data-anim="fade">
            <Accordion items={faqs} idPrefix="home-faq" />
          </div>
        </div>
      </Section>

      {/* ======================================================== CTA ==== */}
      <CTABand
        id="register"
        index="09"
        eyebrow="Start here"
        title="Start Your FairPlay Journey"
        body="Whether you're looking for Online Sports Betting, Sportsbook India, Online Casino India, or the latest FairPlay App, FairPlay brings together sports, casino games, and mobile access in one convenient platform. Complete your FairPlay Register, access your account through FairPlay Login, download the latest FairPlay APK, and explore everything the platform has to offer."
        actions={
          <>
            <Btn href="/#register" variant="primary" size="lg" magnetic>
              FairPlay Register
            </Btn>
            <Btn href="/#download" variant="ghost" size="lg">
              Download the app
            </Btn>
          </>
        }
      />

      {/* Responsible-gambling notice, before the footer. */}
      <Section tight>
        <div className="notice" data-anim="up">
          <span className="notice__mark">18+</span>
          <div className="notice__body">
            <h3 className="t-h4">Play responsibly</h3>
            <p>
              Sports betting and casino games involve financial risk and should be treated as
              entertainment rather than a source of income. Only take part where it is legally
              permitted in your location, understand the rules before you play, set your own limits,
              and never stake money you cannot afford to lose.
            </p>
          </div>
        </div>
      </Section>
    </main>
  );
}
