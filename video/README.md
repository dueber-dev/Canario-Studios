# Canario hero video — first composition

Source: `綺麗な [693413673891000205].mp4` (720×1280, 30 fps, 8.266667 s). The original file remains untouched.

Deliverables:

- `canario-hero-1920x1080.mp4`: silent, 16:9 H.264, 30 fps, 8.266667 s, 2.35 MB. Intended for desktop website hero.
- `canario-mobile-720x1140.mp4`: silent, cropped source, 30 fps, 8.266667 s, 1.65 MB. Intended for small screens.
- `canario-hero-poster.webp`: still frame for loading or reduced motion.

The visible credit in the original occupies the lower portion of the portrait frame. The desktop foreground uses source region `crop=720:900:0:170`; the mobile version uses `crop=720:1140:0:0`. No watermark pixels are used in either export. The desktop foreground is keyed against its blue sky and composited over a static wide sky plate with feathered lateral edges. The canary's movement is from the original footage. The right end of the foreground branch softly fades into the extended background.

The extended sky plate was made with Codex built-in image generation, without Higgsfield credits, from this prompt:

> Use case: photorealistic-natural. Asset type: wide 16:9 background plate for compositing the user's original real canary video into a horizontal website hero. Input image: reference for exact outdoor daylight lighting, blue sky hue, natural depth of field and authentic branch setting ONLY; do not include or replicate the bird. Create a broad, calm, realistic clear blue daytime sky with extremely subtle atmospheric tonal variation and a few faint defocused branches far in the lower corners. Keep the entire central and right-central field as clean unobstructed blue sky so the original moving canary video can be placed over it. Wildlife cinematography look, crisp natural sunlight, unprocessed and believable. No bird or other animals, no foreground branch, no text, no watermark, no logos, no surreal or stylized effects.

Validation: inspected desktop frames near 0 s, 4 s and 8 s and a mobile frame near 4 s; checked duration, dimensions and output sizes with `ffprobe`.

Rights to remove the source credit and publish the footage were not independently verified.
