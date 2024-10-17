import { Coordinate } from "@models/Coordinate";
import { GraphCanvasRenderer } from "@models/GraphCanvasRenderer";

export class CoordUtils {
  static DPR: number = window.devicePixelRatio || 1;

  constructor(private canvas: GraphCanvasRenderer) {}

  canvasToClient(canvasX: number, canvasY: number): Coordinate {
    return {
      x: canvasX - this.canvas.center.x,
      y: canvasY - this.canvas.center.y,
    };
  }

  clientToCanvas(clientX: number, clientY: number): Coordinate {
    return {
      x: clientX + this.canvas.center.x,
      y: clientY + this.canvas.center.y,
    };
  }
}
