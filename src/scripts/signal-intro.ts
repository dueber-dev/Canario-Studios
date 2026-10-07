const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

import { ScrollCamera } from './scroll-camera';

/** A scroll-led statement: empty yellow, reveal, hold, then a quiet exit. */
export function mountSignalIntro(scene: HTMLElement) {
  const stage = scene.querySelector<HTMLElement>('[data-signal-intro-stage]')!;
  const copy = scene.querySelector<HTMLElement>('.signal-intro__copy')!;
  const lineOne = scene.querySelector<HTMLElement>('[data-intro-line="one"]')!;
  const lineTwo = scene.querySelector<HTMLElement>('[data-intro-line="two"]')!;
  const accentBlack = scene.querySelector<HTMLElement>('.signal-intro__accent-black')!;
  const accentWhite = scene.querySelector<HTMLElement>('.signal-intro__accent-white')!;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  let target = 0;
  let progress = 0;
  let frame = 0;
  let previous = performance.now();
  let active = true;
  let disposed = false;
  let travel = 1;
  const camera = new ScrollCamera();
  let snapNextFrame = true;

  function measure() {
    travel = Math.max(1, scene.offsetHeight - stage.clientHeight);
  }

  function paint(time = performance.now()) {
    frame = 0;
    if (disposed) return;
    const dt = Math.min(Math.max(0, time - previous) / 1000, 0.05);
    previous = time;
    target = reduceMotion.matches ? 0.5 : clamp(-scene.getBoundingClientRect().top / travel);
    if (snapNextFrame || reduceMotion.matches) {
      camera.reset(target);
      snapNextFrame = false;
    }
    progress = reduceMotion.matches ? target : camera.step(target, dt);
    const reveal = smooth(0.035, 0.2, progress);
    const firstLine = smooth(0.035, 0.13, progress);
    const secondLine = smooth(0.09, 0.24, progress);
    const hold = smooth(0.35, 0.68, progress);
    const exit = smooth(0.72, 0.94, progress);
    const visibility = reduceMotion.matches ? 1 : reveal * (1 - exit * 0.92);
    const y = reduceMotion.matches ? 0 : (1 - reveal) * 34 - exit * 18;
    const scale = reduceMotion.matches ? 1 : 0.965 + reveal * 0.035 - exit * 0.01;
    const blur = reduceMotion.matches ? 0 : (1 - reveal) * 8 + exit * 3;

    copy.style.opacity = visibility.toFixed(4);
    lineOne.style.opacity = (reduceMotion.matches ? 1 : firstLine).toFixed(4);
    lineTwo.style.opacity = (reduceMotion.matches ? 1 : secondLine).toFixed(4);
    const highlight = reduceMotion.matches ? 0 : smooth(0.56, 0.7, progress);
    accentBlack.style.opacity = (1 - highlight).toFixed(4);
    accentWhite.style.opacity = highlight.toFixed(4);
    copy.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    copy.style.filter = `blur(${blur.toFixed(2)}px)`;
    scene.dataset.progress = progress.toFixed(5);
    scene.dataset.phase = reduceMotion.matches ? 'reduced' : progress < 0.12 ? 'empty' : progress < 0.72 ? 'statement' : 'release';
    scene.dataset.hold = hold.toFixed(4);

    if (active && !document.hidden && (camera.isMoving(target) || (!reduceMotion.matches && progress < 0.76))) {
      frame = requestAnimationFrame(paint);
    }
  }

  function schedule() {
    if (!frame && active && !disposed) frame = requestAnimationFrame(paint);
  }

  function onScroll() {
    schedule();
  }

  function onVisibility() {
    active = !document.hidden;
    previous = performance.now();
    if (active) schedule();
  }

  const observer = new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting || entry.intersectionRatio > 0;
    if (active) schedule();
    else { cancelAnimationFrame(frame); frame = 0; }
  }, { rootMargin: '100% 0px' });

  scene.dataset.ready = '';
  measure();
  observer.observe(scene);
  window.addEventListener('scroll', onScroll, { passive: true, signal: events.signal });
  window.addEventListener('resize', () => { measure(); schedule(); }, { passive: true, signal: events.signal });
  document.addEventListener('visibilitychange', onVisibility, { signal: events.signal });
  reduceMotion.addEventListener('change', () => { previous = performance.now(); snapNextFrame = true; schedule(); }, { signal: events.signal });

  function dispose() {
    disposed = true;
    cancelAnimationFrame(frame);
    events.abort();
    observer.disconnect();
  }
  document.addEventListener('astro:before-swap', dispose, { once: true, signal: events.signal });
  if (import.meta.hot) import.meta.hot.dispose(dispose);
  paint();
  return dispose;
}
