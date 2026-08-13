import { JsonLd, breadcrumbSchema, faqSchema, graph, pageMeta, webPageSchema } from "@/lib/seo";
import Accordion from "@/components/Accordion";
import { ArtBasketball } from "@/components/Art";
import { Bolt, Clock, Live, Shield } from "@/components/Icons";
import {
  Block,
  Btn,
  Bullets,
  CTABand,
  Callout,
  Feature,
  Notice,
  PageHero,
  QuoteBand,
  Section,
  Stat,
  Steps,
  Ticker,
  TileGrid,
} from "@/components/ui";

export const metadata = pageMeta({
  title: "Basketball Betting Online | Odds, Markets & Live Betting",
  description:
    "Explore basketball betting online with basketball odds, live betting, moneyline, point spreads, totals, player props and more. Check available basketball markets.",
  path: "/basketball-betting",
});

const markets = [
  "Moneyline",
  "Point spread",
  "Over/under and totals",
  "Handicap betting",
  "Player props",
  "Team props",
  "First-half markets",
  "Quarter betting",
  "Futures",
  "Parlay betting",
  "Live or in-play markets",
];

const oddsFactors = [
  "Team form",
  "Player availability",
  "Injuries",
  "Recent results",
  "Home-court advantage",
  "Other market information",
];

const popularOptions = [
  [
    "Basketball Moneyline Betting",
    "Moneyline betting is based on the team you expect to win the game. Unlike spread betting, the focus is on the final winner rather than the winning margin.",
  ],
  [
    "Basketball Point Spread Betting",
    "Point spread betting uses a handicap or points margin between the two teams. The selected team must cover the listed spread for the bet to be successful.",
  ],
  [
    "Basketball Over/Under Betting",
    "Over/under betting, also known as totals betting, focuses on the combined points scored by both teams. You choose whether the final score will be above or below the listed total.",
  ],
  [
    "Basketball Handicap Betting",
    "Basketball handicap betting gives one team a points advantage or disadvantage before the market is settled. The exact handicap and settlement rules depend on the selected market.",
  ],
  [
    "Basketball Player Props",
    "Player props focus on individual player performances. Depending on the game, available options may include points, rebounds, assists, three-pointers, or other statistics.",
  ],
  [
    "Basketball Futures Betting",
    "Futures markets cover outcomes that are determined later in a competition. Examples can include championship winners, tournament outcomes, or other season-long markets.",
  ],
];

const competitions = ["NBA", "WNBA", "NCAA basketball", "EuroLeague"];

const howToBetSteps = [
  "Choose a basketball game or competition.",
  "Review the available betting markets.",
  "Check the current basketball odds and lines.",
  "Select the market you want to bet on.",
  "Review the selection, odds, and applicable terms.",
  "Confirm your wager if you are eligible to participate.",
];

const faqs = [
  {
    q: "What is basketball betting?",
    a: "Basketball betting involves placing a wager on an outcome or statistic connected to a basketball game or competition. Markets can include moneyline, point spread, totals, player props, and futures.",
  },
  {
    q: "How do basketball betting odds work?",
    a: "Basketball betting odds indicate the potential return associated with a selected outcome. The odds can change before a game and during live betting as market conditions change.",
  },
  {
    q: "What is basketball point spread betting?",
    a: "Point spread betting involves a points margin between two teams. Instead of simply selecting the winner, the wager is settled against the listed spread.",
  },
  {
    q: "What is basketball over/under betting?",
    a: "Over/under betting involves predicting whether the combined score of both teams will be above or below a specified total.",
  },
  {
    q: "What is basketball moneyline betting?",
    a: "Moneyline betting involves selecting the team you expect to win the game, without applying a point spread to the final result.",
  },
  {
    q: "Can I bet on basketball live?",
    a: "Where legally available, live basketball betting allows you to place wagers while a game is in progress. Live odds and markets can change rapidly during the game.",
  },
  {
    q: "Which basketball leagues can I bet on?",
    a: "Depending on the sportsbook and your location, available competitions may include the NBA, WNBA, NCAA basketball, EuroLeague, and other domestic or international leagues.",
  },
  {
    q: "Are basketball betting tips guaranteed?",
    a: "No. Basketball tips, predictions, statistics, and analysis cannot guarantee a particular outcome. Betting always involves risk.",
  },
  {
    q: "Is basketball betting legal?",
    a: "Betting laws vary by country and jurisdiction. Check the regulations that apply to your location and use only betting services that are legally available to you.",
  },
];

