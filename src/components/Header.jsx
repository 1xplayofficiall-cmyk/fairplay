"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Btn } from "./ui";

const NAV = [
  { href: "/#sports", label: "Sports betting" },
  { href: "/cricket-betting", label: "Cricket" },
  { href: "/football-betting", label: "Football" },
  { href: "/tennis-betting", label: "Tennis" },
  { href: "/basketball-betting", label: "Basketball" },
  { href: "/casino", label: "Casino" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const menu = useRef(null);
  const header = useRef(null);

  /* The menu is stored as "open for which route" rather than a plain boolean,
     so navigating anywhere closes it during render instead of via an effect —
     no cascading re-render, and browser back/forward is covered too. */
  const [openFor, setOpenFor] = useState(null);
  const open = openFor === pathname;
  const setOpen = (next) => setOpenFor(next ? pathname : null);

  /* ------------------------------------------------------------ scroll state
     Two pieces of state, both written as data attributes so the styling lives
     entirely in CSS: `scrolled` fades the backdrop in, `hidden` tucks the bar
     away while the reader is moving down the page. */
  useEffect(() => {
    const el = header.current;
    if (!el) return;
    let last = window.scrollY;
    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      el.dataset.scrolled = String(y > 24);
      el.dataset.hidden = "false";
      last = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [open]);

  /* Lock the page while the overlay is up, and allow Escape to dismiss it. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => event.key === "Escape" && setOpenFor(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* ---------------------------------------------------------- menu animation
     The panel wipes down with clip-path while the links rise out of their own
     hairlines — the same masked-reveal language used for headings. */
  useGSAP(
    () => {
      const panel = menu.current;
      if (!panel) return;
      const links = panel.querySelectorAll(".menu__link");
      const foot = panel.querySelector(".menu__footer");

      if (open) {
        const tl = gsap.timeline();
        tl.set(panel, { visibility: "visible" })
          .to(panel, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "fp-in-out" })
          .from(links, { yPercent: 110, autoAlpha: 0, stagger: 0.06, duration: 0.7 }, 0.18)
          .from(foot, { autoAlpha: 0, y: 16, duration: 0.5 }, 0.45);
        return;
      }

      gsap.to(panel, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.5,
        ease: "fp-in-out",
        onComplete: () => gsap.set(panel, { visibility: "hidden" }),
      });
    },
    { dependencies: [open] }
  );

  const isCurrent = (href) => href.startsWith("/") && !href.includes("#") && pathname === href;

  return (
    <>
      <header className="site-header" ref={header} data-scrolled="false" data-hidden="false">
        <div className="shell site-header__bar">
          <Link className="brand" href="/" aria-label="FairPlay — home">
            {/* Intrinsic size of the asset is 122×50 — declaring anything else
                reserves the wrong box and shifts the bar on load. */}
            <Image src="/fairplay-logo.png" alt="FairPlay" width={122} height={50} quality={100} priority />
          </Link>

          <nav className="site-nav" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                className="site-nav__link"
                href={item.href}
                data-current={isCurrent(item.href) ? "true" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-header__actions">
            <Btn href="/#login" variant="quiet" className="header-login">
              Login
            </Btn>
            <Btn href="/#register" variant="primary" className="header-register">
              Register
            </Btn>
            <button
              type="button"
              className="nav-toggle"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen(!open)}
            >
              <span className="nav-toggle__line" />
              <span className="nav-toggle__line" />
            </button>
          </div>
        </div>
      </header>

      <div className="menu" id="site-menu" ref={menu} hidden={undefined}>
        <span className="menu__aurora" aria-hidden="true" />
        <nav className="menu__list" aria-label="Mobile">
          {NAV.map((item, i) => (
            <div className="menu__item" key={item.href}>
              <Link className="menu__link" href={item.href} onClick={() => setOpen(false)}>
                <span className="index">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
        <div className="menu__footer">
          <Btn href="/#login" variant="ghost" size="lg">
            FairPlay Login
          </Btn>
          <Btn href="/#register" variant="primary" size="lg">
            FairPlay Register
          </Btn>
          <Btn href="/#download" variant="ghost" size="lg">
            APK Download
          </Btn>
        </div>
      </div>
    </>
  );
}
