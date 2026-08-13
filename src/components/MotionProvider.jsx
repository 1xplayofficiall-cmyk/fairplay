"use client";

/* ============================================================================
   MOTION PROVIDER
   ----------------------------------------------------------------------------
   One client component owns all of the site's GSAP work. Pages stay server
   components and describe their motion declaratively with data attributes:

     data-anim="up|fade|scale|clip|stagger|split|chars|draw"
     data-on="load"            play immediately instead of on scroll
     data-delay="0.2"          seconds
     data-stagger="0.08"       per-child / per-line offset
     data-duration="1.2"       seconds
     data-speed / data-lag     ScrollSmoother parallax (effects: true)
     data-count="9"            number that counts up when scrolled into view
     data-tilt                 subtle 3D tilt toward the pointer
     data-magnetic             element drifts toward the pointer
     data-marquee              seamless infinite ticker (doubled track)
     data-pin-x                horizontal panel scroller, pinned
     data-spine                vertical progress line drawn on scroll
     data-spin / data-float    ambient looping artwork

   Three rules keep this safe:
   1. Everything that starts hidden is hidden by CSS scoped to `html.motion`,
      which an inline script adds only when JS runs and motion is allowed. No
      content can ever be stranded invisible.
   2. The scene is built inside gsap.matchMedia() + context.add(), so async
      setup is still tracked and torn down correctly on navigation and across
      breakpoint / reduced-motion changes.
   3. Setup waits on fonts (so SplitText measures real line breaks) and on the
      intro curtain (so the hero doesn't animate behind it) — both with hard
      timeouts, so a stall can never leave the page blank.
   ========================================================================== */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { introReady } from "@/lib/intro";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, CustomEase);

/* Coalesce ScrollTrigger's callbacks so they fire on start/end rather than on
   every scroll frame. With this many triggers on a page it is a large saving
   and nothing here needs per-frame callbacks. */
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

/* House easings. Having exactly two named curves for everything is most of
   what makes separate animations feel like one system. */
CustomEase.create("fp", "0.16, 1, 0.3, 1");
CustomEase.create("fp-in-out", "0.62, 0.02, 0.2, 1");

gsap.defaults({ ease: "fp", duration: 0.9 });

