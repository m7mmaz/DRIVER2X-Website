# APP screenshot slots

Drop numbered images here to fill the APP (Field Manual) screen-by-screen guide.
No component edits required -- the website discovers these files automatically
at build time via `import.meta.glob` in `src/lib/assets.ts`.

```
1.png  = App guide step 1  (Download)
2.png  = App guide step 2  (Install)
3.png  = App guide step 3  (First Launch)
4.png  = App guide step 4  (Launcher Update -- the mandatory update gate screen)
5.png  = App guide step 5  (Add CD 1)
6.png  = App guide step 6  (Add CD 2)
7.png  = App guide step 7  (Main Dashboard)
8.png  = App guide step 8  (Free Trial)
9.png  = App guide step 9  (Subscribe / Purchase)
10.png = App guide step 10 (Enter Activation Code)
11.png = App guide step 11 (Game Update)
12.png = App guide step 12 (Play)
13.png = App guide step 13 (Troubleshooting)
```

The number matches the step's position in `src/content/installGuide.ts`
(`INSTALL_STEPS[0]` -> `1.png`, `INSTALL_STEPS[1]` -> `2.png`, etc.), not the
step's `id` or `title`. Reordering `INSTALL_STEPS` changes which screenshot
number maps to which step. The list above (13 steps, 2026-09-06) was expanded
from an earlier 9-step version after inspecting the real launcher app source
-- see `installGuide.ts`'s own doc comment for exactly which file/function
grounds each step; nothing here is invented.

You do not need every number. If `9.png` doesn't exist, step 9 shows an
in-universe "IMAGE 09 -- SCREENSHOT PENDING" placeholder instead of a broken
image. Adding `9.png` later and rebuilding is all that's required. The
architecture has no upper limit -- adding a 14th step to `INSTALL_STEPS` and
dropping in `14.png` needs no other code changes.

## Screenshot status (2026-09-08 pass 3 -- amber annotations + real CD1/CD2 capture)

Real screenshots captured from a fully clean local uninstall + reinstall +
first launch of the live-published QA50 build (`D2X Launcher Setup.msi`,
rebuilt from the current publish output, SHA-256
`2d669fbc06120fdd40461a6b2cc7370bfb22c417684a0c0baedbda836a55c48f`). The
installer was launched and polled every ~300ms from the moment it opened to
confirm no window/state was missed -- it has exactly 3 real screens (License
Agreement -> Progress -> Finish), no folder-selection/options screen (fixed
per-user path, no customization UI), no UAC prompt (per-user install), and
does not auto-launch the app after Finish. No AI-generated, mockup, or stock
images -- every file here is a real Win32 window capture, reviewed for
sensitive data (no license codes, no device identifiers) before saving.

