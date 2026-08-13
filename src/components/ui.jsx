/* ============================================================================
   UI PRIMITIVES
   ----------------------------------------------------------------------------
   Server components, all of them. Motion is declared with data attributes and
   applied by MotionProvider, which is what keeps these free of "use client".
   ========================================================================== */

import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "./Icons";

const cx = (...parts) => parts.filter(Boolean).join(" ");

/* ------------------------------------------------------------------ button */
export function Btn({ href, children, variant = "primary", size, magnetic, className, ...rest }) {
  const cls = cx("btn", `btn--${variant}`, size === "lg" && "btn--lg", className);
  const inner = <span className="btn__label">{children}</span>;
  const props = { className: cls, ...(magnetic ? { "data-magnetic": magnetic === true ? 0.22 : magnetic } : {}), ...rest };

  return href ? (
    <Link href={href} {...props}>
      {inner}
    </Link>
  ) : (
    <button type="button" {...props}>
      {inner}
    </button>
  );
}

/* ----------------------------------------------------------------- section */
export function Section({ id, children, className, tight, band, shell = true, ...rest }) {
  return (
    <section
      id={id}
      className={cx("section", tight && "section--tight", band && `band band--${band}`, className)}
      {...rest}
    >
      {shell ? <div className="shell">{children}</div> : children}
    </section>
  );
}

/* Index + title over a hairline, with an optional right-hand note. */
export function Head({ index, title, aside, eyebrow, children }) {
  return (
    <div className="head">
      <div className="head__title">
        <span className="eyebrow">
          {index ? <span className="index index--brand">{index}</span> : null}
          {eyebrow}
        </span>
        <h2 className="t-h2" data-anim="split">
          {title}
        </h2>
        {children}
      </div>
      {aside ? <p className="head__aside">{aside}</p> : null}
    </div>
  );
}

/* -------------------------------------------------------------------- tile */
export function Tile({ index, name, note, compact, tall, className }) {
  return (
    <article className={cx("card tile", compact && "tile--compact", tall && "tile--tall", className)}>
      <span className="tile__edge" aria-hidden="true" />
      <div className="tile__top">
        <span className="index">{index}</span>
        <ArrowUpRight className="tile__arrow" width={16} height={16} />
      </div>
      <div>
        <h3 className="tile__name">{name}</h3>
        {note ? <p className="t-small" style={{ marginTop: "0.5rem" }}>{note}</p> : null}
      </div>
    </article>
  );
}

