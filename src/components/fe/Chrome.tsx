import type { ReactNode } from "react";
import { DOWNLOAD_URL, LAUNCHER, SECONDARY_BRAND, TIKTOK_URL } from "@/config/site";
import { STATUS_LABEL, STRINGS } from "@/content/strings";
import type { FeatureStatus } from "@/content/types";
import { pick, useLanguage } from "@/lib/i18n";

/** Shared frontend chrome: grain, scanlines, vignette, corner HUD text. */
export function FeOverlay() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 fe-scanlines" aria-hidden />
      <div className="pointer-events-none absolute inset-0 fe-grain overflow-hidden" aria-hidden />
      <div className="pointer-events-none absolute inset-0 fe-vignette" aria-hidden />
    </>
  );
}

export function FeTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-4xl font-black italic uppercase tracking-tight text-bone text-emboss sm:text-6xl">
      {children}
    </h2>
  );
}

export function FeLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[0.65rem] uppercase tracking-[0.42em] text-muted-foreground">
      {children}
    </span>
  );
}

const STATUS_STYLE: Record<FeatureStatus, string> = {
  ACTIVE: "text-amber-hud border-amber-hud/70",
  IN_DEVELOPMENT: "text-primary border-primary/70",
  PLANNED: "text-muted-foreground border-muted-foreground/50",
};

/** Small status chip used on Features entries. */
export function FeStatusTag({ status }: { status: FeatureStatus }) {
  const { lang } = useLanguage();
  return (
    <span
      className={`inline-block self-start border px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.3em] ${STATUS_STYLE[status]}`}
    >
      {pick(STRINGS.statusLabel, lang)}: {pick(STATUS_LABEL[status], lang)}
    </span>
  );
}

/**
 * Renders a real image when one exists, or a clearly labeled "screenshot
 * needed" placeholder when it doesn't. Never substitutes a stock/generic
 * image for a missing real one -- that would misrepresent the project.
 *
 * `slotNumber` is the numbered-asset-folder position (see
 * src/lib/assets.ts / src/assets/{app,features}/README.md) -- shown on the
 * placeholder ("IMAGE 07") so it's obvious which file to drop in to fill it.
 *
 * Fixed 16:9 frame with `object-fit: contain` (never `cover`): a dropped-in
 * screenshot at any source resolution letterboxes instead of being cropped
 * or stretched. See the recommended-size note in each folder's README.
 */
export function FeAssetSlot({
  image,
  label,
  slotNumber,
}: {
  image: string | null;
  label: string;
  slotNumber: number;
}) {
  const { lang } = useLanguage();
  const padded = String(slotNumber).padStart(2, "0");
  if (image) {
    return (
      <div className="fe-asset-frame flex aspect-video w-full items-center justify-center border border-border/60">
        <img
          src={image}
          alt={label}
          loading="lazy"
          className="h-full w-full object-contain"
          style={{ filter: "sepia(0.15) contrast(1.05)" }}
        />
      </div>
    );
  }
  return (
    <div
      className="fe-asset-slot flex aspect-video w-full flex-col items-center justify-center gap-1.5 border border-dashed border-border/60 text-center"
      role="img"
      aria-label={`${label} -- ${pick(STRINGS.imageSlotPending, lang)}`}
    >
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-amber-hud">
        {pick(STRINGS.imageSlotLabel, lang)} {padded}
      </span>
      <span className="max-w-xs px-4 font-mono text-[0.55rem] uppercase leading-relaxed tracking-[0.22em] text-muted-foreground">
        {label} · {pick(STRINGS.imageSlotPending, lang)}
      </span>
    </div>
  );
}

