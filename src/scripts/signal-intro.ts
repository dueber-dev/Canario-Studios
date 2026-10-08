import { gsap } from 'gsap';
import { createSignalNetwork } from './signal-network';

const glyphs = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789#/+_';

/** Reveals text left to right through a short band of changing glyphs. Deterministic:
 *  the same progress always draws the same characters, so scrubbing back retraces it. */
function decode(text: string, progress: number) {
  const band = 6;
  const shown = Math.floor(progress * (text.length + band));
  const step = Math.floor(progress * 48);
  return [...text].map((char, index) => {
    if (index >= shown) return '';
    if (index < shown - band || char === ' ') return char;
    return glyphs[(index * 7 + step * 13) % glyphs.length];
  }).join('');
}

/** The box floats like the wordmark: a slow sway, plus a lean toward a fine pointer. */
function createDrift(element: HTMLElement) {
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const events = new AbortController();
  const pointer = { x: 0, y: 0 };
  const lean = { x: 0, y: 0 };
  let running = false;
  let frame = 0;
  let time = 0;
  let lastTime = 0;

  window.addEventListener('pointermove', (event) => {
    if (!finePointer.matches) return;
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true, signal: events.signal });

  function animate(now: number) {
    frame = 0;
    if (!running) return;
    // Time-based, so it floats at the same pace on any refresh rate.
    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
    lastTime = now;
    time += dt;
    const follow = 1 - Math.exp(-dt * 3.5);
    lean.x += (pointer.x - lean.x) * follow;
    lean.y += (pointer.y - lean.y) * follow;
    const x = Math.sin(time * 0.57) * 3 + lean.x * 8;
    const y = Math.sin(time * 0.82) * 7 + lean.y * 6;
    element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${Math.sin(time * 0.46) * 0.2}deg)`;
    frame = requestAnimationFrame(animate);
  }

  function setRunning(value: boolean) {
    if (running === value) return;
    running = value;
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (running) frame = requestAnimationFrame(animate);
  }

  return { setRunning, dispose: () => { setRunning(false); events.abort(); } };
}

/** Every few seconds of stillness, the heading leaves upward and rises again, letter by
 *  letter and with the same words, like the reference loop. It never starts mid-scroll. */
function createTitleLoop(lines: HTMLElement[][]) {
  const events = new AbortController();
  const interval = 7;
  let lastScroll = 0;
  let armed = false;
  let pending: gsap.core.Tween | undefined;
  window.addEventListener('scroll', () => { lastScroll = performance.now(); }, { passive: true, signal: events.signal });

  // Both lines go together, left to right; a short beat of black, then they return.
  const replay = gsap.timeline({ paused: true });
  lines.forEach((loops, index) => {
    const pass = { duration: 0.42, ease: 'power3.in', stagger: 0.012, immediateRender: false };
    replay
      .fromTo(loops, { yPercent: 0 }, { ...pass, yPercent: -140 }, index * 0.06)
      .fromTo(loops, { yPercent: 140 }, { ...pass, yPercent: 0, duration: 0.6, ease: 'power3.out' }, 0.85 + index * 0.06);
  });

  function schedule(seconds: number) {
    pending?.kill();
    pending = gsap.delayedCall(seconds, () => {
      // The reader is still scrolling: look again shortly instead of interrupting.
      if (performance.now() - lastScroll < 2000) return schedule(1);
      replay.restart();
      schedule(interval);
    });
  }

  function setArmed(value: boolean) {
    if (armed === value) return;
    armed = value;
    // A replay already under way finishes on its own; only the next one is cancelled.
    if (armed) schedule(interval);
    else pending?.kill();
  }

  return {
    setArmed,
    reset: () => replay.pause(0),
    dispose: () => { pending?.kill(); replay.kill(); events.abort(); },
  };
}

/**
 * The statement scene, on black after the zoom: heading, the network box and the three
 * possibilities, as a paused GSAP timeline whose playhead is the hero's shared clock.
 */
export function createSignalIntro(scene: HTMLElement) {
  const titleLine = (line: number, layer: string) =>
    [...scene.querySelectorAll<HTMLElement>(`[data-title-line="${line}"] [${layer}]`)];
  const titleLines = [titleLine(1, 'data-title-char'), titleLine(2, 'data-title-char')];
  const chars = titleLines.flat();
  const loops = [titleLine(1, 'data-title-loop'), titleLine(2, 'data-title-loop')];
  const tracks = [...scene.querySelectorAll<HTMLElement>('[data-title-track]')];
  const examples = [...scene.querySelectorAll<HTMLElement>('[data-signal-example]')];
  const lines = [...scene.querySelectorAll<HTMLElement>('[data-statement-line]')];
  const box = scene.querySelector<HTMLElement>('[data-network-box]')!;
  const edges = [...box.querySelectorAll<HTMLElement>('[data-edge]')];
  const [column, row] = [...box.querySelectorAll<HTMLElement>('[data-rule]')];
  const decoders = [...box.querySelectorAll<HTMLElement>('[data-decode]')]
    .map((element) => ({ element, text: element.textContent ?? '', progress: { value: 0 } }));
  const network = box.querySelector<HTMLElement>('[data-network]')!;
  const live = createSignalNetwork(box.querySelector<HTMLCanvasElement>('[data-network-canvas]')!);
  if (live) box.dataset.renderer = 'canvas';
  const drift = createDrift(box);
  const loop = createTitleLoop(loops);

  // Heading letters rise from below their mask, left to right, both lines nearly together.
  // 140% clears the mask for the shorter slots of "mejor" as well.
  const lift = { yPercent: 0, duration: 0.045, ease: 'power3.out', stagger: 0.0022 };
  // List lines rise out of their mask's baseline, and leave upward the same way. No blur.
  const below = { yPercent: 115, rotation: 4 };
  const rise = { yPercent: 0, rotation: 0, duration: 0.05, ease: 'expo.out', stagger: 0.006 };
  const leave = { yPercent: -120, duration: 0.03, ease: 'power3.in', stagger: 0.003, immediateRender: false };
  const exit = 0.71;

  const timeline = gsap.timeline({ paused: true })
    // The heading lands while the zoom closes on the black stem.
    .fromTo(titleLines[0], { yPercent: 140 }, lift, 0.235)
    .fromTo(titleLines[1], { yPercent: 140 }, lift, 0.25)
    // Then each letter of "mejor" rolls over to yellow, as "señal" does in the closing.
    .fromTo(tracks, { yPercent: 0 }, { yPercent: -100, duration: 0.05, ease: 'power3.inOut', stagger: 0.008 }, 0.335)
    .fromTo(network, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.04, ease: 'power2.out' }, 0.355)
    // The box is built on the left, then scrolling slides it right to make room for the list.
    .fromTo(box, { '--shift': 1 }, { '--shift': 0, duration: 0.06, ease: 'power3.inOut', immediateRender: false }, 0.44);

  // Lines are drawn from one end: the box clockwise from the top-left, then its two rules.
  const drawn = 'inset(0% 0% 0% 0%)';
  const draw = (target: HTMLElement, from: string, at: number) => timeline
    .fromTo(target, { clipPath: from }, { clipPath: drawn, duration: 0.025, ease: 'power2.inOut' }, at)
    .fromTo(target, { clipPath: drawn }, { clipPath: from, duration: 0.02, ease: 'power2.in', immediateRender: false }, exit);
  ['inset(0% 100% 0% 0%)', 'inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 100%)', 'inset(100% 0% 0% 0%)']
    .forEach((from, index) => draw(edges[index], from, 0.3 + index * 0.01));
  draw(column, 'inset(0% 0% 100% 0%)', 0.345);
  draw(row, 'inset(0% 100% 0% 0%)', 0.36);

  // "Señal" and its definition decode in, before the box moves.
  decoders.forEach(({ element, text, progress }, index) => {
    const write = () => { element.textContent = decode(text, progress.value); };
    write();
    timeline
      .fromTo(progress, { value: 0 }, { value: 1, duration: 0.03 + index * 0.02, ease: 'none', onUpdate: write }, 0.37 + index * 0.01)
      .fromTo(progress, { value: 1 }, { value: 0, duration: 0.02, ease: 'none', onUpdate: write, immediateRender: false }, exit);
  });

  // Each possibility appears solid white in its turn; the one before it then dims.
  examples.forEach((example, index) => {
    const start = 0.49 + index * 0.07;
    timeline.fromTo(lines[index], below, { ...rise, duration: 0.04 }, start);
    if (index > 0) {
      timeline.fromTo(examples[index - 1], { color: '#fff' }, { color: '#999', duration: 0.02, ease: 'none', immediateRender: false }, start);
    }
  });
  timeline
    .fromTo(chars, { yPercent: 0 }, { ...leave, yPercent: -140, stagger: 0.0008 }, exit)
    .fromTo(lines, { yPercent: 0 }, leave, exit)
    .fromTo(network, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.03, ease: 'none', immediateRender: false }, exit);

  const animated = [...chars, ...loops.flat(), ...tracks, box, ...examples, ...lines, ...edges, column, row, network];
  let cleared = false;

  function render(progress: number, reducedMotion: boolean) {
    if (reducedMotion) {
      // Reduced motion reads everything in normal flow, without any inline state.
      if (!cleared) {
        gsap.set(animated, { clearProps: 'all' });
        decoders.forEach(({ element, text }) => { element.textContent = text; });
      }
      cleared = true;
      live?.setRunning(false);
      drift.setRunning(false);
      loop.setArmed(false);
      loop.reset();
      scene.dataset.phase = 'reduced';
      return;
    }
    // Coming back from reduced motion, sweep once so every tween reapplies its state.
    if (cleared) timeline.progress(1).progress(0);
    cleared = false;
    timeline.time(progress);
    // The node wanders on its own clock while the box is on screen, even when scrolling stops.
    live?.setRunning(progress > 0.35 && progress < exit + 0.03);
    // It floats from the moment its first edge is drawn, through the slide, until it leaves.
    drift.setRunning(progress > 0.29 && progress < exit + 0.03);
    // The heading loops only once it has landed and "mejor" is yellow, until the exit.
    loop.setArmed(progress > 0.42 && progress < exit - 0.01);
    scene.dataset.progress = progress.toFixed(5);
    scene.dataset.phase = progress < 0.235 ? 'portal' : progress < 0.44 ? 'statement' : progress < 0.49 ? 'slide'
      : progress < exit ? ['process', 'identity', 'connection'][Math.min(2, Math.floor((progress - 0.49) / 0.07))] : 'signal';
  }

  function dispose() {
    live?.dispose();
    drift.dispose();
    loop.dispose();
  }

  return { render, resize: () => live?.resize(), dispose };
}
