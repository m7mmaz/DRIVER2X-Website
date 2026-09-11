import { createServerFn } from "@tanstack/react-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";
import { FeOverlay } from "@/components/fe/Chrome";
import { STRINGS } from "@/content/strings";
import { pick, useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/vault")({ component: VaultPage });

// Exact Arabic password, per spec -- never translate/transliterate/normalize.
const PASSWORD = "درايفر";
const MAX_ATTEMPTS = 10;

// Copyright/link-removal contact for this page only -- not the launcher's
// own Customer Support WhatsApp config, not a second sitewide support
// channel. Scoped to this single link.
const LINK_REMOVAL_WHATSAPP_URL = "http://wa.me/966542562378";

/**
 * Server-only: reads the two download URLs from src/config/vaultDownloads.ts
 * via a dynamic import inside the handler, so the URLs are never part of the
 * client bundle -- only this RPC's JSON response carries them, and only
 * after the client explicitly calls it (see the `unlocked` effect below).
 * Deliberately unauthenticated (per spec: this is remote config, not a
 * second auth layer) -- the client-side password gate above it is the only
 * gate, and it's explicitly a casual one.
 */
const getVaultDownloads = createServerFn({ method: "GET" }).handler(async () => {
  const { VAULT_DOWNLOADS } = await import("@/config/vaultDownloads");
  return VAULT_DOWNLOADS;
});

type DownloadConfig = { download1: string; download2: string };

function VaultPage() {
  const { lang } = useLanguage();
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [downloads, setDownloads] = useState<DownloadConfig | null>(null);
  const [configFailed, setConfigFailed] = useState(false);
  const locked = attempts >= MAX_ATTEMPTS;

  // Casual deterrents only (spec section 3) -- not real security, and
  // deliberately scoped to this page's own lifetime via the effect cleanup,
  // so the rest of the site is never affected.
  useEffect(() => {
    function onContextMenu(e: MouseEvent) {
      e.preventDefault();
    }
    function onKeyDown(e: KeyboardEvent) {
      const blocked =
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U");
      if (blocked) e.preventDefault();
    }
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Fetch the remote download config only after a successful unlock --
  // never before, never speculatively (spec section 5).
  useEffect(() => {
    if (!unlocked) return;
    let cancelled = false;
    getVaultDownloads()
      .then((data) => {
        if (!cancelled) setDownloads(data);
      })
      .catch(() => {
        if (!cancelled) setConfigFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [unlocked]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (locked || unlocked) return;
    if (input === PASSWORD) {
      setUnlocked(true);
    } else {
      setAttempts((a) => a + 1);
      setWrong(true);
      setInput("");
    }
  }

  return (
    <main className="fe-app-shell relative select-none bg-background">
      <FeOverlay />
      <div className="fe-content-row relative z-20 flex flex-col items-center justify-center gap-6 px-6 py-4 text-center">
        <h1 className="font-display text-4xl font-black italic uppercase tracking-tight text-bone text-emboss sm:text-5xl">
          Driver2<span className="text-primary">X</span>
        </h1>

        {unlocked ? (
          <div className="flex w-full flex-col items-center gap-3 animate-fe-enter">
            <div className="flex w-full max-w-xs flex-col gap-3">
              {downloads ? (
                <>
                  <a
                    href={downloads.download1}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="fe-focus fe-secondary-cta inline-flex items-center justify-center border px-5 py-3 font-display text-sm font-bold uppercase italic tracking-tight text-bone"
                  >
                    {pick(STRINGS.vaultDownload1, lang)}
                  </a>
                  <a
                    href={downloads.download2}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="fe-focus fe-secondary-cta inline-flex items-center justify-center border px-5 py-3 font-display text-sm font-bold uppercase italic tracking-tight text-bone"
                  >
                    {pick(STRINGS.vaultDownload2, lang)}
                  </a>
                </>
              ) : configFailed ? (
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-primary">
                  {pick(STRINGS.vaultConfigError, lang)}
                </p>
              ) : (
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
                  {pick(STRINGS.vaultConfigLoading, lang)}
                </p>
              )}
            </div>

            {/* Wider than the button column (max-w-xs) for comfortable
                Arabic wrapping; centered per user request 2026-09-11. */}
            {downloads && (
              <div className="w-full max-w-sm text-center">
                <p className="text-[0.65rem] leading-relaxed text-muted-foreground/60">
                  {pick(STRINGS.vaultLegalNotice, lang)}
                </p>
                <p className="mt-2 text-[0.65rem] leading-relaxed text-muted-foreground/60">
                  {pick(STRINGS.vaultCopyrightNotice, lang)}{" "}
                  <a
                    href={LINK_REMOVAL_WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="fe-focus whitespace-nowrap text-primary underline"
                  >
                    {pick(STRINGS.vaultLinkRemovalRequest, lang)}
                  </a>
                </p>
              </div>
            )}
          </div>
        ) : locked ? (
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            {pick(STRINGS.vaultLocked, lang)}
          </p>
        ) : (
          <form onSubmit={submit} className="flex w-full max-w-xs flex-col gap-3">
            <label
              htmlFor="vault-password"
              className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground"
            >
              {pick(STRINGS.vaultPasswordLabel, lang)}
            </label>
            <input
              id="vault-password"
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setWrong(false);
              }}
              autoFocus
              autoComplete="off"
              className="fe-focus select-text border border-border/60 bg-transparent px-3 py-2 text-center font-mono text-bone outline-none"
            />
            {wrong && (
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-primary">
                {pick(STRINGS.vaultIncorrect, lang)}
              </p>
            )}
            <button
              type="submit"
              className="fe-focus fe-cta-red border-y px-6 py-2.5 font-display text-lg font-bold uppercase italic tracking-tight text-bone"
            >
              {pick(STRINGS.vaultEnter, lang)}
            </button>
          </form>
        )}

        <Link
          to="/"
          data-sfx="back"
          className="fe-focus font-mono text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground hover:text-bone"
        >
          {pick(STRINGS.mainMenuLabel, lang)}
        </Link>
      </div>
    </main>
  );
}
