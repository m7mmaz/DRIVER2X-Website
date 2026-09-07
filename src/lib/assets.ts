/**
 * Centralized, build-time asset discovery for the three numbered image
 * folders (see the README.md inside each for the naming convention this
 * implements):
 *
 *   src/assets/app/1.png, 2.png, ...        -- APP guide screenshots
 *   src/assets/features/1.png, 2.png, ...   -- FEATURES screenshots
 *   src/assets/backgrounds/1.png .. 5.png   -- per-screen backdrops
 *
 * `import.meta.glob` is Vite/Rolldown's build-time directory scan -- it is
 * the mechanism that makes "drop a numbered file into the folder, rebuild"
 * work without ever touching a React component or hardcoding a file list
 * here. It only works for files under `src/` (not `public/`), which is why
 * these folders live under `src/assets/` -- see each folder's README.md for
 * the full explanation.
 *
 * Nothing in this file needs to change when images are added, removed, or
 * renumbered.
 */

const APP_MODULES = import.meta.glob<string>("../assets/app/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

const FEATURES_MODULES = import.meta.glob<string>("../assets/features/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

const BACKGROUND_MODULES = import.meta.glob<string>("../assets/backgrounds/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

/** Extracts the leading number from a glob-matched path like "../assets/app/7.png" -> 7. */
function numberedMap(modules: Record<string, string>): Map<number, string> {
  const map = new Map<number, string>();
  for (const [path, url] of Object.entries(modules)) {
    const match = /(\d+)\.[a-z0-9]+$/i.exec(path);
    if (!match) continue;
    map.set(Number(match[1]), url);
  }
  return map;
}

const appImages = numberedMap(APP_MODULES);
const featureImages = numberedMap(FEATURES_MODULES);
const backgroundImages = numberedMap(BACKGROUND_MODULES);

/** 1-based step number -> screenshot, or null if that slot has no image yet (renders a placeholder). */
export function getAppImage(step: number): string | null {
  return appImages.get(step) ?? null;
}

/** 1-based feature number -> screenshot, or null if that slot has no image yet (renders a placeholder). */
export function getFeatureImage(step: number): string | null {
  return featureImages.get(step) ?? null;
}

export type BackgroundKey = "intro" | "menu" | "launcher" | "features" | "about";

/**
 * HOME=1, MORE INFORMATION=2, APP=3, FEATURES=4, ABOUT=5 -- see
 * src/assets/backgrounds/README.md. Keyed by the app's existing internal
 * screen ids ("intro" = Home, "menu" = More Information) rather than the
 * customer-facing names, since those are what Frontend.tsx already tracks.
 */
const BACKGROUND_INDEX: Record<BackgroundKey, number> = {
  intro: 1,
  menu: 2,
  launcher: 3,
  features: 4,
  about: 5,
};

/**
 * Falls back to the nearest lower-numbered background if a slot's file was
 * deleted, rather than showing nothing -- a full-bleed backdrop has no good
 * "placeholder" treatment the way a screenshot frame does.
 */
export function getBackgroundImage(key: BackgroundKey): string | null {
  const wanted = BACKGROUND_INDEX[key];
  for (let n = wanted; n >= 1; n--) {
    const hit = backgroundImages.get(n);
    if (hit) return hit;
  }
  return null;
}
