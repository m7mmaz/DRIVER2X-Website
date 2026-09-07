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

Real screenshots still needed for every step above (none exist yet):
application main screen (7), CD1/CD2 selection (5/6), the mandatory update
gate (4), the Free Trial card (8), the Subscribe/purchase entry point (9),
the activation code dialog (10), and Play (12) are the highest-value ones to
capture first since they show the screens a customer will actually see.

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
