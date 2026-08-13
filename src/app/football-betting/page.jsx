import { JsonLd, breadcrumbSchema, faqSchema, graph, pageMeta, webPageSchema } from "@/lib/seo";
import Accordion from "@/components/Accordion";
import { ArtFootball } from "@/components/Art";
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
  title: "Football Betting Online",
  description:
    "Explore football betting online — upcoming fixtures, football odds, match result, total goals, correct score, handicap and live in-play markets.",
  path: "/football-betting",
});

const markets = [
  "Match winner",
  "Draw",
  "Both teams to score",
  "Over and under goals",
  "Correct score",
  "Double chance",
  "Handicap betting",
  "Half-time result",
  "Total goals",
  "First goal",
  "Other available match markets",
];

const oddsFactors = [
  "Team performance",
  "Player availability",
  "Injuries and team news",
  "Match conditions",
  "Market activity",
  "Events during live play",
];

const matchInformation = [
  "Home and away teams",
  "Competition",
  "Match date",
  "Kick-off time",
  "Available markets",
  "Current odds",
  "Match status",
];

const liveMarkets = [
  "Match result",
  "Next goal",
  "Total goals",
  "Both teams to score",
  "Half-time markets",
  "Other in-play markets",
];

const competitions = [
  "Premier League",
  "UEFA Champions League",
  "UEFA Europa League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "International football",
  "Major football tournaments",
  "Domestic competitions",
];

const guides = [
  "How football betting odds work",
  "Football betting markets explained",
  "Match result betting",
  "Over and under goals",
  "Both teams to score",
  "Correct score betting",
  "Handicap betting",
  "Live football betting",
  "Understanding football statistics",
];

const fixtures = [
  "Upcoming fixtures",
  "Completed matches",
  "Final scores",
  "Half-time scores",
  "Competition information",
  "Match status",
  "Settled market information",
];

const promotions = [
  "Eligibility requirements",
  "Promotion period",
  "Minimum requirements",
  "Wagering conditions",
  "Applicable markets",
  "Expiry dates",
  "Withdrawal conditions",
  "Full promotion terms",
];

const responsible = [
  "Set a budget before you start.",
  "Never chase losses.",
  "Take regular breaks.",
  "Use available betting or deposit limits.",
  "Only use money you can afford to lose.",
  "Only participate where legally permitted.",
  "Consider self-exclusion if you need a break.",
];

const howItWorks = [
  ["Choose a Match", "Browse available football matches and select the fixture you want to explore."],
  [
    "Select a Market",
    "Review the available markets, such as match result, total goals, correct score, or both teams to score.",
  ],
  ["Check the Odds", "Review the displayed football odds, market information, and applicable terms."],
  [
    "Review Your Selection",
    "Before confirming, check your selection, odds, stake, and any relevant conditions.",
  ],
  [
    "Check the Result",
    "Once the match is completed and the relevant market is settled, check the outcome through the results or account section.",
  ],
];

const faqs = [
  {
    q: "What is football betting?",
    a: "Football betting involves selecting an outcome or market related to a football match. Available markets can include match results, goals, scores, handicaps, and other match events.",
  },
  {
    q: "What are the most common football betting markets?",
    a: "Common markets include match winner, draw, both teams to score, total goals, correct score, double chance, and handicap betting.",
  },
  {
    q: "What is live football betting?",
    a: "Live football betting allows users to access eligible markets while a match is taking place. Live odds and market availability can change throughout the game.",
  },
  {
    q: "How do football betting odds work?",
    a: "Football odds indicate the potential return associated with a particular selection. Displayed odds can change before and during a match.",
  },
  {
    q: "Can football betting guarantee a profit?",
    a: "No. Football betting involves financial risk, and there is no guaranteed profit or winning outcome.",
  },
  {
    q: "Can I bet on Premier League matches?",
    a: "Where available and legally permitted, markets may be offered on Premier League matches and other supported football competitions.",
  },
  {
    q: "Is online football betting legal?",
    a: "Gambling laws vary between countries and jurisdictions. Always check the laws that apply to your location before participating.",
  },
];

/* Home → this page. The trail matches the visible route line in PageHero. */
const crumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Football betting", path: "/football-betting" },
]);

