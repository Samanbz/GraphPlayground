import { GraphCanvasRenderer } from "./GraphCanvasRenderer";
import { Point } from "./Point";

export class GraphNode extends Point {
  protected override _radius: number = 60;
  protected override color: string = "#bbdefb";
  protected lineWidth: number = this.radius / 15;
  protected strokeColor: string = "#2196f3";

  constructor(canvas: GraphCanvasRenderer, x: number, y: number) {
    super(canvas, x, y);
    canvas.addNode(this);
    console.log(this.coords, this.canvasCoords);
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

  contains(x: number, y: number): boolean {
    const { x: canvasX, y: canvasY } = this.canvas.coordUtils.clientToCanvas(x, y);
    return Math.sqrt((this._x - canvasX) ** 2 + (this._y - canvasY) ** 2) <= this.radius;
  }

  override adaptToScale(scaleFactor: number): void {
    super.adaptToScale(scaleFactor);
    this.lineWidth *= scaleFactor;
  }

  override render(): void {
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
