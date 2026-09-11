import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { getBackgroundImage } from "@/lib/assets";
import { SECONDARY_BRAND, TIKTOK_URL } from "@/config/site";
import { STRINGS } from "@/content/strings";
import { pick, useLanguage } from "@/lib/i18n";
import { playBackSound, playMoveSound, playSelectSound } from "@/lib/sounds";
import { AppHeader, FeDownloadCta, FeOverlay, LanguageSwitcher } from "./Chrome";
import { MENU_ITEMS, type ScreenId } from "./menu";
import { Screen } from "./Screens";

/**
 * Stacks the previous backdrop underneath the incoming one and lets the new
 * layer's CSS fade-in animation (see .fe-backdrop-layer in styles.css) reveal
 * it -- a plain crossfade, not an instant swap (section 14/17 of the
 * 2026-09-06 UX pass: background changes must feel cinematic, not abrupt).
 * The old layer is removed ~150ms after the ~500ms fade completes, once it's
 * no longer visible under the fully-opaque new one.
 */
function Backdrop({ src }: { src: string | null }) {
  const [layers, setLayers] = useState<{ id: number; src: string }[]>(src ? [{ id: 0, src }] : []);
  const nextId = useRef(1);

  useEffect(() => {
    if (!src) return;
    setLayers((prev) => {
      if (prev[prev.length - 1]?.src === src) return prev;
      return [...prev, { id: nextId.current++, src }];
    });
  }, [src]);

  useEffect(() => {
    if (layers.length <= 1) return;
    const timer = window.setTimeout(() => {
      setLayers((prev) => prev.slice(-1));
    }, 650);
    return () => window.clearTimeout(timer);
  }, [layers]);

  return (
    <div className="absolute inset-0" aria-hidden>
      {layers.map((layer, i) => (
        <img
          key={layer.id}
          src={layer.src}
          alt=""
          className="fe-backdrop-layer"
          style={{ zIndex: i }}
        />
      ))}
    </div>
  );
}

