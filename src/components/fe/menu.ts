import type { Localized } from "@/lib/i18n";

export type ScreenId = "menu" | "launcher" | "features" | "about";

export interface MenuItem {
  id: ScreenId;
  label: Localized<string>;
  blurb: Localized<string>;
}

/**
 * Deliberately minimal (2026-09-06 UX simplification): three items only.
 * Download is NOT a menu item -- it is its own standalone call-to-action
 * (see Frontend.tsx's FeDownloadCta), so it never competes with in-universe
 * navigation for attention. Undercover / Take A Ride / Dynamic World /
 * Garage / Briefing were folded out of primary navigation entirely per
 * this simplification -- Dynamic World's honest ACTIVE/PLANNED system
 * status now lives inside Features, which already covered the same ground.
 */
export const MENU_ITEMS: MenuItem[] = [
  {
    // Internal id/screen-name stays "launcher" (technically required
    // throughout Screens.tsx/menu wiring) -- only the customer-facing
    // label changed to "App" per the 2026-09-06 UX pass.
    id: "launcher",
    label: { en: "App", ar: "التطبيق" },
    blurb: {
      en: "Download, install and launch, step by step",
      ar: "التحميل والتثبيت والتشغيل، خطوة بخطوة",
    },
  },
  {
    id: "features",
    label: { en: "Features", ar: "المميزات" },
    blurb: {
      en: "Every system DRIVER2X adds to Driver 2",
      ar: "كل نظام يضيفه DRIVER2X إلى Driver 2",
    },
  },
  {
    id: "about",
    label: { en: "About", ar: "حول المشروع" },
    blurb: {
      en: "Credits, community and the project itself",
      ar: "الاعتمادات والمجتمع والمشروع نفسه",
    },
  },
];
