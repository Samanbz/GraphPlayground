import { GraphCanvasRenderer } from "./GraphCanvasRenderer";
import { GraphEntity } from "./GraphEntity";
import { GraphNode } from "./GraphNode";
import { Point } from "./Point";
export class GraphEdge implements GraphEntity {
  canvas: GraphCanvasRenderer;

  private _from: Point;
  private _to: Point;
  private lineWidth: number = 2;
  private strokeColor: string = "#FFFFFFEE";

  constructor(canvas: GraphCanvasRenderer, from: GraphNode, to: Point) {
    this.canvas = canvas;
    canvas.addEdge(this);

    this._from = from;
    this._to = to;
  }

  setDestination(to: Point): void {
    this._to = to;
  }

  setLineWidth(width: number): void {
    this.lineWidth = width;
  }

  containsNode(node: Point): boolean {
    return this._from === node || this._to === node;
  }

  get from(): Point {
    return this._from;
  }

  get to(): Point {
    return this._to;
  }

  render(): void {
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this._from.x, this._from.y);
    this.canvas.ctx.lineTo(this._to.x, this._to.y);
    this.canvas.ctx.lineWidth = this.lineWidth;
    this.canvas.ctx.strokeStyle = this.strokeColor;
    this.canvas.ctx.stroke();
    this.canvas.ctx.closePath();
  }
}
