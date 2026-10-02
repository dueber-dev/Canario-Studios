// Rate-limit the frame and retain scrolling at the sticky boundary until it ends.
const stage = document.querySelector<HTMLElement>(".hero-stage")!;
const viewport = document.querySelector<HTMLElement>(".hero-viewport")!;
const preference = matchMedia("(prefers-reduced-motion: reduce)");
const lifetime = new AbortController();
const passive = { passive: true, signal: lifetime.signal };
const active = { passive: false, signal: lifetime.signal };
const MAX_PROGRESS_PER_SECOND = 0.625;
let progress = 0;
let target = 0;
let previous = 0;
let frame = 0;
let start = 0;
let distance = 1;
let gateOpen = false;
let touchY = 0;
let pendingLink: HTMLAnchorElement | null = null;
const boundary = () => start + distance;

function render() {
  stage.style.setProperty("--hero-frame", progress.toFixed(5));
}

function followPendingLink() {
  const link = pendingLink;
  pendingLink = null;
  if (link) {
    const element = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (element) {
      history.pushState(null, "", link.hash);
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
}

function tick(now: number) {
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
    if (progress === 1) {
      gateOpen = true;
      followPendingLink();
    }
  }
}

function animate() {
  if (!frame) {
    previous = performance.now();
    frame = requestAnimationFrame(tick);
  }
}

function holdAtBoundary() {
  target = 1;
  window.scrollTo({ top: boundary(), behavior: "instant" });
  animate();
}

function updateTarget() {
  if (preference.matches) return;
  if (scrollY <= start + 1) gateOpen = false;
  if (!gateOpen && scrollY > boundary()) {
    holdAtBoundary();
    return;
  }
  target = Math.max(0, Math.min(1, (scrollY - start) / distance));
  if (target < 1 && scrollY <= boundary()) {
    gateOpen = false;
    pendingLink = null;
  }
  if (Math.abs(target - progress) > 0.0001 || (target === 1 && !gateOpen)) animate();
}

function measure() {
  start = stage.getBoundingClientRect().top + scrollY;
  distance = Math.max(1, stage.offsetHeight - viewport.offsetHeight);
}

function configure() {
  cancelAnimationFrame(frame);
  frame = 0;
  pendingLink = null;
  stage.classList.toggle("is-interactive", !preference.matches);
  measure();
  target = Math.max(0, Math.min(1, (scrollY - start) / distance));
  progress = preference.matches ? 1 : target;
  // Deep links and restored positions below the hero don't acquire a scroll gate.
  gateOpen = progress === 1 || (!!location.hash && !["#inicio", "#hero-title"].includes(location.hash));
  render();
}

function interceptForward(event: Event, pixels: number) {
  if (preference.matches || gateOpen || pixels <= 0 || scrollY + pixels < boundary()) return;
  event.preventDefault();
  holdAtBoundary();
}

configure();
window.addEventListener("scroll", updateTarget, passive);
window.addEventListener("wheel", (event) => {
  if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
  interceptForward(event, event.deltaY * unit);
}, active);
window.addEventListener("touchstart", (event) => { touchY = event.touches[0]?.clientY ?? 0; }, passive);
window.addEventListener("touchmove", (event) => {
  if (event.touches.length !== 1) return;
  const nextY = event.touches[0].clientY;
  interceptForward(event, touchY - nextY);
  touchY = nextY;
}, active);
window.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
      (event.target as Element).closest("input,textarea,select,button,[contenteditable=true]")) return;
  const delta = event.key === "End" ? document.documentElement.scrollHeight
    : ["PageDown", " "].includes(event.key) ? innerHeight * 0.9
    : event.key === "ArrowDown" ? 40 : 0;
  interceptForward(event, delta);
}, active);
stage.addEventListener("click", (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 ||
      preference.matches || gateOpen || ["#inicio", "#hero-title"].includes(link.hash)) return;
  if (!document.getElementById(decodeURIComponent(link.hash.slice(1)))) return;
  event.preventDefault();
  pendingLink = link;
  holdAtBoundary();
}, { signal: lifetime.signal });
window.addEventListener("pageshow", configure, passive);
preference.addEventListener("change", configure, { signal: lifetime.signal });
const sizeObserver = new ResizeObserver(() => { measure(); updateTarget(); });
sizeObserver.observe(viewport);

if (import.meta.hot) import.meta.hot.dispose(() => {
  lifetime.abort();
  sizeObserver.disconnect();
  cancelAnimationFrame(frame);
  stage.classList.remove("is-interactive");
  stage.style.removeProperty("--hero-frame");
});
