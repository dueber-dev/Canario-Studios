import { gsap } from 'gsap';

/**
 * SIGNAL's statement and possibilities as a paused GSAP timeline whose playhead is the
 * hero's shared clock: positions are sequence units, identical in either direction.
 */
export function createSignalIntro(scene: HTMLElement) {
  const wordsOf = (root: ParentNode) => [...root.querySelectorAll<HTMLElement>('[data-intro-word]')];
  const [first, second] = [...scene.querySelectorAll<HTMLElement>('[data-intro-line]')].map(wordsOf);
  const fill = scene.querySelector<HTMLElement>('.signal-intro__fill')!;
  const examples = [...scene.querySelectorAll<HTMLElement>('[data-signal-example]')];
  const exampleWords = examples.map(wordsOf);
  const backdrop = scene.querySelector<HTMLElement>('.signal-intro__backdrop')!;
  const paper = scene.querySelector<HTMLElement>('.signal-intro__paper')!;

  // Words rise out of their line's baseline, and leave upward the same way. No blur.
  const below = { yPercent: 115, rotation: 6 };
  const rise = { yPercent: 0, rotation: 0, duration: 0.05, ease: 'expo.out', stagger: 0.008 };
  const leave = { yPercent: -120, duration: 0.03, ease: 'power3.in', stagger: 0.004, immediateRender: false };
  // Backgrounds change with a hard edge rising from the bottom instead of a crossfade.
  const covered = { clipPath: 'inset(100% 0% 0% 0%)' };
  const cover = (duration: number) => ({ clipPath: 'inset(0% 0% 0% 0%)', duration, ease: 'power3.inOut' });

  const timeline = gsap.timeline({ paused: true })
    // The first line lands while the zoom closes on the dot; the second follows.
    .fromTo(first, below, rise, 0.222)
    .fromTo(second, below, rise, 0.35)
    // Only "funcionar mejor" is lit, left to right, then held for reading.
    .fromTo(fill, { clipPath: 'inset(0% 100% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 0.035, ease: 'power2.inOut',
    }, 0.425)
    .fromTo([...first, ...second], { yPercent: 0 }, leave, 0.515)
    .fromTo(paper, covered, cover(0.04), 0.555);
  examples.forEach((example, index) => {
    const start = 0.605 + index * 0.08;
    timeline.fromTo(exampleWords[index], below, rise, start);
    // Earlier possibilities stay legible at half strength.
    if (index < 2) timeline.fromTo(example, { opacity: 1 }, { opacity: 0.5, duration: 0.045, ease: 'none' }, start + 0.08);
  });
  timeline
    .fromTo(exampleWords.flat(), { yPercent: 0 }, leave, 0.845)
    // Black is complete as the closing line rises (see signal-closing.ts).
    .fromTo(backdrop, covered, cover(0.06), 0.865);

  const animated = [...first, ...second, fill, ...examples, ...exampleWords.flat(), paper, backdrop];
  let cleared = false;

  function render(progress: number, reducedMotion: boolean) {
    if (reducedMotion) {
      // Reduced motion reads everything in normal flow, without any inline state.
      if (!cleared) gsap.set(animated, { clearProps: 'all' });
      cleared = true;
      scene.dataset.phase = 'reduced';
      return;
    }
    // Coming back from reduced motion, sweep once so every tween reapplies its state.
    if (cleared) timeline.progress(1).progress(0);
    cleared = false;
    timeline.time(progress);
    scene.dataset.progress = progress.toFixed(5);
    scene.dataset.phase = progress < 0.225 ? 'portal' : progress < 0.555 ? 'statement'
      : progress < 0.605 ? 'paper' : progress < 0.88 ? 'examples' : 'signal';
  }

  return { render };
}
