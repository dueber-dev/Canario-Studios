const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

/** A scroll-led statement: empty yellow, reveal, hold, then a quiet exit. */
export function mountSignalIntro(scene: HTMLElement) {
  const stage = scene.querySelector<HTMLElement>('[data-signal-intro-stage]')!;
  const copy = scene.querySelector<HTMLElement>('.signal-intro__copy')!;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  let target = 0;
  let progress = 0;
  let frame = 0;
  let previous = performance.now();
  let active = true;
  let disposed = false;
  let travel = 1;

  function measure() {
    travel = Math.max(1, scene.offsetHeight - stage.clientHeight);
  }

  function paint(time = performance.now()) {
    frame = 0;
    if (disposed) return;
    const dt = Math.min(Math.max(0, time - previous) / 1000, 0.05);
    previous = time;
    target = reduceMotion.matches ? 0.45 : clamp(-scene.getBoundingClientRect().top / travel);
    const ease = 1 - Math.exp(-dt / 0.085);
    progress += (target - progress) * ease;
    const reveal = smooth(0.12, 0.35, progress);
    const hold = smooth(0.35, 0.68, progress);
    const exit = smooth(0.72, 0.94, progress);
    const visibility = reduceMotion.matches ? 1 : reveal * (1 - exit * 0.92);
    const y = reduceMotion.matches ? 0 : (1 - reveal) * 34 - exit * 18;
    const scale = reduceMotion.matches ? 1 : 0.965 + reveal * 0.035 - exit * 0.01;
    const blur = reduceMotion.matches ? 0 : (1 - reveal) * 8 + exit * 3;

    copy.style.opacity = visibility.toFixed(4);
    copy.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    copy.style.filter = `blur(${blur.toFixed(2)}px)`;
    scene.dataset.progress = progress.toFixed(5);
    scene.dataset.phase = reduceMotion.matches ? 'reduced' : progress < 0.12 ? 'empty' : progress < 0.72 ? 'statement' : 'release';
    scene.dataset.hold = hold.toFixed(4);

    if (active && !document.hidden && (Math.abs(target - progress) > 0.0002 || (!reduceMotion.matches && progress < 0.76))) {
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
  reduceMotion.addEventListener('change', () => { previous = performance.now(); schedule(); }, { signal: events.signal });

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
