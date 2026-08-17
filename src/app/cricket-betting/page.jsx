import { JsonLd, breadcrumbSchema, faqSchema, graph, pageMeta, webPageSchema } from "@/lib/seo";
import Accordion from "@/components/Accordion";
import Cricket3D from "@/components/Cricket3D";
import { Bolt, Clock, Live, Shield } from "@/components/Icons";
import {
  Block,
  Btn,
  Bullets,
  CTABand,
  Callout,
  Feature,
  Head,
  Notice,
  PageHero,
  PhoneMock,
  QuoteBand,
  Section,
  Stat,
  Steps,
  Ticker,
  TileGrid,
} from "@/components/ui";

export const metadata = pageMeta({
  title: "Cricket Betting India – Online Cricket Betting & Live Cricket Betting on FairPlay",
  description:
    "Experience Cricket Betting India with FairPlay — pre-match and Live Cricket Betting markets across IPL, ICC events, T20 leagues, ODIs and Test cricket.",
  path: "/cricket-betting",
});

const highlights = [
  "Comprehensive Online Cricket Betting Site",
  "Real-time Live Cricket Betting",
  "Competitive Cricket Betting Odds",
  "Wide range of Cricket Betting Markets",
  "Mobile-friendly Cricket Betting App",
  "Quick registration and secure account access",
  "Support for domestic and international cricket events",
];

const competitions = [
  "International Cricket",
  "Domestic Cricket",
  "ICC Events",
  "T20 Leagues",
  "Test Matches",
  "One Day Internationals",
];

const liveMarkets = [
  "Match Winner",
  "Next Over Runs",
  "Total Match Runs",
  "Top Batter",
  "Top Bowler",
  "Team Totals",
  "Fall of Next Wicket",
  "Session Betting",
  "Innings Winner",
];

const iplMarkets = [
  "Match Winner",
  "Toss Winner",
  "Top Batter",
  "Top Bowler",
  "Team Totals",
  "Player Performance",
  "Most Sixes",
  "Most Fours",
  "Total Boundaries",
];

const internationalCoverage = [
  "ICC Events",
  "Bilateral Series",
  "World Cups",
  "Champions Trophy",
  "Test Series",
  "ODI Series",
  "T20 International Series",
];

const odiMarkets = [
  "Match Winner",
  "Team Runs",
  "Top Batter",
  "Top Bowler",
  "Total Boundaries",
  "Player Performance",
];

const testMarkets = [
  "Match Winner",
  "Draw",
  "Highest Opening Partnership",
  "First Innings Lead",
  "Top Batter",
  "Top Bowler",
];

const appAccess = [
  "Online Cricket Betting",
  "Live Cricket Betting",
  "IPL Betting",
  "Cricket Betting Markets",
  "Account management",
  "Match schedules",
  "Live updates",
];

const tips = [
  "Follow recent team and player form.",
  "Check pitch and weather conditions before the match.",
  "Compare available Cricket Betting Odds.",
  "Understand different betting markets before placing selections.",
  "Set a budget and stick to it.",
  "Use Live Cricket Betting only when comfortable with fast-changing markets.",
  "Enjoy betting responsibly and for entertainment purposes.",
];

const steps = [
  "Create your account.",
  "Complete the registration process.",
  "Log in securely.",
  "Explore Cricket Betting India markets.",
  "Choose your preferred match and betting market.",
  "Follow the action with Live Cricket Betting.",
];

const marketCards = [
  ["Match Winner", "Predict which team will win the match."],
  ["Top Batter", "Choose the player expected to score the most runs."],
  ["Top Bowler", "Select the bowler likely to take the most wickets."],
  ["Total Runs", "Predict whether the total match score will finish over or under a specified line."],
  ["Team Runs", "Bet on the total runs scored by an individual team."],
  [
    "Player Performance",
    "Explore markets based on batting, bowling, wickets, boundaries, or other player statistics.",
  ],
];

