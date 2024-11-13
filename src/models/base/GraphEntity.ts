import { GraphCanvasRenderer } from "../GraphCanvasRenderer";

export interface GraphEntity {
  canvas: GraphCanvasRenderer;
  update(): void;
}
