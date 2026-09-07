import type { Localized } from "@/lib/i18n";

/**
 * ACTIVE        - verified present in the real DD2_COMMERCIAL/REDRIVER2
 *                 source at the time this content was written (cite the
 *                 file/function in the entry's `evidence` field).
 * IN_DEVELOPMENT - real code exists but is partial, vanilla-mechanic-based,
 *                 or not fully confirmed end-to-end.
 * PLANNED       - roadmap intent only; no implementation evidence found.
 *
 * Never mark anything ACTIVE without a source citation in `evidence`.
 */
export type FeatureStatus = "ACTIVE" | "IN_DEVELOPMENT" | "PLANNED";

export interface Feature {
  id: string;
  number: string;
  title: Localized<string>;
  status: FeatureStatus;
  /** One line, shown in list/nav context. */
  summary: Localized<string>;
  /** Longer, shown on the feature's own screen. */
  description: Localized<string>;
  /** Bullet-style technical/gameplay notes. */
  details: Localized<string[]>;
  /** Where this was verified -- a file/function reference. English-only (an internal source citation, not customer-facing prose). */
  evidence: string;
}

export interface InstallStep {
  id: string;
  number: string;
  title: Localized<string>;
  explanation: Localized<string>;
  notes: Localized<string[]>;
}
