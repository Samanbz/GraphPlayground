import { Coordinate } from "./Coordinate";
import { GraphCanvasRenderer } from "./GraphCanvasRenderer";
import { GraphEntity } from "./GraphEntity";
import { Matrix } from "./Matrix";

export class Point implements Coordinate, GraphEntity {
  protected _x: number;
  protected _y: number;
  protected _radius: number = 2;
  protected color: string = "#FFFFFF22";

  constructor(
    public canvas: GraphCanvasRenderer,
    x: number,
    y: number,
  ) {
    this.canvas = canvas;
    const { x: canvasX, y: canvasY } = this.canvas.coordUtils.coordsToCanvas({ x, y });
    this._x = canvasX;
    this._y = canvasY;
  }

  get coords(): Coordinate {
    return this.canvas.coordUtils.canvasToCoords(this.canvasCoords);
  }

  get canvasCoords(): Coordinate {
    return {
      x: this._x,
      y: this._y,
    };
  }

  get clientCoords(): Coordinate {
    return this.canvas.coordUtils.canvasToClient(this.canvasCoords);
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

  /**
   * Transforms the node by the given matrix.
   * @param matrix transformation matrix
   */
  protected matrixTransform(matrix: Matrix): void {
    const [newX, newY] = matrix.executeTransform(this.x, this.y);
    this.move(this.canvas.coordUtils.coordsToCanvas({ x: newX, y: newY }));
  }

  adaptToScale(scaleFactor: number): void {
    this.scale(scaleFactor);
    this.matrixTransform(
      new Matrix([
        [scaleFactor, 0],
        [0, scaleFactor],
      ]),
    );
  }

  render(): void {
    this.canvas.ctx.beginPath();
    this.canvas.ctx.arc(this._x, this._y, this._radius, 0, 2 * Math.PI);
    this.canvas.ctx.fillStyle = this.color;
    this.canvas.ctx.fill();
    this.canvas.ctx.closePath();
  }
}
