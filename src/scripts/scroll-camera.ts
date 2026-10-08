/** Smooth scroll targets without letting a wheel fling skip the camera journey. */
export class ScrollCamera {
  progress = 0;
  readonly maxSpeed: number;
  readonly maxProgress: number;

  constructor(maxSpeed = 0.42, maxProgress = 1) {
    this.maxSpeed = maxSpeed;
    this.maxProgress = maxProgress;
  }
  readonly damping = 0.12;

  reset(target: number) {
    this.progress = Math.max(0, Math.min(this.maxProgress, target));
  }

  step(target: number, seconds: number) {
    const goal = Math.max(0, Math.min(this.maxProgress, target));
    // A suspended tab or a stalled frame must not cause a jump on its return.
    const dt = Math.max(0, Math.min(0.05, seconds));
    const gap = goal - this.progress;
    const damped = Math.abs(gap) * (1 - Math.exp(-dt / this.damping));
    const distance = Math.min(Math.abs(gap), this.maxSpeed * dt, damped);
    this.progress += Math.sign(gap) * distance;
    if (Math.abs(goal - this.progress) < 0.0001) this.progress = goal;
    return this.progress;
  }

  isMoving(target: number) {
    return Math.abs(target - this.progress) > 0.0001;
  }
}