/**
 * Large, unmissable Back/Next pagination bar for paginated screens (APP,
 * FEATURES) -- the primary navigation control on those screens, not a
 * footer link (2026-09-06 UX pass: the old thin text links were replaced
 * entirely by this).
 *
 * Symmetrical first/middle/last behavior (2026-09-06 refinement pass,
 * section 12/14 -- replaces the previous "Next disables on the last item"
 * design, which is exactly what was called out as wrong):
 *   FIRST item:  [ MAIN MENU ]           [ NEXT ]
 *   MIDDLE item: [ BACK ]                [ NEXT ]
 *   LAST item:   [ BACK ]                [ FINISH ]
 * Neither button is EVER disabled -- there is always a real destination
 * (previous item, next item, or straight back to APP/FEATURES/ABOUT via
 * `onExit`). Finish gets its own checkmark glyph (not the plain arrow) so
 * it reads as "done, returning" rather than "continue forward" -- the one
 * required visual distinction from a normal Next.
 *
 * Arrow glyphs are chosen from `isRtl` rather than mirrored with CSS
 * transforms, so they read correctly (Back points toward reading-start)
 * in both directions. Keyboard Left/Right (see Screens.tsx's PaginatedScreen)
 * always mean previous/next regardless of language -- only these glyphs
 * mirror, not that meaning.
 */
export function FeStepNav({
  counter,
  onPrev,
  onNext,
  onExit,
  prevLabel,
  nextLabel,
}: {
  counter: string;
  onPrev?: (() => void) | undefined;
  onNext?: (() => void) | undefined;
  onExit: () => void;
  prevLabel?: string | undefined;
  nextLabel?: string | undefined;
}) {
  const { lang, isRtl } = useLanguage();
  const backArrow = isRtl ? "→" : "←";
  const nextArrow = isRtl ? "←" : "→";
  const isFirst = !onPrev;
  const isLast = !onNext;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        {/* dir="ltr" pins digit order ("02 / 09") -- without it, the bidi
            algorithm can reorder this mixed digits-and-slash string when
            it's embedded in an RTL paragraph, flipping it to "09 / 02". */}
        <span
          dir="ltr"
          className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground"
        >
          {counter}
        </span>
        {/* Subtle hint that ArrowLeft/ArrowRight also paginate (2026-09-06
            spec section 16) -- dir="ltr" for the same bidi-safety reason as
            the counter above: the physical Left/Right keys mean
            previous/next regardless of language, so this must never
            visually reorder. */}
        <span
          dir="ltr"
          className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-muted-foreground/50"
        >
          {pick(STRINGS.arrowKeyHint, lang)}
        </span>
      </div>
      {/* data-sfx="back" marks this as a "going backward" control for the
          site-wide sound delegate in Frontend.tsx (mouseover -> move sound,
          click -> back sound instead of the select-sound default) --
          2026-09-07 user request for a generic, every-button sound system
          rather than scattered per-component sound calls. */}
      <nav className="fe-navbar" aria-label="Step navigation">
        <button
          type="button"
          onClick={onPrev ?? onExit}
          data-sfx="back"
          className="fe-focus fe-navbtn"
        >
          <span className="fe-navbtn-arrow" aria-hidden>
            {backArrow}
          </span>
          <span className="fe-navbtn-text">
            {isFirst ? pick(STRINGS.mainMenuLabel, lang) : pick(STRINGS.previous, lang)}
            {!isFirst && prevLabel ? <span className="fe-navbtn-sublabel">{prevLabel}</span> : null}
          </span>
        </button>
        <button
          type="button"
          onClick={onNext ?? onExit}
          className="fe-focus fe-navbtn fe-navbtn-next"
        >
          <span className="fe-navbtn-text">
            {isLast ? pick(STRINGS.finish, lang) : pick(STRINGS.next, lang)}
            {!isLast && nextLabel ? <span className="fe-navbtn-sublabel">{nextLabel}</span> : null}
            {isLast ? (
              <span className="fe-navbtn-sublabel">{pick(STRINGS.mainMenuLabel, lang)}</span>
            ) : null}
          </span>
          <span className="fe-navbtn-arrow" aria-hidden>
            {isLast ? "✓" : nextArrow}
          </span>
        </button>
      </nav>
    </div>
  );
}

/** Single large Back control (About screen has no pagination, only Back to Menu). */
export function BackButton({ onBack }: { onBack: () => void }) {
  const { lang, isRtl } = useLanguage();
  return (
    <button
      type="button"
      onClick={onBack}
      data-sfx="back"
      className="fe-focus fe-navbtn self-start"
    >
      <span className="fe-navbtn-arrow" aria-hidden>
        {isRtl ? "→" : "←"}
      </span>
      {pick(STRINGS.backHint, lang)}
    </button>
  );
}

