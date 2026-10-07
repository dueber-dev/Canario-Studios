/** A decorative signal finder: a tracking ring and a slightly slower inner point. */
export function mountSignalCursor(cursor: HTMLElement) {
  const inner = cursor.querySelector<HTMLElement>('[data-cursor-dot]')!;
  const hero = document.querySelector<HTMLElement>('[data-signal-hero]');
  const signal = document.querySelector<SVGCircleElement>('[data-signal-dot]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const events = new AbortController();
  const target = { x: 0, y: 0 };
  const ring = { x: 0, y: 0 };
  const point = { x: 0, y: 0 };
  let active = false;
  let disposed = false;
  let frame = 0;
  let previousTime = 0;

  const enabled = () => pointer.matches && !motion.matches && !document.hidden;

  function paint(time: number) {
    frame = 0;
    if (!active || disposed || !enabled()) return;
    const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 1 / 60;
    previousTime = time;

    // Read hit targets before moving the follower. It never intercepts a hit itself.
    const progress = Number(hero?.dataset.progress ?? 1);
    const rect = progress < 0.14 ? signal?.getBoundingClientRect() : undefined;
    const detected = rect && Math.hypot(target.x - rect.x - rect.width / 2, target.y - rect.y - rect.height / 2) < rect.width / 2 + 30;
    const hit = document.elementFromPoint(target.x, target.y);
    const action = hit?.closest('a, button, input, textarea, select, [role="button"]');
    const onYellow = progress >= 0.84 || Boolean(hit?.closest('.signal-destination'));

    // Time-based damping: the point follows the ring, with its offset kept inside it.
    const ringEase = 1 - Math.exp(-dt / 0.055);
    const pointEase = 1 - Math.exp(-dt / 0.095);
    ring.x += (target.x - ring.x) * ringEase;
    ring.y += (target.y - ring.y) * ringEase;
    point.x += (ring.x - point.x) * pointEase;
    point.y += (ring.y - point.y) * pointEase;
    const dx = point.x - ring.x;
    const dy = point.y - ring.y;
    const limit = Math.min(1, 10 / (Math.hypot(dx, dy) || 1));

    cursor.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
    inner.style.transform = `translate(calc(-50% + ${dx * limit}px), calc(-50% + ${dy * limit}px))`;
    cursor.dataset.mode = detected ? 'signal' : action ? 'action' : 'idle';
    cursor.dataset.onYellow = String(onYellow);
    cursor.dataset.visible = 'true';

    // Stop as soon as the follower settles; pointer/scroll events wake it again.
    if (Math.hypot(target.x - ring.x, target.y - ring.y) + Math.hypot(dx, dy) > 0.03) schedule();
  }

  function schedule() {
    if (!frame && active && enabled() && !disposed) frame = requestAnimationFrame(paint);
  }

  function hide() {
    active = false;
    previousTime = 0;
    cancelAnimationFrame(frame);
    frame = 0;
    delete cursor.dataset.visible;
    delete cursor.dataset.pressed;
  }

  function move(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || !enabled()) { hide(); return; }
    target.x = event.clientX;
    target.y = event.clientY;
    if (!active) {
      ring.x = point.x = target.x;
      ring.y = point.y = target.y;
      previousTime = 0;
    }
    active = true;
    schedule();
  }

  const options = { passive: true, signal: events.signal };
  window.addEventListener('pointermove', move, options);
  window.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse') { hide(); return; }
    if (active) cursor.dataset.pressed = 'true';
  }, options);
  window.addEventListener('pointerup', () => { delete cursor.dataset.pressed; }, options);
  window.addEventListener('pointercancel', hide, options);
  document.addEventListener('pointerout', (event) => { if (!event.relatedTarget) hide(); }, options);
  window.addEventListener('blur', hide, options);
  window.addEventListener('scroll', schedule, options);
  hero?.addEventListener('signal:scenechange', schedule, options);
  window.addEventListener('resize', schedule, options);
  document.addEventListener('keydown', (event) => { if (event.key === 'Tab') hide(); }, { signal: events.signal });
  document.addEventListener('visibilitychange', hide, options);
  motion.addEventListener('change', hide, options);
  pointer.addEventListener('change', hide, options);

  function dispose() {
    hide();
    disposed = true;
    events.abort();
  }
  document.addEventListener('astro:before-swap', dispose, { once: true, signal: events.signal });
  if (import.meta.hot) import.meta.hot.dispose(dispose);
  return dispose;
}