**Annotation color**: all instructional rectangles use the website's own
`--amber-hud: oklch(0.72 0.13 72)` accent (the same color as the site's
"System Notes"/"Important" headers) converted to sRGB `#D6963B`, NOT red --
red was rejected because several real controls (the Purchase button, the
site's own red accents) are themselves red, making a red annotation nearly
invisible. Every rectangle's pixel bounds were individually re-derived from
its own screenshot and visually re-verified after drawing, not reused from
earlier coordinates.

**Annotated + original pairs**: for steps where the customer must click a
specific control, `<N>.png` is the annotated teaching version (a thin amber
rectangle drawn on a *copy* of the real screenshot, over the exact control to
click -- never covering text/buttons, never modifying the app itself) and
`<N>-original.png` is the same real screenshot with no markup, kept in this
folder for reference. `<N>-original.png` is intentionally NOT picked up by
`getAppImage()` (its filename doesn't match the numbered-file pattern), so it
never appears on the live site -- it's a reference copy only.

**How the real CD1/CD2 screen was safely reproduced**: `GamePathService.ResolveInstall()`
checks the real per-user commercial path first (`<install dir>\Game\`, empty
on a fresh install -- the Setup Wizard is what populates it), and only falls
back to this dev machine's own `DevTreeCandidateDir` (a machine-local pointer
in `%LocalAppData%\DD2Launcher\devpaths.local.json`, confirmed via reading
`GamePathService.cs`) if the commercial path is empty. That fallback -- not
any state of the shared game tree itself -- was the only reason the Setup
Wizard hadn't appeared in earlier passes. `devpaths.local.json` was moved
aside (not deleted), the app was launched fresh (genuinely reporting
`NotFound` and showing the real Setup Wizard), the Welcome and CD1/CD2
screens were captured, the wizard was closed via its own X button without
providing any disc data, and `devpaths.local.json` was immediately moved
back to its exact original location and content. The shared
`DD2_COMMERCIAL`/`REDRIVER2` dev tree was never opened, read from, or
modified at any point. Restoration was verified by relaunching afterward and
confirming the dashboard (and the real, unmodified subscription state)
returned exactly as before.

Filled:
- `2.png` / `2-original.png` -- the real MSI License Agreement screen, checkbox checked, Install button enabled; `2.png` has an amber box around Install (Install).
- `5.png` / `6.png` (share `5-original.png`/`6-original.png`, same real base screenshot) -- the real "اختر أقراص اللعبة" (Choose game discs) Setup Wizard screen, both CD1 and CD2 cards visible together exactly as the real app shows them; `5.png` boxes CD1's own "اختيار" button, `6.png` boxes CD2's own "اختيار" button (Add CD1 / Add CD2).
- `7.png` -- the real, persistent Main Dashboard with an active subscription, no annotation (nothing to click, purely informational) (Main Dashboard).
- `8.png` / `8-original.png` -- the real "no license yet" dashboard; `8.png` has an amber box around the Free Trial button (Free Trial).
- `9.png` / `9-original.png` -- same real base screen as `8`, since the Purchase card and Free Trial card genuinely sit together in the real app; `9.png` has an amber box around the Purchase button instead (Subscribe/Purchase).
- `10.png` / `10-original.png` -- the real "تفعيل رمز الترخيص" dialog, empty field; `10.png` has an amber box around the input field only (re-verified to clear the label text above it) (Enter Activation Code).
- `12.png` / `12-original.png` -- same real base screen as `7`, since Play is part of the same persistent dashboard; `12.png` has an amber box around the Play button (Play).

Also captured this pass, kept as reference only in the scratch working area
(not copied into this folder, since the current architecture is one image
per guide step and these would duplicate/extend step 02 rather than being a
distinct customer step): the installer's raw unchecked-checkbox state, the
live installation-progress screen ("Updating component registration"), the
installer's Finish screen (amber box around Finish), and the Setup Wizard's
own Welcome screen (before the Discs screen). Available on request if a
future pass wants to split "Install" or "First Launch" into their own
multi-image sub-sequences.

Intentionally left as placeholders, with reasons (verified this pass, not an oversight):
- `1.png` (Download) -- this step is about the website's own Download button, which the customer is already looking at; a screenshot of the site showing itself adds nothing.
- `3.png` (First Launch) -- confirmed via rapid polling that this produces no distinct titled window of its own on this machine; it leads straight into either the Setup Wizard (5/6, now captured) or the Main Dashboard (7).
- `4.png` (Launcher Update gate) -- NOT SAFELY REPRODUCIBLE this pass: only appears when a real update is pending, and this machine is already on the latest build. Forcing it would mean tricking the app's own update-detection against production, risking this machine's real installed build. Needs a genuinely pending update to capture safely.
- `11.png` (Game Update) -- a fail-open background check with no distinct visible screen of its own in the current source.
- `13.png` (Troubleshooting) -- aggregates several different real scenarios; no single window represents it.

## Accepted file types

`.png`, `.jpg`, `.jpeg`, `.webp` -- pick whichever you have; the extension
doesn't matter, only the leading number.

## Recommended size

**1920 x 1080 (16:9).** Images are displayed inside a fixed 16:9 frame with
`object-fit: contain`, so a different source resolution/aspect ratio will
never distort -- it will letterbox instead. 1920x1080 (or a smaller multiple
of the same 16:9 ratio, e.g. 1280x720, if you want a smaller file) gives the
sharpest result with no letterboxing. The actual D2X Launcher window is not
16:9 itself (it's a fixed-size WinForms dashboard) -- capture it at its
native size and let the contain-frame letterbox it rather than stretching or
cropping the capture to fit 16:9.

## Why `src/assets/app/` and not `public/assets/app/`

Vite (and this project's Rolldown-based build) can only build-time-discover
files with `import.meta.glob` inside `src/`, not inside `public/` -- files in
`public/` are copied verbatim with no build-time manifest. Putting the numbered
images here (instead of `public/assets/app/`) is what makes "drop a file in,
rebuild, it shows up" possible without ever touching a React component. The
folder name and numbering convention are otherwise identical to what was
originally requested.
