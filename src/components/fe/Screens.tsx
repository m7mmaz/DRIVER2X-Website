import { useEffect, useState } from "react";
import { LAUNCHER, SECONDARY_BRAND } from "@/config/site";
import { FEATURES } from "@/content/features";
import { INSTALL_STEPS } from "@/content/installGuide";
import { STRINGS } from "@/content/strings";
import { getAppImage, getFeatureImage } from "@/lib/assets";
import { pick, useLanguage } from "@/lib/i18n";
import { playBackSound, playSelectSound } from "@/lib/sounds";
import { BackButton, FeAssetSlot, FeLabel, FeStatusTag, FeStepNav, FeTikTok } from "./Chrome";
import { MENU_ITEMS, type ScreenId } from "./menu";

const menuLabel = (id: "launcher" | "features" | "about") =>
  MENU_ITEMS.find((m) => m.id === id)!.label;

/**
 * Shared "one paginated item per screen" body used by both APP and
 * FEATURES: label/title row (shrink-0) -> image+text row (flex-1, min-h-0,
 * side-by-side on wider viewports so a full-width image on top never eats
 * the vertical budget text needs) -> the large Back/Next bar (shrink-0).
 * Fits inside .fe-content-row at every target resolution without the page
 * itself scrolling; `.fe-scroll-safety` on the text column is a safety net
 * for unusually long content or very short windows, not the design.
 */
function PaginatedScreen({
  screenLabel,
  screenTitle,
  screenIntro,
  itemKey,
  number,
  title,
  image,
  imageLabel,
  children,
  counter,
  onPrev,
  onNext,
  onExit,
  prevLabel,
  nextLabel,
}: {
  screenLabel: string;
  screenTitle: string;
  screenIntro: string;
  itemKey: string;
  number: string;
  title: string;
  image: string | null;
  imageLabel: string;
  children: React.ReactNode;
  counter: string;
  onPrev?: (() => void) | undefined;
  onNext?: (() => void) | undefined;
  onExit: () => void;
  prevLabel?: string | undefined;
  nextLabel?: string | undefined;
}) {
  const { lang, isRtl } = useLanguage();

  // ArrowLeft/ArrowRight paginate APP/FEATURES. 2026-09-07: reversed from
  // the earlier "Left always means previous regardless of language" rule --
  // explicit user request to mirror keyboard meaning with the visual RTL
  // layout instead (Arabic: Right=previous/Left=next, matching where the
  // Back/Next buttons themselves sit on screen; English unchanged:
  // Left=previous/Right=next). Scoped to this component's own lifetime
  // (mounted only while APP/FEATURES is showing), so it never competes with
  // Frontend.tsx's global menu/Escape listener or fires while on
  // Home/Menu/About.
  //
  // Explicit sound calls here (2026-09-07 fix -- these keys previously
  // played nothing): unlike a real mouse click on the Back/Next buttons,
  // ArrowLeft/ArrowRight don't dispatch any DOM click event for the
  // site-wide sound delegate in Frontend.tsx to catch, so this is one of
  // the few keyboard-only paths that has to call the sound functions
  // directly (same pattern as arrow-key menu highlighting and Escape).
  useEffect(() => {
    const prevKey = isRtl ? "ArrowRight" : "ArrowLeft";
    const nextKey = isRtl ? "ArrowLeft" : "ArrowRight";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === prevKey && onPrev) {
        e.preventDefault();
        playBackSound();
        onPrev();
      } else if (e.key === nextKey && onNext) {
        e.preventDefault();
        playSelectSound();
        onNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrev, onNext, isRtl]);

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-3 px-6 py-3 sm:px-10">
      <div className="shrink-0 animate-fe-enter">
        <FeLabel>
          {pick(STRINGS.select, lang)} · {screenLabel}
        </FeLabel>
        <h2 className="font-display text-[clamp(1.4rem,3.4vh,2.25rem)] font-black italic uppercase tracking-tight text-bone text-emboss">
          {screenTitle}
        </h2>
        <p className="hidden max-w-xl text-[0.8rem] uppercase leading-relaxed tracking-wide text-muted-foreground sm:block">
          {screenIntro}
        </p>
      </div>

      <div
        key={itemKey}
        className="flex min-h-0 flex-1 flex-col gap-4 animate-fe-slide-in md:flex-row"
      >
        {/* Image column widened ~24% (42%/520px -> 52%/640px) per
            2026-09-07 request -- the screenshot reads as visually too small
            relative to the viewport. Pure width increase only: since
            FeAssetSlot's frame is `aspect-video` (16:9) + `w-full`, its
            height scales automatically with width, so this alone enlarges
            the frame proportionally without touching object-fit/aspect
            ratio or the image files themselves. */}
        <div className="flex shrink-0 flex-col gap-2 md:w-[52%] md:max-w-[640px]">
          <div className="flex items-baseline gap-3 border-b border-border/50 pb-2 md:hidden">
            <span className="font-mono text-xl text-primary">{number}</span>
            <h3 className="font-display text-xl font-black uppercase italic tracking-tight text-bone">
              {title}
            </h3>
          </div>
          <div className="max-h-[32vh] w-full md:max-h-none md:flex-1">
            <FeAssetSlot image={image} label={imageLabel} slotNumber={Number(number)} />
          </div>
        </div>

        <div className="fe-scroll-safety flex min-h-0 flex-1 flex-col gap-3">
          <div className="hidden items-baseline gap-4 border-b border-border/50 pb-3 md:flex">
            <span className="font-mono text-2xl text-primary lg:text-3xl">{number}</span>
            <h3 className="font-display text-2xl font-black uppercase italic tracking-tight text-bone text-emboss lg:text-4xl">
              {title}
            </h3>
          </div>
          {children}
        </div>
      </div>

      <div className="shrink-0 border-t border-border/60 pt-3">
        <FeStepNav
          counter={counter}
          onPrev={onPrev}
          onNext={onNext}
          onExit={onExit}
          prevLabel={prevLabel}
          nextLabel={nextLabel}
        />
      </div>
    </div>
  );
}