/**
 * Persistent application header, shown on every screen except the Home/intro
 * hero (whose own hero Download CTA already fills the download role -- a
 * second one there would be redundant). Two visually distinct groups
 * (2026-09-06 refinement pass, section 2/3/25 -- fixes the previous layout,
 * which split Download away from the brand text and grouped it with the
 * language switcher instead, reading as an "isolated unrelated button"):
 *   - Brand group (reading-start side): DRIVER2X + the fixed SECONDARY_BRAND
 *     line, with the compact Download CTA immediately beside them -- one
 *     coherent product-identity unit, not two unrelated controls.
 *   - Utility group (reading-end side): the persistent MAIN MENU button
 *     (section 4 -- omitted via `onMainMenu` being undefined on the Menu
 *     screen itself, since it would be a no-op there) and the language
 *     switcher.
 */
export function AppHeader({
  onBrandClick,
  onMainMenu,
  screenLabel,
}: {
  onBrandClick: () => void;
  onMainMenu?: (() => void) | undefined;
  screenLabel?: string | undefined;
}) {
  const { lang } = useLanguage();
  return (
    <header className="fe-app-header">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <button
          onClick={onBrandClick}
          data-sfx="back"
          className="fe-focus flex flex-col items-start gap-0.5 text-left rtl:text-right"
        >
          {/* "X" in red (--primary), matching the hero/menu wordmark's
              existing Driver2<span className="text-primary">X</span>
              treatment -- STRINGS.siteName is always exactly "DRIVER2X" in
              both languages (never translated), so splitting it here
              mirrors that established pattern rather than string-slicing a
              translatable value. */}
          <span className="font-display text-lg font-black uppercase italic leading-none tracking-tight text-bone sm:text-xl">
            DRIVER2<span className="text-primary">X</span>
          </span>
          {/* Fixed English secondary brand -- see SECONDARY_BRAND's own doc
              comment in config/site.ts and .fe-brand-secondary in styles.css.
              Never runs through pick()/STRINGS -- this string never
              translates, by design. */}
          <span
            dir="ltr"
            className="hidden fe-brand-secondary text-[0.55rem] text-amber-hud sm:inline"
          >
            {SECONDARY_BRAND}
          </span>
        </button>
        <FeDownloadCta variant="compact" />
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        {onMainMenu && (
          <button
            onClick={onMainMenu}
            data-sfx="back"
            className="fe-focus inline-flex items-center gap-1.5 border border-border/60 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-amber-hud hover:text-bone"
          >
            {pick(STRINGS.mainMenuLabel, lang)}
          </button>
        )}
        <LanguageSwitcher />
        {screenLabel && (
          <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.42em] text-muted-foreground md:inline">
            {screenLabel}
          </span>
        )}
      </div>
    </header>
  );
}

/**
 * The one, standalone download call-to-action. Deliberately styled to look
 * NOTHING like the vertical menu list or its selection slab -- this is a
 * separate primary action, not a menu item (see menu.ts's own comment).
 */
