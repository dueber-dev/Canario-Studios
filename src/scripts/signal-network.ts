/**
 * A node wandering a fixed lattice: points swell as it nears and fade beyond
 * about four cells, and spokes reach the ring of points about two cells away.
 * Geometry is in cell units, so the server poster and the canvas share it.
 */
// The network panel is the box's right-hand part, 10 × 6.3 cells.
export const networkSize = { columns: 10, rows: 6.3 };

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

export interface NetworkFrame {
  node: { x: number; y: number; r: number };
  dots: { x: number; y: number; r: number; alpha: number }[];
  spokes: { x: number; y: number; alpha: number }[];
}

export function networkFrame(node: { x: number; y: number }): NetworkFrame {
  const dots: NetworkFrame['dots'] = [];
  const spokes: NetworkFrame['spokes'] = [];
  // Lattice points sit on half-cells, so the box edges cut between them.
  for (let column = 0; column < Math.ceil(networkSize.columns); column++) {
    for (let row = 0; row < Math.ceil(networkSize.rows); row++) {
      const x = column + 0.5;
      const y = row + 0.5;
      const distance = Math.hypot(x - node.x, y - node.y);
      const r = 0.107 - 0.023 * distance;
      const alpha = clamp((4.6 - distance) / 1.2);
      if (r > 0 && alpha > 0) dots.push({ x, y, r, alpha });
      // A soft window keeps spokes from popping as the node crosses the lattice.
      const reach = smooth(1.7, 1.95, distance) * (1 - smooth(2.45, 2.75, distance));
      if (reach > 0) spokes.push({ x, y, alpha: reach });
    }
  }
  return { node: { ...node, r: 0.17 }, dots, spokes };
}

/** A smooth, never-repeating wander inside the box, as a function of time in seconds. */
export function nodeAt(time: number) {
  const { columns, rows } = networkSize;
  return {
    x: columns * (0.5 + 0.27 * Math.sin(time * 0.61) + 0.105 * Math.sin(time * 0.23 + 1.3)),
    y: rows * (0.5 + 0.188 * Math.sin(time * 0.47 + 0.6) + 0.083 * Math.sin(time * 0.19 + 2.1)),
  };
}

/** Canvas renderer for the box; it runs only while the scene asks for it. */
export function createSignalNetwork(canvas: HTMLCanvasElement) {
  const available = canvas.getContext('2d');
  // Without a 2D context the server poster stays in place.
  if (!available) return undefined;
  const context = available;
  let running = false;
  let frame = 0;
  let time = 0;
  let lastTime = 0;
  let cell = 1;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * ratio);
    canvas.height = Math.round(canvas.clientHeight * ratio);
    cell = canvas.width / networkSize.columns;
    draw();
  }

  function draw() {
    const { node, dots, spokes } = networkFrame(nodeAt(time));
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = Math.max(1, cell * 0.018);
    for (const spoke of spokes) {
      context.strokeStyle = `rgb(255 255 255 / ${0.72 * spoke.alpha})`;
      context.beginPath();
      context.moveTo(node.x * cell, node.y * cell);
      context.lineTo(spoke.x * cell, spoke.y * cell);
      context.stroke();
    }
    for (const dot of dots) {
      context.fillStyle = `rgb(255 255 255 / ${dot.alpha})`;
      context.beginPath();
      context.arc(dot.x * cell, dot.y * cell, dot.r * cell, 0, Math.PI * 2);
      context.fill();
    }
    context.fillStyle = '#fff';
    context.beginPath();
    context.arc(node.x * cell, node.y * cell, node.r * cell, 0, Math.PI * 2);
    context.fill();
  }

  function animate(now: number) {
    frame = 0;
    if (!running) return;
    // Time-based, and a stalled frame never makes the node jump.
    if (lastTime) time += Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    draw();
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

  resize();
  return { resize, setRunning, dispose: () => setRunning(false) };
}
