import { gsap } from 'gsap';

const svgNS = 'http://www.w3.org/2000/svg';

/**
 * ENTRY: the letters rise from the wordmark's baseline, then the Signal Dot lands.
 * Time-based and brief; it never holds the scroll, and the camera can zoom meanwhile.
 */
export function playWordmarkEntry(wordmark: SVGGElement, dot: SVGCircleElement) {
  const svg = wordmark.ownerSVGElement!;
  const box = wordmark.getBBox();
  const letters = [...wordmark.children]
    .filter((child): child is SVGGraphicsElement => child !== dot)
    .sort((a, b) => a.getBBox().x - b.getBBox().x);

  // The clip lives in the group's own space, so it follows the camera transform.
  // Its bottom edge is the baseline; it is removed afterwards so the zoom never clips.
  const clip = document.createElementNS(svgNS, 'clipPath');
  clip.id = 'wordmark-entry-clip';
  const edge = document.createElementNS(svgNS, 'rect');
  const top = box.y - box.height * 4;
  edge.setAttribute('x', String(box.x - box.width));
  edge.setAttribute('y', String(top));
  edge.setAttribute('width', String(box.width * 3));
  edge.setAttribute('height', String(box.y + box.height + 0.5 - top));
  clip.append(edge);
  svg.prepend(clip);
  wordmark.setAttribute('clip-path', 'url(#wordmark-entry-clip)');

  const finish = () => {
    wordmark.removeAttribute('clip-path');
    clip.remove();
  };
  const timeline = gsap.timeline({ delay: 0.15, onComplete: finish })
    .fromTo(letters, { y: box.height }, { y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.03 })
    .fromTo(dot, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.6, ease: 'back.out(2.4)' }, '-=0.45');

  return () => {
    timeline.progress(1).kill();
    finish();
  };
}
