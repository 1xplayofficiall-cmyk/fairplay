"use client";

/* ============================================================================
   SCROLL PROGRESS — a 2px brand hairline across the top of the viewport.
   ========================================================================== */

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ScrollProgress() {
  const bar = useRef(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.35, invalidateOnRefresh: true },
        }
      );
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  return <div className="progress" ref={bar} aria-hidden="true" />;
}
