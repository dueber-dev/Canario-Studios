/*!
 * Camera interpolation adapted from Glyph Portal © 2026 Christian Katzmann. MIT.
 * Origin: UsefulPortal.astro on https://ktzm.dk → UsefulPortal.tsx → ClarityPortal.tsx.
 * A scroll-driven camera through live type. Keep this notice with copies.
 * Canario adaptation: outlined wordmark, fixed Signal Dot destination, native Astro.
 */
import type { createSignalSurface } from './signal-surface';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

export function mountSignalHero(hero: HTMLElement) {
  const stage = hero.querySelector<HTMLElement>('[data-hero-stage]')!;
  const art = hero.querySelector<SVGSVGElement>('[data-portal-art]')!;
  const wordmark = art.querySelector<SVGGElement>('[data-wordmark]')!;
  const dot = art.querySelector<SVGCircleElement>('[data-signal-dot]')!;
  const field = hero.querySelector<HTMLElement>('[data-signal-surface]')!;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const events = new AbortController();
  const bounds = wordmark.getBBox();
  const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  const target = { x: dot.cx.baseVal.value, y: dot.cy.baseVal.value, radius: dot.r.baseVal.value };
  let width = 1, height = 1, travel = 1, startScale = 1, endScale = 1;
  let progress = 0;
  let pointer = { x: 0, y: 0 };
  let visible = true;
  let disposed = false;
  let frame = 0;
  let loadingSurface = false;
  let surface: ReturnType<typeof createSignalSurface> | undefined;

  function updateSurface() {
    surface?.setRunning(visible && !document.hidden && !reducedMotion.matches && progress < 0.28);
  }

  async function loadSurface() {
    if (surface || loadingSurface || reducedMotion.matches || disposed) return;
    loadingSurface = true;
    try {
      const { createSignalSurface } = await import('./signal-surface');
      if (disposed || reducedMotion.matches) return;
      surface = createSignalSurface(field);
      updateSurface();
    } catch (error) {
      // The server-rendered dot surface remains available without WebGL.
      field.dataset.renderer = 'static';
      if (import.meta.env.DEV) console.warn('Signal surface fallback:', error);
    } finally {
      loadingSurface = false;
    }
  }

  function paint() {
    frame = 0;
    if (disposed) return;
    progress = reducedMotion.matches ? 0 : clamp(-hero.getBoundingClientRect().top / travel);
    const t = clamp(progress / 0.84);
    const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
    const scale = Math.exp(Math.log(startScale) + Math.log(endScale / startScale) * eased);
    const blend = (1 / scale - 1 / startScale) / (1 / endScale - 1 / startScale);
    const cx = center.x + (target.x - center.x) * blend;
    const cy = center.y + (target.y - center.y) * blend;
    // Pointer steers the approach only. Both endpoints remain exactly on the logo/dot.
    const arc = Math.sin(Math.PI * eased) * (1 - smooth(0.65, 1, t));
    const x = width / 2 + pointer.x * Math.min(56, width * 0.04) * arc;
    const y = height * (0.43 + 0.07 * eased) + pointer.y * 24 * arc;
    const roll = (pointer.x * 1.5 - 1) * smooth(0.06, 0.5, t) * (1 - smooth(0.62, 0.92, t));
    wordmark.setAttribute('transform', `translate(${x} ${y}) scale(${scale}) rotate(${roll}) translate(${-cx} ${-cy})`);
    field.style.opacity = String(1 - smooth(0.015, 0.28, progress));
    const entered = t >= 1;
    // End scale already covers all four corners; switching layers cannot flash white.
    stage.style.backgroundColor = entered ? 'var(--canario-signal)' : 'var(--canario-paper)';
    art.style.visibility = entered ? 'hidden' : 'visible';
    hero.dataset.progress = progress.toFixed(5);
    updateSurface();
  }

  function schedule() {
    if (!frame && !disposed) frame = requestAnimationFrame(paint);
  }

  function layout() {
    if (disposed) return;
    hero.dataset.motion = reducedMotion.matches ? 'reduced' : 'full';
    width = stage.clientWidth;
    height = stage.clientHeight;
    if (!width || !height) return;
    travel = Math.max(1, hero.offsetHeight - height);
    startScale = Math.min(width * (width <= 600 ? 0.9 : 0.86), 1500) / bounds.width;
    endScale = Math.max(startScale * 1.01, Math.hypot(width, height) / (2 * target.radius) * 1.06);
    art.setAttribute('viewBox', `0 0 ${width} ${height}`);
    hero.dataset.ready = '';
    paint();
    if (reducedMotion.matches) {
      surface?.dispose();
      surface = undefined;
    } else {
      void loadSurface();
    }
  }

  function chooseApproach(event: PointerEvent) {
    if (!finePointer.matches || reducedMotion.matches || progress > 0.04) return;
    pointer = { x: clamp(event.clientX / width) * 2 - 1, y: clamp(event.clientY / height) * 2 - 1 };
    schedule();
  }

  const observer = new ResizeObserver(layout);
  observer.observe(stage);
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updateSurface();
    if (visible) schedule();
  });
  visibility.observe(stage);
  window.addEventListener('scroll', schedule, { passive: true, signal: events.signal });
  window.addEventListener('resize', layout, { passive: true, signal: events.signal });
  window.addEventListener('pointermove', chooseApproach, { passive: true, signal: events.signal });
  window.addEventListener('pageshow', layout, { signal: events.signal });
  document.addEventListener('visibilitychange', updateSurface, { signal: events.signal });
  reducedMotion.addEventListener('change', layout, { signal: events.signal });

  function dispose() {
    disposed = true;
    cancelAnimationFrame(frame);
    events.abort();
    observer.disconnect();
    visibility.disconnect();
    surface?.dispose();
  }
  document.addEventListener('astro:before-swap', dispose, { once: true, signal: events.signal });
  if (import.meta.hot) import.meta.hot.dispose(dispose);
  layout();
  return dispose;
}
