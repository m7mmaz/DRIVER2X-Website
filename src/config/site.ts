/**
 * Single source of truth for every public-facing DRIVER2X URL/version
 * string. Nothing in this file may reference internal QA build numbers,
 * QA slot names (e.g. "QA48"), internal R2/Cloudflare URLs, or any other
 * detail that isn't meant for a customer to see. See PROJECT_STATE.md in
 * the launcher repo for what's safe to publish vs. what must stay internal.
 *
 * Translatable copy (site name, tagline, button labels, etc.) lives in
 * src/content/strings.ts instead -- this file is only for values that are
 * the same regardless of language (URLs, version numbers, file sizes).
 */

/**
 * TODO(release): replace with the real GitHub Releases asset URL once
 * D2XLauncherSetup.msi is published publicly. Deliberately NOT example.com
 * and deliberately NOT a real-looking URL, so a forgotten placeholder fails
 * obviously instead of silently pointing somewhere wrong.
 */
export const DOWNLOAD_URL = "https://github.com/m7mmaz/DRIVER2X-Website/releases/download/v1.0.20/DRIVER2X-Setup.zip";

/**
 * Real account (2026-09-06) -- matches the exact same constant already
 * shipping inside the launcher app itself
 * (DD2.Launcher/Services/PurchaseService.cs's TikTokUrl), so the website and
 * the app point at the same profile.
 */
export const TIKTOK_URL = "https://www.tiktok.com/@m7mmaz";

/**
 * NOT a real Salla URL yet. Verified against the actual codebase (2026-09-06):
 * every existing Salla integration point -- DD2.Launcher/Services/
 * PurchaseService.cs's FullVersionProductUrl, ExpirationForm.cs's own copy of
 * the same constant, and DD2_CLOUDFLARE/COMMERCIAL_BACKEND_ARCHITECTURE.md's
 * §7 -- uses this exact same placeholder and explicitly documents Salla as
 * "out of scope for this phase (no API calls, no webhook, no product
 * created)". No real store URL exists anywhere in this codebase to copy from.
 * Replace this the moment you have the real product/store URL; nothing else
 * needs to change -- every component reads this one constant.
 */
export const SALLA_URL = "https://YOUR-SALLA-PRODUCT-URL";

/**
 * Secondary, English-only project brand shown alongside the DRIVER2X
 * wordmark in the persistent header. Deliberately a plain (non-Localized)
 * string, not part of src/content/strings.ts -- like DOWNLOAD_URL/LAUNCHER
 * above, it is the same regardless of language by design (2026-09-06:
 * DRIVER2X itself must never be translated either -- see
 * STRINGS.siteName's own comment).
 */
export const SECONDARY_BRAND = "DRIVER 2 EXPANSION";

/**
 * Public-facing launcher info only. `version` is the MSI's own
 * ProductVersion (a real, stable, public version number that already ships
 * inside D2XLauncherSetup.msi) -- never an internal QA slot number like
 * "QA48". Update this by hand at publish time.
 */
export const LAUNCHER = {
  version: "1.0.20",
  platform: "Windows 10 / 11 · 64-bit",
  size: "~110 MB",
  requires: "Original Driver 2 disc data",
} as const;

export const LINKS = {
  // TODO: fill in once this exists publicly.
  github: "",
} as const;
