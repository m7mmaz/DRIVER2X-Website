# UI sound effects

Drop these three files here to enable the site's sounds. No component edits
required -- discovered automatically at build time via `import.meta.glob` in
`src/lib/sounds.ts`, same mechanism as the numbered image folders.

```
move.mp3   (or .wav / .ogg) = plays when highlighting a different one of
                                the three main-menu options (App/Features/
                                About) -- arrow keys or mouse hover.
select.mp3 (or .wav / .ogg) = plays when entering APP / FEATURES / ABOUT
                                from the main menu, and on every "Next" /
                                "Finish" button throughout the site.
back.mp3   (or .wav / .ogg) = plays when returning to the main menu, and on
                                every "Previous" / "Main Menu" button
                                throughout the site (Escape included).
```

Exact filename (before the extension) is what's matched -- `select.mp3`,
`select.wav`, and `select.ogg` are all valid, pick whichever you have.

If a file isn't present, that action is silently silent (no sound, no
error, no broken-audio console warning) -- exactly like a missing numbered
image renders a placeholder instead of breaking.

## Volume

Played at a fixed, moderate volume (not configurable per-file) so a loud
source file doesn't need re-encoding -- see `VOLUME` in `src/lib/sounds.ts`
if it needs adjusting after you hear it in place.

## Licensing

These are used only once you've confirmed you hold the rights to publish
them on this public website.
