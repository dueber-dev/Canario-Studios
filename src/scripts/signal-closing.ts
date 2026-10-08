import { gsap } from 'gsap';

/**
 * "Esa es la señal." as a paused GSAP timeline whose playhead is the hero's shared
 * clock: positions are sequence units, so the same scroll always shows the same frame.
 */
export function createSignalClosing(scene: HTMLElement) {
  const type = scene.querySelector<HTMLElement>('[data-closing-type]')!;
  const chars = scene.querySelectorAll<HTMLElement>('[data-closing-char]');
  const tracks = scene.querySelectorAll<HTMLElement>('[data-closing-track]');

  const timeline = gsap.timeline({ paused: true })
    .set(type, { autoAlpha: 1 }, 0.765)
    // Letters rise out of the baseline while the line settles from a slight push-in.
    .fromTo(type, { scale: 1.12 }, { scale: 1, duration: 0.13, ease: 'power3.out' }, 0.775)
    // 140% clears the line mask for the shorter "señal" slots too.
    .fromTo(chars, { yPercent: 140, rotation: 12 }, {
      yPercent: 0, rotation: 0, duration: 0.065, ease: 'expo.out', stagger: 0.0045,
    }, 0.775)
    // After a held read in white, each letter of "señal" rolls over to yellow.
    .fromTo(tracks, { yPercent: 0 }, {
      yPercent: -100, duration: 0.05, ease: 'power3.inOut', stagger: 0.008,
    }, 0.935);
  gsap.set(type, { autoAlpha: 0 });

  function render(progress: number, reducedMotion: boolean) {
    // Reduced motion shows the finished composition: letters in place, "señal" in yellow.
    timeline.time(reducedMotion ? timeline.duration() : progress);
    scene.dataset.phase = progress < 0.775 ? 'hidden' : progress < 0.935 ? 'white' : 'signal';
  }

  return { render };
}
