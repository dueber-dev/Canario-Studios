/*!
 * Camera interpolation adapted from Glyph Portal © 2026 Christian Katzmann. MIT.
 * Origin: UsefulPortal.astro on https://ktzm.dk → UsefulPortal.tsx → ClarityPortal.tsx.
 * A scroll-driven camera through live type. Keep this notice with copies.
 * Canario adaptation: outlined wordmark, fixed Signal Dot destination, native Astro.
 */
import { gsap } from 'gsap';
import type { createSignalSurface } from './signal-surface';
import { ScrollCamera } from './scroll-camera';
import { createSignalIntro } from './signal-intro';
import { createSignalClosing } from './signal-closing';
import { playWordmarkEntry } from './wordmark-entry';

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
  // The square dot of "studios" turns on its own centre while the wordmark is in view.
  const studiosSpin = gsap.to(art.querySelector('[data-studios-dot]'), {
    rotation: 360, duration: 4, ease: 'none', repeat: -1, transformOrigin: '50% 50%', paused: true,
  });
  const field = hero.querySelector<HTMLElement>('[data-signal-surface]')!;
  const introElement = hero.querySelector<HTMLElement>('[data-signal-intro]')!;
  const intro = createSignalIntro(introElement);
  const closing = createSignalClosing(hero.querySelector<HTMLElement>('[data-signal-closing]')!);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const events = new AbortController();
  const bounds = wordmark.getBBox();
  const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  const target = { x: dot.cx.baseVal.value, y: dot.cy.baseVal.value, radius: dot.r.baseVal.value };
  let width = 1, height = 1, travel = 1, startScale = 1, endScale = 1;
  let progress = 0;
  let scrollTarget = 0;
  // A shared clock prevents the text from advancing before a fast zoom finishes.
  // SIGNAL keeps its 0–1 timings; the closing extends the same clock to hold "señal".
  const sequenceEnd = 1.25;
  const camera = new ScrollCamera(0.12, sequenceEnd);
  const zoomEnd = 0.29;
  let snapNextFrame = true;
  let holdingScene = false;
  let previousTone = '';
  let pointer = { x: 0, y: 0 };
  let visible = true;
  let disposed = false;
  let frame = 0;
  let idleTime = 0;
  let lastFrameTime = 0;
  const drift = { x: 0, y: 0 };
  let loadingSurface = false;
  let surface: ReturnType<typeof createSignalSurface> | undefined;
  let stopEntry: (() => void) | undefined;

  function updateSurface() {
    const running = (visible || holdingScene) && !document.hidden && !reducedMotion.matches && progress < 0.28;
    surface?.setRunning(running);
    // Reduced motion leaves the dot upright.
    if (reducedMotion.matches) studiosSpin.pause(0);
    else studiosSpin.paused(!running);
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

  function paint(now = performance.now()) {
    frame = 0;
    if (disposed) return;
    const heroTop = hero.getBoundingClientRect().top;
    scrollTarget = reducedMotion.matches ? 0 : clamp(-heroTop / travel) * sequenceEnd;
    const dt = lastFrameTime ? Math.min((now - lastFrameTime) / 1000, 0.05) : 1 / 60;
    lastFrameTime = now;
    if (snapNextFrame || reducedMotion.matches) {
      camera.reset(scrollTarget);
      snapNextFrame = false;
    }
    const sequence = camera.step(scrollTarget, document.hidden ? 0 : dt);
    progress = clamp(sequence / zoomEnd);
    // Preserve the scene when a native scroll fling has already passed the pin.
    // No wheel/touch event is consumed, and explicit navigation can skip the scene.
    holdingScene = !reducedMotion.matches && heroTop <= -travel && sequence < sequenceEnd - 0.0001;
    hero.toggleAttribute('data-holding-scene', holdingScene);
    const idleActive = (visible || holdingScene) && !document.hidden && !reducedMotion.matches && progress < 0.16;
    if (idleActive) idleTime += dt;
    const follow = 1 - Math.exp(-dt * 3.5);
    drift.x += (pointer.x - drift.x) * follow;
    drift.y += (pointer.y - drift.y) * follow;
    const floatWeight = reducedMotion.matches ? 0 : 1 - smooth(0.005, 0.16, progress);
    const floatX = (Math.sin(idleTime * 0.57) * 3 + drift.x * 5) * floatWeight;
    const floatY = (Math.sin(idleTime * 0.82) * 8 + drift.y * 4) * floatWeight;
    const floatRoll = Math.sin(idleTime * 0.46) * 0.16 * floatWeight;
    // Use the complete camera range so the same timeline plays backward on scroll-up.
    // A shortened end range would leave a static tail that made the reverse feel stuck.
    const t = clamp(progress);
    const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
    const scale = Math.exp(Math.log(startScale) + Math.log(endScale / startScale) * eased);
    const blend = (1 / scale - 1 / startScale) / (1 / endScale - 1 / startScale);
    const cx = center.x + (target.x - center.x) * blend;
    const cy = center.y + (target.y - center.y) * blend;
    // Pointer steers the approach only. Both endpoints remain exactly on the logo/dot.
    const arc = Math.sin(Math.PI * eased) * (1 - smooth(0.65, 1, t));
    const x = width / 2 + pointer.x * Math.min(56, width * 0.04) * arc + floatX;
    const y = height * (0.43 + 0.07 * eased) + pointer.y * 24 * arc + floatY;
    const roll = 5 * smooth(0.03, 0.35, t) * (1 - smooth(0.55, 0.9, t)) + floatRoll;
    wordmark.setAttribute('transform', `translate(${x} ${y}) scale(${scale}) rotate(${roll}) translate(${-cx} ${-cy})`);
    field.style.opacity = String(1 - smooth(0.015, 0.28, progress));
    const entered = t >= 1;
    // End scale already covers all four corners; switching layers cannot flash white.
    stage.style.backgroundColor = entered ? 'var(--canario-signal)' : 'var(--canario-paper)';
    art.style.visibility = entered ? 'hidden' : 'visible';
    intro.render(sequence, reducedMotion.matches);
    closing.render(sequence, reducedMotion.matches);
    hero.dataset.progress = progress.toFixed(5);
    hero.dataset.sequence = sequence.toFixed(5);
    hero.dataset.scrollTarget = scrollTarget.toFixed(5);
    const tone = sequence >= 0.895 ? 'dark' : sequence >= 0.575 ? 'light' : progress >= 0.8 ? 'yellow' : 'light';
    hero.dataset.tone = tone;
    if (tone !== previousTone) {
      previousTone = tone;
      hero.dispatchEvent(new Event('signal:scenechange'));
    }
    updateSurface();
    if (!document.hidden && (idleActive || camera.isMoving(scrollTarget))) schedule();
    else lastFrameTime = 0;
  }

  function schedule() {
    if (!frame && !disposed) frame = requestAnimationFrame(paint);
  }

  function guardSceneDuringScroll() {
    // Mark the scene before the next paint. This closes the one-frame gap between
    // the browser's native scroll jump and the camera's interpolated progress.
    if (!reducedMotion.matches && hero.getBoundingClientRect().top <= -travel && camera.progress < sequenceEnd - 0.0001) {
      holdingScene = true;
      hero.setAttribute('data-holding-scene', '');
    }
    schedule();
  }

  function layout() {
    if (disposed) return;
    cancelAnimationFrame(frame);
    frame = 0;
    hero.dataset.motion = reducedMotion.matches ? 'reduced' : 'full';
    // Preserve SIGNAL's scroll distance and timings when extending the clock.
    hero.style.setProperty('--sequence-height', `${(1 + 6.6 * sequenceEnd) * 100}svh`);
    width = stage.clientWidth;
    height = reducedMotion.matches ? window.innerHeight : stage.clientHeight;
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
    lastFrameTime = 0;
    if (!visible && !camera.isMoving(scrollTarget)) { cancelAnimationFrame(frame); frame = 0; }
    updateSurface();
    if (visible) schedule();
  });
  visibility.observe(stage);
  window.addEventListener('scroll', guardSceneDuringScroll, { passive: true, signal: events.signal });
  window.addEventListener('resize', layout, { passive: true, signal: events.signal });
  window.addEventListener('pointermove', chooseApproach, { passive: true, signal: events.signal });
  window.addEventListener('pageshow', () => { snapNextFrame = true; layout(); }, { signal: events.signal });
  hero.querySelector('.skip-hero')?.addEventListener('click', (event) => {
    if (reducedMotion.matches) return;
    event.preventDefault();
    camera.reset(zoomEnd);
    window.scrollTo({ top: window.scrollY + hero.getBoundingClientRect().top + travel * zoomEnd / sequenceEnd, behavior: 'instant' });
    introElement.focus({ preventScroll: true });
    paint();
  }, { signal: events.signal });
  document.addEventListener('visibilitychange', () => {
    lastFrameTime = 0;
    updateSurface();
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else schedule();
  }, { signal: events.signal });
  reducedMotion.addEventListener('change', layout, { signal: events.signal });

  function dispose() {
    disposed = true;
    stopEntry?.();
    studiosSpin.kill();
    cancelAnimationFrame(frame);
    events.abort();
    observer.disconnect();
    visibility.disconnect();
    surface?.dispose();
    hero.removeAttribute('data-holding-scene');
  }
  document.addEventListener('astro:before-swap', dispose, { once: true, signal: events.signal });
  if (import.meta.hot) import.meta.hot.dispose(dispose);
  layout();
  // The opening plays only from the top; a restored scroll position starts settled.
  if (!reducedMotion.matches && camera.progress === 0) stopEntry = playWordmarkEntry(wordmark, dot);
  document.documentElement.removeAttribute('data-intro');
  return dispose;
}
