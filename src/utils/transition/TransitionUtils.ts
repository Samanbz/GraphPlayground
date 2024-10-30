export class TransitionUtils {
  static animate(from: number, to: number, duration: number, apply: (x: number) => void) {
    let start: number;

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      const progress = TransitionUtils.ease(from, to, duration);

      apply(progress(elapsed));
      if (elapsed < duration || progress(elapsed) <= to) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  static animateLinear(from: number, to: number, duration: number, apply: (x: number) => void) {
    let start: number;

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      const progress = TransitionUtils.easeLinear(from, to, duration);

      apply(progress(elapsed));
      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  private static ease(from: number, to: number, duration: number): (x: number) => number {
    const progress = (x: number) => {
      const exp = Math.E ** ((-10 / duration) * (x - duration / 2));
      const bottom = 1 + exp;
      return to / bottom + from;
    };

    return progress;
  }

  private static easeLinear(from: number, to: number, duration: number): (x: number) => number {
    const progress = (x: number) => {
      return ((to - from) / duration) * x + from;
    };

    return progress;
  }
}
