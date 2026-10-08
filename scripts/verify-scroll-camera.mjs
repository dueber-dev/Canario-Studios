import assert from 'node:assert/strict';
import { ScrollCamera } from '../src/scripts/scroll-camera.ts';

const results = [];
for (const fps of [30, 60, 144]) {
  const camera = new ScrollCamera();
  let enteredAt = 0;
  let settledAt = 0;
  for (let frame = 1; frame <= fps * 4; frame++) {
    const previous = camera.progress;
    camera.step(1, 1 / fps);
    assert.ok(camera.progress >= previous && camera.progress <= 1);
    assert.ok(camera.progress - previous <= camera.maxSpeed / fps + 0.0001);
    if (!enteredAt && camera.progress >= 0.84) enteredAt = frame / fps;
    if (!camera.isMoving(1)) { settledAt = frame / fps; break; }
  }
  assert.ok(enteredAt >= 1.95 && enteredAt <= 2.1, 'A fling reveals yellow in about two seconds');
  assert.ok(settledAt > 0 && settledAt <= 3.25, 'No indefinitely delayed tail');
  // Changing direction must start reversing immediately and remain bounded.
  const end = camera.progress;
  camera.step(0, 1 / fps);
  assert.ok(camera.progress < end);
  for (let frame = 0; frame < fps * 4; frame++) camera.step(0, 1 / fps);
  assert.equal(camera.progress, 0);
  camera.reset(0.3);
  camera.step(1, 30);
  assert.ok(camera.progress <= 0.3211, 'A background pause never jumps the camera');
  camera.reset(0);
  // A slow gesture remains under user control, then smoothly settles where it stopped.
  for (let frame = 0; frame <= fps * 8; frame++) {
    const target = frame / (fps * 8) * 0.4;
    camera.step(target, 1 / fps);
    assert.ok(camera.progress <= target + 0.0001);
  }
  for (let frame = 0; frame < fps; frame++) camera.step(0.4, 1 / fps);
  assert.equal(camera.progress, 0.4);
  results.push({ fps, yellowAfterSeconds: enteredAt, settledAfterSeconds: settledAt });
}
console.log(JSON.stringify(results));

// The full SIGNAL sequence uses a slower shared clock. Flinging to the end
// must show the opening before the conclusion, and reversing must never jump.
for (const fps of [30, 60, 144]) {
  const camera = new ScrollCamera(0.12);
  let firstVisible = 0;
  for (let frame = 1; frame <= fps * 10; frame++) {
    const before = camera.progress;
    camera.step(1, 1 / fps);
    assert.ok(camera.progress >= before && camera.progress - before <= 0.12 / fps + 1e-9);
    if (!firstVisible && camera.progress >= 0.225) firstVisible = frame / fps;
  }
  assert.ok(firstVisible >= 1.85 && firstVisible <= 1.92, 'Opening starts during the final zoom');
  assert.equal(camera.progress, 1, 'A fast scroll reaches the closing without an endless tail');
  for (let frame = 0; frame < fps * 10; frame++) {
    const before = camera.progress;
    camera.step(0, 1 / fps);
    assert.ok(camera.progress <= before && before - camera.progress <= 0.12 / fps + 1e-9);
  }
  assert.equal(camera.progress, 0, 'Reverse returns fully to the logo');
}
console.log('Shared SIGNAL clock: forward/reverse at 30, 60 and 144 fps passed.');
