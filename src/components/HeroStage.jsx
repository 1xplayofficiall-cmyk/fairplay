/* ============================================================================
   HERO — CENTRE STAGE
   ----------------------------------------------------------------------------
   A cinematic opening rather than a layout: the headline sits dead centre and
   everything else is either atmosphere behind it or a quiet hairline at the
   very top and bottom of the frame.

   The depth comes entirely from light — a floodlight from above, two angled
   shafts, a halo behind the type, a pool on the floor and a vignette — layered
   at different parallax speeds so the field has real distance in it. Radial
   gradients only, no blur filters: a blurred 40vw layer is expensive to
   rasterise and these are already soft.
   ========================================================================== */

import Link from "next/link";

import CricketBall from "./CricketBall";
import TeenPattiCards from "./TeenPattiCards";
import { Btn } from "./ui";

export default function HeroStage() {
  return (
    <section className="stage" id="top">
      {/* ---------------------------------------------------- the light field */}
      <div className="stage__sky" aria-hidden="true">
        <span className="stage__flood" data-speed="0.85" />
        <span className="stage__beam stage__beam--o" data-speed="0.9" />
        <span className="stage__beam stage__beam--g" data-speed="0.94" />
        <span className="stage__rings" data-speed="1.05">
          <i />
          <i />
          <i />
        </span>
        <span className="stage__halo" data-speed="1.08" />
        <span className="stage__ground" data-speed="1.14" />
        <span className="stage__vignette" />

        {/* Both props sit after the vignette on purpose: they occupy the
            darkest part of the frame, and behind the falloff they mute to
            almost nothing. Their own glows are what seat them in the scene.

            Each is nested three deep because the motions stack and two of them
            drive the same property: the outer span takes scroll parallax
            (ScrollSmoother writes `y`), the inner one the idle bob (GSAP also
            writes `y`), and the spin lives inside the artwork. Flattened onto
            one element they would fight over the transform. */}
        <span className="stage__ball" data-speed="0.88">
          <span className="stage__drift" data-float="14">
            <i className="stage__prop-glow stage__prop-glow--ball" />
            <CricketBall />
          </span>
        </span>

        <span className="stage__cards" data-speed="0.93">
          <span className="stage__drift" data-float="9">
            <i className="stage__prop-glow stage__prop-glow--cards" />
            <TeenPattiCards />
          </span>
        </span>
      </div>

      <div className="shell stage__inner">
        <div className="stage__rule stage__rule--top" data-anim="fade" data-on="load">
          <span>01 / Official website</span>
          <span className="stage__live">
            <i aria-hidden="true" />
            Live now
          </span>
          <span>India / 18+</span>
        </div>

        {/* ----------------------------------------------------------- centre */}
        <div className="stage__core">
          <span className="stage__eyebrow" data-anim="fade" data-on="load" data-delay="0.06">
            Sportsbook + Casino
          </span>

          <h1 className="stage__title t-gradient-lines">
            <span data-anim="split" data-on="load" data-delay="0.12">
              Every match.
            </span>
            <span data-anim="split" data-on="load" data-delay="0.24">
              Every move.
            </span>
            <span className="stage__title-accent" data-anim="split" data-on="load" data-delay="0.36">
              On FairPlay.
            </span>
          </h1>

          <p className="stage__sub" data-anim="up" data-on="load" data-delay="0.52">
            Online sports betting and casino games for people who follow every moment — cricket,
            football, tennis and kabaddi, plus the full live casino floor, on one account.
          </p>

          <div className="stage__actions" data-anim="up" data-on="load" data-delay="0.6">
            <Btn href="/#register" variant="primary" size="lg" magnetic>
              FairPlay Register
            </Btn>
            <Btn href="/#download" variant="ghost" size="lg">
              Download the app
            </Btn>
          </div>
        </div>

        <nav
          className="stage__rule stage__rule--bottom"
          aria-label="Featured sections"
          data-anim="fade"
          data-on="load"
          data-delay="0.7"
        >
          <Link href="/cricket-betting">Cricket</Link>
          <Link href="/football-betting">Football</Link>
          <Link href="/casino">Casino</Link>
        </nav>
      </div>
    </section>
  );
}
