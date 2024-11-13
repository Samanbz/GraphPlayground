import { Line } from "two.js/src/shapes/line";
import { GraphCanvasRenderer } from "./GraphCanvasRenderer";
import { GraphEntity } from "./base/GraphEntity";
import { GraphNode } from "./GraphNode";
import { Point } from "./Point";

export class GraphEdge implements GraphEntity {
  private _from: GraphNode;
  private _to: Point | GraphNode;
  private lineWidth: number = 2;
  private strokeColor: string = "#FFFFFFEE";

  shape: Line;

  constructor(
    public canvas: GraphCanvasRenderer,
    from: GraphNode,
    to: Point | GraphNode,
  ) {
    this.canvas = canvas;

    this._from = from;
    this._to = to;

    const fromCoords = from.canvasCoords;
    const toCoords = to.canvasCoords;

    this.shape = new Line(fromCoords.x, fromCoords.y, toCoords.x, toCoords.y);
    this.shape.stroke = this.strokeColor;
    this.shape.linewidth = this.lineWidth;

    this.canvas.addEdge(this);
  }

  setDestination(to: Point): void {
    this._to = to;
  }

  setLineWidth(width: number): void {
    this.lineWidth = width;
  }

  containsNode(node: GraphNode): boolean {
    return this._from === node || this._to === node;
  }

  get from(): GraphNode {
    return this._from;
  }

  get to(): Point {
    return this._to;
  }

  update(): void {
    this.shape.stroke = this.strokeColor;
    this.shape.linewidth = this.lineWidth;

    const fromCoords = this._from.canvasCoords;
    const toCoords = this._to.canvasCoords;

    this.shape.vertices[0].set(fromCoords.x, fromCoords.y);
    this.shape.vertices[1].set(toCoords.x, toCoords.y);
  }
}