export function Frontend() {
  const { lang } = useLanguage();
  const [screen, setScreen] = useState<"intro" | ScreenId>("intro");
  const [index, setIndex] = useState(0);
  const [glitch, setGlitch] = useState(0);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const transitionTimer = useRef<number | null>(null);
  const transitionId = useRef(0);
  const screenRegionRef = useRef<HTMLDivElement | null>(null);

  const transition = useCallback((next: ScreenId) => {
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    const requestId = ++transitionId.current;
    setGlitch((g) => g + 1);
    transitionTimer.current = window.setTimeout(() => {
      if (requestId === transitionId.current) setScreen(next);
    }, 260);
  }, []);

  const goToMenu = useCallback(() => transition("menu"), [transition]);

  // Site-wide sound system (2026-09-07 user request, generalized to "every
  // button" after two follow-ups): ONE delegated listener pair below
  // handles hover (move sound) and click (select sound, or back sound for
  // anything marked `data-sfx="back"`) for every <button>/<a href> on the
  // page -- see that effect further down. Components stay plain (no
  // explicit playXSound() calls in their onClick handlers) specifically so
  // a real mouse click never double-fires against this delegate.
  //
  // The two keyboard-only interactions below are the exception: arrow-key
  // menu highlighting and Escape-to-menu don't dispatch any DOM click/hover
  // event for the delegate to catch, so they call the sound functions
  // directly. Enter-to-confirm on the main menu instead synthesizes a real
  // `.click()` on the already-focused menu item button -- that's a genuine
  // click event, so the delegate plays its sound the same way a mouse click
  // would, without a second explicit call here.
  const moveMenuIndex = useCallback((next: number) => {
    setIndex((i) => {
      if (next !== i) playMoveSound();
      return next;
    });
  }, []);

  const escapeToMenu = useCallback(() => {
    if (screen !== "menu" && screen !== "intro") playBackSound();
    goToMenu();
  }, [screen, goToMenu]);

  const confirm = useCallback(() => itemRefs.current[index]?.click(), [index]);

  // Delegated hover/click sounds for every button/link on the page.
  useEffect(() => {
    function closestInteractive(target: EventTarget | null): HTMLElement | null {
      return target instanceof Element ? target.closest<HTMLElement>("button, a[href]") : null;
    }
    function onPointerOver(e: MouseEvent) {
      const el = closestInteractive(e.target);
      if (!el) return;
      if (e.relatedTarget instanceof Node && el.contains(e.relatedTarget)) return;
      playMoveSound();
    }
    function onClick(e: MouseEvent) {
      const el = closestInteractive(e.target);
      if (!el) return;
      if (el.dataset["sfx"] === "back") playBackSound();
      else playSelectSound();
    }
    window.addEventListener("mouseover", onPointerOver);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mouseover", onPointerOver);
      window.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (screen === "intro") {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          transition("menu");
        }
        return;
      }
      if (screen !== "menu") {
        if (e.key === "Escape") escapeToMenu();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveMenuIndex((index + 1) % MENU_ITEMS.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveMenuIndex((index - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        confirm();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, confirm, escapeToMenu, moveMenuIndex, index, transition]);

  useEffect(() => {
    if (screen === "menu") {
      itemRefs.current[index]?.focus();
    } else if (screen !== "intro") {
      screenRegionRef.current?.focus();
    }
  }, [screen, index]);

  useEffect(
    () => () => {
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    },
    [],
  );

  const active = MENU_ITEMS[index]!;
  // active.id is typed as ScreenId (which technically includes "menu") only
  // because MenuItem reuses ScreenId for convenience -- MENU_ITEMS itself
  // never contains a "menu" entry, so this narrowing is safe by construction.
  const mode = (screen === "menu" || screen === "intro" ? active.id : screen) as Exclude<
    ScreenId,
    "menu"
  >;
  const backdrop = getBackgroundImage(screen);

  return (
    <main className="fe-app-shell relative bg-background">
      {/* Backdrop -- crossfades per screen, see Backdrop() above. */}
      <Backdrop src={backdrop} />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-background/10 rtl:bg-gradient-to-l" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/70" />
      </div>

      <FeOverlay />
      <div
        className={`pointer-events-none absolute inset-0 fe-atmosphere fe-mode-${mode}`}
        aria-hidden
      />

      {/* CRT flash on transition */}
      <div
        key={glitch}
        className="pointer-events-none absolute inset-0 z-30 bg-bone animate-fe-flash"
        aria-hidden
      />

      {/* Subtle red/blue "police light" sweep on transition -- user request
          2026-09-07. Same `glitch`-keyed remount pattern as the CRT flash
          above so it replays fresh on every navigation. */}
      <div
        key={`police-${glitch}`}
        className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
        aria-hidden
      >
        <div className="fe-police-red" />
        <div className="fe-police-blue" />
      </div>

      {/* Persistent header row: brand + always-visible compact Download +
          language switch. Never shown on the intro/hero screen -- there,
          the hero CTA IS the download action, so a second one would be
          redundant clutter (section 3/4 of the 2026-09-06 UX pass). Grid
          row 1 of .fe-app-shell -- its rendered height is what row 2
          (.fe-content-row) subtracts from the fixed viewport automatically. */}
      {screen !== "intro" && (
        <div className="relative z-20">
          <AppHeader
            onBrandClick={goToMenu}
            onMainMenu={screen === "menu" ? undefined : goToMenu}
            screenLabel={
              screen === "menu" ? pick(STRINGS.mainMenuLabel, lang) : pick(active.label, lang)
            }
          />
        </div>
      )}

      <div
        key={`body-${screen}-${glitch}`}
        className="fe-content-row relative z-20 flex flex-col justify-center animate-fe-glitch"
      >
        {screen === "intro" ? (
          // LEVEL 1 -- hero only. No menu, no secondary chrome competing for
          // attention: wordmark, tagline, one line of description, the
          // download CTA (the clearest action on this screen), then Enter
          // The World as a distinctly secondary action below it.
          <section
            className="relative flex h-full flex-col items-center justify-center gap-[clamp(1rem,3vh,2rem)] px-6 py-4 text-center sm:px-10"
            aria-labelledby="intro-title"
          >
            <div className="absolute top-4 flex w-full justify-end px-6 sm:px-10">
              <LanguageSwitcher />
            </div>

            <div className="max-w-2xl animate-fe-enter">
              <h1
                id="intro-title"
                className="font-display text-[19vw] font-black uppercase italic leading-[0.78] tracking-[-0.06em] text-bone text-emboss sm:text-[11vw] lg:text-[6.5vw]"
              >
                Driver2<span className="text-primary">X</span>
              </h1>
              {/* Fixed "DRIVER 2 EXPANSION" secondary brand -- shown on every
                  screen's own central/header lockup regardless of language
                  (2026-09-07 user request), styled to match the header's
                  secondary-brand treatment. */}
              <p
                dir="ltr"
                className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-amber-hud sm:text-[0.75rem]"
              >
                {SECONDARY_BRAND}
              </p>
              <p className="mx-auto mt-4 max-w-sm text-sm uppercase leading-relaxed tracking-wider text-muted-foreground">
                {pick(STRINGS.heroDescription, lang)}
              </p>
            </div>

            <div className="flex w-full max-w-md flex-col items-center gap-4 animate-fe-enter">
              <FeDownloadCta />

              <button
                onClick={() => transition("menu")}
                className="fe-focus fe-cta-red group block w-full overflow-hidden border-y px-6 py-2.5"
                autoFocus
              >
                <span className="relative block font-display text-lg font-bold uppercase italic tracking-tight text-bone transition-colors group-hover:text-primary sm:text-xl">
                  {pick(STRINGS.moreInformation, lang)}
                </span>
                <span className="relative mt-0.5 block font-mono text-[0.55rem] uppercase tracking-[0.32em] text-muted-foreground">
                  {pick(STRINGS.moreInformationHint, lang)}
                </span>
              </button>
            </div>
          </section>
        ) : screen === "menu" ? (
          <div className="flex h-full flex-col justify-center gap-6 px-6 py-2 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
            {/* Logo lockup -- always on the reading-start side (right in
                Arabic, left in English), explicit rtl: overrides rather than
                relying only on implicit logical flex behavior. */}
            <div className="animate-fe-enter">
              <h1 className="font-display text-[16vw] font-black uppercase italic leading-[0.78] tracking-[-0.05em] text-bone text-emboss sm:text-[12vw] lg:text-[7vw]">
                Driver2<span className="text-primary">X</span>
              </h1>
              {/* Fixed "DRIVER 2 EXPANSION" secondary brand -- shown on every
                  screen's own central/header lockup regardless of language
                  (2026-09-07 user request), styled to match the header's
                  secondary-brand treatment. */}
              <p
                dir="ltr"
                className="mt-1 text-center font-mono text-[0.65rem] uppercase tracking-[0.3em] text-amber-hud sm:text-[0.75rem]"
              >
                {SECONDARY_BRAND}
              </p>
              <p className="mt-4 hidden max-w-xs text-sm uppercase leading-relaxed tracking-wider text-muted-foreground lg:block">
                {pick(active.blurb, lang)}
              </p>
              {/* Large Download directly under the Menu screen's own logo
                  lockup, in addition to (not replacing) the persistent
                  header's compact copy -- user request 2026-09-07. */}
              <div className="mt-4">
                <FeDownloadCta />
              </div>
            </div>

            {/* Menu -- English sits on the right (lg:items-end), Arabic
                mirrors to the left (rtl:lg:items-start). */}
            <nav
              className="flex w-full flex-col items-stretch lg:w-auto lg:items-end rtl:lg:items-start"
              aria-label="Main menu"
            >
              {MENU_ITEMS.map((item, i) => {
                const selected = i === index;
                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    onMouseEnter={() => setIndex(i)}
                    onFocus={() => setIndex(i)}
                    onClick={() => {
                      setIndex(i);
                      transition(item.id);
                    }}
                    aria-current={selected ? "true" : undefined}
                    className="fe-focus group relative w-full overflow-hidden border-b border-border/40 py-2 text-left last:border-b-0 rtl:text-right lg:w-[min(46vw,620px)] lg:text-right rtl:lg:text-left"
                  >
                    <span
                      className={`absolute inset-y-0 end-0 w-full fe-slab transition-all duration-200 ${
                        selected ? "opacity-100" : "opacity-0"
                      } lg:origin-right rtl:lg:origin-left lg:scale-x-100`}
                      style={{ transform: selected ? "none" : "translateX(6%)" }}
                    />
                    <span
                      className={`relative block px-4 font-display text-[8vw] font-black uppercase italic leading-[1.02] tracking-tight transition-all duration-200 sm:text-5xl lg:text-[2.8vw] ${
                        selected
                          ? "text-bone text-emboss lg:-translate-x-2 rtl:lg:translate-x-2"
                          : "text-bone/45 hover:text-bone/70"
                      }`}
                    >
                      {pick(item.label, lang)}
                    </span>
                  </button>
                );
              })}
              <p className="mt-4 hidden px-4 font-mono text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground sm:block lg:text-right rtl:lg:text-left">
                {pick(STRINGS.selectHint, lang)}
              </p>
              <p className="mt-4 px-4 font-mono text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground sm:hidden">
                {pick(STRINGS.tapHint, lang)}
              </p>
            </nav>
          </div>
        ) : (
          <div ref={screenRegionRef} tabIndex={-1} className="h-full min-h-0 outline-none">
            <Screen id={screen} onBack={goToMenu} />
          </div>
        )}
      </div>

      {/* Compact, persistent status line -- still small, never a large
          footer (section 24 of the 2026-09-06 UX pass: no page scroll means
          no room for one) -- but enlarged from the original 0.5rem per
          2026-09-07 request. "M7MMAZ" is a separate red, clickable link
          straight to the TikTok profile, not just plain text. */}
      <footer className="fe-app-footer relative z-20 text-center font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground/70">
        {pick(STRINGS.footerRightsPrefix, lang)}{" "}
        <a
          href={TIKTOK_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="fe-focus text-primary hover:underline"
        >
          M7MMAZ
        </a>
        <span className="mx-2 text-muted-foreground/40">·</span>
        <Link to="/vault" className="fe-focus text-primary hover:underline">
          {pick(STRINGS.vaultEntryLabel, lang)}
        </Link>
      </footer>
    </main>
  );
}
