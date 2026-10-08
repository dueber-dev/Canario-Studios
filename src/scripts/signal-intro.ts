import { gsap } from 'gsap';
import { createSignalNetwork } from './signal-network';

const glyphs = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789#/+_';

/** Reveals text left to right through a short band of changing glyphs. Deterministic:
 *  the same progress always draws the same characters, so scrubbing back retraces it. */
function decode(text: string, progress: number) {
  const band = 6;
  const shown = Math.floor(progress * (text.length + band));
  const step = Math.floor(progress * 48);
  return [...text].map((char, index) => {
    if (index >= shown) return '';
    if (index < shown - band || char === ' ') return char;
    return glyphs[(index * 7 + step * 13) % glyphs.length];
  }).join('');
}

/**
 * The statement scene, on black after the zoom: heading, the network box and the three
 * possibilities, as a paused GSAP timeline whose playhead is the hero's shared clock.
 */
export function createSignalIntro(scene: HTMLElement) {
  const words = [...scene.querySelectorAll<HTMLElement>('[data-statement-word]')];
  const fill = scene.querySelector<HTMLElement>('.signal-statement__fill')!;
  const examples = [...scene.querySelectorAll<HTMLElement>('[data-signal-example]')];
  const lines = [...scene.querySelectorAll<HTMLElement>('[data-statement-line]')];
  const box = scene.querySelector<HTMLElement>('[data-network-box]')!;
  const edges = [...box.querySelectorAll<HTMLElement>('[data-edge]')];
  const [column, row] = [...box.querySelectorAll<HTMLElement>('[data-rule]')];
  const decoders = [...box.querySelectorAll<HTMLElement>('[data-decode]')]
    .map((element) => ({ element, text: element.textContent ?? '', progress: { value: 0 } }));
  const network = box.querySelector<HTMLElement>('[data-network]')!;
  const live = createSignalNetwork(box.querySelector<HTMLCanvasElement>('[data-network-canvas]')!);
  if (live) box.dataset.renderer = 'canvas';

  // Words rise out of their mask's baseline, and leave upward the same way. No blur.
  const below = { yPercent: 115, rotation: 4 };
  const rise = { yPercent: 0, rotation: 0, duration: 0.05, ease: 'expo.out', stagger: 0.006 };
  const leave = { yPercent: -120, duration: 0.03, ease: 'power3.in', stagger: 0.003, immediateRender: false };
  const exit = 0.71;

  const timeline = gsap.timeline({ paused: true })
    // The heading lands while the zoom closes on the black stem.
    .fromTo(words, below, rise, 0.235)
    // Only "mejor" is lit, left to right, in the signal colour.
    .fromTo(fill, { clipPath: 'inset(0% 100% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 0.035, ease: 'power2.inOut',
    }, 0.3)
    .fromTo(network, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.04, ease: 'power2.out' }, 0.355)
    // The box is built on the left, then scrolling slides it right to make room for the list.
    .fromTo(box, { '--shift': 1 }, { '--shift': 0, duration: 0.06, ease: 'power3.inOut', immediateRender: false }, 0.44);

  // Lines are drawn from one end: the box clockwise from the top-left, then its two rules.
  const drawn = 'inset(0% 0% 0% 0%)';
  const draw = (target: HTMLElement, from: string, at: number) => timeline
    .fromTo(target, { clipPath: from }, { clipPath: drawn, duration: 0.025, ease: 'power2.inOut' }, at)
    .fromTo(target, { clipPath: drawn }, { clipPath: from, duration: 0.02, ease: 'power2.in', immediateRender: false }, exit);
  ['inset(0% 100% 0% 0%)', 'inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 100%)', 'inset(100% 0% 0% 0%)']
    .forEach((from, index) => draw(edges[index], from, 0.3 + index * 0.01));
  draw(column, 'inset(0% 0% 100% 0%)', 0.345);
  draw(row, 'inset(0% 100% 0% 0%)', 0.36);

  // "Señal" and its definition decode in, before the box moves.
  decoders.forEach(({ element, text, progress }, index) => {
    const write = () => { element.textContent = decode(text, progress.value); };
    write();
    timeline
      .fromTo(progress, { value: 0 }, { value: 1, duration: 0.03 + index * 0.02, ease: 'none', onUpdate: write }, 0.37 + index * 0.01)
      .fromTo(progress, { value: 1 }, { value: 0, duration: 0.02, ease: 'none', onUpdate: write, immediateRender: false }, exit);
  });

  // Each possibility appears solid white in its turn; the one before it then dims.
  examples.forEach((example, index) => {
    const start = 0.49 + index * 0.07;
    timeline.fromTo(lines[index], below, { ...rise, duration: 0.04 }, start);
    if (index > 0) {
      timeline.fromTo(examples[index - 1], { color: '#fff' }, { color: '#999', duration: 0.02, ease: 'none', immediateRender: false }, start);
    }
  });
  timeline
    .fromTo([...words, ...lines], { yPercent: 0 }, leave, exit)
    .fromTo(network, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.03, ease: 'none', immediateRender: false }, exit);

  const animated = [...words, fill, box, ...examples, ...lines, ...edges, column, row, network];
  let cleared = false;

  function render(progress: number, reducedMotion: boolean) {
    if (reducedMotion) {
      // Reduced motion reads everything in normal flow, without any inline state.
      if (!cleared) {
        gsap.set(animated, { clearProps: 'all' });
        decoders.forEach(({ element, text }) => { element.textContent = text; });
      }
      cleared = true;
      live?.setRunning(false);
      scene.dataset.phase = 'reduced';
      return;
    }
    // Coming back from reduced motion, sweep once so every tween reapplies its state.
    if (cleared) timeline.progress(1).progress(0);
    cleared = false;
    timeline.time(progress);
    // The node wanders on its own clock while the box is on screen, even when scrolling stops.
    live?.setRunning(progress > 0.35 && progress < exit + 0.03);
    scene.dataset.progress = progress.toFixed(5);
    scene.dataset.phase = progress < 0.235 ? 'portal' : progress < 0.44 ? 'statement' : progress < 0.49 ? 'slide'
      : progress < exit ? ['process', 'identity', 'connection'][Math.min(2, Math.floor((progress - 0.49) / 0.07))] : 'signal';
  }

  return { render, resize: () => live?.resize(), dispose: () => live?.dispose() };
}
