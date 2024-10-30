import { TransitionUtils } from "utils/transition/TransitionUtils";
import { Coordinate } from "./Coordinate";
import { GraphCanvasRenderer } from "./GraphCanvasRenderer";
import { Point } from "./Point";

export class GraphNode extends Point {
  protected override _radius: number = 0;
  protected override color: string = "#bbdefb";
  protected lineWidth: number = this.radius / 15;
  protected strokeColor: string = "#2196f3";
  private originalRadius: number = 60;

  constructor(canvas: GraphCanvasRenderer, x: number, y: number) {
    super(canvas, x, y);
    canvas.addNode(this);
  }

  protected setRadius(s: number): void {
    this._radius = s;
  }

  /**
   * Changes the styling of the node to indicate that it is selected.
   */
  select(): void {
    this.color = "#2196f3";
    this.strokeColor = "#2196f3";
  }

  /**
   * Changes the styling of the node to indicate that it is not selected.
   */
  deselect(): void {
    this.color = "#bbdefb";
    this.strokeColor = "#2196f3";
  }

  contains(coords: Coordinate): boolean {
    const { x: canvasX, y: canvasY } = this.canvas.coordUtils.clientToCanvas(coords);
    return Math.sqrt((this._x - canvasX) ** 2 + (this._y - canvasY) ** 2) <= this.radius;
  }

  entryAnimation(): void {
    TransitionUtils.animate(this._radius, this.originalRadius, 50, (s) => this.setRadius(s));
  }

  override adaptToScale(scaleFactor: number): void {
    super.adaptToScale(scaleFactor);
    this.lineWidth *= scaleFactor;
  }

  override render(): void {
    this.canvas.ctx.beginPath();
    this.canvas.ctx.arc(this._x, this._y, this._radius, 0, 2 * Math.PI);
    this.canvas.ctx.fillStyle = this.color;
    this.canvas.ctx.fill();
    this.canvas.ctx.lineWidth = this.lineWidth;
    this.canvas.ctx.strokeStyle = this.strokeColor;
    this.canvas.ctx.stroke();
    this.canvas.ctx.closePath();
  }
}