/* [from-vars, to-vars] per reveal variant. */
const VARIANTS = {
  up: [{ y: 42, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }],
  fade: [{ autoAlpha: 0 }, { autoAlpha: 1 }],
  scale: [{ scale: 0.93, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }],
  clip: [{ clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" }],
};

const num = (value, fallback) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/* SplitText must measure line breaks against the real font, not the fallback,
   or every line re-flows the moment the webfont swaps in. */
const fontsReady = () =>
  Promise.race([
    typeof document !== "undefined" && document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((resolve) => setTimeout(resolve, 1500)),
  ]);

/* ============================================================================
   THE SCENE
   Runs inside a gsap context. Anything that is not a tween (DOM listeners,
   SplitText instances) registers its own undo in `teardown`.
   ========================================================================== */
function buildScene({ desktop, hover }, teardown) {
  const on = (el, type, handler) => {
    el.addEventListener(type, handler, { passive: true });
    teardown.push(() => el.removeEventListener(type, handler));
  };

  const trigger = (el, start = "top 88%") =>
    el.dataset.on === "load" ? undefined : { trigger: el, start, once: true };

  /* ---------------------------------------------------- entrance reveals */
  Object.entries(VARIANTS).forEach(([name, [from, to]]) => {
    gsap.utils.toArray(`[data-anim='${name}']`).forEach((el) => {
      gsap.fromTo(el, from, {
        ...to,
        duration: num(el.dataset.duration, 1),
        delay: num(el.dataset.delay, 0),
        scrollTrigger: trigger(el),
      });
    });
  });

  /* ---------------------------------------------------- staggered groups */
  gsap.utils.toArray("[data-anim='stagger']").forEach((el) => {
    gsap.fromTo(
      el.children,
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.85,
        delay: num(el.dataset.delay, 0),
        stagger: num(el.dataset.stagger, 0.075),
        scrollTrigger: trigger(el, "top 86%"),
      }
    );
  });

  /* ------------------------------------------- masked line / char reveals
     The mask option wraps each line so text slides out from behind its own
     edge. That masking is the difference between a reveal that looks
     designed and one that merely fades. */
  gsap.utils.toArray("[data-anim='split'],[data-anim='chars']").forEach((el) => {
    const byChars = el.dataset.anim === "chars";
    const split = SplitText.create(el, {
      type: byChars ? "chars,words" : "lines",
      mask: byChars ? "words" : "lines",
      linesClass: "line",
      wordsClass: "word",
      autoSplit: !byChars,
      onSplit(self) {
        gsap.set(el, { autoAlpha: 1 });
        return gsap.from(byChars ? self.chars : self.lines, {
          yPercent: 118,
          duration: byChars ? 0.8 : 1.1,
          stagger: num(el.dataset.stagger, byChars ? 0.022 : 0.085),
          delay: num(el.dataset.delay, 0),
          scrollTrigger: trigger(el, "top 86%"),
        });
      },
    });
    teardown.push(() => split.revert());
  });

  /* -------------------------------------------------------- SVG drawing */
  gsap.utils.toArray("[data-anim='draw']").forEach((el) => {
    gsap.set(el, { autoAlpha: 1 });
    gsap.fromTo(
      el.querySelectorAll("path, circle, line, rect, ellipse, polyline"),
      { drawSVG: "0%" },
      {
        drawSVG: "100%",
        duration: 1.6,
        stagger: 0.07,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }
    );
  });

  /* ------------------------------------------------------------ counters */
  gsap.utils.toArray("[data-count]").forEach((el) => {
    const value = { n: 0 };
    const prefix = el.dataset.countPrefix ?? "";
    const suffix = el.dataset.countSuffix ?? "";
    gsap.to(value, {
      n: num(el.dataset.count, 0),
      duration: 1.8,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = `${prefix}${Math.round(value.n)}${suffix}`;
      },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  /* --------------------------------------------------------- steps spine */
  gsap.utils.toArray("[data-spine]").forEach((el) => {
    gsap.fromTo(
      el,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top 75%", end: "bottom 70%", scrub: 0.6 },
      }
    );
  });

  /* ----------------------------------------------------------- tickers
     The track is rendered twice in the markup, so shifting it by exactly
     -50% loops with no seam.

     The scroll-velocity "momentum" boost that used to live here is gone: it
     ran a callback on every scroll frame and allocated a fresh tween each
     time just to nudge timeScale. A plain constant loop is one GPU-friendly
     transform and looks the same. */
  gsap.utils.toArray("[data-marquee]").forEach((track) => {
    const dir = track.dataset.marqueeDir === "right" ? 1 : -1;
    gsap.set(track, { xPercent: dir === 1 ? -50 : 0 });
    const loop = gsap.to(track, {
      xPercent: dir === 1 ? 0 : -50,
      ease: "none",
      duration: num(track.dataset.marqueeSpeed, 34),
      repeat: -1,
    });

    /* Off-screen tickers are paused outright — no reason to keep animating
       something nobody can see. */
    ScrollTrigger.create({
      trigger: track,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
    });
  });

  /* ------------------------------------- horizontal pinned panel scroller */
  if (desktop) {
    gsap.utils.toArray("[data-pin-x]").forEach((section) => {
      const track = section.querySelector("[data-pin-track]");
      if (!track) return;
      const distance = () => Math.max(track.scrollWidth - window.innerWidth + 64, 0);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.35}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });
  }

  /* ------------------------------------------- pointer-reactive surfaces */
  if (hover) {
    /* Light that follows the cursor across a surface.
       `.card` already covers .tile and .feature — they are always rendered
       together — so matching those separately bound a second, redundant
       listener to the same 21 elements. */
    gsap.utils.toArray(".card, .panel, [data-pointer-light]").forEach((el) => {
      let rect = null;
      on(el, "pointerenter", () => {
        rect = el.getBoundingClientRect();
      });
      on(el, "pointermove", (event) => {
        if (!rect) rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        el.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
      on(el, "pointerleave", () => {
        rect = null;
      });
    });

    /* Subtle 3D tilt. */
    gsap.utils.toArray("[data-tilt]").forEach((el) => {
      const max = num(el.dataset.tilt, 7);
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });
      gsap.set(el, { transformPerspective: 900 });
      let rect = null;
      on(el, "pointerenter", () => {
        rect = el.getBoundingClientRect();
      });
      on(el, "pointermove", (event) => {
        if (!rect) rect = el.getBoundingClientRect();
        ry(((event.clientX - rect.left) / rect.width - 0.5) * max * 2);
        rx(((event.clientY - rect.top) / rect.height - 0.5) * -max * 2);
      });
      on(el, "pointerleave", () => {
        rect = null;
        rx(0);
        ry(0);
      });
    });

    /* Magnetic pull on primary actions. */
    gsap.utils.toArray("[data-magnetic]").forEach((el) => {
      const pull = num(el.dataset.magnetic, 0.25);
      const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3" });
      let rect = null;
      on(el, "pointerenter", () => {
        rect = el.getBoundingClientRect();
      });
      on(el, "pointermove", (event) => {
        if (!rect) rect = el.getBoundingClientRect();
        xTo((event.clientX - (rect.left + rect.width / 2)) * pull);
        yTo((event.clientY - (rect.top + rect.height / 2)) * pull);
      });
      on(el, "pointerleave", () => {
        rect = null;
        xTo(0);
        yTo(0);
      });
    });
  }

  
  const whileVisible = (el, tween) => {
    tween.pause();
    ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
    });
  };

  gsap.utils.toArray("[data-spin]").forEach((el) => {
    whileVisible(
      el,
      gsap.to(el, {
        rotation: 360 * (el.dataset.spin === "reverse" ? -1 : 1),
        /* `data-spin-origin="100 100"` pins the pivot in SVG user units. Needed
           whenever the artwork's centre is not its bounding-box centre — GSAP
           resolves transformOrigin against the bbox, and for a clipped or
           off-centre group that lands somewhere the shape never was. */
        ...(el.dataset.spinOrigin ? { svgOrigin: el.dataset.spinOrigin } : {}),
        duration: num(el.dataset.spinDuration, 40),
        ease: "none",
        repeat: -1,
      })
    );
  });

  gsap.utils.toArray("[data-float]").forEach((el, i) => {
    whileVisible(
      el,
      gsap.to(el, {
        y: -num(el.dataset.float, 14),
        duration: gsap.utils.random(3.2, 4.8),
        delay: i * 0.25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    );
  });
}

/* ========================================================================== */
export default function MotionProvider() {
  const pathname = usePathname();
  const smoother = useRef(null);

  /* -------------------------------------------------------------- smoothing
     Created once for the lifetime of the app so it survives navigation. */
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const instance = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 0.15,
        speed: 1,
        effects: true,
        smoothTouch: 0,
        ignoreMobileResize: true,
      });
      smoother.current = instance;
      document.documentElement.classList.add("smooth");

      /* Same-page anchors should glide, not jump. */
      const onClick = (event) => {
        const link = event.target?.closest?.('a[href*="#"]');
        if (!link) return;
        const url = new URL(link.getAttribute("href"), window.location.href);
        if (url.pathname !== window.location.pathname || !url.hash) return;
        const target = document.querySelector(url.hash);
        if (!target) return;
        event.preventDefault();
        instance.scrollTo(target, true, "top 100px");
        history.replaceState(null, "", url.hash);
      };
      document.addEventListener("click", onClick);

      return () => {
        document.removeEventListener("click", onClick);
        document.documentElement.classList.remove("smooth");
        smoother.current = null;
        instance.kill();
      };
    });

    return () => mm.revert();
  }, {});

  /* ---------------------------------------------------------------- reveals
     Rebuilt on every navigation, because the DOM it reads is page-specific. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      let cancelled = false;

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 981px)",
          hover: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          if (!context.conditions.motion) return;

          const teardown = [];

          Promise.all([fontsReady(), introReady()]).then(() => {
            if (cancelled) return;
            context.add(() => buildScene(context.conditions, teardown));
            ScrollTrigger.refresh();
          });

          return () => teardown.forEach((undo) => undo());
        }
      );

      return () => {
        cancelled = true;
        mm.revert();
      };
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  /* ------------------------------------------------------------ scroll reset
     When navigating to any new page, force native window scroll and ScrollSmoother
     to the very top (0) immediately so every page opens from the starting top. */
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const resetToTop = () => {
      // 1. Reset native window & document scroll to top
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // 2. Reset GSAP smooth-content container transform
      const content = document.querySelector("#smooth-content");
      if (content) {
        gsap.set(content, { y: 0, translateY: 0, clearProps: "transform" });
      }

      // 3. Reset ScrollSmoother instance
      if (smoother.current) {
        smoother.current.scrollTo(0, false);
        if (typeof smoother.current.scrollTop === "function") {
          smoother.current.scrollTop(0);
        }
      }
    };

    // Execute immediately on route change
    resetToTop();

    // Re-verify after DOM render & GSAP ScrollTrigger refresh
    const frameId = requestAnimationFrame(() => {
      resetToTop();
      ScrollTrigger.refresh();
    });

    const timerId = setTimeout(() => {
      resetToTop();
      ScrollTrigger.refresh();
    }, 50);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timerId);
    };
  }, [pathname]);

  return null;
}
