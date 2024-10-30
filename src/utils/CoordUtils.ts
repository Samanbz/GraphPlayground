import { Coordinate } from "@models/Coordinate";
import { GraphCanvasRenderer } from "@models/GraphCanvasRenderer";

/**
 * Client
 * Canvas
 * Coords
 */
export class CoordUtils {
  static DPR: number = window.devicePixelRatio || 1;

  constructor(private canvas: GraphCanvasRenderer) {}

  canvasToClient(canvasCoords: Coordinate): Coordinate {
    return {
      x: canvasCoords.x / CoordUtils.DPR,
      y: canvasCoords.y / CoordUtils.DPR,
    };
  }

  clientToCanvas(clientCoords: Coordinate): Coordinate {
    return {
      x: clientCoords.x * CoordUtils.DPR,
      y: clientCoords.y * CoordUtils.DPR,
    };
  }

  coordsToCanvas(coords: Coordinate): Coordinate {
    return {
      x: coords.x + this.canvas.center.x,
      y: coords.y + this.canvas.center.y,
    };
  }

  canvasToCoords(canvasCoords: Coordinate): Coordinate {
    return {
      x: canvasCoords.x - this.canvas.center.x,
      y: canvasCoords.y - this.canvas.center.y,
    };
  }

  clientToCoords(clientCoords: Coordinate): Coordinate {
    return {
      x: clientCoords.x * CoordUtils.DPR - this.canvas.center.x,
      y: clientCoords.y * CoordUtils.DPR - this.canvas.center.y,
    };
  }

  coordsToClient(coords: Coordinate): Coordinate {
    return {
      x: (coords.x - this.canvas.center.x) / CoordUtils.DPR,
      y: (coords.y - this.canvas.center.y) / CoordUtils.DPR,
    };
  }

  getMouseEventCoords(event: MouseEvent): Coordinate {
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }
}
