import gsap from "gsap";
import { createVideoSurface } from "./video-surface";

const hero = document.querySelector<HTMLElement>(".hero")!;
const video = document.querySelector<HTMLVideoElement>("#canario-video")!;
const music = document.querySelector<HTMLAudioElement>("#background-music")!;
const ambientButton =
  document.querySelector<HTMLButtonElement>(".ambient-toggle")!;
const ambientLabel = document.querySelector<HTMLElement>(
  "[data-ambient-label]",
)!;
const cursor = document.querySelector<HTMLElement>(".cursor-sound")!;
const mediaStatus = document.querySelector<HTMLElement>("#media-status")!;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const mobile = matchMedia("(max-width: 680px)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const lifetime = new AbortController();
const listen = { signal: lifetime.signal };
let inView = true;
let manuallyPaused = reducedMotion.matches;
let soundEnabled = false;
let soundPromptDismissed = false;
let videoFailed = false;
let lastSource = "";
let bounds = hero.getBoundingClientRect();
let pointerVisible = false;
let cursorWidth = 224;
const moveX = gsap.quickTo(cursor, "x", { duration: 0.32, ease: "power3.out" });
const moveY = gsap.quickTo(cursor, "y", { duration: 0.32, ease: "power3.out" });

function updateControls() {
  ambientButton.setAttribute("aria-pressed", String(soundEnabled));
  ambientLabel.textContent = soundEnabled
    ? "Silenciar sonido"
    : "Activar sonido";
  ambientButton.setAttribute("aria-label", ambientLabel.textContent);
  ambientButton.title = ambientLabel.textContent;
  ambientButton.hidden = false;
  cursorWidth = cursor.offsetWidth || 190;
}

async function playVideo() {
  if (!inView || document.hidden || manuallyPaused || videoFailed) return;
  try {
    await video.play();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return;
    manuallyPaused = true;
    mediaStatus.textContent =
      "Puedes iniciar el video al activar el sonido.";
    updateControls();
  }
}

async function playMusic() {
  if (!soundEnabled || document.hidden) return;
  if (!music.getAttribute("src")) music.src = music.dataset.src!;
  music.volume = 0.1;
  try {
    await music.play();
  } catch {
    mediaStatus.textContent =
      "La mÃºsica no estÃ¡ disponible. Puedes seguir usando el sonido del video.";
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  soundPromptDismissed = true;
  hideCursor();
  video.muted = !soundEnabled;
  if (soundEnabled) {
    manuallyPaused = false;
    void playVideo();
    void playMusic();
  } else music.pause();
  updateControls();
}

function hideCursor() {
  pointerVisible = false;
  cursor.classList.remove("is-visible");
  hero.classList.remove("pointer-sound");
  moveX.tween.pause();
  moveY.tween.pause();
}

function refreshBounds() {
  bounds = hero.getBoundingClientRect();
  cursorWidth = cursor.offsetWidth || 224;
}

function setSource() {
  const source = (
    mobile.matches ? video.dataset.mobile : video.dataset.desktop
  )!;
  if (source === lastSource) return;
  lastSource = source;
  videoFailed = false;
  video.classList.remove("is-ready");
  video.src = source;
  video.muted = !soundEnabled;
  video.volume = 0.35;
  void playVideo();
}

const disposeSurface = createVideoSurface(video);
video.disablePictureInPicture = true;
video.disableRemotePlayback = true;
video.controls = false;
setSource();
updateControls();
video.addEventListener(
  "playing",
  () => {
    video.classList.add("is-ready");
    updateControls();
  },
  listen,
);
video.addEventListener("pause", updateControls, listen);
video.addEventListener(
  "error",
  () => {
    videoFailed = true;
    video.classList.remove("is-ready");
    mediaStatus.textContent =
      "El video no estÃ¡ disponible. Se muestra una imagen del canario.";
  },
  listen,
);
ambientButton.addEventListener("click", toggleSound, listen);
hero.addEventListener("pointerenter", refreshBounds, listen);
hero.addEventListener(
  "pointermove",
  (event) => {
    if (
      soundPromptDismissed ||
      !finePointer.matches ||
      mobile.matches ||
      reducedMotion.matches ||
      event.pointerType !== "mouse" ||
      (event.target as Element).closest("a,button")
    ) {
      hideCursor();
      return;
    }
    const x = Math.max(
      bounds.left + 10,
      Math.min(event.clientX + 22, bounds.right - cursorWidth - 10),
    );
    const y = Math.max(
      bounds.top + 10,
      Math.min(event.clientY + 20, bounds.bottom - 54, innerHeight - 54),
    );
    if (!pointerVisible) {
      gsap.set(cursor, { x, y });
      pointerVisible = true;
      cursor.classList.add("is-visible");
      hero.classList.add("pointer-sound");
    }
    moveX(x);
    moveY(y);
  },
  listen,
);
hero.addEventListener("pointerleave", hideCursor, listen);
hero.addEventListener(
  "click",
  (event) => {
    if (
      pointerVisible &&
      !(event.target as Element).closest("a,button") &&
      !getSelection()?.toString()
    )
      toggleSound();
  },
  listen,
);
document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Tab" || event.key === "Escape") hideCursor();
  },
  listen,
);
window.addEventListener(
  "scroll",
  () => {
    refreshBounds();
    hideCursor();
  },
  { ...listen, passive: true },
);

const observer = new IntersectionObserver(
  ([entry]) => {
    inView = entry.isIntersecting;
    if (inView) void playVideo();
    else {
      video.pause();
      hideCursor();
    }
    updateControls();
  },
  { threshold: 0.1 },
);
observer.observe(hero);
const resizeObserver = new ResizeObserver(refreshBounds);
resizeObserver.observe(hero);

document.addEventListener(
  "visibilitychange",
  () => {
    if (document.hidden) {
      video.pause();
      music.pause();
      hideCursor();
    } else {
      void playVideo();
      void playMusic();
    }
  },
  listen,
);
reducedMotion.addEventListener(
  "change",
  () => {
    if (reducedMotion.matches) {
      manuallyPaused = true;
      video.pause();
      hideCursor();
    }
  },
  listen,
);
finePointer.addEventListener("change", hideCursor, listen);
mobile.addEventListener(
  "change",
  () => {
    hideCursor();
    setSource();
  },
  listen,
);
window.addEventListener(
  "pagehide",
  () => {
    video.pause();
    music.pause();
    hideCursor();
  },
  listen,
);
window.addEventListener(
  "pageshow",
  () => {
    void playVideo();
    void playMusic();
  },
  listen,
);

if (import.meta.hot)
  import.meta.hot.dispose(() => {
    lifetime.abort();
    disposeSurface();
    observer.disconnect();
    resizeObserver.disconnect();
    moveX.tween.kill();
    moveY.tween.kill();
    video.pause();
    music.pause();
  });
