/** Adapted from the user's DottedSurface reference (Three.js sine-wave point field). */
import {
  BufferGeometry, CanvasTexture, Color, Float32BufferAttribute, Fog,
  PerspectiveCamera, Points, PointsMaterial, Scene, WebGLRenderer,
} from 'three';
import { SignalCycle } from './signal-cycle';

export function createSignalSurface(container: HTMLElement) {
  const columns = 40;
  const rows = 60;
  const total = columns * rows;
  const cycle = new SignalCycle(total);
  const positions = new Float32Array(total * 3);
  const colors = new Float32Array(total * 3);
  const yellow = new Color('#f0bc15');
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 2000, 10000);
  const camera = new PerspectiveCamera(60, 1, 1, 10000);
  camera.position.set(0, 355, 1220);

  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0xffffff, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 32;
  const context = sprite.getContext('2d');
  if (!context) {
    renderer.dispose();
    throw new Error('Point sprite canvas unavailable');
  }
  context.fillStyle = '#fff';
  context.beginPath();
  context.arc(16, 16, 15, 0, Math.PI * 2);
  context.fill();
  const texture = new CanvasTexture(sprite);
  const geometry = new BufferGeometry();
  for (let i = 0; i < total; i++) {
    positions[i * 3] = Math.floor(i / rows) * 150 - (columns * 150) / 2;
    positions[i * 3 + 2] = (i % rows) * 150 - (rows * 150) / 2;
  }
  const positionAttribute = new Float32BufferAttribute(positions, 3);
  const colorAttribute = new Float32BufferAttribute(colors, 3);
  geometry.setAttribute('position', positionAttribute);
  geometry.setAttribute('color', colorAttribute);
  const material = new PointsMaterial({
    size: 11, map: texture, alphaTest: 0.15, vertexColors: true,
    transparent: true, opacity: 0.86, sizeAttenuation: true, depthWrite: false,
  });
  const points = new Points(geometry, material);
  // Positions move every frame; do not cull against the initial, flat bounding sphere.
  points.frustumCulled = false;
  scene.add(points);
  container.append(renderer.domElement);

  let running = false;
  let requestedRunning = false;
  let contextAvailable = true;
  let disposed = false;
  let frame = 0;
  let elapsed = 0;
  let lastTime = 0;

  function paint() {
    cycle.update(elapsed);
    const phase = elapsed * 2.4;
    for (let i = 0; i < total; i++) {
      const offset = i * 3;
      positionAttribute.array[offset + 1] =
        Math.sin((Math.floor(i / rows) + phase) * 0.3) * 50 +
        Math.sin(((i % rows) + phase) * 0.5) * 50;
      const weight = cycle.weights[i];
      colorAttribute.array[offset] = yellow.r * weight;
      colorAttribute.array[offset + 1] = yellow.g * weight;
      colorAttribute.array[offset + 2] = yellow.b * weight;
    }
    positionAttribute.needsUpdate = true;
    colorAttribute.needsUpdate = true;
    renderer.render(scene, camera);
  }

  function animate(time: number) {
    frame = 0;
    if (!running || disposed) return;
    // Time-based motion runs at the same speed on 60 Hz and 144 Hz screens.
    if (lastTime) elapsed += Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    paint();
    frame = requestAnimationFrame(animate);
  }

  function setRunning(value: boolean) {
    requestedRunning = value;
    value = value && contextAvailable;
    if (disposed || running === value) return;
    running = value;
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (running) frame = requestAnimationFrame(animate);
  }

  function resize() {
    if (disposed || !contextAvailable) return;
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    paint();
  }

  function contextLost(event: Event) {
    event.preventDefault();
    contextAvailable = false;
    setRunning(requestedRunning);
    renderer.domElement.style.visibility = 'hidden';
    delete container.dataset.renderer;
  }
  function contextRestored() {
    if (disposed) return;
    contextAvailable = true;
    resize();
    renderer.domElement.style.visibility = 'visible';
    container.dataset.renderer = 'webgl';
    setRunning(requestedRunning);
  }
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  renderer.domElement.addEventListener('webglcontextrestored', contextRestored);
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();
  container.dataset.renderer = 'webgl';

  return {
    setRunning,
    dispose() {
      setRunning(false);
      disposed = true;
      observer.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', contextRestored);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      delete container.dataset.renderer;
    },
  };
}