/* Home → this page. The trail matches the visible route line in PageHero. */
const crumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Basketball betting", path: "/basketball-betting" },
]);

export default function BasketballBettingPage() {
  return (
    <main id="main">
      <JsonLd
        schema={graph(
          crumbs,
          webPageSchema({
            title: metadata.title,
            description: metadata.description,
            path: "/basketball-betting",
            breadcrumb: crumbs,
          }),
          faqSchema(faqs, "/basketball-betting"),
        )}
      />

      <PageHero
        route={<span>Basketball betting</span>}
        kicker="Basketball betting online"
        title="Basketball Betting Online"
        sub="Access a wide range of markets across popular basketball games and competitions."
        lean="o"
        art={<ArtBasketball />}
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
            Basketball betting online gives you access to a wide range of markets across popular
            basketball games and competitions. From pre-match basketball betting odds to fast-paced
            live betting, you can choose markets based on the game, league, and available options.
          </p>
          <p>
            Follow major competitions such as the NBA, WNBA, NCAA basketball, and EuroLeague, and check
            available markets including moneyline, point spread, totals, player props, handicaps, and
            futures.
          </p>
          <p className="index">
            Always review the current odds, market rules, and applicable terms before placing a bet.
          </p>
        </div>
      </PageHero>

      <Ticker items={competitions} speed={44} dir="right" />

      <Section tight>
        <div className="stat-row" data-anim="stagger" data-stagger="0.09">
          <Stat value={11} label="Market types" />
          <Stat value={4} label="Major leagues" />
          <Stat value={6} label="Steps to bet" />
          <Stat text="18+" label="Legal age applies" />
        </div>
      </Section>

      <Section>
        <Block index="01" eyebrow="Markets" title="Basketball Betting Markets">
          <div className="prose">
            <p>
              Different basketball betting markets let you wager on different aspects of a game. The
              markets available can vary depending on the competition, event, and sportsbook.
            </p>
            <p className="t-g">Popular options include:</p>
          </div>
          <Bullets items={markets} cols={3} />
        </Block>

        <Block index="02" eyebrow="Odds" title="Basketball Betting Odds">
          <div className="prose">
            <p>
              Basketball betting odds represent the potential return associated with a selected
              outcome. They can change before a game begins and may move quickly once live betting
              starts.
            </p>
            <p>
              Basketball odds and betting lines can be influenced by factors such as team form,
              player availability, injuries, recent results, home-court advantage, and other market
              information.
            </p>
          </div>
          <TileGrid items={oddsFactors} compact />
          <Callout>
            Before placing a wager, check the latest odds and make sure you understand the market and
            settlement conditions.
          </Callout>
        </Block>
      </Section>

      <QuoteBand wide>
        Live odds and available markets may move frequently — game score, time remaining, possession,
        and player performance can affect live basketball lines.
      </QuoteBand>

      <Section>
        <Block index="03" eyebrow="Options" title="Popular Basketball Betting Options">
          <div className="grid cols-3" data-anim="stagger">
            {popularOptions.map(([title, body], i) => (
              <article className="card tile tile--compact" key={title}>
                <span className="tile__edge" aria-hidden="true" />
                <span className="index index--brand">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="tile__name" style={{ maxWidth: "22ch" }}>
                    {title}
                  </h3>
                  <p className="t-small" style={{ marginTop: "var(--sp-3)" }}>
                    {body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Block>

        <Block index="04" eyebrow="In-play" title="Live Basketball Betting">
          <div className="prose">
            <p>
              Live basketball betting lets you place wagers while a game is already underway, where this
              feature is legally available.
            </p>
            <p>
              Live markets may include moneyline, point spread, totals, player props, and other in-play
              options. Because basketball games can change quickly, live odds and available markets
              may also move frequently.
            </p>
            <p>
              Game score, time remaining, possession, player performance, and other developments can
              affect live basketball betting lines.
            </p>
          </div>
          <div className="grid cols-3" data-anim="stagger">
            <Feature
              icon={<Live />}
              title="Fast in-play shifts"
              body="Live markets move as possession, time remaining, and scores update."
              lean="g"
            />
            <Feature
              icon={<Clock />}
              title="Quarter and half markets"
              body="Follow separate live lines for individual quarters and halves."
            />
            <Feature
              icon={<Bolt />}
              title="In-game props"
              body="React to momentum changes and live player performances."
            />
          </div>
          <Callout>
            Check the current market and applicable rules before confirming an in-play wager.
          </Callout>
        </Block>
      </Section>

      <Section band="raise">
        <Block index="05" eyebrow="Leagues" title="Major Basketball Leagues & Competitions">
          <div className="prose">
            <h3>NBA Betting</h3>
            <p>
              NBA betting covers available markets for National Basketball Association games.
              Depending on the event, you may find moneyline, point spread, totals, player props,
              futures, and live betting options.
            </p>
            <p>
              NBA betting odds can change as game-day information develops, including changes in team
              news and player availability.
            </p>

            <h3>WNBA Betting</h3>
            <p>
              WNBA betting provides markets for Women&apos;s National Basketball Association games.
              Available options may include game winners, spreads, totals, player props, futures, and
              live betting.
            </p>
            <p>Market availability can differ between games and sportsbooks.</p>

            <h3>NCAA Basketball Betting</h3>
            <p>
              NCAA basketball betting covers college basketball games and competitions. Common markets
              can include moneyline, point spread, totals, futures, and selected player or team
              markets.
            </p>
            <p>Always check the specific event for currently available betting options.</p>

            <h3>EuroLeague Betting</h3>
            <p>
              EuroLeague betting covers games from one of Europe&apos;s leading basketball
              competitions. Depending on the event, markets can include match winners, handicaps,
              totals, and live basketball betting.
            </p>
            <p>Odds and market availability may vary by game and sportsbook.</p>
          </div>
        </Block>
      </Section>

      <Section>
        <Block index="06" eyebrow="Guide" title="How to Bet on Basketball">
          <div className="prose">
            <p>
              If you&apos;re new to basketball betting, understanding the market and odds is a good
              place to start.
            </p>
            <p className="t-g">A typical basketball betting process is:</p>
          </div>
          <Steps items={howToBetSteps} rail />
          <div className="prose">
            <p>
              Betting availability, minimum age requirements, and legal restrictions depend on your
              location.
            </p>
          </div>
        </Block>

        <Block index="07" eyebrow="Tips" title="Basketball Betting Tips">
          <div className="prose">
            <p>
              Before placing a wager, you may want to consider relevant information such as recent
              team performances, player availability, injuries, schedules, head-to-head records, and
              statistics.
            </p>
            <p>
              Basketball predictions and betting tips cannot guarantee a particular result. Sports
              outcomes are uncertain, and past performance does not guarantee future results.
            </p>
          </div>
          <Callout>
            Set a budget for betting and avoid wagering more than you can afford to lose.
          </Callout>
        </Block>
      </Section>

      <Section band="raise">
        <Block index="08" eyebrow="Popularity" title="Why Basketball Is Popular for Betting">
          <div className="prose">
            <p>
              Basketball offers a variety of betting opportunities because games contain frequent
              scoring and changing game situations.
            </p>
            <p>
              Pre-match markets allow you to assess a game before tip-off, while live betting provides
              markets that can change throughout the match. Different options such as spreads, totals,
              player props, and moneyline markets also allow bettors to focus on different aspects of a
              game.
            </p>
            <p>
              The exact markets and odds available depend on the competition, event, sportsbook, and
              applicable regulations.
            </p>
          </div>
        </Block>

        <div className="split">
          <div className="stack">
            <span className="eyebrow" data-anim="fade">
              <span className="index index--brand">09</span> Answers
            </span>
            <h2 className="t-h2" data-anim="split">
              Basketball Betting FAQs
            </h2>
            <p className="t-small" style={{ maxWidth: "30ch" }}>
              Spreads, totals, moneyline, and live basketball betting rules explained.
            </p>
          </div>
          <div data-anim="fade">
            <Accordion items={faqs} idPrefix="basketball-faq" />
          </div>
        </div>
      </Section>

      <Section>
        <Block index="10" eyebrow="Responsible betting" title="Responsible Basketball Betting">
          <div className="prose prose--lede">
            <p>
              Betting should be treated as entertainment and not as a guaranteed source of income. Set
              personal limits, understand the risks, and never wager more than you can afford to
              lose.
            </p>
          </div>
          <div className="prose">
            <p>
              If gambling stops being enjoyable or begins affecting your finances or everyday life,
              consider using available responsible gambling and self-exclusion tools.
            </p>
          </div>
        </Block>
      </Section>

      <CTABand
        index="11"
        eyebrow="Play responsibly"
        title="Play Responsibly"
        body="Betting should be treated as entertainment and not as a guaranteed source of income. Set personal limits, understand the risks, and never wager more than you can afford to lose."
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
            18+ / Legal age applies. Betting availability depends on your location and local laws.
            Betting should be treated as entertainment and not as a guaranteed source of income. Set
            personal limits, understand the risks, and never wager more than you can afford to lose.
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
