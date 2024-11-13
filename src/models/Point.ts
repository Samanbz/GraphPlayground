import { Coordinate } from "./base/Coordinate";
import { GraphCanvasRenderer } from "./GraphCanvasRenderer";
import { GraphEntity } from "./base/GraphEntity";
import { Circle } from "two.js/src/shapes/circle";

// not necessarily associated with a shape
export class Point implements GraphEntity {
  protected _x: number;
  protected _y: number;
  protected color: string = "#AAAAAAAA";

  shape: Circle;

  constructor(
    public canvas: GraphCanvasRenderer,
    x: number,
    y: number,
    protected _radius: number = 2,
  ) {
    this.canvas = canvas;

    const { x: canvasX, y: canvasY } = this.canvas.coordUtils.coordsToCanvas(Coordinate.fromXY(x, y));
    this._x = canvasX;
    this._y = canvasY;

    this.shape = new Circle(this._x, this._y, this._radius);
    this.shape.fill = this.color;
  }

  get coords(): Coordinate {
    return this.canvas.coordUtils.canvasToCoords(this.canvasCoords);
  }

  get canvasCoords(): Coordinate {
    return Coordinate.fromXY(this._x, this._y);
  }

  get x(): number {
    return this.coords.x;
  }

  get y(): number {
    return this.coords.y;
  }

  get radius(): number {
    return this._radius;
  }

  protected scale(factor: number): void {
    this._radius *= factor;
  }

  move(canvasCoords: Coordinate): void {
    const { x: newX, y: newY } = canvasCoords;
    this._x = newX;
    this._y = newY;
  }

  update(): void {
    this.canvas.graphics.makeCircle(this._x, this._y, this._radius).fill = this.color; //FIXME
  }
}
