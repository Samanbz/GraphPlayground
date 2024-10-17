export type Matrix2x2 = [[number, number], [number, number]];

export class Matrix {
  m: Matrix2x2;

  constructor(m: Matrix2x2) {
    this.m = m;
  }

  executeTransform(x: number, y: number): [number, number] {
    const [[a, b], [c, d]] = this.m;
    return [a * x + b * y, c * x + d * y];
  }

  multiply(m2: Matrix): Matrix {
    const [[a, b], [c, d]] = this.m;
    const [[e, f], [g, h]] = m2.m;
    return new Matrix([
      [a * e + b * g, a * f + b * h],
      [c * e + d * g, c * f + d * h],
    ]);
  }
}
