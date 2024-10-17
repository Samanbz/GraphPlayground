import { CoordUtils } from "utils/CoordUtils";
import { Coordinate } from "./Coordinate";
import { Graph } from "./Graph";
import { GraphGrid } from "./GraphGrid";

export class GraphCanvasRenderer extends Graph {
  readonly canvasElement: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly coordUtils: CoordUtils;

  private grid: GraphGrid;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvasElement = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.coordUtils = new CoordUtils(this);
    this.adaptToDPR();
    this.grid = new GraphGrid(this, 40);
  }

  get width(): number {
    return this.canvasElement.width;
  }

  get height(): number {
    return this.canvasElement.height;
  }

  get center(): Coordinate {
    return {
      x: this.width / 2,
      y: this.height / 2,
    };
  }

  /**
   * Adapt the canvas scale to the device pixel ratio.
   */
  protected adaptToDPR() {
    const width = this.canvasElement.clientWidth;
    const height = this.canvasElement.clientHeight;

    this.canvasElement.width = width * CoordUtils.DPR;
    this.canvasElement.height = height * CoordUtils.DPR;
    this.ctx.transform(1 / CoordUtils.DPR, 0, 0, 1 / CoordUtils.DPR, 0, 0);

    this.ctx.scale(CoordUtils.DPR, CoordUtils.DPR);
  }

  zoom(scale: number): void {
    this.grid.adaptToScale(scale);
    this.nodes.forEach((node) => {
      node.adaptToScale(scale);
    });
  }
  /**
   * Main rendering engine for the canvas.
   */
  render(): void {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    this.ctx.restore();

    this.grid.render();
    this.edges.forEach((edge) => edge.render());
    this.nodes.forEach((node) => node.render());

    requestAnimationFrame(this.render.bind(this));
  }
}
