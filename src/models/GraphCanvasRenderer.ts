import { Graph } from "./Graph";

export class GraphCanvasRenderer extends Graph {
  protected canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.adaptToDPR();
  }

  /**
   * Adapt the canvas scale to the device pixel ratio.
   */
  protected adaptToDPR() {
    const dpr = window.devicePixelRatio || 1;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;

    this.ctx.scale(dpr, dpr);
  }

  protected renderGridPoint(x: number, y: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#FFFFFF20";
    this.ctx.fill();
    this.ctx.closePath();
  }

  protected renderGrid() {
    const gridSepration = 40;

    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const gridWidth = Math.floor(width / gridSepration) + 1;
    const gridHeight = Math.floor(height / gridSepration) + 1;

    for (let i = -gridWidth / 2; i < gridWidth / 2; i++) {
      for (let j = -gridHeight / 2; j < gridHeight / 2; j++) {
        this.renderGridPoint(i * gridSepration + width / 2, j * gridSepration + height / 2);
      }
    }
  }

  /**
   * Main rendering engine for the canvas.
   */
  render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderGrid();
    this.edges.forEach((edge) => edge.render());
    this.nodes.forEach((node) => node.render());
    requestAnimationFrame(this.render.bind(this));
  }
}
