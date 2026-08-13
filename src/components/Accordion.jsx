"use client";

/* ============================================================================
   ACCORDION — one panel open at a time, height animated by GSAP so the motion
   matches the rest of the site instead of using a CSS height hack. Buttons and
   aria wiring keep it operable from the keyboard.
   ========================================================================== */

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Accordion({ items, idPrefix = "faq" }) {
  const [open, setOpen] = useState(null);
  const root = useRef(null);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray(".faq-item__a", root.current);

      panels.forEach((panel, i) => {
        const isOpen = i === open;
        gsap.killTweensOf(panel);

        if (isOpen) {
          gsap.set(panel, { height: "auto" });
          gsap.from(panel, {
            height: 0,
            duration: 0.55,
            ease: "fp-in-out",
            onComplete: () => ScrollTrigger.refresh(),
          });
          gsap.fromTo(
            panel.firstElementChild,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.08 }
          );
          return;
        }

        gsap.to(panel, {
          height: 0,
          duration: 0.42,
          ease: "fp-in-out",
          onComplete: () => ScrollTrigger.refresh(),
        });
      });
    },
    { dependencies: [open], scope: root }
  );

  return (
    <div className="faq-list" ref={root}>
      {items.map((item, i) => {
        const isOpen = i === open;
        return (
          <div className="faq-item" key={item.q} data-open={isOpen ? "true" : "false"}>
            <h3>
              <button
                type="button"
                className="faq-item__q"
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-panel-${i}`}
                id={`${idPrefix}-btn-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <span className="faq-item__sign" aria-hidden="true" />
              </button>
            </h3>
            <div
              className="faq-item__a"
              id={`${idPrefix}-panel-${i}`}
              role="region"
              aria-labelledby={`${idPrefix}-btn-${i}`}
            >
              <div className="faq-item__inner">
                {(Array.isArray(item.a) ? item.a : [item.a]).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {item.extra}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
