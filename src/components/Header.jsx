"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Close } from "./Icons";
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

  /* The toggle is hidden above 980px. If the viewport crosses that line while
     the panel is open — a rotation, or a dragged window — close it, or a mobile
     panel is left floating beside the desktop nav with its scrim quietly
     swallowing every click on the page. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 981px)");
    const closeIfWide = () => mq.matches && setOpenFor(null);
    closeIfWide();
    mq.addEventListener("change", closeIfWide);
    return () => mq.removeEventListener("change", closeIfWide);
  }, []);

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
     A dropping panel rather than the full-screen wipe it used to be: it drops
     from under the bar and the links rise out of their own hairlines. The old
     clip-path wipe is gone with the full-bleed overlay — insetting a rounded
     panel needs `round`, and animating y/opacity is cheaper anyway. */
  useGSAP(
    () => {
      const panel = menu.current;
      if (!panel) return;
      const links = panel.querySelectorAll(".menu__link");
      const foot = panel.querySelector(".menu__footer");

      if (open) {
        const tl = gsap.timeline();
        tl.set(panel, { visibility: "visible" })
          .fromTo(
            panel,
            { y: -14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.42, ease: "fp" }
          )
          .from(links, { yPercent: 110, autoAlpha: 0, stagger: 0.04, duration: 0.5 }, 0.1)
          .from(foot, { autoAlpha: 0, y: 12, duration: 0.4 }, 0.24);
        return;
      }

      gsap.to(panel, {
        y: -10,
        autoAlpha: 0,
        duration: 0.28,
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

      {/* The panel no longer covers the screen, so it needs somewhere to be
          dismissed from. The scrim sits below the header rather than over it,
          which leaves the toggle live — tap outside, tap the X, hit Escape or
          tap the toggle again, all four close it. */}
      <button
        type="button"
        className="menu-scrim"
        data-open={open}
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      <div className="menu" id="site-menu" ref={menu} hidden={undefined}>
        <span className="menu__aurora" aria-hidden="true" />
        <div className="menu__head">
          <span className="menu__eyebrow">Menu</span>
          <button
            type="button"
            className="menu__close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <Close width={17} height={17} />
          </button>
        </div>
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
          <div className="menu__footer-row">
            <Btn href="/#login" variant="ghost">
              Login
            </Btn>
            <Btn href="/#register" variant="primary">
              Register
            </Btn>
          </div>
          <Btn href="/#download" variant="ghost">
            APK Download
          </Btn>
        </div>
      </div>
    </>
  );
}
