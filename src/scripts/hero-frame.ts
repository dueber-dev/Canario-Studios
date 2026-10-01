// Native sticky scrolling keeps wheel, touch and keyboard navigation intact.
// Only the visual frame is rate limited: a complete change takes at least 1.6s.
const stage = document.querySelector<HTMLElement>(".hero-stage")!;
const viewport = document.querySelector<HTMLElement>(".hero-viewport")!;
const preference = matchMedia("(prefers-reduced-motion: reduce)");
const lifetime = new AbortController();
const options = { passive: true, signal: lifetime.signal };
const MAX_PROGRESS_PER_SECOND = 0.625;
let progress = 0;
let target = 0;
let previous = 0;
let frame = 0;
let start = 0;
let distance = 1;

function render() {
  stage.style.setProperty("--hero-frame", progress.toFixed(5));
}

function tick(now: number) {
  // Cap elapsed time too: resuming a background tab must not cause a jump.
  const seconds = Math.min((now - previous) / 1000, 0.05);
  previous = now;
  const difference = target - progress;
  const step = Math.min(
    Math.abs(difference) * (1 - Math.exp(-seconds / 0.14)),
    MAX_PROGRESS_PER_SECOND * seconds,
  );
  progress += Math.sign(difference) * step;
  render();
  if (Math.abs(target - progress) > 0.0001) frame = requestAnimationFrame(tick);
  else {
    progress = target;
    render();
    frame = 0;
  }
}

function updateTarget() {
  if (preference.matches) return;
  target = Math.max(0, Math.min(1, (scrollY - start) / distance));
  if (!frame && Math.abs(target - progress) > 0.0001) {
    previous = performance.now();
    frame = requestAnimationFrame(tick);
  }
}

function measure() {
  start = stage.getBoundingClientRect().top + scrollY;
  distance = Math.max(1, stage.offsetHeight - viewport.offsetHeight);
  updateTarget();
}

function configure() {
  cancelAnimationFrame(frame);
  frame = 0;
  stage.classList.toggle("is-interactive", !preference.matches);
  measure();
  // No animation on initial load, restored scroll positions or reduced motion.
  progress = preference.matches ? 1 : target;
  render();
}

configure();
window.addEventListener("scroll", updateTarget, options);
window.addEventListener("resize", measure, options);
window.addEventListener("pageshow", measure, options);
preference.addEventListener("change", configure, { signal: lifetime.signal });
const sizeObserver = new ResizeObserver(measure);
sizeObserver.observe(viewport);

if (import.meta.hot) import.meta.hot.dispose(() => {
  lifetime.abort();
  sizeObserver.disconnect();
  cancelAnimationFrame(frame);
  stage.classList.remove("is-interactive");
  stage.style.removeProperty("--hero-frame");
});
