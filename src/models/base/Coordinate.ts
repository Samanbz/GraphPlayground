export class Coordinate {
  constructor(
    private _x: number,
    private _y: number,
  ) {}

  get x(): number {
    return this._x;
  }
  get y(): number {
    return this._y;
  }

  static fromXY(x: number, y: number): Coordinate {
    return new Coordinate(x, y);
  }

  static from(coords: Coordinate): Coordinate {
    return new Coordinate(coords.x, coords.y);
  }

  times(factor: number): Coordinate {
    return new Coordinate(this.x * factor, this.y * factor);
  }

  plus(coords: Coordinate): Coordinate {
    return new Coordinate(this.x + coords.x, this.y + coords.y);
  }

  minus(coords: Coordinate): Coordinate {
    return new Coordinate(this.x - coords.x, this.y - coords.y);
  }

  round(): Coordinate {
    return new Coordinate(Math.round(this.x), Math.round(this.y));
  }

  apply(func: (n: number) => number): Coordinate {
    return new Coordinate(func(this.x), func(this.y));
  }
}
