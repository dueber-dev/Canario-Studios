const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

/** Pure visual sampling of the hero's shared clock, identical in either direction. */
export function createSignalIntro(scene: HTMLElement) {
  const copy = scene.querySelector<HTMLElement>('.signal-intro__copy')!;
  const first = scene.querySelector<HTMLElement>('[data-intro-line="one"]')!;
  const second = scene.querySelector<HTMLElement>('[data-intro-line="two"]')!;
  const accent = scene.querySelector<HTMLElement>('.signal-intro__accent')!;
  const examples = [...scene.querySelectorAll<HTMLElement>('[data-signal-example]')];
  const closing = scene.querySelector<HTMLElement>('.signal-intro__closing p')!;
  const beacon = scene.querySelector<HTMLElement>('.signal-intro__beacon')!;
  const ripple = scene.querySelector<HTMLElement>('.signal-intro__ripple')!;
  const backdrop = scene.querySelector<HTMLElement>('.signal-intro__backdrop')!;
  const paper = scene.querySelector<HTMLElement>('.signal-intro__paper')!;

  function render(progress: number, reducedMotion: boolean) {
    if (reducedMotion) {
      [copy, first, second, accent, ...examples, closing, beacon, ripple, backdrop, paper]
        .forEach((element) => element.removeAttribute('style'));
      scene.dataset.phase = 'reduced';
      return;
    }

    // The first fade overlaps the last part of the zoom, with no blur or travel.
    const firstReveal = smooth(0.225, 0.27, progress);
    const secondReveal = smooth(0.35, 0.395, progress);
    // Leave the white words fully readable on yellow before changing scenes.
    const statementExit = smooth(0.515, 0.555, progress);
    copy.style.opacity = String(1 - statementExit);
    first.style.opacity = String(firstReveal);
    second.style.opacity = String(secondReveal);
    const white = Math.round(255 * smooth(0.425, 0.46, progress));
    accent.style.color = `rgb(${white} ${white} ${white})`;

    // Complete the white background before the first possibility appears.
    paper.style.opacity = String(smooth(0.555, 0.595, progress));
    const examplesExit = 1 - smooth(0.845, 0.88, progress);
    examples.forEach((example, index) => {
      const start = 0.605 + index * 0.08;
      const reveal = smooth(start, start + 0.045, progress);
      const recede = index < 2 ? smooth(start + 0.08, start + 0.125, progress) : 0;
      example.style.opacity = String(reveal * examplesExit * (1 - recede * 0.5));
      example.style.transform = `translateY(${(1 - reveal) * 10}px)`;
    });

    const night = smooth(0.865, 0.925, progress);
    backdrop.style.opacity = String(night);
    const pointReveal = smooth(0.89, 0.93, progress);
    beacon.style.opacity = String(pointReveal);
    beacon.style.transform = `scale(${0.65 + pointReveal * 0.35})`;
    const pulse = smooth(0.905, 0.98, progress);
    ripple.style.opacity = String(Math.sin(Math.PI * pulse) * 0.45);
    ripple.style.transform = `scale(${1 + pulse * 3})`;
    closing.style.opacity = String(smooth(0.935, 0.985, progress));
    scene.dataset.progress = progress.toFixed(5);
    scene.dataset.phase = progress < 0.225 ? 'portal' : progress < 0.555 ? 'statement'
      : progress < 0.605 ? 'paper' : progress < 0.88 ? 'examples' : 'signal';
  }

  return { render };
}
