# Self-hosted variable fonts

This directory holds the self-hosted **variable** `woff2` font binaries for the
Ryze Technology site. The `@font-face` declarations live in
[`src/styles/fonts.css`](../../src/styles/fonts.css) and the critical fonts are
preloaded from `index.html`.

> **Status:** The actual font binaries are **not committed** to this repo. Until
> you drop them in, the `@font-face` `url(...)` references will 404 and the
> browser gracefully falls back to the metric-matched fallback faces
> (`* Fallback`, built on local system fonts) and then `system-ui`. This keeps
> layout shift (CLS) near zero and is acceptable for development. Add the real
> binaries below for production.

## Files to add

Drop these exact filenames here (they must match the `url()` references in
`src/styles/fonts.css`):

| Filename                          | Typeface         | Role            | License | Source |
| --------------------------------- | ---------------- | --------------- | ------- | ------ |
| `ClashDisplay-Variable.woff2`     | Clash Display    | Display / hero  | Free (ITF) | https://www.fontshare.com/fonts/clash-display |
| `GeneralSans-Variable.woff2`      | General Sans     | Sans / body     | Free (ITF) | https://www.fontshare.com/fonts/general-sans |
| `JetBrainsMono-Variable.woff2`    | JetBrains Mono   | Mono / eyebrow  | OFL 1.1 | https://github.com/JetBrains/JetBrainsMono |

All three are free/open to self-host. If you prefer fully OFL alternatives you
can substitute:

- Display: **Clash Display** → e.g. a grotesk like **Space Grotesk** (OFL)
- Sans: **General Sans** → **Inter** (OFL)
- Mono: **JetBrains Mono** (OFL) — already OFL

## How to obtain the woff2

1. Download the variable font (`.ttf` variable axis) from the source above.
2. Convert/subset to `woff2` (e.g. with
   [`fonttools`](https://github.com/fonttools/fonttools) +
   [`woff2`](https://github.com/google/woff2), or
   [glyphhanger](https://github.com/zachleat/glyphhanger) for subsetting).
   Keep it a **variable** woff2 so the full `100 900` weight range works.
3. Save it here using the filename in the table above.

## Important: keep things in sync

If you change a filename, typeface, or family name, update **both**:

- `src/styles/fonts.css` — the `@font-face { src: url(...) }` and the
  metric-override fallback values (`size-adjust`, `ascent-override`,
  `descent-override`, `line-gap-override`). Re-tune these to the new typeface
  using a tool like the [Fallback Font Generator](https://screenspan.net/fallback)
  to keep CLS low (Requirement 39.3).
- `index.html` — the `<link rel="preload" as="font" ...>` tags for the critical
  display + sans fonts.
- `src/index.css` — the `--font-display` / `--font-sans` / `--font-mono` token
  stacks (the matching `* Fallback` family must be listed right after the real
  family).
