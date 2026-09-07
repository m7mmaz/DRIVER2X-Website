# FEATURES screenshot slots

Drop numbered images here to fill the FEATURES (System Archive) screen-by-screen
gallery. No component edits required -- discovered automatically at build time
via `import.meta.glob` in `src/lib/assets.ts`.

```
1.png  = Fuel System
2.jpg  = Dynamic Police            (already present -- real in-engine capture)
3.png  = Police Roadblocks
4.png  = Heat System
5.png  = Random Events -- Civilian Revenge
6.png  = Traffic Incidents
7.png  = Civilian AI
8.png  = Garage / Repair
9.png  = Live Interaction (TikTok)
10.jpg = Dynamic World              (already present -- real in-engine capture)
11.png = New Missions / Gameplay Expansions
12.png = Other Systems
```

The number matches the feature's position in `src/content/features.ts`
(`FEATURES[0]` -> `1.png`, `FEATURES[1]` -> `2.png`, etc.), not the feature's
`id` or `number` string. Reordering `FEATURES` changes which screenshot number
maps to which feature.

`2.jpg` and `10.jpg` already exist -- they're the same real, verified
in-engine screenshot (`screen-world.jpg`, a police-roadblock capture) that
this project already used for the Dynamic Police and Dynamic World entries
before this pass. They were copied here, not replaced, so nothing was lost.

You do not need every number. A missing slot shows an in-universe "IMAGE NN --
SCREENSHOT PENDING" placeholder instead of a broken image.

## Accepted file types

`.png`, `.jpg`, `.jpeg`, `.webp`.

## Recommended size

**1920 x 1080 (16:9).** Displayed inside a fixed 16:9 frame with
`object-fit: contain` -- never distorted, only letterboxed if the aspect
ratio differs.

## Why `src/assets/features/` and not `public/assets/features/`

Same reason as `app/` -- see that folder's README. Build-time discovery via
`import.meta.glob` requires the files to live under `src/`.
