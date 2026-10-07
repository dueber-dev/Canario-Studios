import assert from 'node:assert/strict';
import { SignalCycle } from '../src/scripts/signal-cycle.ts';

// Test the requested visual invariant over three minutes, including delayed frames.
let seed = 20261007;
const random = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 2 ** 32;
};
const total = 2400;
const signals = new SignalCycle(total, random);
const seen = new Set();
let minimumFull = total, maximumTinted = 0;
for (let frame = 0; frame <= 60 * 180; frame++) {
  signals.update(frame / 60);
  let full = 0, tinted = 0, intensity = 0;
  signals.weights.forEach((weight, index) => {
    assert.ok(Number.isFinite(weight) && weight >= 0 && weight <= 1);
    if (weight === 1) { full++; seen.add(index); }
    if (weight > 0) tinted++;
    intensity += weight;
  });
  assert.ok(full >= total * 0.2, 'At least 20% of the surface stays fully yellow');
  assert.ok(tinted <= total * 0.3, 'Crossfades never tint more than 30% of the surface');
  assert.ok(Math.abs(intensity - total * 0.25) < 0.001, 'Signal intensity remains at 25%');
  minimumFull = Math.min(minimumFull, full);
  maximumTinted = Math.max(maximumTinted, tinted);
}
assert.ok(seen.size > total * 0.9, 'Signals migrate broadly across the surface');
signals.update(600);
signals.update(601);
assert.ok(signals.weights.every((weight) => Number.isFinite(weight)), 'Long frame gaps remain safe');
console.log(JSON.stringify({
  simulatedSeconds: 180,
  signalIntensity: '25%',
  minimumFullyYellow: `${(minimumFull / total * 100).toFixed(2)}%`,
  maximumTinted: `${(maximumTinted / total * 100).toFixed(2)}%`,
  distinctSignals: seen.size,
}));
