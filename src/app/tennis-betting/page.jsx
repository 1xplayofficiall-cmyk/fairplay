import { JsonLd, breadcrumbSchema, faqSchema, graph, pageMeta, webPageSchema } from "@/lib/seo";
import Accordion from "@/components/Accordion";
import Tennis3D from "@/components/Tennis3D";
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
  QuoteBand,
  Section,
  Stat,
  Ticker,
  TileGrid,
} from "@/components/ui";

export const metadata = pageMeta({
  title: "Tennis Betting Online – Explore Tennis Betting Odds & Markets on FairPlay",
  description:
    "Explore Tennis Betting Online with FairPlay — match winner, set betting, total games, handicaps, live tennis betting, and major Grand Slam tournament coverage.",
  path: "/tennis-betting",
});

const markets = [
  "Match winner",
  "Set winner",
  "Set betting",
  "Game betting",
  "Total games",
  "Total sets",
  "Game handicap",
  "Match handicap",
  "Correct score",
  "First set winner",
  "Over and under games",
  "Other available markets",
];

const oddsFactors = [
  "Player form",
  "Current rankings",
  "Recent performances",
  "Injuries and fitness",
  "Head-to-head records",
  "Court surface",
  "Tournament conditions",
  "Developments during live play",
];

const matchInformation = [
  "Player names",
  "Tournament",
  "Match date",
  "Start time",
  "Court surface",
  "Available markets",
  "Current odds",
  "Match status",
];

const liveMarkets = [
  "Match winner",
  "Set winner",
  "Next set winner",
  "Total games",
  "Game handicap",
  "Set handicap",
  "Other in-play markets",
];

const tournaments = [
  "Australian Open",
  "French Open",
  "Wimbledon",
  "US Open",
  "ATP Tour events",
  "WTA Tour events",
  "ATP Masters tournaments",
  "WTA tournaments",
  "Other professional tennis competitions",
];

const howTennisBettingWorks = [
  ["1. Choose a Tennis Match", "Browse available matches and select the fixture you want to explore."],
  [
    "2. Select a Betting Market",
    "Review the available markets, such as match winner, set betting, total games, or handicap markets.",
  ],
  ["3. Check the Odds", "Review the displayed tennis odds, market information, and applicable terms."],
  [
    "4. Review Your Selection",
    "Before confirming, check your selection, odds, stake, and any relevant conditions.",
  ],
  [
    "5. Check the Result",
    "Once the match is completed and the relevant market is settled, check the outcome through the results or account section.",
  ],
];

const guides = [
  "How tennis betting odds work",
  "Tennis betting markets explained",
  "Match winner betting",
  "Set betting",
  "Game betting",
  "Total games betting",
  "Handicap betting",
  "Correct score betting",
  "Live tennis betting",
  "Understanding tennis statistics",
  "Tennis rankings",
  "Head-to-head records",
];

const resultsInformation = [
  "Upcoming fixtures",
  "Completed matches",
  "Match scores",
  "Set scores",
  "Tournament information",
  "Player information",
  "Match status",
  "Settled market information",
];

const promotionsReview = [
  "Eligibility requirements",
  "Promotion period",
  "Minimum requirements",
  "Wagering conditions",
  "Applicable markets",
  "Expiry dates",
  "Withdrawal conditions",
  "Full promotion terms",
];

const responsibleRules = [
  "Set a budget before you start.",
  "Never chase losses.",
  "Take regular breaks.",
  "Use available betting or deposit limits.",
  "Only use money you can afford to lose.",
  "Only participate where legally permitted.",
  "Consider self-exclusion if you need a break.",
];

const faqs = [
  {
    q: "What is tennis betting?",
    a: "Tennis betting involves selecting an outcome or market related to a tennis match. Available markets can include match winner, set winner, total games, handicaps, correct score, and other match events.",
  },
  {
    q: "What are the most common tennis betting markets?",
    a: "Common markets include match winner, set betting, total games, game handicap, match handicap, correct score, and over and under games.",
  },
  {
    q: "What is live tennis betting?",
    a: "Live tennis betting allows users to access eligible markets while a tennis match is taking place. Live odds and market availability can change throughout the match.",
  },
  {
    q: "How do tennis betting odds work?",
    a: "Tennis odds indicate the potential return associated with a particular selection. Displayed odds can change before and during a match.",
  },
  {
    q: "Can tennis betting guarantee a profit?",
    a: "No. Tennis betting involves financial risk, and there is no guaranteed profit or winning outcome.",
  },
  {
    q: "Can I bet on Grand Slam tournaments?",
    a: "Where available and legally permitted, markets may be offered on Grand Slam tournaments such as the Australian Open, French Open, Wimbledon, and US Open.",
  },
  {
    q: "Does the tennis court surface affect betting?",
    a: "Court surface can be one factor when assessing a tennis match because players may have different performance records on different surfaces. However, no individual factor guarantees a particular result.",
  },
  {
    q: "Is online tennis betting legal?",
    a: "Gambling laws vary between countries and jurisdictions. Always check the laws that apply to your location before participating.",
  },
];

