# Background image slots

The website's backdrop changes per screen, with a crossfade transition. Replace
any of these files (keep the same number) to change that screen's background --
no component edits required.

```
1.jpg = HOME               (currently: menu-bg.jpg, real Driver 2 key art)
2.jpg = MORE INFORMATION    (currently: menu-bg.jpg, same key art)
3.jpg = APP                 (currently: screen-ride.jpg, real key art)
4.jpg = FEATURES            (currently: screen-world.jpg, real in-engine capture)
5.jpg = ABOUT               (currently: menu-bg.jpg, same key art)
```

Unlike `app/` and `features/`, every slot here is filled out of the box (all
five numbers exist, seeded from this project's existing real, verified
artwork) -- there is no "5 screens but only 3 images" case to design for. If
you delete a numbered file, that screen falls back to whatever the nearest
lower-numbered background is (see `src/lib/assets.ts`'s `getBackgroundImage`),
never a broken image.

## Accepted file types

`.png`, `.jpg`, `.jpeg`, `.webp`.

## Recommended size

**1920 x 1080 (16:9).** Displayed full-bleed with `object-fit: cover` (fills
the viewport, crops rather than letterboxes) under the existing grain /
scanline / vignette overlay, so a slightly different crop per image is fine --
just avoid critical detail in the extreme edges on an ultra-wide (2560x1440)
viewport, since more of the sides gets shown there than at 16:9.

## Why `src/assets/backgrounds/` and not `public/assets/backgrounds/`

Same reason as `app/` and `features/` -- see either of those READMEs.
Build-time discovery via `import.meta.glob` requires the files to live under
`src/`.