function FeaturesScreen({ onExit }: { onExit: () => void }) {
  const { lang } = useLanguage();
  const [index, setIndex] = useState(0);
  const feature = FEATURES[index]!;

  return (
    <PaginatedScreen
      screenLabel={pick(menuLabel("features"), lang)}
      screenTitle={pick(STRINGS.featuresArchiveTitle, lang)}
      screenIntro={pick(STRINGS.featuresArchiveIntro, lang)}
      itemKey={feature.id}
      number={feature.number}
      title={pick(feature.title, lang)}
      image={getFeatureImage(Number(feature.number))}
      imageLabel={pick(feature.title, lang)}
      counter={`${feature.number} / ${String(FEATURES.length).padStart(2, "0")}`}
      onPrev={index > 0 ? () => setIndex((i) => i - 1) : undefined}
      onNext={index < FEATURES.length - 1 ? () => setIndex((i) => i + 1) : undefined}
      onExit={onExit}
      prevLabel={index > 0 ? pick(FEATURES[index - 1]!.title, lang) : undefined}
      nextLabel={index < FEATURES.length - 1 ? pick(FEATURES[index + 1]!.title, lang) : undefined}
    >
      <FeStatusTag status={feature.status} />
      <p className="text-[0.92rem] leading-relaxed tracking-wide text-muted-foreground">
        {pick(feature.description, lang)}
      </p>
      {pick(feature.details, lang).length > 0 && (
        <div className="flex flex-col gap-1.5 border-s-2 border-primary/60 ps-4">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-amber-hud">
            {pick(STRINGS.systemNotes, lang)}
          </span>
          <ul className="flex flex-col gap-1.5">
            {pick(feature.details, lang).map((d, i) => (
              <li
                key={i}
                className="text-[0.82rem] leading-relaxed tracking-wide text-muted-foreground"
              >
                · {d}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-auto font-mono text-[0.5rem] leading-relaxed tracking-[0.2em] text-muted-foreground/70">
        {pick(STRINGS.sourceLabel, lang)}: {feature.evidence}
      </p>
    </PaginatedScreen>
  );
}

function AppScreen({ onExit }: { onExit: () => void }) {
  const { lang } = useLanguage();
  const [index, setIndex] = useState(0);
  const step = INSTALL_STEPS[index]!;

  return (
    <PaginatedScreen
      screenLabel={pick(menuLabel("launcher"), lang)}
      screenTitle={pick(STRINGS.appGuideTitle, lang)}
      screenIntro={pick(STRINGS.appGuideIntro, lang)}
      itemKey={step.id}
      number={step.number}
      title={pick(step.title, lang)}
      image={getAppImage(Number(step.number))}
      imageLabel={pick(step.title, lang)}
      counter={`${step.number} / ${String(INSTALL_STEPS.length).padStart(2, "0")}`}
      onPrev={index > 0 ? () => setIndex((i) => i - 1) : undefined}
      onNext={index < INSTALL_STEPS.length - 1 ? () => setIndex((i) => i + 1) : undefined}
      onExit={onExit}
      prevLabel={index > 0 ? pick(INSTALL_STEPS[index - 1]!.title, lang) : undefined}
      nextLabel={
        index < INSTALL_STEPS.length - 1 ? pick(INSTALL_STEPS[index + 1]!.title, lang) : undefined
      }
    >
      <p className="text-[0.92rem] leading-relaxed tracking-wide text-muted-foreground">
        {pick(step.explanation, lang)}
      </p>
      {pick(step.notes, lang).length > 0 && (
        <div className="flex flex-col gap-1.5 border-s-2 border-amber-hud/60 ps-4">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-amber-hud">
            {pick(STRINGS.important, lang)}
          </span>
          <ul className="flex flex-col gap-1.5">
            {pick(step.notes, lang).map((n, i) => (
              <li
                key={i}
                className="text-[0.82rem] leading-relaxed tracking-wide text-muted-foreground"
              >
                · {n}
              </li>
            ))}
          </ul>
        </div>
      )}
    </PaginatedScreen>
  );
}

function AboutScreen({ onBack }: { onBack: () => void }) {
  const { lang } = useLanguage();
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-3 px-6 py-3 sm:px-10">
      <div className="shrink-0 animate-fe-enter">
        <FeLabel>
          {pick(STRINGS.select, lang)} · {pick(menuLabel("about"), lang)}
        </FeLabel>
        <h2 className="font-display text-[clamp(1.4rem,3.4vh,2.25rem)] font-black italic uppercase tracking-tight text-bone text-emboss">
          {pick(STRINGS.siteName, lang)}
        </h2>
        {/* Fixed "DRIVER 2 EXPANSION" secondary brand -- shown on every
            screen's own central/header lockup regardless of language
            (2026-09-07 user request). */}
        <p dir="ltr" className="font-mono text-[0.75rem] uppercase tracking-[0.3em] text-amber-hud">
          {SECONDARY_BRAND}
        </p>
      </div>

      <div className="fe-scroll-safety grid min-h-0 flex-1 grid-cols-1 gap-x-10 gap-y-4 lg:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col gap-4">
          <p className="text-[0.92rem] leading-relaxed tracking-wide text-muted-foreground animate-fe-slide-in">
            {pick(STRINGS.aboutDescription, lang)}
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between border-b border-border/60 pb-1.5">
              <span className="font-display text-base font-bold uppercase italic text-bone">
                {pick(STRINGS.engineLabel, lang)}
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-amber-hud">
                REDRIVER2
              </span>
            </div>
            <div className="flex items-baseline justify-between border-b border-border/60 pb-1.5">
              <span className="font-display text-base font-bold uppercase italic text-bone">
                {pick(STRINGS.appLabel, lang)}
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-amber-hud">
                {LAUNCHER.platform}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4">
          <FeTikTok />
          <p className="font-mono text-[0.6rem] leading-loose tracking-[0.18em] text-muted-foreground">
            {pick(STRINGS.aboutLegal, lang)}
          </p>
        </div>
      </div>

      <div className="shrink-0 border-t border-border/60 pt-3">
        <BackButton onBack={onBack} />
      </div>
    </div>
  );
}

export function Screen({ id, onBack }: { id: ScreenId; onBack: () => void }) {
  if (id === "launcher") return <AppScreen onExit={onBack} />;
  if (id === "features") return <FeaturesScreen onExit={onBack} />;
  // "about"
  return <AboutScreen onBack={onBack} />;
}
