"use client";

/* ============================================================================
   PRELOADER
   ----------------------------------------------------------------------------
   A short branded curtain on the first visit of a session. It is rendered on
   the server but kept `display: none` until `html.motion` exists, so a visitor
   with JS off — or with reduced motion on — never sees it and never gets stuck
   behind it.
   ========================================================================== */

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { finishIntro } from "@/lib/intro";

const SEEN_KEY = "fp:intro";

export default function Preloader() {
  const [done, setDone] = useState(false);
  const root = useRef(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      /* Only the first page of a session gets the curtain. */
      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* private mode — treat as first visit, just don't remember it */
      }

      if (seen) {
        finishIntro();
        setDone(true);
        return;
      }

      const count = el.querySelector(".preloader__count");
      const value = { n: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          finishIntro();
          setDone(true);
        },
      });

      tl.from(".preloader__word", { yPercent: 115, duration: 0.85, ease: "fp" })
        .to(
          ".preloader__fill",
          { scaleX: 1, duration: 1.05, ease: "fp-in-out" },
          0.15
        )
        .to(
          value,
          {
            n: 100,
            duration: 1.05,
            ease: "fp-in-out",
            onUpdate: () => {
              if (count) count.textContent = `${Math.round(value.n)}`.padStart(3, "0");
            },
          },
          0.15
        )
        .to(".preloader__word", { yPercent: -115, duration: 0.6, ease: "fp-in-out" }, "+=0.1")
        .to(".preloader__bar, .preloader__count", { autoAlpha: 0, duration: 0.3 }, "<")
        .to(el, { yPercent: -100, duration: 0.85, ease: "fp-in-out" }, "-=0.25");
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div className="preloader" ref={root} role="presentation">
      <div className="preloader__inner">
        <div className="preloader__mark">
          <span className="preloader__word">
            fair<span className="t-brand">play</span>
          </span>
        </div>
        <div className="preloader__bar">
          <span className="preloader__fill" />
        </div>
        <span className="preloader__count">000</span>
      </div>
    </div>
  );
}
