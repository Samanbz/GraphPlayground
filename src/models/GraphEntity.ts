import { GraphCanvasRenderer } from "./GraphCanvasRenderer";

export interface GraphEntity {
  canvas: GraphCanvasRenderer;
  render(): void;
}
