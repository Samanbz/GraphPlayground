import { GraphCanvas, GraphEntity } from "@models/index";

export class GraphNode implements GraphEntity {
  canvas: GraphCanvas;

  private _x: number;
  private _y: number;
  private _radius: number = 40;
  private color: string = "#ade8f4";
  private lineWidth: number = this.radius / 10;
  private strokeColor: string = "#0077b6";

  constructor(canvas: GraphCanvas, x: number, y: number) {
    this.canvas = canvas;
    canvas.addNode(this);

    this._x = x;
    this._y = y;
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

  get radius(): number {
    return this._radius;
  }

  /**
   * Changes the styling of the node to indicate that it is selected.
   */
  select(): void {
    this.color = "#f4a261";
    this.strokeColor = "#e76f51";
  }

  /**
   * Changes the styling of the node to indicate that it is not selected.
   */
  deselect(): void {
    this.color = "#ade8f4";
    this.strokeColor = "#0077b6";
  }

  render(): void {
    this.canvas.ctx.beginPath();
    this.canvas.ctx.arc(this._x, this._y, this.radius, 0, 2 * Math.PI);
    this.canvas.ctx.fillStyle = this.color;
    this.canvas.ctx.fill();
    this.canvas.ctx.lineWidth = this.lineWidth;
    this.canvas.ctx.strokeStyle = this.strokeColor;
    this.canvas.ctx.stroke();
    this.canvas.ctx.closePath();
  }
}