/* Home → this page. The trail matches the visible route line in PageHero. */
const crumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Tennis betting", path: "/tennis-betting" },
]);

export default function TennisBettingPage() {
  return (
    <main id="main" className="tennis-page">
      <JsonLd
        schema={graph(
          crumbs,
          webPageSchema({
            title: metadata.title,
            description: metadata.description,
            path: "/tennis-betting",
            breadcrumb: crumbs,
          }),
          faqSchema(faqs, "/tennis-betting"),
        )}
      />

      <PageHero
        route={<span>Tennis betting</span>}
        kicker="Explore Tennis Betting"
        title="Tennis Betting Online"
        sub="Follow major tennis tournaments, players, and matches with tennis betting online."
        lean="g"
        art={<Tennis3D />}
        actions={
          <>
            <Btn href="/#register" variant="primary" magnetic>
              Create an account
            </Btn>
            <Btn href="/cricket-betting" variant="ghost">
              Cricket betting
            </Btn>
          </>
        }
      >
        <div className="prose">
          <p>
            Follow major tennis tournaments, players, and matches with tennis betting online. Browse
            upcoming fixtures, view tennis betting odds, and explore a range of betting markets in
            one place.
          </p>
          <p>
            From match winner and set betting to total games, handicaps, and live tennis betting,
            available markets can vary depending on the tournament, match, and applicable
            regulations.
          </p>
          <p className="index">18+ / Legal age applies. Betting availability depends on your location and local laws.</p>
        </div>
      </PageHero>

      <Ticker items={tournaments} speed={44} dir="right" />

      <Section tight>
        <div className="stat-row" data-anim="stagger" data-stagger="0.09">
          <Stat value={12} label="Market types" />
          <Stat value={9} label="Major tournaments" />
          <Stat value={5} label="Steps to a selection" />
          <Stat text="18+" label="Legal age applies" />
        </div>
      </Section>

      <Section>
        <Block index="01" eyebrow="Markets" title="Tennis Betting Markets">
          <div className="prose">
            <p>
              Tennis matches can offer a range of tennis betting markets. Depending on the event,
              available options may include:
            </p>
          </div>
          <Bullets items={markets} cols={3} />
          <div className="prose">
            <p>Market availability, odds, and terms can vary between matches and competitions.</p>
          </div>
        </Block>

        <Block index="02" eyebrow="Odds" title="Tennis Betting Odds">
          <div className="prose">
            <p>
              Tennis betting odds represent the potential return associated with a particular
              selection.
            </p>
            <p className="t-g">Odds can change based on factors such as:</p>
          </div>
          <Bullets items={oddsFactors} cols={3} />
          <Callout>
            Always review the current odds, market information, and applicable terms before confirming
            a selection.
          </Callout>
        </Block>
      </Section>

      <QuoteBand wide>
        Live tennis odds can change quickly as points, games, and sets are played — markets may{" "}
        <em>open, close, or change</em> during a live match.
      </QuoteBand>

      <Section>
        <Block index="03" eyebrow="Fixtures" title="Upcoming Tennis Matches">
          <div className="prose">
            <p>Browse upcoming tennis matches and fixtures across supported tournaments and competitions.</p>
            <p className="t-g">Match information may include:</p>
          </div>
          <TileGrid items={matchInformation} compact />
          <div className="prose">
            <p>Select a fixture to view its available markets and relevant match information.</p>
          </div>
        </Block>

        <Block index="04" eyebrow="In-play" title="Live Tennis Betting">
          <div className="prose">
            <p>Follow eligible matches with live tennis betting while the match is in progress.</p>
            <p className="t-g">Depending on the event, live markets may include:</p>
          </div>
          <Bullets items={liveMarkets} cols={3} />
          <div className="grid cols-3" data-anim="stagger">
            <Feature
              icon={<Live />}
              title="Point-by-point updates"
              body="Live tennis odds can change quickly as points, games, and sets are played."
              lean="g"
            />
            <Feature
              icon={<Clock />}
              title="In-play market changes"
              body="Markets may open, close, or change during a live match."
            />
            <Feature
              icon={<Bolt />}
              title="Set and game handicaps"
              body="Follow eligible matches live as the match progresses."
            />
          </div>
        </Block>
      </Section>

      <Section band="raise">
        <Block index="05" eyebrow="Tournaments" title="Major Tennis Tournaments">
          <div className="prose">
            <p>
              Depending on availability, tennis markets may be offered across major tournaments and
              professional competitions, including:
            </p>
          </div>
          <Bullets items={tournaments} cols={3} />
          <div className="prose">
            <p>Tournament and market availability depends on the platform and applicable regulations.</p>
          </div>
        </Block>
      </Section>

      {/* Five across needs the full shell width — inside a block the cards
          would be squeezed to about half the space they need. */}
      <Section>
        <Head
          index="06"
          eyebrow="How it works"
          title="How Tennis Betting Works"
          aside="From picking a fixture to checking the settled result — the same five steps every time."
        />
        <div className="grid cols-5" data-anim="stagger">
          {howTennisBettingWorks.map(([title, body], i) => (
            <article className="card tile tile--tall" key={title}>
              <span className="tile__edge" aria-hidden="true" />
              <span className="index index--brand">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="tile__name" style={{ maxWidth: "16ch" }}>
                  {title.replace(/^\d+\.\s*/, "")}
                </h3>
                <p className="t-small" style={{ marginTop: "var(--sp-3)" }}>
                  {body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section band="raise">
        <Block index="07" eyebrow="Guides" title="Tennis Betting Guides">
          <div className="prose">
            <p>
              New to online tennis betting? Our guides can help explain common markets, betting
              terminology, and how different options work.
            </p>
            <p className="t-g">Topics may include:</p>
          </div>
          <Bullets items={guides} cols={3} />
          <div className="prose">
            <p>
              These guides are designed to explain betting concepts and should not be considered
              predictions or guarantees of future results.
            </p>
          </div>
        </Block>

        <Block index="08" eyebrow="Results" title="Tennis Results & Fixtures">
          <div className="prose">
            <p>Keep track of tennis results and upcoming fixtures across supported competitions.</p>
            <p className="t-g">Depending on the platform, information may include:</p>
          </div>
          <Bullets items={resultsInformation} cols={3} />
          <div className="prose">
            <p>Check individual event pages for the latest available match information.</p>
          </div>
        </Block>
      </Section>

      <Section>
        <Block index="09" eyebrow="Promotions" title="Tennis Betting Promotions">
          <div className="prose">
            <p>Eligible users may have access to tennis-related promotions and other offers.</p>
            <p className="t-g">Before participating in a promotion, review:</p>
          </div>
          <Bullets items={promotionsReview} cols={3} />
          <div className="prose">
            <p>
              Promotions are subject to their individual terms and may not be available in every
              location.
            </p>
          </div>
        </Block>

        <Block index="10" eyebrow="Responsible betting" title="Responsible Tennis Betting">
          <div className="prose prose--lede">
            <p>
              Tennis betting involves financial risk. There is no guaranteed outcome or guaranteed
              profit.
            </p>
          </div>
          <div className="prose">
            <p className="t-g">If you choose to participate:</p>
          </div>
          <Bullets items={responsibleRules} cols={2} />
          <div className="prose">
            <p>
              Betting should be treated as entertainment rather than a guaranteed source of income.
            </p>
          </div>
        </Block>
      </Section>

      <Section band="raise">
        <div className="split">
          <div className="stack">
            <span className="eyebrow" data-anim="fade">
              <span className="index index--brand">11</span> Answers
            </span>
            <h2 className="t-h2" data-anim="split">
              Tennis Betting FAQs
            </h2>
            <p className="t-small" style={{ maxWidth: "30ch" }}>
              Grand Slams, odds and in-play markets, explained simply.
            </p>
          </div>
          <div data-anim="fade">
            <Accordion items={faqs} idPrefix="tennis-faq" />
          </div>
        </div>
      </Section>

      <CTABand
        index="12"
        eyebrow="Play responsibly"
        title="Play Responsibly"
        body="Tennis betting is for adults of legal gambling age and involves financial risk. Understand the available markets and odds before participating, set appropriate limits, and never treat betting as a guaranteed source of income."
        actions={
          <>
            <Btn href="/#register" variant="primary" size="lg" magnetic>
              Create an account
            </Btn>
            <Btn href="/casino" variant="ghost" size="lg">
              Explore the casino
            </Btn>
          </>
        }
      />

      <Section tight>
        <Notice title="Bet responsibly">
          <p>
            Tennis betting is for adults of legal gambling age and involves financial risk.
            Understand the available markets and odds before participating, set appropriate limits,
            and never treat betting as a guaranteed source of income.
          </p>
          <div className="row" style={{ marginTop: "var(--sp-2)" }}>
            <span className="tag">
              <Shield width={12} height={12} /> Set deposit limits
            </span>
            <span className="tag">
              <Clock width={12} height={12} /> Take regular breaks
            </span>
          </div>
        </Notice>
      </Section>
    </main>
  );
}
