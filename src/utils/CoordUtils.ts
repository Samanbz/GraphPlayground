import { Coordinate } from "@models/base/Coordinate";
import { GraphCanvasRenderer } from "@models/GraphCanvasRenderer";

/**
 * Canvas
 * Coords
 */
export class CoordUtils {
  zoomFactor: number = 1;
  center: Coordinate;
  canvasOrigin: Coordinate;

  constructor(private canvas: GraphCanvasRenderer) {
    this.center = this.canvas.center;
    this.canvasOrigin = this.canvasToCoords(Coordinate.fromXY(0, 0));
  }

  coordsToCanvas(coords: Coordinate): Coordinate {
    return Coordinate.from(coords).times(this.zoomFactor).plus(this.center);
  }

  canvasToCoords(canvasCoords: Coordinate): Coordinate {
    return Coordinate.from(canvasCoords)
      .minus(this.center)
      .times(1 / this.zoomFactor);
  }

  getMouseEventCoords(event: MouseEvent): Coordinate {
    return Coordinate.fromXY(event.clientX, event.clientY);
  }

  adaptToZoom(zoomFactor: number, zoomOrigin: Coordinate): void {
    const delta = this.center.minus(zoomOrigin);
    this.center = zoomOrigin.plus(delta.times(zoomFactor / this.zoomFactor));
    this.zoomFactor = zoomFactor;
  }

  adaptToPan(delta: Coordinate): void {
    this.center = this.center.plus(delta);
  }
}
