/** Random, paired crossfades keep 25% signal intensity and at most 30% tinted dots. */
export class SignalCycle {
  readonly weights: Float32Array;
  readonly count: number;
  readonly maxTinted: number;
  private readonly dormant: number[];
  private readonly slots: { current: number; next: number; started: number; expires: number }[];
  private transitions = 0;
  private readonly random: () => number;

  constructor(total: number, random = Math.random) {
    this.random = random;
    this.weights = new Float32Array(total);
    this.count = Math.floor(total * 0.25);
    this.maxTinted = Math.floor(total * 0.3);
    const indices = Array.from({ length: total }, (_, i) => i);
    for (let i = total - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    this.slots = indices.slice(0, this.count).map((current) => {
      this.weights[current] = 1;
      // Stagger the opening frame so signals never change in a single pulse.
      return { current, next: -1, started: 0, expires: random() * 7 };
    });
    this.dormant = indices.slice(this.count);
  }

  update(time: number) {
    for (const slot of this.slots) {
      if (slot.next >= 0) {
        const t = Math.min(1, Math.max(0, (time - slot.started) / 0.6));
        const blend = t * t * (3 - 2 * t);
        this.weights[slot.current] = 1 - blend;
        this.weights[slot.next] = blend;
        if (t === 1) {
          this.dormant.push(slot.current);
          slot.current = slot.next;
          slot.next = -1;
          slot.expires = time + 3 + this.random() * 4;
          this.transitions--;
        }
      } else if (time >= slot.expires && this.count + this.transitions < this.maxTinted) {
        const pick = Math.floor(this.random() * this.dormant.length);
        slot.next = this.dormant[pick];
        this.dormant[pick] = this.dormant[this.dormant.length - 1];
        this.dormant.pop();
        slot.started = time;
        this.transitions++;
      }
    }
  }
}