export default function FootballBettingPage() {
  return (
    <main id="main" className="football-page">
      <JsonLd
        schema={graph(
          crumbs,
          webPageSchema({
            title: metadata.title,
            description: metadata.description,
            path: "/football-betting",
            breadcrumb: crumbs,
          }),
          faqSchema(faqs, "/football-betting"),
        )}
      />

      <PageHero
        route={<span>Football betting</span>}
        kicker="Explore football betting"
        title="Football Betting Online"
        sub="Follow your favourite teams, leagues and competitions in one place."
        lean="g"
        art={<ArtFootball />}
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
            Follow your favourite teams, leagues, and competitions with football betting online.
            Browse upcoming matches, view available football odds, and explore different betting
            markets in one place.
          </p>
          <p>
            From match results and total goals to correct scores, handicaps, and live markets, the
            options available can vary depending on the match, competition, and applicable
            regulations.
          </p>
          <p className="index">18+ / Legal age applies. Betting availability depends on your location and local laws.</p>
        </div>
      </PageHero>

      <Ticker items={competitions} speed={44} dir="right" />

      <Section tight>
        <div className="stat-row" data-anim="stagger" data-stagger="0.09">
          <Stat value={11} label="Match market types" />
          <Stat value={10} label="Competitions covered" />
          <Stat value={5} label="Steps to a selection" />
          <Stat text="18+" label="Legal age applies" />
        </div>
      </Section>

      <Section>
        <Block index="01" eyebrow="Markets" title="Football Betting Markets">
          <div className="prose">
            <p>
              Football matches can offer a range of betting markets. Depending on the event, available
              options may include:
            </p>
          </div>
          <Bullets items={markets} cols={3} />
          <div className="prose">
            <p>Market availability, odds, and terms can vary between events.</p>
          </div>
        </Block>

        <Block index="02" eyebrow="Odds" title="Football Betting Odds">
          <div className="prose">
            <p>
              Football betting odds represent the potential return associated with a particular
              selection.
            </p>
            <p className="t-g">Odds may change based on factors such as:</p>
          </div>
          <Bullets items={oddsFactors} cols={3} />
          <Callout>
            Always review the current odds, market information, and applicable terms before confirming
            a selection.
          </Callout>
        </Block>
      </Section>

      <QuoteBand wide>
        Live football odds can change as the match develops — markets may{" "}
        <em>open, close or change</em> during play.
      </QuoteBand>

      <Section>
        <Block index="03" eyebrow="Fixtures" title="Upcoming Football Matches">
          <div className="prose">
            <p>Browse upcoming football fixtures across supported leagues and competitions.</p>
            <p className="t-g">Match information may include:</p>
          </div>
          <TileGrid items={matchInformation} compact />
          <div className="prose">
            <p>Select a fixture to view its available markets and relevant match information.</p>
          </div>
        </Block>

        <Block index="04" eyebrow="In-play" title="Live Football Betting">
          <div className="prose">
            <p>Follow eligible matches with live football betting while the game is in progress.</p>
            <p className="t-g">Depending on the event, live markets may include:</p>
          </div>
          <Bullets items={liveMarkets} cols={3} />
          <div className="grid cols-3" data-anim="stagger">
            <Feature
              icon={<Live />}
              title="Markets update live"
              body="In-play markets open, close and change as the match develops."
              lean="g"
            />
            <Feature
              icon={<Clock />}
              title="Half-time and full-time"
              body="Follow separate markets for each phase of the match."
            />
            <Feature
              icon={<Bolt />}
              title="Next goal, total goals"
              body="React to the state of the game rather than only the final result."
            />
          </div>
        </Block>
      </Section>

      <Section band="raise">
        <Block index="05" eyebrow="Competitions" title="Popular Football Competitions">
          <div className="prose">
            <p>
              Depending on availability, football markets may be offered across major competitions,
              including:
            </p>
          </div>
          <Bullets items={competitions} cols={3} />
          <div className="prose">
            <p>Competition and market availability depend on the platform and applicable regulations.</p>
            <p>For more focused information, users can explore dedicated competition pages where available.</p>
          </div>
        </Block>
      </Section>

      {/* Five across needs the full shell width, so this one uses the section
          head layout rather than a narrow block. */}
      <Section>
        <Head
          index="06"
          eyebrow="How it works"
          title="How Football Betting Works"
          aside="From picking a fixture to checking the settled result — the same five steps every time."
        />
        <div className="grid cols-5" data-anim="stagger">
          {howItWorks.map(([title, body], i) => (
            <article className="card tile tile--tall" key={title}>
              <span className="tile__edge" aria-hidden="true" />
              <span className="index index--brand">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="tile__name" style={{ maxWidth: "16ch" }}>
                  {title}
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
        <Block index="07" eyebrow="Guides" title="Football Betting Guides">
          <div className="prose">
            <p>
              New to online football betting? Educational guides can help you understand common
              betting markets, terminology, and how different options work.
            </p>
            <p className="t-g">Topics may include:</p>
          </div>
          <Bullets items={guides} cols={3} />
          <div className="prose">
            <p>
              These guides are intended to explain betting concepts and should not be considered
              predictions or guarantees of future results.
            </p>
          </div>
        </Block>

        <Block index="08" eyebrow="Results" title="Football Results & Fixtures">
          <div className="prose">
            <p>Keep track of football results and upcoming fixtures across supported competitions.</p>
            <p className="t-g">Depending on the platform, information may include:</p>
          </div>
          <Bullets items={fixtures} cols={3} />
          <div className="prose">
            <p>Check individual event pages for the latest available match information.</p>
          </div>
        </Block>
      </Section>

      <Section>
        <Block index="09" eyebrow="Promotions" title="Football Betting Promotions">
          <div className="prose">
            <p>Eligible users may have access to football-related promotions and other offers.</p>
            <p className="t-g">Before participating in a promotion, review:</p>
          </div>
          <Bullets items={promotions} cols={3} />
          <div className="prose">
            <p>
              Promotions are subject to their individual terms and may not be available in every
              location.
            </p>
          </div>
        </Block>

        <Block index="10" eyebrow="Responsible betting" title="Responsible Football Betting">
          <div className="prose prose--lede">
            <p>
              Football betting involves financial risk. There is no guaranteed outcome or guaranteed
              profit.
            </p>
          </div>
          <div className="prose">
            <p className="t-g">If you choose to participate:</p>
          </div>
          <Bullets items={responsible} cols={2} />
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
              Football Betting FAQs
            </h2>
            <p className="t-small" style={{ maxWidth: "30ch" }}>
              Markets, odds and live betting, explained without the jargon.
            </p>
          </div>
          <div data-anim="fade">
            <Accordion items={faqs} idPrefix="football-faq" />
          </div>
        </div>
      </Section>

      <CTABand
        index="12"
        eyebrow="Play responsibly"
        title="Play Responsibly"
        body="Football betting is for adults of legal gambling age and involves financial risk. Understand the available markets and odds before participating, set appropriate limits, and never treat betting as a guaranteed source of income."
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
            Gambling laws vary between countries and jurisdictions — always check the laws that apply
            to your location before participating. Set a budget before you start, never chase losses,
            and only use money you can afford to lose.
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
