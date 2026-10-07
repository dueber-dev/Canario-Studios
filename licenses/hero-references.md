# Hero references

The user supplied two component references on 2026-10-07.

- **DottedSurface:** a Three.js surface with a 40 × 60 point grid and two sine waves. The Astro implementation in `src/scripts/signal-surface.ts` adapts that geometry and camera, with circular sprites, time-based animation, randomized signal colors, visibility controls, and resource cleanup. No upstream author or license notice was included in the supplied surface snippet.
- **Glyph Portal:** the camera interpolation in `src/scripts/signal-hero.ts` is adapted from the supplied component, which includes the following notice. The implementation preserves that notice and replaces live type selection with the supplied Canario vector wordmark and its fixed yellow dot.

```text
Glyph Portal © 2026 Christian Katzmann. MIT.
Origin: UsefulPortal.astro on https://ktzm.dk → UsefulPortal.tsx → ClarityPortal.tsx.
A scroll-driven camera through live type. Keep this notice with copies.
```

The outlined logo in `src/assets/canario-wordmark.svg` was extracted from the user's `brand/logo/sketches/canario studios logo.svg`. The source file is unchanged. Only the wordmark group is included in the web asset; off-artboard artwork and an embedded raster image are excluded. The logo's original yellow is `#F0BC15`. No font files are needed to render it.