const faqs = [
  {
    q: "What is Cricket Betting India?",
    a: "Cricket Betting India refers to online betting markets available for domestic and international cricket matches, including Test, ODI, T20, and franchise competitions.",
  },
  {
    q: "What is Online Cricket Betting?",
    a: "Online Cricket Betting allows users to explore betting markets before a match begins using an online platform.",
  },
  {
    q: "What is Live Cricket Betting?",
    a: "Live Cricket Betting enables users to place selections while a match is in progress, with odds and markets updating in real time.",
  },
  {
    q: "Which tournaments are available?",
    a: "FairPlay covers ICC Events, T20 Leagues, Domestic Cricket, International Cricket, One Day Internationals, Test Matches, and other major competitions.",
  },
  {
    q: "Can I use the Cricket Betting App?",
    a: "Yes. The Cricket Betting App provides convenient access to betting markets, live matches, and account features on compatible Android devices.",
  },
];

const phoneRows = [
  { label: "Match winner", value: "Live" },
  { label: "Next over runs", value: "Live" },
  { label: "Top batter", value: "Open" },
  { label: "Fall of next wicket", value: "Live" },
];

/* Home → this page. The trail matches the visible route line in PageHero. */
const crumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Cricket betting", path: "/cricket-betting" },
]);

export default function CricketBettingPage() {
  return (
    <main id="main" className="cricket-page">
      <JsonLd
        schema={graph(
          crumbs,
          webPageSchema({
            title: metadata.title,
            description: metadata.description,
            path: "/cricket-betting",
            breadcrumb: crumbs,
          }),
          faqSchema(faqs, "/cricket-betting"),
        )}
      />

      <PageHero
        route={<span>Cricket betting</span>}
        kicker="Cricket Betting India"
        title="Online Cricket Betting & Live Cricket Betting on FairPlay"
        sub="Experience Cricket Betting India with FairPlay."
        art={<Cricket3D />}
        actions={
          <>
            <Btn href="/#register" variant="primary" magnetic>
              Start betting
            </Btn>
            <Btn href="/#download" variant="ghost">
              Cricket Betting App
            </Btn>
          </>
        }
      />

      <Ticker items={[...competitions, ...iplMarkets]} speed={42} />

      <Section tight>
        <div className="stat-row" data-anim="stagger" data-stagger="0.09">
          <Stat value={9} label="Live market types" />
          <Stat value={6} label="Competition formats" />
          <Stat value={6} label="Steps to get started" />
          <Stat text="18+" label="Legal age applies" />
        </div>
      </Section>

      <Section>
        <div className="split--even grid">
          <div className="prose prose--lede" data-anim="up">
            <p>
              Cricket is more than just a sport in India — it&apos;s a passion that brings millions of
              fans together. From thrilling international tournaments to domestic competitions and
              franchise leagues, every match creates excitement for cricket enthusiasts. At FairPlay,
              users can explore a comprehensive Cricket Betting India experience with access to a wide
              range of betting markets, live betting opportunities, and a mobile-friendly platform.
            </p>
          </div>
          <div className="prose prose--lede" data-anim="up" data-delay="0.08">
            <p>
              Whether you&apos;re interested in Online Cricket Betting before the first ball is bowled
              or prefer the excitement of Live Cricket Betting as the match unfolds, FairPlay provides
              a convenient platform to follow your favourite teams and tournaments. Designed for
              beginners and experienced users alike, the platform offers a simple interface, multiple
              betting options, and quick account access across desktop and Android devices.
            </p>
          </div>
        </div>
      </Section>

      <Section band="raise">
        <Block index="01" eyebrow="Why FairPlay" title="Why Choose FairPlay for Cricket Betting India?">
          <div className="prose">
            <p>
              FairPlay combines cricket betting with a user-friendly experience, making it easy to
              explore betting markets across major cricket events. As a trusted Cricket Betting Site,
              the platform is designed to help users access matches, compare available markets, and
              enjoy seamless navigation.
            </p>
            <p className="t-o">Key highlights include:</p>
          </div>
          <Bullets items={highlights} cols={2} />
          <div className="prose">
            <p>
              Whether you&apos;re following a Test match, a T20 league, or a One Day International,
              FairPlay brings cricket betting together in one convenient destination.
            </p>
          </div>
        </Block>
      </Section>

      <Section>
        <Block index="02" eyebrow="Pre-match" title="Online Cricket Betting">
          <div className="prose">
            <p>
              Online Cricket Betting allows users to explore betting markets before a match begins.
              Pre-match betting provides time to review teams, player form, match conditions, and
              available odds before making a selection.
            </p>
            <p>FairPlay offers betting opportunities across a variety of competitions, including:</p>
          </div>
          <TileGrid items={competitions} compact />
          <div className="prose">
            <p>
              With betting markets available throughout the cricket calendar, users can enjoy action
              across tournaments and bilateral series all year round.
            </p>
          </div>
        </Block>

        <Block index="03" eyebrow="In-play" title="Live Cricket Betting">
          <div className="prose">
            <p>
              For users who enjoy the excitement of real-time action, Live Cricket Betting offers
              continuously updated betting markets while a match is in progress.
            </p>
            <p>
              As momentum shifts during the game, new betting opportunities become available, allowing
              users to react to changing match situations.
            </p>
            <p className="t-o">Popular Live Cricket Match Betting markets may include:</p>
          </div>
          <Bullets items={liveMarkets} cols={4} />
          <Callout>
            Live betting creates an engaging experience by allowing users to follow every over while
            exploring updated markets throughout the match.
          </Callout>
        </Block>
      </Section>

      {/* A market showcase reads better three across, so it takes the full
          shell width instead of sitting in a narrow block. */}
      <Section band="raise">
        <Head
          index="04"
          eyebrow="Markets"
          title="Cricket Betting Markets"
          aside="FairPlay offers a diverse selection of Cricket Betting Markets, giving users multiple ways to engage with every match."
        />
        <div className="grid cols-3" data-anim="stagger">
          {marketCards.map(([title, body], i) => (
            <article className="card tile tile--tall" key={title}>
              <span className="tile__edge" aria-hidden="true" />
              <span className="index index--brand">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="tile__name" style={{ maxWidth: "18ch" }}>
                  {title}
                </h3>
                <p className="t-small" style={{ marginTop: "var(--sp-3)" }}>
                  {body}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="t-body" style={{ marginTop: "var(--sp-6)" }} data-anim="up">
          The availability of betting markets may vary depending on the competition and match format.
        </p>
      </Section>

      <QuoteBand wide band="sunken">
        Odds reflect the potential return on a successful selection — and the{" "}
        <em>probability</em> assigned to an outcome.
      </QuoteBand>

      <Section>
        <Block index="05" eyebrow="Odds" title="Cricket Betting Odds">
          <div className="prose">
            <p>
              Understanding Cricket Betting Odds is an important part of online betting. Odds reflect
              the potential return on a successful selection while also indicating the probability
              assigned to an outcome.
            </p>
            <p>
              FairPlay updates odds throughout both pre-match and live events, allowing users to
              compare available options before placing their selections.
            </p>
            <p>
              Whether following international cricket or domestic leagues, updated odds help users
              make informed decisions based on the latest match developments.
            </p>
          </div>
          <div className="grid cols-3" data-anim="stagger">
            <Feature
              icon={<Clock />}
              title="Updated pre-match"
              body="Odds move as team news and conditions become clear before the toss."
            />
            <Feature
              icon={<Live />}
              title="Updated in-play"
              body="Markets refresh over by over as momentum shifts during the match."
            />
            <Feature
              icon={<Bolt />}
              title="Compare before you back"
              body="Review the available options and terms before confirming a selection."
              lean="g"
            />
          </div>
        </Block>
      </Section>

      <Section band="raise">
        <Block index="06" eyebrow="IPL" title="IPL Betting">
          <div className="prose">
            <p>
              The Indian Premier League remains one of the most popular cricket competitions in the
              world, attracting millions of fans every season.
            </p>
            <p>
              FairPlay offers dedicated IPL Betting markets throughout the tournament, covering league
              matches, playoffs, and the final.
            </p>
            <p>
              Users can also enjoy Live IPL Betting, where markets continue to update throughout each
              match.
            </p>
            <p className="t-o">Popular IPL Cricket Betting markets include:</p>
          </div>
          <Bullets items={iplMarkets} cols={4} />
          <div className="prose">
            <p>
              Whether following your favourite franchise or every game of the tournament, FairPlay
              provides betting opportunities across the complete IPL season.
            </p>
          </div>
        </Block>
      </Section>

      {/* Format pairs, as two full-bleed panels. */}
      <div className="duo">
        <article className="duo__panel duo__panel--o">
          <span className="eyebrow">
            <span className="index index--brand">07</span> International
          </span>
          <h2 className="t-h2" data-anim="split">
            International Cricket Betting
          </h2>
          <div className="prose" data-anim="up">
            <p>
              Cricket fans can also explore International Cricket Betting across the world&apos;s
              biggest competitions.
            </p>
            <p className="t-o">Coverage includes:</p>
          </div>
          <Bullets items={internationalCoverage} cols={2} />
          <div className="duo__foot">
            <p className="t-small">
              International fixtures provide betting opportunities throughout the year across
              different playing conditions and formats.
            </p>
          </div>
        </article>

        <article className="duo__panel duo__panel--g">
          <span className="eyebrow">
            <span className="index index--brand">08</span> T20
          </span>
          <h2 className="t-h2" data-anim="split">
            T20 Cricket Betting
          </h2>
          <div className="prose" data-anim="up">
            <p>Fast-paced and action-packed, T20 cricket creates exciting betting opportunities.</p>
            <p className="t-g">FairPlay offers dedicated T20 Cricket Betting markets covering:</p>
          </div>
          <Bullets
            items={["International T20 Matches", "Franchise T20 Leagues", "Domestic T20 Competitions"]}
            cols={2}
          />
          <div className="duo__foot">
            <p className="t-small">
              The shorter format provides frequent betting opportunities through changing match
              situations and live betting markets.
            </p>
          </div>
        </article>
      </div>

      <div className="duo">
        <article className="duo__panel duo__panel--g">
          <span className="eyebrow">
            <span className="index index--brand">09</span> ODI
          </span>
          <h2 className="t-h2" data-anim="split">
            ODI Cricket Betting
          </h2>
          <div className="prose" data-anim="up">
            <p>One Day Internationals continue to be one of cricket&apos;s most popular formats.</p>
            <p className="t-g">With ODI Cricket Betting, users can explore markets across:</p>
          </div>
          <Bullets items={odiMarkets} cols={2} />
          <div className="duo__foot">
            <p className="t-small">
              ODI matches combine strategy and excitement, making them ideal for both pre-match and
              live betting.
            </p>
          </div>
        </article>

        <article className="duo__panel duo__panel--o">
          <span className="eyebrow">
            <span className="index index--brand">10</span> Test
          </span>
          <h2 className="t-h2" data-anim="split">
            Test Cricket Betting
          </h2>
          <div className="prose" data-anim="up">
            <p>
              Traditional cricket fans can enjoy Test Cricket Betting throughout the international
              calendar. Five-day matches create unique betting opportunities that extend beyond simply
              predicting the winner.
            </p>
            <p className="t-o">Popular Test betting markets include:</p>
          </div>
          <Bullets items={testMarkets} cols={2} />
          <div className="duo__foot">
            <p className="t-small">
              Test cricket rewards patience, strategy, and careful analysis, making it a favourite
              format for many experienced cricket followers.
            </p>
          </div>
        </article>
      </div>

      <Section band="raise">
        <div className="app-block">
          <div className="app-block__device" data-speed="0.94">
            <PhoneMock rows={phoneRows} title="Cricket" cta="View markets" />
          </div>
          <div className="stack">
            <span className="eyebrow" data-anim="fade">
              <span className="index index--brand">11</span> Mobile
            </span>
            <h2 className="t-h2" data-anim="split">
              Cricket Betting App
            </h2>
            <div className="prose" data-anim="up">
              <p>The Cricket Betting App makes it easy to stay connected wherever you are.</p>
              <p className="t-o">Designed for Android users, the app provides access to:</p>
            </div>
            <Bullets items={appAccess} cols={2} />
            <p className="t-small">
              The mobile-friendly interface allows users to follow cricket action from virtually
              anywhere using a compatible Android device.
            </p>
            <div className="row">
              <Btn href="/#download" variant="primary" magnetic>
                FairPlay APK Download
              </Btn>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <Block index="12" eyebrow="The platform" title="Best Cricket Betting Site India">
          <div className="prose">
            <p>
              FairPlay aims to provide a reliable experience for users looking for a modern Best
              Cricket Betting Site India. With a combination of comprehensive betting markets, live
              betting options, intuitive navigation, and mobile accessibility, the platform offers
              everything cricket fans need in one place.
            </p>
            <p>
              Whether you&apos;re following domestic competitions or international tournaments,
              FairPlay helps you stay connected throughout the cricket season.
            </p>
          </div>
        </Block>

        <Block index="13" eyebrow="Tips" title="Tips for Online Cricket Betting">
          <div className="prose">
            <p>
              While every user has their own approach, these general Cricket Betting Tips can help
              improve your overall experience:
            </p>
          </div>
          <Bullets items={tips} cols={2} />
        </Block>

        <Block index="14" eyebrow="Get started" title="How to Get Started">
          <div className="prose">
            <p>Getting started with cricket betting on FairPlay is simple:</p>
          </div>
          <Steps items={steps} rail />
        </Block>
      </Section>

      <Section band="raise">
        <div className="split">
          <div className="stack">
            <span className="eyebrow" data-anim="fade">
              <span className="index index--brand">15</span> Answers
            </span>
            <h2 className="t-h2" data-anim="split">
              Frequently Asked Questions
            </h2>
            <p className="t-small" style={{ maxWidth: "30ch" }}>
              Cricket betting terms, formats and markets, explained plainly.
            </p>
          </div>
          <div data-anim="fade">
            <Accordion items={faqs} idPrefix="cricket-faq" />
          </div>
        </div>
      </Section>

      <CTABand
        index="16"
        eyebrow="Start here"
        title="Start Your Cricket Betting Journey"
        body="Whether you're following Cricket Betting India, enjoying Online Cricket Betting, exploring Live Cricket Betting, or looking for comprehensive coverage of IPL Betting, International Cricket Betting, ODI Cricket Betting, T20 Cricket Betting, and Test Cricket Betting, FairPlay brings everything together on one easy-to-use platform. Create your account today, explore a wide range of Cricket Betting Markets, stay updated with competitive Cricket Betting Odds, and enjoy a seamless cricket betting experience throughout the season."
        actions={
          <>
            <Btn href="/#register" variant="primary" size="lg" magnetic>
              Create your account
            </Btn>
            <Btn href="/football-betting" variant="ghost" size="lg">
              Football betting
            </Btn>
          </>
        }
      />

      <Section tight>
        <Notice title="Bet responsibly">
          <p>
            Cricket betting involves financial risk and there is no guaranteed outcome. Set a budget
            before you start, never chase losses, only take part where it is legally permitted in your
            location, and treat betting as entertainment rather than a source of income.
          </p>
          <div className="row" style={{ marginTop: "var(--sp-2)" }}>
            <span className="tag">
              <Shield width={12} height={12} /> Set a budget
            </span>
            <span className="tag">
              <Clock width={12} height={12} /> Take breaks
            </span>
          </div>
        </Notice>
      </Section>
    </main>
  );
}
