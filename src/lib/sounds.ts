/**
 * UI sound effects: move (main-menu highlight change), select (entering a
 * screen / any "Next"/"Finish" button), back (returning to the main menu /
 * any "Previous"/"Main Menu" button). Same "drop a file in, no component
 * edits" architecture as src/lib/assets.ts's numbered images -- see
 * src/assets/sounds/README.md for the exact filenames expected.
 *
 * Real audio files, supplied by the site owner (who holds the rights to
 * publish them) -- never fabricated placeholder beeps, and never sourced
 * from the original Driver 2 game's own copyrighted assets (this project's
 * standing rule: never distribute original game data on the public site).
 */

const MOVE_MODULES = import.meta.glob<string>("../assets/sounds/move.{mp3,wav,ogg}", {
  eager: true,
  import: "default",
});

const SELECT_MODULES = import.meta.glob<string>("../assets/sounds/select.{mp3,wav,ogg}", {
  eager: true,
  import: "default",
});

const BACK_MODULES = import.meta.glob<string>("../assets/sounds/back.{mp3,wav,ogg}", {
  eager: true,
  import: "default",
});

function firstUrl(modules: Record<string, string>): string | null {
  return Object.values(modules)[0] ?? null;
}

const moveUrl = firstUrl(MOVE_MODULES);
const selectUrl = firstUrl(SELECT_MODULES);
const backUrl = firstUrl(BACK_MODULES);

/** Medium/light per request -- present but never intrusive. */
const VOLUME = 0.35;

// One reused <audio> element per sound file (2026-09-07 fix -- "the sound is
// a bit different during rapid Up/Down"): creating a brand-new Audio() on
// every call meant holding an arrow key (fast key-repeat) stacked multiple
// independent, overlapping playbacks of the same file on top of each other
// -- audibly muddier/different than a single isolated hover-triggered play.
// Reusing one element per URL and rewinding it (`currentTime = 0`) on every
// trigger makes a new call cleanly restart the same playback instead of
// layering another copy underneath it, so rapid repeats sound identical to
// a single isolated trigger.
const audioCache = new Map<string, HTMLAudioElement>();

function getAudio(url: string): HTMLAudioElement {
  let audio = audioCache.get(url);
  if (!audio) {
    audio = new Audio(url);
    audioCache.set(url, audio);
  }
  return audio;
}

/**
 * 2026-09-07 fix ("sound doesn't work the very first time you reach the
 * main menu, but works after that"): browsers block audio.play() until the
 * page has registered a genuine user gesture, AND that permission is
 * granted per-origin/tab, not per <audio> element -- so a fresh `new
 * Audio()` on the very first click can still be silently rejected even
 * though the click itself was real, if the browser hasn't yet logged any
 * successful gesture-triggered playback for this page. This "spends" that
 * very first gesture on a silent (volume 0), immediately-paused play of
 * each sound, strictly before the real click handlers run (pointerdown
 * fires before click in the event sequence) -- once the browser has logged
 * that first successful play, every subsequent real playSound() call works
 * normally for the rest of the session. Runs at most once; a no-op in SSR
 * (no `window`).
 *
 * 2026-09-07 fix ("sometimes hover plays nothing, only click sound works"):
 * this used to unlock via the SAME cached element `playSound()` uses
 * (`getAudio(url)`). If a genuine hover/click landed while that unlock's
 * own async play-then-pause was still in flight, its delayed `.pause()`
 * could fire AFTER the real sound had already started on that same
 * element -- silently cutting it off mid-playback. Using throwaway
 * `new Audio()` instances here instead means unlocking can never touch the
 * shared cached elements the real playSound() calls use, so the two can
 * never race against each other.
 */
let audioUnlocked = false;
function unlockAudioOnce() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  for (const url of [moveUrl, selectUrl, backUrl]) {
    if (!url) continue;
    try {
      const audio = new Audio(url);
      audio.volume = 0;
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.then(() => audio.pause()).catch(() => {});
      }
    } catch {
      // Best-effort only.
    }
  }
}

if (typeof window !== "undefined") {
  const onFirstGesture = () => {
    unlockAudioOnce();
    window.removeEventListener("pointerdown", onFirstGesture);
    window.removeEventListener("keydown", onFirstGesture);
  };
  window.addEventListener("pointerdown", onFirstGesture, { once: true });
  window.addEventListener("keydown", onFirstGesture, { once: true });
}

function playSound(url: string | null) {
  if (!url) return; // missing file -- silently silent, same as a missing numbered image
  try {
    const audio = getAudio(url);
    audio.volume = VOLUME;
    audio.currentTime = 0;
    // Autoplay policies can reject this before any user gesture has
    // occurred -- best-effort only, never worth surfacing an error for a UI
    // sound.
    void audio.play().catch(() => {});
  } catch {
    // Best-effort only.
  }
}

/** Highlighting a different main-menu option (arrow keys or mouse hover). */
export function playMoveSound() {
  playSound(moveUrl);
}

/** Entering APP/FEATURES/ABOUT from the main menu, or any Next/Finish button. */
export function playSelectSound() {
  playSound(selectUrl);
}

/** Returning to the main menu, or any Previous/Main Menu button. */
export function playBackSound() {
  playSound(backUrl);
}
