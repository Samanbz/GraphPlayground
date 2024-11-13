import { Coordinate } from "./base/Coordinate";
import { GraphCanvasRenderer } from "./GraphCanvasRenderer";
import { Point } from "./Point";
import { Circle } from "two.js/src/shapes/circle";

export class GraphNode extends Point {
  protected override _radius: number = 40;
  protected override color: string = "#bbdefb";
  protected lineWidth: number = this.radius / 15;
  protected strokeColor: string = "#bbdefb";
  private originalRadius: number = 60;

  constructor(canvas: GraphCanvasRenderer, x: number, y: number) {
    super(canvas, x, y);

    this.shape = new Circle(this._x, this._y, this._radius);
    this.shape.fill = this.color;
    this.shape.stroke = this.strokeColor;
    this.shape.linewidth = this.lineWidth;

    canvas.addNode(this);
  }

  protected setRadius(s: number): void {
    this._radius = s;
  }

  /**
   * Changes the styling of the node to indicate that it is selected.
   */
  select(): void {
    this.color = "#bbdefb";
    this.strokeColor = "#2196f3";
  }

  /**
   * Changes the styling of the node to indicate that it is not selected.
   */
  deselect(): void {
    this.color = "#bbdefb";
    this.strokeColor = "#bbdefb";
  }

  contains(coords: Coordinate): boolean {
    return Math.sqrt((this.x - coords.x) ** 2 + (this.y - coords.y) ** 2) <= this.radius;
  }

  override update(): void {
    this.shape.translation.set(this._x, this._y);
    this.shape.radius = this._radius;
    this.shape.fill = this.color;
    this.shape.stroke = this.strokeColor;
  }
}
