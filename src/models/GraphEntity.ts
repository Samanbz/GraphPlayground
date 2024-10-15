import { GraphCanvas } from "@models/index";

export interface GraphEntity {
  canvas: GraphCanvas;
  render(): void;
}
