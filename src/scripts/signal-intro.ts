import { gsap } from 'gsap';
import { createSignalNetwork } from './signal-network';

/**
 * The statement scene, on black after the zoom: heading, the three possibilities and
 * the network box, as a paused GSAP timeline whose playhead is the hero's shared clock.
 */
export function createSignalIntro(scene: HTMLElement) {
  const words = [...scene.querySelectorAll<HTMLElement>('[data-statement-word]')];
  const fill = scene.querySelector<HTMLElement>('.signal-statement__fill')!;
  const examples = [...scene.querySelectorAll<HTMLElement>('[data-signal-example]')];
  const lines = [...scene.querySelectorAll<HTMLElement>('[data-statement-line]')];
  const box = scene.querySelector<HTMLElement>('[data-network-box]')!;
  const edges = [...box.querySelectorAll<HTMLElement>('[data-edge]')];
  const network = box.querySelector<HTMLElement>('[data-network]')!;
  const canvas = box.querySelector<HTMLCanvasElement>('[data-network-canvas]')!;
  const live = createSignalNetwork(canvas);
  if (live) box.dataset.renderer = 'canvas';

  // Words rise out of their mask's baseline, and leave upward the same way. No blur.
  const below = { yPercent: 115, rotation: 4 };
  const rise = { yPercent: 0, rotation: 0, duration: 0.05, ease: 'expo.out', stagger: 0.006 };
  const leave = { yPercent: -120, duration: 0.03, ease: 'power3.in', stagger: 0.003, immediateRender: false };
  const dim = '#999';
  // Each edge is drawn from one corner, clockwise from the top-left.
  const drawn = 'inset(0% 0% 0% 0%)';
  const undrawn = ['inset(0% 100% 0% 0%)', 'inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 100%)', 'inset(100% 0% 0% 0%)'];

  const timeline = gsap.timeline({ paused: true })
    // The heading lands while the zoom closes on the black stem.
    .fromTo(words, below, rise, 0.235)
    // The network appears once its box is drawn.
    .fromTo(network, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.04, ease: 'power2.out' }, 0.33)
    .fromTo(lines, below, { ...rise, stagger: 0.012 }, 0.31)
    // Only "mejor" is lit, left to right, in the signal colour.
    .fromTo(fill, { clipPath: 'inset(0% 100% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 0.035, ease: 'power2.inOut',
    }, 0.345);
  edges.forEach((edge, index) => {
    timeline
      .fromTo(edge, { clipPath: undrawn[index] }, { clipPath: drawn, duration: 0.025, ease: 'power2.inOut' }, 0.29 + index * 0.01)
      .fromTo(edge, { clipPath: drawn }, {
        clipPath: undrawn[index], duration: 0.02, ease: 'power2.in', immediateRender: false,
      }, 0.7 + (edges.length - 1 - index) * 0.006);
  });
  // One possibility at a time is solid white; the others stay dim.
  const white = { color: '#fff', duration: 0.02, ease: 'none', immediateRender: false };
  examples.forEach((example, index) => {
    const start = 0.4 + index * 0.1;
    timeline.fromTo(example, { color: dim }, white, start);
    if (index < examples.length - 1) {
      timeline.fromTo(example, { color: '#fff' }, { ...white, color: dim }, start + 0.1);
    }
  });
  timeline
    .fromTo([...words, ...lines], { yPercent: 0 }, leave, 0.7)
    .fromTo(network, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.03, ease: 'none', immediateRender: false }, 0.7);

  const animated = [...words, fill, ...examples, ...lines, ...edges, network];
  let cleared = false;

  function render(progress: number, reducedMotion: boolean) {
    if (reducedMotion) {
      // Reduced motion reads everything in normal flow, without any inline state.
      if (!cleared) gsap.set(animated, { clearProps: 'all' });
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
    live?.setRunning(progress > 0.32 && progress < 0.73);
    scene.dataset.progress = progress.toFixed(5);
    scene.dataset.phase = progress < 0.235 ? 'portal' : progress < 0.4 ? 'statement'
      : progress < 0.7 ? ['process', 'identity', 'connection'][Math.min(2, Math.floor((progress - 0.4) / 0.1))] : 'signal';
  }

  return { render, resize: () => live?.resize(), dispose: () => live?.dispose() };
}