/* Grid of tiles built from a list of strings. */
export function TileGrid({ items, cols = 3, compact, startAt = 1 }) {
  return (
    <div className={cx("grid", `cols-${cols}`)} data-anim="stagger" data-stagger="0.06">
      {items.map((item, i) => (
        <Tile
          key={item}
          index={String(i + startAt).padStart(2, "0")}
          name={item}
          compact={compact}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------- lists */
export function Bullets({ items, cols, className }) {
  return (
    <ul className={cx("list", cols >= 2 && cols <= 4 && `list--${cols}col`, className)}>
      {items.map((item) => (
        <li key={item}>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* `rail` lays the steps out as a row of cards filling the full width. It is
   opt-in rather than automatic because Steps is also used inside narrow
   columns (the app block on the home page), where a row has no room — and
   below the rail breakpoint these fall back to the stacked spine anyway.

   The number is a real element rather than a CSS counter because `.card`
   claims both pseudo-elements for its surface and pointer-light layers. */
export function Steps({ items, rail }) {
  return (
    <ol className={cx("steps", rail && "steps--rail")}>
      <span className="steps__spine" data-spine aria-hidden="true" />
      {items.map((item, i) => (
        <li className={cx(rail && "card")} key={item}>
          <span className="steps__num">{String(i + 1).padStart(2, "0")}</span>
          <span className="steps__text">{item}</span>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ pieces */
export function Feature({ icon, title, body, lean }) {
  return (
    <article className={cx("card feature", lean === "g" && "feature--g")}>
      <span className="feature__mark">{icon}</span>
      <h3 className="t-h4">{title}</h3>
      <p className="t-small">{body}</p>
    </article>
  );
}

export function Callout({ children }) {
  return (
    <div className="callout" data-anim="up">
      <p>{children}</p>
    </div>
  );
}

/* Counts up when scrolled into view. Pass `text` instead of `value` for a
   figure that shouldn't animate (or isn't a number). */
export function Stat({ value, text, label, suffix = "", prefix = "" }) {
  return (
    <div className="stat">
      {text ? (
        <span className="stat__num">{text}</span>
      ) : (
        <span
          className="stat__num"
          data-count={value}
          data-count-suffix={suffix}
          data-count-prefix={prefix}
        >
          {prefix}
          {value}
          {suffix}
        </span>
      )}
      <span className="stat__label">{label}</span>
    </div>
  );
}

export function Notice({ badge = "18+", title, children }) {
  return (
    <div className="notice" data-anim="up">
      <span className="notice__mark">{badge}</span>
      <div className="notice__body">
        {title ? <h3 className="t-h4">{title}</h3> : null}
        {children}
      </div>
    </div>
  );
}

/* Seamless ticker. The item list is rendered twice — the duplicate is what
   lets the loop shift by exactly -50% without a seam. */
export function Ticker({ items, speed = 34, dir = "left" }) {
  const run = (hidden) =>
    items.map((item) => (
      <span className="ticker__item" key={`${hidden ? "b" : "a"}-${item}`}>
        {item}
      </span>
    ));

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track" data-marquee data-marquee-speed={speed} data-marquee-dir={dir}>
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------- block
   The workhorse for editorial pages: a title column against a body column.
   Stack these inside a Section and long-form content gets a rhythm. */
export function Block({ index, eyebrow, title, children, className }) {
  return (
    <div className={cx("block-section", className)}>
      <Head index={index} eyebrow={eyebrow} title={title} />
      <div className="block__body" data-anim="up">
        {children}
      </div>
    </div>
  );
}

/* A single oversized statement, used to break up long pages. */
export function QuoteBand({ children, wide, band = "raise" }) {
  return (
    <section className={cx("quote-band band", `band--${band}`, wide && "quote-band--wide")}>
      <div className="shell">
        <p className="quote-band__text" data-anim="split">
          {children}
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- page hero */
export function PageHero({ route, kicker, title, sub, children, art, actions, lean = "o" }) {
  return (
    <header className="page-hero">
      <div className="aurora" aria-hidden="true">
        <div className={`aurora__blob aurora__blob--${lean}`} />
        <div className="aurora__blob aurora__blob--center" />
      </div>
      <div className="shell page-hero__grid">
        <div className="page-hero__copy">
          
          <h1 className="page-hero__title">
            {kicker ? (
              <>
                <span className="page-hero__kicker" data-anim="fade" data-on="load" data-delay="0.08">
                  {kicker}
                </span>
                {/* Keeps the two halves of the heading from running together
                    when the text is read out or extracted. */}
                <span className="vh"> — </span>
              </>
            ) : null}
            <span
              className="page-hero__headline t-gradient-lines"
              data-anim="split"
              data-on="load"
              data-delay="0.16"
            >
              {title}
            </span>
          </h1>
          {sub ? (
            <p className="page-hero__sub" data-anim="up" data-on="load" data-delay="0.3">
              {sub}
            </p>
          ) : null}
          {children ? (
            <div data-anim="up" data-on="load" data-delay="0.4">
              {children}
            </div>
          ) : null}
          {actions ? (
            <div className="row" data-anim="up" data-on="load" data-delay="0.5">
              {actions}
            </div>
          ) : null}
        </div>
        {art ? (
          <div className="page-hero__art" data-speed="0.9" data-anim="draw">
            {art}
          </div>
        ) : null}
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------- cta band */
export function CTABand({ index = "09", eyebrow = "Get started", title, body, actions, id }) {
  return (
    <section className="cta-band" id={id}>
      <div className="aurora" aria-hidden="true">
        <div className="aurora__blob aurora__blob--center" />
      </div>
      {/* Static. This is a 1100px element with a mask on it — rotating it
          forever meant re-rasterising a viewport-sized masked layer on every
          frame, for a movement almost nobody would notice. */}
      <div className="cta-band__rings" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="shell cta-band__inner">
        <span className="eyebrow" data-anim="fade">
          <span className="index index--brand">{index}</span>
          {eyebrow}
        </span>
        <h2 className="t-mega t-gradient-lines" data-anim="split">
          {title}
        </h2>
        <p className="t-body" data-anim="up">
          {body}
        </p>
        <div className="row" style={{ justifyContent: "center" }} data-anim="up" data-delay="0.1">
          {actions}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- device */
export function PhoneMock({ rows = [], title = "FairPlay", cta = "Place bet" }) {
  return (
    <div className="phone" data-tilt="6" data-float="12">
      <span className="phone__notch" aria-hidden="true" />
      <div className="phone__screen">
        <div className="phone__bar">
          <span>{title}</span>
          <span className="index index--brand">LIVE</span>
        </div>
        {rows.map((row) => (
          <div className="phone__row" key={row.label}>
            <span>{row.label}</span>
            <span className="phone__odd">{row.value}</span>
          </div>
        ))}
        <div className="phone__cta">{cta}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ helpers */
export function TextLink({ href, children }) {
  return (
    <Link className="link" href={href}>
      {children}
      <ArrowRight width={15} height={15} />
    </Link>
  );
}

export { cx };