export function FeDownloadCta({ variant = "hero" }: { variant?: "hero" | "compact" }) {
  const { lang } = useLanguage();
  if (variant === "compact") {
    return (
      <a
        href={DOWNLOAD_URL}
        className="fe-focus fe-download-compact group inline-flex items-center gap-2 border border-amber-hud/60 px-4 py-2 font-display text-sm font-bold uppercase italic tracking-tight text-bone transition-colors hover:border-amber-hud"
      >
        {pick(STRINGS.downloadCtaCompact, lang)}
      </a>
    );
  }
  return (
    <div className="animate-fe-enter">
      <a href={DOWNLOAD_URL} className="fe-focus fe-download-hero group block w-full max-w-md">
        <span className="relative block overflow-hidden border-2 border-amber-hud/80 px-6 py-4 text-center transition-transform duration-200 group-hover:scale-[1.015]">
          <span className="absolute inset-0 fe-download-slab" />
          <span className="relative font-display text-2xl font-black uppercase italic tracking-tight text-bone sm:text-3xl">
            {pick(STRINGS.downloadCta, lang)}
          </span>
        </span>
      </a>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.8rem] uppercase tracking-[0.3em] text-muted-foreground">
        <span className="inline-flex items-center gap-2 text-amber-hud">
          {/* Windows logo (four-pane flag) -- inline SVG, no icon-library
              dependency added. White per request, regardless of the
              surrounding amber text color. */}
          <svg
            viewBox="0 0 88 88"
            width="14"
            height="14"
            fill="white"
            aria-hidden
            className="shrink-0"
          >
            <rect x="0" y="0" width="40" height="40" />
            <rect x="48" y="0" width="40" height="40" />
            <rect x="0" y="48" width="40" height="40" />
            <rect x="48" y="48" width="40" height="40" />
          </svg>
          {pick(STRINGS.windowsPc, lang)}
        </span>
        <span>{LAUNCHER.platform}</span>
      </div>
      <p className="mt-2 max-w-md font-mono text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground/70">
        {pick(STRINGS.subscriptionNotice, lang)}
      </p>
    </div>
  );
}

/** EN | العربية -- toggles language and persists the choice. */
/**
 * Small bordered HUD-style tag, not a dropdown -- one click toggles the
 * only two supported languages. The active language is bone/bold, the
 * inactive one dimmed, so the current state is obvious at a glance rather
 * than reading like two equal-weight labels.
 */
export function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage();
  return (
    <button
      onClick={toggleLang}
      className="fe-focus flex items-center gap-1.5 border border-border/60 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.2em] transition-colors hover:border-amber-hud"
      aria-label={lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
    >
      <span className={lang === "en" ? "text-bone" : "text-muted-foreground/50"}>EN</span>
      <span className="text-muted-foreground/40">/</span>
      <span className={lang === "ar" ? "text-bone" : "text-muted-foreground/50"}>العربية</span>
    </button>
  );
}

/** Small, subtle TikTok follow prompt -- opens externally, never in-app. */
/**
 * A small, self-contained field-note panel -- not a generic social-media
 * footer bar. Deliberately its own bordered block so it reads as part of
 * the frontend's own chrome rather than a bolted-on share widget.
 */
export function FeTikTok() {
  const { lang } = useLanguage();
  return (
    <div className="fe-tiktok-panel flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.35em] text-amber-hud">
          {pick(STRINGS.tiktokPanelLabel, lang)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{pick(STRINGS.tiktokFollow, lang)}</p>
      </div>
      <a
        href={TIKTOK_URL}
        target="_blank"
        rel="noreferrer noopener"
        className="fe-focus fe-secondary-cta inline-flex shrink-0 items-center justify-center border px-5 py-2 font-display text-sm font-bold text-bone uppercase italic tracking-tight transition-colors hover:text-amber-hud"
      >
        {pick(STRINGS.tiktokButton, lang)}
      </a>
    </div>
  );
}

export function FeHud({ mode }: { mode: "launcher" | "features" | "about" }) {
  const telemetry = {
    launcher: {
      location: "Chicago",
      time: "20:26",
      traffic: "Normal",
      unit: "System online",
      heat: "00",
    },
    features: {
      location: "Rio",
      time: "09:15",
      traffic: "Normal",
      unit: "System archive",
      heat: "--",
    },
    about: { location: "Rio", time: "04:08", traffic: "Low", unit: "System check", heat: "--" },
  }[mode];

  return (
    <aside className="fe-hud" aria-label="Decorative city telemetry">
      <div className="fe-hud-grid">
        <span>Location</span>
        <strong>{telemetry.location}</strong>
        <span>Time</span>
        <strong>{telemetry.time}</strong>
        <span>Traffic</span>
        <strong>{telemetry.traffic}</strong>
      </div>
      <div className="mt-3 border-t border-primary/40 pt-2">
        <span>Dispatch</span>
        <strong>{telemetry.unit}</strong>
        <span>Pursuit: none · Heat: {telemetry.heat}</span>
      </div>
    </aside>
  );
}
