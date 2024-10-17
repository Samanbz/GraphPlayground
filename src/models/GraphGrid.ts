import { GraphCanvasRenderer } from "./GraphCanvasRenderer";
import { GraphEntity } from "./GraphEntity";
import { Point } from "./Point";

export class GraphGrid implements GraphEntity {
  private gridPoints: Point[] = [];

  constructor(
    public canvas: GraphCanvasRenderer,
    private gridSeparation: number,
  ) {
    this.generateGridPoints();
  }

  private generateGridPoints() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const gridWidth = Math.ceil(width / this.gridSeparation) + 1;
    const gridHeight = Math.ceil(height / this.gridSeparation) + 1;

    for (let i = -gridWidth / 2; i < gridWidth / 2; i++) {
      for (let j = -gridHeight / 2; j < gridHeight / 2; j++) {
        const x = i * this.gridSeparation;
        const y = j * this.gridSeparation;
        this.gridPoints.push(new Point(this.canvas, x, y));
      }
    }
  }

  adaptToScale(scaleFactor: number): void {
    this.gridPoints.forEach((point) => {
      point.adaptToScale(scaleFactor);
    });
  }

  render(): void {
    this.canvas.ctx.save();
    this.canvas.ctx.setTransform(1, 0, 0, 1, 0, 0);

    this.gridPoints.forEach((point) => {
      point.render();
    });

    this.canvas.ctx.restore();
  }
}
