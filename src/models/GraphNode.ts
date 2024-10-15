import { GraphCanvas } from "./GraphCanvas";
import { GraphEntity } from "./GraphEntity";
import { Point } from "./Point";

export class GraphNode extends Point implements GraphEntity {
  canvas: GraphCanvas;

  private _radius: number = 40;
  private color: string = "#bbdefb";
  private lineWidth: number = this.radius / 15;
  private strokeColor: string = "#2196f3";

  constructor(canvas: GraphCanvas, x: number, y: number) {
    super(x, y);
    this.canvas = canvas;
    canvas.addNode(this);
  }

  get radius(): number {
    return this._radius;
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
