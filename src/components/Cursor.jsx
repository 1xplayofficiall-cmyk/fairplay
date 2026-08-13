"use client";

/* ============================================================================
   CURSOR — a lagging ring plus a hard dot. The ring trails the pointer and
   swells over anything interactive; the dot stays exact so precision is never
   lost. Rendered only on fine-pointer devices (CSS hides it elsewhere).
   ========================================================================== */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export default function Cursor() {
  const ring = useRef(null);
  const dot = useRef(null);

  useGSAP(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ringEl = ring.current;
    const dotEl = dot.current;
    if (!ringEl || !dotEl) return;

    const ringX = gsap.quickTo(ringEl, "x", { duration: 0.55, ease: "power3" });
    const ringY = gsap.quickTo(ringEl, "y", { duration: 0.55, ease: "power3" });
    const dotX = gsap.quickTo(dotEl, "x", { duration: 0.12, ease: "power2" });
    const dotY = gsap.quickTo(dotEl, "y", { duration: 0.12, ease: "power2" });

    let shown = false;
    const onMove = (event) => {
      if (!shown) {
        shown = true;
        gsap.to([ringEl, dotEl], { autoAlpha: 1, duration: 0.3 });
      }
      ringX(event.clientX);
      ringY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);

      const interactive = event.target?.closest?.(
        'a, button, summary, [data-cursor], input, .faq-item__q'
      );
      ringEl.dataset.active = interactive ? "true" : "false";
    };

    const onLeave = () => {
      shown = false;
      gsap.to([ringEl, dotEl], { autoAlpha: 0, duration: 0.25 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, {});

  return (
    <>
      <div className="cursor" ref={ring} aria-hidden="true" data-active="false" />
      <div className="cursor__dot" ref={dot} aria-hidden="true" />
    </>
  );
}
